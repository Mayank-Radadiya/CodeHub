import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createSnippets = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    language: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if the user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if the user exists in the database
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    // Enter the snippet into the database
    const snippetId = await ctx.db.insert("snippets", {
      userId: identity.subject,
      userName: user.name,
      title: args.title,
      description: args.description,
      code: args.code,
      language: args.language,
    });

    return snippetId;
  },
});
