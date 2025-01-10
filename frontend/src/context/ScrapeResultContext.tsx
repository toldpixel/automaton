"use client";

// ChatGPT generated
import { ScrapeResult } from "@/types/scraperesult";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

// Define the context type
interface ScrapeResultContextType {
  results: ScrapeResult[];
  setResults: Dispatch<SetStateAction<ScrapeResult[]>>;
}

// Create the context with the correct type
const ScrapeResultContext = createContext<ScrapeResultContextType | undefined>(
  undefined
);

// Provider component
export const ScrapeResultProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [results, setResults] = useState<ScrapeResult[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/scrape-results");
        const data: ScrapeResult[] = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching scrape results:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrapeResultContext.Provider value={{ results, setResults }}>
      {children}
    </ScrapeResultContext.Provider>
  );
};

// Custom hook for accessing the context
export const useScrapeResult = (): ScrapeResultContextType => {
  const context = useContext(ScrapeResultContext);
  if (!context) {
    throw new Error(
      "useScrapeResult must be used within a ScrapeResultProvider"
    );
  }
  return context;
};
