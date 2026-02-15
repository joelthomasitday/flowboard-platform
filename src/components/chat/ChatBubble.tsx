"use client";

import React from "react";
import { motion } from "framer-motion";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-soft ${
          isUser
            ? "bg-soft-blue text-deep-blue rounded-tr-none"
            : "bg-cream-warm border border-border-soft text-deep-blue rounded-tl-none"
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </motion.div>
  );
}
