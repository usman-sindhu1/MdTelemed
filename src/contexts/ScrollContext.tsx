import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScrollContextType {
  isScrollingDown: boolean;
  setIsScrollingDown: (value: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  return (
    <ScrollContext.Provider value={{ isScrollingDown, setIsScrollingDown }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext must be used within ScrollProvider');
  }
  return context;
};

