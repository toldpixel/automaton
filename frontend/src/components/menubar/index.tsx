import React from "react";
import { Button } from "../ui/button";

const items = [
  { label: "Overview", view: "Overview" },
  { label: "Add", view: "Add" },
  { label: "Settings", view: "Settings" },
];

type Props = {
  activeView: string;
  onMenuClick: (view: string) => void;
  statusColor: string;
  status: string;
};

const Menubar = ({ status, activeView, onMenuClick, statusColor }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div className="inline-flex items-center rounded-md mb-2 justify-between bg-[#09090B] text-white p-2 border border-[#27272A] shadow-md">
        <div className="flex space-x-2">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => onMenuClick(item.view)}
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
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full ${statusColor}`} />
        <span>Scraper {status}</span>
      </div>
    </div>
  );
};

export default Menubar;