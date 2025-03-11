import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

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
