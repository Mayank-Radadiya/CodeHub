"use client";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import SnippetLoadingSkeleton from "./_components/SnippetLoadingSkeleton";
import { Editor } from "@monaco-editor/react";
import {
  LANGUAGE_CONFIG,
  defineMonacoThemes,
} from "@/app/(root)/_components/_constants";
import { Clock, Code, MessageSquare, User } from "lucide-react";
import NavigationHeader from "@/components/global/NavigationHeader";
import Image from "next/image";
import CopyButton from "./_components/CopyButton";
import Comments from "./_components/Comments";

const Page = () => {
  const snippetId = useParams().id;

  const snippet = useQuery(api.snippets.getSnippetById, {
    snippetId: snippetId as Id<"snippets">,
  });
  const comments = useQuery(api.snippets.getComments, {
    snippetId: snippetId as Id<"snippets">,
  });

  // If the snippet is undefined or null, show a loading skeleton
  if (!snippet || snippet === undefined) {
    return (
      <div className="min-h-screen">
        <main className="w-full mx-auto px-4">
          <SnippetLoadingSkeleton />
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen  text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:pt-3">
          <NavigationHeader />
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6 sm:py-8 lg:py-10">
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#ffffff08] p-2.5 shrink-0">
                    <Image
                      src={`/${snippet.language}.png`}
                      alt={`${snippet.language} logo`}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-3">
                    <h1 className="text-xl sm:text-2xl font-semibold text-white">
                      {snippet.title}
                    </h1>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-3 text-sm">
                      <div className="flex items-center gap-2 text-[#8b8b8d]">
                        <User className="w-5 h-5" />
                        <span>{snippet.userName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#8b8b8d]">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(snippet._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#8b8b8d]">
                        <MessageSquare className="w-4 h-4" />
                        <span>{comments?.length} comments</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#808086]">
                      {snippet.description}
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center px-3 py-1.5 bg-[#ffffff08] text-[#808086] rounded-lg text-sm font-medium shrink-0">
                  {snippet.language}
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="rounded-2xl overflow-hidden border border-[#ffffff0a] bg-[#121218]">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#ffffff0a] bg-[#121218]">
                <div className="flex items-center gap-2 text-[#808086]">
                  <Code className="w-4 h-4" />
                  <span className="text-sm font-medium">Source Code</span>
                </div>
                <CopyButton code={snippet.code} />
              </div>
              <Editor
                height="600px"
                language={LANGUAGE_CONFIG[snippet.language].monacoLanguage}
                value={snippet.code}
                theme="vs-dark"
                beforeMount={defineMonacoThemes}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  readOnly: true,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                  renderWhitespace: "selection",
                  fontFamily:
                    '"Fira Code", "Cascadia Code", Consolas, monospace',
                  fontLigatures: true,
                }}
              />
            </div>

            <Comments snippetId={snippet._id} />
          </div>
        </main>
      </div>
    </>
  );
};

export default Page;
