"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { getCodeReview } from "@/utils/gemini";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const AiOutputPanel = () => {
  const { language } = useCodeEditorStore();
  const [aiReview, setAiReview] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const fetchReview = async () => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    if (savedCode) {
      setLoading(true);
      try {
        const review = await getCodeReview(savedCode);
        setAiReview(review);
      } catch (error) {
        console.error("Error fetching AI review:", error);
        setAiReview("Failed to generate review. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setAiReview("No code found to review. Please write some code first.");
    }
  };

  // // Optional: Auto-fetch review when language changes
  // useEffect(() => {
  //   // Comment this out if you only want manual triggering via the button
  //   // fetchReview();
  // }, [language]);

  return (
    <div className="relative bg-[#181825] rounded-xl p-4 ring-1 ring-gray-800/50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">AI Review</h2>
        <button
          onClick={fetchReview}
          disabled={loading}
          className="text-zinc-500 hover:text-zinc-200 backdrop-blur-lg bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-6 shadow hover:shadow-zinc-400 duration-700"
        >
          {/* Background Glow Effect */}
          <span
            className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 
                   opacity-0 group-hover:opacity-30 transition-all duration-500"
          ></span>

          {/* Text with Smooth Scale Effect */}
          <span className="relative z-10 block group-hover:scale-105 transition-transform duration-200">
            {loading ? (
              <span className="flex items-center gap-2">Generating...</span>
            ) : (
              "Get AI Review"
            )}
          </span>
        </button>
      </div>

      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {aiReview && (
        <div className="prose prose-sm max-w-none prose-invert">
          <div
            className="relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] 
        rounded-xl p-4 h-[650px] overflow-auto font-mono text-sm"
          >
            <ReactMarkdown
              components={{
                code({
                  inline,
                  className,
                  children,
                  ...props
                }: {
                  inline?: boolean;
                  className?: string;
                  children?: React.ReactNode;
                }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className="bg-gray-800 p-1 rounded text-gray-100"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {aiReview}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiOutputPanel;
