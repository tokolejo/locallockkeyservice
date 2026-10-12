"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AnimationMode = "clean" | "dynamic" | "minimal";

interface AnimationContextType {
  mode: AnimationMode;
  setMode: (mode: AnimationMode) => void;
  isSwitcherOpen: boolean;
  setIsSwitcherOpen: (open: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType>({
  mode: "clean",
  setMode: () => {},
  isSwitcherOpen: true,
  setIsSwitcherOpen: () => {},
});

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AnimationMode>("clean");
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("locksmith_anim_mode") as AnimationMode;
      if (saved && ["clean", "dynamic", "minimal"].includes(saved)) {
        queueMicrotask(() => setModeState(saved));
      }
    } catch {
      // Ignore in restrictive environments
    }
  }, []);

  const setMode = (newMode: AnimationMode) => {
    setModeState(newMode);
    localStorage.setItem("locksmith_anim_mode", newMode);
  };

  return (
    <AnimationContext.Provider
      value={{
        mode,
        setMode,
        isSwitcherOpen,
        setIsSwitcherOpen,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  return useContext(AnimationContext);
}
