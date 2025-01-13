"use client";
import { ChartComponent } from "@/components/chart";
import Menubar from "@/components/menubar";
import { Button } from "@/components/ui/button";
import { useScrapeResult } from "@/context/ScrapeResultContext";
import { ScrollableDataTable } from "@/components/datatable";
import React, { useEffect, useState } from "react";
import { ScrapeProvider } from "@/context/chartBoxPlotContext";
import Add from "@/components/menubar/add";
import { Download, FileText } from "lucide-react";
import { socket } from "../socket";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Scrape } from "@/types/scraperesult";
export default function Home() {
  const { results, overviewResults, setResults, fetchResults } =
    useScrapeResult();
  const [activeView, setActiveView] = useState<string>("Overview"); // Default state
  const [workerStatus, setWorkerStatus] = useState<string>("idle"); // For Lifecycle
  const [isConnected, setIsConnected] = useState(false);
  const [isTransport, setTransport] = useState("N/A");
  const [downloadFormat, setDownloadFormat] = useState<"csv" | "excel">("csv");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isSelected, setIsSelected] = useState<string>(""); // For Overview Title
  const [aimode, setAiMode] = useState<Boolean>(false);

  type RowStatus = {
    [key: string]: {
      status: string;
      color: string;
    };
  };

  const [rowStatuses, setRowStatuses] = useState<RowStatus>({});
  // Handles the status updates "Scraper ready"
  useEffect(() => {
    function onConnect() {
      console.log("Connected!", socket.id);
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("worker-ready", (data) => {
      console.log("Received worker-ready:", data.status);
      setWorkerStatus("ready");
    });

    socket.on("worker-progress", (data) => {
      console.log("progress data:", data.progress);
      setTimeout(() => setWorkerStatus("processing"), 3000);
      console.log(
        `Worker progress for ${data.id.split(":")[1]}:`,
        data.progress
      );
      const id = data.id.split(":")[1];
      setRowStatuses((prev) => ({
        ...prev,
        [id]: { status: "processing", color: "text-yellow-500" },
      }));
    });

    socket.on("worker-completed", (data) => {
      setWorkerStatus("completed");
      setTimeout(() => setWorkerStatus("ready"), 3000);
      console.log(
        `Worker completed for ${data.id.split(":")[1]}:`,
        data.result
      );
      const id = data.id.split(":")[1];
      setRowStatuses((prev) => ({
        ...prev,
        [id]: { status: "completed", color: "text-purple-500" },
      }));
      fetchResults();
    });
    socket.on("worker-failed", (data) => {
      setWorkerStatus("failed");
      console.log(`Worker failed for ${data.id}:`, data.error);
      const id = data.id.split(":")[1];
      setRowStatuses((prev) => ({
        ...prev,
        [id]: { status: "failed", color: "text-red-500" },
      }));
    });
    socket.on("worker-error", () => setWorkerStatus("error"));

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("worker-ready");
      socket.off("worker-progress");
      socket.off("worker-completed");
      socket.off("worker-failed");
      socket.off("worker-error");
    };
  }, []);

  useEffect(() => {
    if (aimode) {
      socket.emit("ai-mode-activated", { mode: true });
    } else {
      socket.emit("ai-mode-activated", { mode: false });
    }
  }, [aimode]);

  // Excel or CSV Download
  const handleDownload = async () => {
    if (selectedRows.size === 0) {
      alert("Please select at least one item to download.");
      return;
    }

    const list = Array.from(selectedRows);

    const newDownload = {
      list: list,
      format: downloadFormat,
    };

    console.log(newDownload);
    const response = await fetch("/api/scrape-results/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDownload),
    });

    if (!response.ok) {
      alert("Failed to download the file. Please try again.");
      return;
    }

    const contentDisposition = response.headers.get("Content-Disposition"); //Filename
    const contentType = response.headers.get("Content-Type"); //runtime errors
    const blob = await response.blob();

    const fileExtension = downloadFormat === "csv" ? "csv" : "xlsx";

    const filename =
      contentDisposition?.match(/filename="(.+)"/)?.[1] ||
      `scrape-results.${fileExtension}`;

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = () => {
    switch (workerStatus) {
      case "ready":
        return "bg-green-500";
      case "processing":
        return "bg-yellow-500";
      case "completed":
        return "bg-purple-500";
      case "failed":
        return "bg-red-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="h-screen flex-col space-y-5 items-center justify-center text-white">
          <div className="flex justify-between items-center">
            <div className="text-[48px] font-bold ">Automaton</div>
            <div className="">
              <Popover>
                <PopoverTrigger>
                  <div className="flex items-center space-x-2 bg-[#171717] rounded py-2 px-6 ">
                    <div>
                      <span>
                        <Download />
                      </span>
                    </div>
                    <div>Get Data</div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className=" text-[#909098] space-x-2 space-y-2 items-center justify-between border border-[#27272A] bg-[#27272A]">
                  <div className="flex items-center justify-between space-x-2">
                    <FileText className="text-green-500" />
                    <select
                      id="format"
                      value={downloadFormat}
                      onChange={(e) =>
                        setDownloadFormat(e.target.value as "csv" | "excel")
                      }
                      className="bg-gray-800 text-white rounded px-2 py-1"
                    >
                      <option value="csv">CSV</option>
                      <option value="excel">XLSX</option>
                    </select>
                    <Button onClick={handleDownload}>Download</Button>
                  </div>
                  <hr className="border border-[#727880]"></hr>
                  <div>{selectedRows.size} selected</div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {/* <div className="inline-flex space-x-2 bg-[#27272A] p-1 rounded-lg"></div> */}
          <ScrapeProvider>
            <div className="flex rounded gap-5 ">
              <div className="w-1/2 border border-[#27272A] p-5">
                <div className="mb-5">
                  {isSelected ? (
                    <div>
                      {isSelected.charAt(0).toUpperCase() + isSelected.slice(1)}
                    </div>
                  ) : (
                    <div>Overview</div>
                  )}
                </div>
                <div>
                  {/* Sets ScrapeProviderContext in Scrollable DataTable to change the Chart Data */}
                  <ChartComponent overviewResults={overviewResults} />
                </div>
              </div>
              <div className="w-1/2 border text-[#909098] border-[#27272A] p-5">
                <div>
                  <Menubar
                    status={workerStatus}
                    activeView={activeView}
                    onMenuClick={(view) => setActiveView(view)}
                    statusColor={getStatusColor()}
                    setAiMode={setAiMode}
                  />
                  {activeView === "Add" && <Add />}
                  {activeView === "Overview" && (
                    <ScrollableDataTable
                      rowStatuses={rowStatuses}
                      results={results}
                      setResults={setResults}
                      selectedRows={selectedRows}
                      setSelectedRows={setSelectedRows} // for downloading
                      setIsSelected={setIsSelected} // for overview or individual chart view
                    />
                  )}
                </div>
              </div>
            </div>
          </ScrapeProvider>
        </div>
      </div>
    </>
  );
}
