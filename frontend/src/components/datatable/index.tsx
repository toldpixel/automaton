"use client";

import React, { useEffect, useState } from "react";
import { Scrape, ScrapeResult } from "@/types/scraperesult";
import { useScrapeContext } from "@/context/chartBoxPlotContext";
import { Button } from "../ui/button";
import { extractHostname } from "@/utils/url";

type Props = {
  results: ScrapeResult[];
  selectedRows: Set<string>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  setIsSelected: React.Dispatch<React.SetStateAction<string>>;
};

export const ScrollableDataTable = ({
  results,
  selectedRows,
  setSelectedRows,
  setIsSelected,
}: Props) => {
  const { setScrapes } = useScrapeContext(); // Sets the chart with the clicked row data in ChartBoxPlotContext
  const allSelected = selectedRows.size === results.length;

  // logic to show the data on the chart when clicking
  const handleRowClick = (scrapeResult: ScrapeResult) => {
    // pass in results
    console.log(scrapeResult.result);
    if (scrapeResult.result) {
      setScrapes(scrapeResult.result); // sets the Chart <--
      setIsSelected(extractHostname(scrapeResult.url as string));
    }
    console.log("No results");
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedRows((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleSelectAllChange = () => {
    if (allSelected) {
      setSelectedRows(new Set());
    } else {
      const allIds = results.map((result) => result.id as string);
      setSelectedRows(new Set(allIds));
    }
  };

  return (
    <div className="border border-[#27272A] min-h-[300px] max-h-[500px] overflow-y-auto">
      <div className="sticky top-0 bg-gray-800 text-white p-3">
        <div className="flex items-center justify-between font-bold">
          <div className="flex space-x-2 text-sm items-center">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAllChange}
              className="cursor-pointer w-4 h-4"
            />
            <div className="text-sm">{selectedRows.size}</div>
          </div>

          <div className="flex flex-1 justify-between pl-4">
            <div className="w-[32%]">selected</div>
            <div className="w-[32%]">Status</div>
            <div className="w-[35%]">Web Address</div>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto">
        {results.map((scrapeResult) => (
          <div
            data-id={scrapeResult.id}
            key={scrapeResult.id}
            onClick={() => handleRowClick(scrapeResult)}
            className="grid grid-cols-3 gap-1 p-3 border-b  border-gray-700 hover:bg-[rgba(255,255,255,0.1)] cursor-pointer"
          >
            <div className="flex w-[32%]">
              <input
                type="checkbox"
                checked={selectedRows.has(scrapeResult.id as string)}
                onChange={(e) =>
                  handleCheckboxChange(scrapeResult.id as string)
                }
                onClick={(e) => e.stopPropagation()} // Prevent triggering row click
                className="cursor-pointer w-4 h-4"
              />
            </div>
            <div className="w-[32%]">Status</div>
            <div className="w-[50%] truncate">
              {extractHostname(scrapeResult.url as string) || "Unknown"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
