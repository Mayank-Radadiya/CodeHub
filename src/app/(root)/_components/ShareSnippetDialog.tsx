import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useMutation } from "convex/react";
import { X } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";

interface ShareSnippetDialogProps {
  onClose: () => void;
}

const ShareSnippetDialog = ({ onClose }: ShareSnippetDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const { language, getCode } = useCodeEditorStore();

  const createSnippet = useMutation(api.snippets.createSnippets);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSharing(true);

    try {
      const code = getCode();

      await createSnippet({ title, description, code, language });
      toast.success("Snippet shared successfully!");
      setTitle("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error sharing snippet:", error);
      toast.error("Failed to share snippet. Please try again.");
    }
    setIsSharing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e2e] rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Share Snippet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#181825] border border-[#313244] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sum of two numbers"
              required
            />

            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-400 mb-2 mt-4"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#181825] border border-[#313244] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="This code does..."
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 bg-[#181825] border border-[#313244] rounded-lg hover:text-gray-300 hover:bg-[#dd4744] transition duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSharing}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
          disabled:opacity-50"
            >
              {isSharing ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareSnippetDialog;
