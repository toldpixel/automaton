"use client";

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

// ChatGPT Boilerplate
// Define the context type
interface ScrapeResultContextType {
  results: ScrapeResult[];
  setResults: Dispatch<SetStateAction<ScrapeResult[]>>;
  fetchResults: () => Promise<void>; // Add a method to fetch results manually
}

// Create the context with the correct type
const ScrapeResultContext = createContext<ScrapeResultContextType | undefined>(
  undefined
);

// Provider component
export const ScrapeResultProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [results, setResults] = useState<ScrapeResult[]>([]);

  // Fetch function to retrieve scrape results
  const fetchResults = async () => {
    try {
      const response = await fetch("/api/scrape-results"); // Adjusted endpoint
      if (!response.ok) {
        throw new Error(
          `Error fetching scrape results: ${response.statusText}`
        );
      }
      const data: ScrapeResult[] = await response.json();
      console.log(data);
      setResults(data);
    } catch (error) {
      console.error("Error fetching scrape results:", error);
    }
  };

  // Fetch results on mount
  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <ScrapeResultContext.Provider value={{ results, setResults, fetchResults }}>
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
