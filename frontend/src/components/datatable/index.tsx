"use client";

import React, { useEffect, useState } from "react";
import { Scrape, ScrapeResult } from "@/types/scraperesult";
import { useScrapeContext } from "@/context/chartBoxPlotContext";
import { Button } from "../ui/button";
import { extractHostname } from "@/utils/url";
import { formatDate } from "@/utils/date";

type Props = {
  results: ScrapeResult[];
  selectedRows: Set<string>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  setIsSelected: React.Dispatch<React.SetStateAction<string>>;
  setResults: React.Dispatch<React.SetStateAction<ScrapeResult[]>>;
};

export const ScrollableDataTable = ({
  results,
  selectedRows,
  setResults,
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

  // Remove all selected ids
  const handleRemoveSelected = async () => {
    if (selectedRows.size === 0) {
      return;
    }

    try {
      const list = Array.from(selectedRows);

      // Send a POST request to the delete endpoint
      const deleteList = {
        list: list,
      };
      const response = await fetch("/api/scrape-results/delete", {
        method: "POST", // Use POST to send data in the body
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteList),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      const { deletedCount } = await response.json();

      // Filter out the deleted rows from the results
      const remainingResults = results.filter(
        (result) => !list.includes(result.id as string)
      );

      // Update the state
      setSelectedRows(new Set()); // Clear the selected rows
      setScrapes([]); // Clear chart data if necessary
      setIsSelected(""); // Reset the selection
      setResults(remainingResults); // Update the table data with remaining results

      alert(`Successfully removed item(s).`);
    } catch (error) {
      console.error("Error deleting selected rows:", error);
      alert("Failed to remove selected items. Please try again.");
    }
  };

  return (
    <div className="border border-[#27272A] min-h-[300px] max-h-[500px] overflow-y-auto">
      <div className="p-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleRemoveSelected}
          disabled={selectedRows.size === 0} // Disable if no rows selected
        >
          Remove Selected
        </Button>
      </div>

      <div
        className="sticky top-0 bg-gray-800 text-white p-3 grid gap-2"
        style={{
          gridTemplateColumns: "5% 20% 20% 25% 30%",
          fontWeight: "bold",
        }}
      >
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAllChange}
            className="cursor-pointer w-4 h-4"
          />
        </div>
        <div>Selected</div>
        <div>Status</div>
        <div>Last Scrape</div>
        <div>Web Address</div>
      </div>

      {/* Table Rows */}
      <div>
        {results.map((scrapeResult) => (
          <div
            key={scrapeResult.id}
            data-id={scrapeResult.id}
            onClick={() => handleRowClick(scrapeResult)}
            className="grid gap-2 p-3 border-b border-gray-700 hover:bg-[rgba(255,255,255,0.1)] cursor-pointer"
            style={{
              gridTemplateColumns: "5% 20% 20% 25% 30%",
            }}
          >
            {/* Checkbox Column */}
            <div className="flex items-center">
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

            {/* Columns */}
            <div>
              {selectedRows.has(scrapeResult.id as string) ? "Yes" : "No"}
            </div>
            <div>Status</div>
            <div>{formatDate(scrapeResult.Metadata?.addedAt as string)}</div>
            <div className="truncate">
              {extractHostname(scrapeResult.url as string) || "Unknown"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
