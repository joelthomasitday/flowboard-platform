"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ChatButton from "./ChatButton";

const ChatWindow = dynamic(() => import("./ChatWindow"), {
  ssr: false,
});

export default function FlowBoardChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for custom "open-chatbot" events from other components
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-chatbot", handleOpen);
    return () => window.removeEventListener("open-chatbot", handleOpen);
  }, []);

  return (
    <>
      {isOpen && (
        <ChatWindow onClose={() => setIsOpen(false)} />
      )}
      <div className={`fixed bottom-6 right-6 z-50 ${isOpen ? "hidden sm:block" : "block"}`}>
        <ChatButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      </div>
    </>
  );
}
