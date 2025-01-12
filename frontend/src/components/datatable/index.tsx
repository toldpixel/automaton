"use client";

import React from "react";
import { ScrapeResult } from "@/types/scraperesult";
import { useScrapeContext } from "@/context/chartBoxPlotContext";

type Props = {
  results: ScrapeResult[];
};

const ScrollableDataTable = ({ results }: Props) => {
  const { scrapes, setScrapes } = useScrapeContext();

  const handleRowClick = (scrapeResult: ScrapeResult) => {
    console.log(scrapeResult.result);
    if (scrapeResult.result) {
      setScrapes(scrapeResult.result);
    }
    console.log("No results");
  };
  return (
    <div className="border border-[#27272A]">
      <div className="sticky top-0 bg-gray-800 text-white p-3">
        <div className="grid grid-cols-2 gap-2 font-bold">
          <div>Status</div>
          <div>Web Address</div>
        </div>
      </div>

      <div className="overflow-y-auto">
        {results.map((scrapeResult) => (
          <div
            key={scrapeResult.id}
            onClick={() => handleRowClick(scrapeResult)}
            className="grid grid-cols-2 gap-2 p-3 border-b  border-gray-700 hover:bg-[rgba(255,255,255,0.1)]"
          >
            <div>Status</div>
            <div>{scrapeResult.url || "Unknown"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableDataTable;
