import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const saveExecution = mutation({
  args: {
    // get all this values from the client as arguments.
    language: v.string(),
    code: v.string(),
    output: v.optional(v.string()), // we ether get the output or the error
    error: v.optional(v.string()),
  },

  // This function will be called when the client calls this mutation
  // It will be called with the context and the arguments
  // The context will contain the database, auth, and other helpers
  handler: async (ctx, args) => {
    const Identity = await ctx.auth.getUserIdentity();

    // check if user is authenticated
    if (!Identity) {
      throw new Error("User not authenticated");
    }

    // check if user is a pro user
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), Identity.subject))
      .first();

    // check if user is a pro user
    // if user is not a pro user, check if the language is javascript
    if (!user?.isPro && args.language !== "javascript") {
      throw new ConvexError("Pro subscription required to use this language");
    }

    // check if user is a pro user then store the code execution.
    await ctx.db.insert("codeExecutions", {
      ...args,
      userId: Identity.subject,
    });
  },
});

export const getUserExecutions = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("codeExecutions")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getUserStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const executions = await ctx.db
      .query("codeExecutions")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get starred snippets
    const starredSnippets = await ctx.db
      .query("stars")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get all starred snippet details to analyze languages
    const snippetIds = starredSnippets.map((star) => star.snippetId);
    const snippetDetails = await Promise.all(
      snippetIds.map((id) => ctx.db.get(id))
    );

    // Calculate most starred language
    const starredLanguages = snippetDetails.filter(Boolean).reduce(
      (acc, curr) => {
        if (curr?.language) {
          acc[curr.language] = (acc[curr.language] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const mostStarredLanguage =
      Object.entries(starredLanguages).sort(([, a], [, b]) => b - a)[0]?.[0] ??
      "N/A";

    // Calculate execution stats
    const last24Hours = executions.filter(
      (e) => e._creationTime > Date.now() - 24 * 60 * 60 * 1000
    ).length;

    const languageStats = executions.reduce(
      (acc, curr) => {
        acc[curr.language] = (acc[curr.language] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const languages = Object.keys(languageStats);
    const favoriteLanguage = languages.length
      ? languages.reduce((a, b) =>
          languageStats[a] > languageStats[b] ? a : b
        )
      : "N/A";

    return {
      totalExecutions: executions.length,
      languagesCount: languages.length,
      languages: languages,
      last24Hours,
      favoriteLanguage,
      languageStats,
      mostStarredLanguage,
    };
  },
});
