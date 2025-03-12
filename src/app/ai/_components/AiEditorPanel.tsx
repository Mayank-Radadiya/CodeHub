"use client";
import {
  LANGUAGE_CONFIG,
  defineMonacoThemes,
} from "@/app/(root)/_components/_constants";
import { EditorPanelSkeleton } from "@/app/(root)/_components/EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useClerk } from "@clerk/nextjs";
import { Editor } from "@monaco-editor/react";
import Image from "next/image";

const AiEditorPanel = () => {
  const { language, theme, fontSize, setEditor } = useCodeEditorStore();

  const mounted = useMounted();
  const clerk = useClerk();

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };
  if (!mounted) return null;

  return (
    <>
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image
                src={"/" + language + ".png"}
                alt="Logo"
                width={24}
                height={24}
              />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Code Editor</h2>
              <p className="text-xs text-gray-500">
                Past your code here and let AI help you
              </p>
            </div>
          </div>
        </div>
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          {!clerk.loaded && <EditorPanelSkeleton />}
          {clerk.loaded && (
            <Editor
              height="610px"
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              theme={theme}
              onChange={handleEditorChange}
              beforeMount={defineMonacoThemes}
              onMount={(editor) => setEditor(editor)}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 4,
                  horizontalScrollbarSize: 4,
                },
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AiEditorPanel;
