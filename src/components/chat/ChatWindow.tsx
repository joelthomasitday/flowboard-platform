"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, X, ExternalLink, MessageCircle } from "lucide-react";
import ChatBubble from "./ChatBubble";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  "What should I work on today?",
  "Create a new project",
  "Show me risky deadlines",
  "Summarize my week"
];

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          context: { page: "homepage" }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Chat Error Context:", errorData);
        throw new Error(errorData.details || "Stream failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      let assistantContent = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        assistantContent += chunk;

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantContent;
          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Apologies, my neural link is flickering. Please try again soon." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full sm:w-[420px] h-dvh sm:h-[600px] glass-panel bg-cream/90 sm:rounded-xl flex flex-col overflow-hidden z-100 border-t sm:border border-soft-blue/20 shadow-xl"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-soft-blue/5 blur-[50px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-light-green/5 blur-[50px] -z-10 rounded-full" />

      {/* Header */}
      <div className="shrink-0 px-6 py-5 border-b border-border-soft flex items-center justify-between bg-white/40 backdrop-blur-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-syne font-bold text-deep-blue text-lg tracking-tight">FlowBoard AI</h3>
            <div className="w-2 h-2 rounded-full bg-light-green" />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-deep-blue/40">Your Intelligent Workspace Assistant</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-soft-blue/10 rounded-full transition-colors text-deep-blue/60"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-surface-tinted flex items-center justify-center border border-soft-blue/10">
              <MessageCircle className="w-8 h-8 text-soft-blue" />
            </div>
            <div className="space-y-2">
              <h4 className="font-syne font-bold text-deep-blue">Strategic Guidance Starts Here</h4>
              <p className="text-sm text-deep-blue/60 max-w-[240px]">Ask me anything about your projects or workflow architecture.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-2 w-full mt-4">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-left px-4 py-3 text-sm text-deep-blue/80 bg-white/60 border border-border-soft rounded-xl hover:border-soft-blue/40 hover:bg-soft-blue/5 transition-all group"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className="space-y-2">
                <ChatBubble role={msg.role} content={msg.content} />
                {msg.role === "assistant" && (msg.content.toLowerCase().includes("project") || msg.content.toLowerCase().includes("create")) && (
                  <div className="flex justify-start pl-4 pb-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-light-green text-deep-blue text-[10px] font-bold uppercase tracking-wider rounded-full shadow-soft hover:bg-light-green-dark transition-colors border border-light-green-dark/30">
                      <ExternalLink className="w-3 h-3" />
                      Open Project Workspace
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-cream-warm border border-border-soft px-4 py-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-soft-blue opacity-50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-soft-blue opacity-50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-soft-blue opacity-50" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 p-4 bg-white/60 backdrop-blur-md border-t border-border-soft pb-safe sm:pb-4">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Ask FlowBoard AI..."
            className="flex-1 bg-surface-sunken border border-border-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-soft-blue/20 text-deep-blue"
          />
          <button
            onClick={() => handleSend(input)}
            className="p-3 bg-deep-blue text-cream rounded-xl hover:bg-deep-blue-dark transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between px-1">
          <button className="flex items-center gap-1.5 text-[10px] font-mono text-deep-blue/40 hover:text-deep-blue transition-colors uppercase tracking-widest">
            <ExternalLink className="w-3 h-3" />
            Open Dashboard
          </button>
          <span className="text-[10px] font-mono text-deep-blue/20">CTRL + / TO FOCUS</span>
        </div>
      </div>
    </div>
  );
}
