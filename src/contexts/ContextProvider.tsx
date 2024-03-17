// src/contexts/ContextProvider.tsx
import React, { createContext, useState, useEffect, useContext } from "react";

export const ETH_PRICE = 3891.4522521;
export const RATIO = 1; // 1 ETH = 0.9934 byzETH

export const ContextProviderContext = createContext<ContextProps>({
  showAnimation: false,
  setShowAnimation: () => {},
  triggerAnimation: () => {},
});

interface ContextProps {
  showAnimation: any;
  setShowAnimation: React.Dispatch<React.SetStateAction<any>>;
  triggerAnimation: any;
}

interface ContextProviderProps {
  children: React.ReactNode;
}
export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [showAnimation, setShowAnimation] = useState<any>(false);

  const triggerAnimation = () => {
    console.log("we triggeerr");
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 820);
  };

  return (
    <ContextProviderContext.Provider
      value={{
        showAnimation,
        setShowAnimation,
        triggerAnimation,
      }}
    >
      {children}
    </ContextProviderContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(ContextProviderContext);
  if (!context) {
    throw new Error("useUser must be used within a ContextProvider");
  }
  return context;
};
