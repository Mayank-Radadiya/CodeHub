import { ArrowRight, Command, Star, X } from "lucide-react"; // Added X for close button
import Link from "next/link";
import { useEffect, useRef } from "react"; // Added useEffect and useRef for click-outside logic

interface ProPlanViewProps {
  onClose: () => void;
}

function ProPlanView({ onClose }: ProPlanViewProps) {
  const dialogRef = useRef<HTMLDivElement>(null); // Ref to track the dialog box

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        onClose(); // Call the onClose prop function to close the dialog
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Outer container with overlay */}
      <div
        ref={dialogRef}
        className="relative max-w-md mx-auto text-center p-6 bg-[#12121a]/95 border border-gray-800/70 rounded-xl shadow-2xl"
      >
        {/* Gradient background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl" />
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dialog content */}
        <div className="relative">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 mb-6 ring-1 ring-gray-800/50">
            <Star className="w-6 h-6 text-purple-400" />
          </div>

          <h1 className="text-2xl font-semibold text-white mb-2">
            Pro Plan Active
          </h1>
          <p className="text-gray-300 mb-6 text-base">
            Experience the full power of professional development
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 text-white rounded-lg transition-all duration-200 border border-gray-800 hover:border-blue-500/60 group"
          >
            <Command className="w-4 h-4 text-blue-400" />
            <span>Open Editor</span>
            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProPlanView;
