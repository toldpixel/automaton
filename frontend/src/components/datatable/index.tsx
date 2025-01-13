"use client";

import React, { useEffect, useState } from "react";
import { Scrape, ScrapeResult } from "@/types/scraperesult";
import { useScrapeContext } from "@/context/chartBoxPlotContext";
import { useScrapeResult } from "@/context/ScrapeResultContext";
import { Button } from "../ui/button";
import { extractHostname } from "@/utils/url";
import { formatDate } from "@/utils/date";
import { RefreshCw } from "lucide-react";

type RowStatus = {
  [key: string]: {
    status: string;
    color: string;
  };
};

type Props = {
  results: ScrapeResult[];
  selectedRows: Set<string>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  setIsSelected: React.Dispatch<React.SetStateAction<string>>;
  setResults: React.Dispatch<React.SetStateAction<ScrapeResult[]>>;
  rowStatuses: RowStatus;
};

export const ScrollableDataTable = ({
  results,
  selectedRows,
  setResults,
  setSelectedRows,
  setIsSelected,
  rowStatuses,
}: Props) => {
  const { setScrapes } = useScrapeContext(); // Sets the chart with the clicked row data in ChartBoxPlotContext
  const { fetchResults } = useScrapeResult(); // Refresh or rerender page after added data
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
      // Separate IDs into repeatable and non-repeatable based on scheduleFrequency
      const repeatableIds: string[] = [];
      const nonRepeatableIds: string[] = [];

      results.forEach((result) => {
        if (selectedRows.has(result.id as string)) {
          if (result.Metadata?.scheduleFrequency) {
            repeatableIds.push(result.id as string);
          } else {
            nonRepeatableIds.push(result.id as string);
          }
        }
      });

      console.log("Repeatable", repeatableIds);
      console.log("Non-rep", nonRepeatableIds);

      // Helper function to send delete requests
      const sendDeleteRequest = async (url: string, ids: string[]) => {
        if (ids.length === 0) return; // Skip if no IDs to delete
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ list: ids }),
        });
        if (!response.ok) {
          throw new Error(
            `Failed to delete from ${url}: ${response.statusText}`
          );
        }
      };

      // Send requests for repeatable and non-repeatable deletions
      await Promise.all([
        sendDeleteRequest("/api/scrape-results/delete", nonRepeatableIds),
        sendDeleteRequest("/api/scrape-results/deleterep", repeatableIds),
      ]);

      // Filter out the deleted rows from the results
      const remainingResults = results.filter(
        (result) => !selectedRows.has(result.id as string)
      );

      // Refresh data
      await fetchResults();

      // Update the state
      setSelectedRows(new Set()); // Clear the selected rows
      setScrapes([]); // Clear chart data if necessary
      setIsSelected(""); // Reset the selection
      setResults(remainingResults); // Update the table data with remaining results

      alert(`Successfully removed selected item(s).`);
    } catch (error) {
      console.error("Error deleting selected rows:", error);
      alert("Failed to remove selected items. Please try again.");
    }
  };

  return (
    <div className="border border-[#27272A] min-h-[500px] overflow-y-auto">
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
        {results.map((scrapeResult) => {
          const status =
            rowStatuses[scrapeResult.id as string]?.status || "idle";
          const color =
            rowStatuses[scrapeResult.id as string]?.color || "text-gray-500";
          console.log(status);
          return (
            <div
              key={scrapeResult.id}
              data-id={scrapeResult.id}
              onClick={() => handleRowClick(scrapeResult)}
              className={`grid gap-2 p-3 border-b border-gray-700 hover:bg-[rgba(255,255,255,0.1)] cursor-pointer `}
              style={{
                gridTemplateColumns: "5% 20% 20% 25% 20% 5%",
              }}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedRows.has(scrapeResult.id as string)}
                  onChange={(e) =>
                    handleCheckboxChange(scrapeResult.id as string)
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer w-4 h-4"
                />
              </div>
              <div>
                {selectedRows.has(scrapeResult.id as string) ? "Yes" : "No"}
              </div>
              <div className={`${color}`}>{status}</div>
              <div>{scrapeResult.Metadata?.addedAt as string}</div>
              <div className="truncate">
                {extractHostname(scrapeResult.url as string) || "Unknown"}
              </div>
              <div>
                {scrapeResult.Metadata?.scheduleFrequency === "" ? (
                  ""
                ) : (
                  <RefreshCw />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
