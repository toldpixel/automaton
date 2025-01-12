"use client";

import { Scrape, ScrapeResult } from "@/types/scraperesult";
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
  setOverviewResults: Dispatch<SetStateAction<Scrape[]>>;
  overviewResults: Scrape[];
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
  const [overviewResults, setOverviewResults] = useState<Scrape[]>([]);

  // Fetch function to retrieve scrape results
  const fetchResults = async () => {
    try {
      const response = await fetch("/api/scrape-results"); // Adjusted endpoint
      if (!response.ok) {
        throw new Error(
          `Error fetching scrape results: ${response.statusText}`
        );
      }
      const scrapeResult: ScrapeResult[] = await response.json();
      const overviewResult = overviewPrepare(scrapeResult);
      setResults(scrapeResult);
      setOverviewResults(overviewResult);
    } catch (error) {
      console.error("Error fetching scrape results:", error);
    }
  };

  // Prepare overview data for the chart
  function overviewPrepare(scrapeResult: ScrapeResult[]): Scrape[] {
    return scrapeResult.flatMap((resultData) => resultData.result || []);
  }

  // Fetch results on mount
  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <ScrapeResultContext.Provider
      value={{
        results,
        overviewResults,
        setResults,
        fetchResults,
        setOverviewResults,
      }}
    >
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
