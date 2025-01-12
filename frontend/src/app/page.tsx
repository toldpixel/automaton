"use client";
import { ChartComponent } from "@/components/chart";
import Menubar from "@/components/menubar";
import { Button } from "@/components/ui/button";
import { useScrapeResult } from "@/context/ScrapeResultContext";
import ScrollableDataTable from "@/components/datatable";
import React, { useEffect, useState } from "react";
import { ScrapeProvider } from "@/context/chartBoxPlotContext";
import Add from "@/components/menubar/add";
import { WebsocketEventEnum } from "../types/events";
import { socket } from "../socket";
export default function Home() {
  const { results } = useScrapeResult();
  const [activeView, setActiveView] = useState<string>("Overview"); // Default state
  const [workerStatus, setWorkerStatus] = useState<string>("idle"); // For Lifecycle
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    function onConnect() {
      console.log("Connected!", socket.id);
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    socket.on("worker-ready", (data) => {
      console.log("Received worker-ready:", data.status);
      setWorkerStatus("ready");
    });
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("worker-progress", () => setWorkerStatus("progress"));
    socket.on("worker-completed", () => setWorkerStatus("completed"));
    socket.on("worker-failed", () => setWorkerStatus("failed"));
    socket.on("worker-error", () => setWorkerStatus("error"));
    socket.on("some event", (payload) => {
      console.log("Received 'some event':", payload);
    });

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

  const getStatusColor = () => {
    switch (workerStatus) {
      case "ready":
        return "bg-green-500";
      case "progress":
        return "bg-blue-500";
      case "completed":
        return "bg-purple-500";
      case "failed":
        return "bg-red-500";
      case "error":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="h-screen flex-col space-y-5 items-center justify-center text-white">
          <div className="flex justify-between items-center">
            <div className="text-[48px] font-bold ">Dashboard</div>
            <div className="">
              <Button
                size="lg"
                className="text-black bg-[#FAFAFA] hover:bg-slate-200"
              >
                Download
              </Button>
            </div>
          </div>
          <div className="inline-flex space-x-2 bg-[#27272A] p-1 rounded-lg">
            <div>
              <Button>Overview</Button>
            </div>
            <div>
              <Button>Scraper</Button>
            </div>
          </div>
          <ScrapeProvider>
            <div className="flex rounded gap-5 ">
              <div className="w-1/2 border border-[#27272A] p-5">
                <div className="mb-5">Overview</div>
                <div>
                  {/* Sets ScrapeProviderContext in Scrollable DataTable to change the Chart Data */}

                  <ChartComponent />
                </div>
              </div>
              <div className="w-1/2 border text-[#909098] border-[#27272A] p-5">
                <div>
                  <Menubar
                    status={workerStatus}
                    activeView={activeView}
                    onMenuClick={(view) => setActiveView(view)}
                    statusColor={getStatusColor()}
                  />

                  {activeView === "Add" && <Add />}
                  {activeView === "Overview" && (
                    <ScrollableDataTable results={results} />
                  )}
                  {activeView === "Settings" && <Add />}
                </div>
              </div>
            </div>
          </ScrapeProvider>
        </div>
      </div>
    </>
  );
}
