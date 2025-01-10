import { ChartComponent } from "@/components/chart";
import { Button } from "@/components/ui/button";

import React from "react";

export default function Home() {
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
          <div className="flex rounded gap-5">
            <div className="w-1/2 border border-[#27272A] p-5">
              <div>Overview</div>
              <div>
                <ChartComponent />
              </div>
            </div>
            <div className="w-1/2 border border-[#27272A] p-5">test</div>
          </div>
        </div>
      </div>
    </>
  );
}
