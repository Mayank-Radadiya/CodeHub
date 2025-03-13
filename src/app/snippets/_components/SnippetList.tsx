"use client";
import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import SnippetCard from "./SnippetCard";
import {
  BookOpen,
  ChevronFirst,
  ChevronRight,
  Code,
  Search,
  Tag,
  X,
} from "lucide-react";
import SnippetsPageSkeleton from "./SnippetsPageSkeleton";
import { AnimatePresence, motion } from "framer-motion";
import { Snippet } from "@/types";
import Image from "next/image";

function SnippetList() {
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const itemsPerPage = 9;

  // Paginated snippets query
  const paginatedResult = useQuery(api.snippets.getSnippets, {
    paginationOpts: {
      numItems: itemsPerPage,
      cursor: currentCursor || undefined,
    },
  });

  // Full snippets query for search (fetches all snippets)
  const allSnippetsResult = useQuery(
    api.snippets.getAllSnippets, // Assume this is a new Convex query for all snippets
    undefined
  );

  // Update paginated snippets
  useEffect(() => {
    if (paginatedResult && !searchQuery) {
      const newSnippets = paginatedResult.snippets || [];
      setSnippets(
        newSnippets.map((snippet) => ({
          ...snippet,
        }))
      );
      setNextCursor(paginatedResult.continueCursor);
      setIsDone(paginatedResult.isDone);
    }
  }, [paginatedResult, searchQuery]);

  // Filter snippets based on search and language
  const filterSnippets = (snippetList: Snippet[]) =>
    snippetList
      .filter((snippet) => snippet && snippet._id) // Ensure valid snippets
      .filter((snippet) => {
        const matchesSearch =
          !searchQuery ||
          snippet.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          snippet.language?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          snippet.userName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLanguage =
          !selectedLanguage || snippet.language === selectedLanguage;
        return matchesSearch && matchesLanguage;
      });

  // Use all snippets for search, otherwise use paginated snippets
  const displayedSnippets =
    searchQuery.length > 0 && allSnippetsResult
      ? filterSnippets(
          allSnippetsResult.map((snippet) => ({
            ...snippet,
          }))
        )
      : filterSnippets(snippets);

  const languages = [
    ...new Set(snippets.map((s) => s.language).filter(Boolean)),
  ];
  const popularLanguages = languages.slice(0, 5);

  const handleNext = () => {
    if (nextCursor && !isDone && !searchQuery) {
      setCursorHistory((prev) => [...prev, currentCursor || ""]);
      setCurrentCursor(nextCursor);
      setSnippets([]);
    }
  };

  const handlePrevious = () => {
    if (cursorHistory.length > 0 && !searchQuery) {
      const newHistory = [...cursorHistory];
      const prevCursor = newHistory.pop();
      setCursorHistory(newHistory);
      setCurrentCursor(prevCursor || null);
      setIsDone(false);
      setSnippets([]);
    }
  };

  // Loading state
  if (
    paginatedResult === undefined ||
    (searchQuery && allSnippetsResult === undefined)
  ) {
    return (
      <div className="min-h-screen z-10 flex flex-col items-center justify-center">
        <SnippetsPageSkeleton />
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-sm text-gray-400 mb-6"
        >
          <BookOpen className="w-4 h-4" />
          Community Code Library
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-6"
        >
          Discover & Share Code Snippets
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-400 mb-8"
        >
          Explore a curated collection of code snippets from the community
        </motion.p>
      </div>

      {/* Filters Section */}
      <div className="relative max-w-5xl mx-auto mb-12 space-y-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search snippets by title, language, or author..."
              className="w-full pl-12 pr-4 py-4 bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white rounded-xl border border-[#313244] hover:border-[#414155] transition-all duration-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Languages:</span>
          </div>
          {popularLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() =>
                setSelectedLanguage(lang === selectedLanguage ? null : lang)
              }
              className={`group relative px-3 py-1.5 rounded-lg transition-all duration-200 ${
                selectedLanguage === lang
                  ? "text-blue-400 bg-blue-500/10 ring-2 ring-blue-500/50"
                  : "text-gray-400 hover:text-gray-300 bg-[#1e1e2e] hover:bg-[#262637] ring-1 ring-gray-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={`/${lang}.png`}
                  alt={lang}
                  height={16}
                  width={16}
                  className="w-4 h-4 object-contain"
                />
                <span className="text-sm">{lang}</span>
              </div>
            </button>
          ))}
          {selectedLanguage && (
            <button
              onClick={() => setSelectedLanguage(null)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {displayedSnippets.length} snippets found
            </span>
          </div>
        </div>
      </div>

      {/* Snippets Grid */}
      <motion.div
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        layout
      >
        <AnimatePresence mode="popLayout">
          {displayedSnippets.length > 0 ? (
            displayedSnippets.map((snippet) => (
              <SnippetCard key={snippet._id} snippet={snippet} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full text-center p-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 ring-1 ring-white/10 mb-6">
                <Code className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">
                No snippets found
              </h3>
              <p className="text-gray-400">
                {searchQuery || selectedLanguage
                  ? "Try adjusting your search or filters"
                  : "No snippets available on this page"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination (hidden during search) */}
      {!searchQuery && (
        <div className="flex justify-end mt-4 items-center">
          <button
            onClick={handlePrevious}
            disabled={cursorHistory.length === 0}
            className="mr-2 px-4 py-2 flex items-center gap-3 text-gray-200 hover:bg-slate-800 hover:scale-105 hover:text-gray-100 transition-all border-slate-400 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronFirst /> Previous
          </button>
          <button
            onClick={handleNext}
            disabled={isDone || !nextCursor}
            className="mr-2 px-4 py-2 flex items-center gap-3 text-gray-200 hover:bg-slate-800 hover:scale-105 hover:text-gray-100 transition-all border-slate-400 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default SnippetList;
