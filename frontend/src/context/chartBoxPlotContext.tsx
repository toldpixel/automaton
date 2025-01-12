"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

export interface Scrape {
  name?: string;
  gpu?: string;
  storage?: string;
  network?: string;
  egress?: string;
  price_monthly?: string;
  price_hourly?: string;
}

interface ScrapeContextType {
  scrapes: Scrape[];
  setScrapes: Dispatch<SetStateAction<Scrape[]>>;
}

const ScrapeContext = createContext<ScrapeContextType | undefined>(undefined);

export const ScrapeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [scrapes, setScrapes] = useState<Scrape[]>([]);

  React.useEffect(() => {
    console.log("Scrapes updated in context:", scrapes);
  }, [scrapes]);

  return (
    <ScrapeContext.Provider value={{ scrapes, setScrapes }}>
      {children}
    </ScrapeContext.Provider>
  );
};

export const useScrapeContext = (): ScrapeContextType => {
  const context = useContext(ScrapeContext);
  if (!context) {
    throw new Error("useScrapeContext must be used within a ScrapeProvider");
  }
  return context;
};
