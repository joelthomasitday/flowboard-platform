"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface DemoContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  nextStep: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
    setDemoStep(0);
  };

  const nextStep = () => {
    setDemoStep((prev) => prev + 1);
  };

  return (
    <DemoContext.Provider value={{ isDemoMode, toggleDemoMode, demoStep, setDemoStep, nextStep }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemoMode must be used within a DemoProvider");
  }
  return context;
}
