"use client";
import React, { useEffect, useState } from "react";
import { useScrapeContext } from "@/context/chartBoxPlotContext";
import { Switch } from "@/components/ui/switch";
import { Bot } from "lucide-react";
const items = [
  { label: "Overview", view: "Overview" },
  { label: "Add", view: "Add" },
];

type Props = {
  activeView: string;
  onMenuClick: (view: string) => void;
  statusColor: string;
  status: string;
  setAiMode: (checked: boolean) => void;
};

const Menubar = ({
  status,
  activeView,
  onMenuClick,
  setAiMode,
  statusColor,
}: Props) => {
  const { setScrapes } = useScrapeContext(); // Sets the chart with the clicked row data in ChartBoxPlotContext
  // when switching tabs it should empty scrapes so that Overview is shown
  const [isSwitchChecked, setIsSwitchChecked] = useState(false); //state for switch

  // Propagate the switch state to send it over socket to scraper
  const handleSwitchChange = (checked: boolean) => {
    setIsSwitchChecked(checked);
    setAiMode(checked);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="inline-flex items-center rounded-md mb-2 justify-between bg-[#09090B] text-white p-2 border border-[#27272A] shadow-md">
        <div className="flex space-x-2">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                onMenuClick(item.view);
                setScrapes([]);
              }}
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                activeView === item.view
                  ? "bg-blue-600 text-white"
                  : "bg-[#27272A] text-[#5F5F65] "
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={isSwitchChecked}
          onCheckedChange={handleSwitchChange}
        />
        <div>AI Mode</div>
        <Bot className={`${isSwitchChecked ? "text-green-500" : ""}`} />
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full transition-all duration-300 ${statusColor}`}
        />
        <span className="min-w-[200px] text-ellipsis overflow-hidden whitespace-nowrap">
          Scraper {status}
        </span>
      </div>
    </div>
  );
};

export default Menubar;
