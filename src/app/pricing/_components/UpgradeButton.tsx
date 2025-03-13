"use client";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useState } from "react";
import ProPlanView from "./ProPlanView";

interface UpgradeButtonProps {
  isPro?: boolean;
}

export default function UpgradeButton({ isPro }: UpgradeButtonProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const CHEKOUT_URL = "";

  const handleClick = () => {
    if (isPro) {
      setIsShareDialogOpen(true);
    } else {
      window.open(CHEKOUT_URL, "_blank");
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsShareDialogOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white 
          bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg 
          hover:from-blue-600 hover:to-blue-700 transition-all"
      >
        <Zap className="w-5 h-5" />
        Upgrade to Pro
      </motion.button>

      {/* Share Dialog */}
      {isShareDialogOpen && (
        <ProPlanView onClose={() => setIsShareDialogOpen(false)} />
      )}
    </>
  );
}
