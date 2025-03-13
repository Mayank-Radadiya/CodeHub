"use client";
import { redirect, useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { s } from "framer-motion/client";
import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";

const Page = () => {
  const { snippetId } = useParams();
  if (!snippetId) {
    redirect("/snippets");
  }
  const snippet = useQuery(api.snippets.getSnippetById, {
    snippetId: snippetId as Id<"snippets">,
  });
  const comments = useQuery(api.snippets.getComments, {
    snippetId: snippetId as Id<"snippets">,
  });
  return (
    <div>
      <h1>Title: new Page</h1>
      <p>Page</p>
    </div>
  );
};

export default Page;
