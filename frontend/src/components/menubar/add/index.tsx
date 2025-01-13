import { ScrapeResult } from "@/types/scraperesult";
import React, { useState } from "react";
import { useScrapeResult } from "@/context/ScrapeResultContext"; // Refresh or rerender page after added data

type Props = {};

const Add = (props: Props) => {
  const { fetchResults } = useScrapeResult();
  const [url, setUrl] = useState("");
  const [selectors, setSelectors] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low" | "">("");
  const [scheduleFrequency, setScheduleFrequency] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (url.trim() === "") {
      alert("URL cannot be empty.");
      return;
    }
    if (selectors.trim() === "") {
      alert("Please enter selectors.");
      return;
    }

    const newWebsite: ScrapeResult = {
      url: url,
      selectors: selectors,
      Metadata: {
        priority: priority || "",
        scheduleFrequency: scheduleFrequency,
        addedAt: new Date().toISOString(),
      },
    };

    try {
      // Send POST to management
      const response = await fetch("/api/scrape-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWebsite),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);
      alert("Scraping website!");

      // Refresh data
      await fetchResults();

      setUrl(""); //! Reset the form :)
      setSelectors("");
      setPriority("");
      setScheduleFrequency("");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form try again");
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-4 border border-gray-700 rounded-lg"
      >
        <div>
          <label htmlFor="url" className="block text-sm font-medium ">
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://example.com/pricing"
            className="mt-1 block w-full p-2 bg-gray-800 border border-gray-600  rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium ">Selectors</label>
          <input
            type="text"
            id="selectors"
            value={selectors}
            onChange={(e) => setSelectors(e.target.value)}
            required
            placeholder="div > div > div"
            className="mt-1 block w-full p-2 bg-gray-800 border border-gray-600  rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#909098]">
            Priority
          </label>
          <div className="flex space-x-4 mt-2">
            {["high", "medium", "low", ""].map((level) => (
              <label key={level} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={level}
                  checked={priority === level}
                  onChange={() =>
                    setPriority(level as "high" | "medium" | "low" | "")
                  }
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="">
                  <span
                    className={`${
                      level === "high"
                        ? "text-red-500"
                        : level === "medium"
                        ? "text-yellow-500"
                        : level === "low"
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  >
                    {level === "high"
                      ? "High"
                      : level === "medium"
                      ? "Medium"
                      : level === "low"
                      ? "Low"
                      : "None"}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="scheduleFrequency"
            className="block text-sm font-medium text-white"
          >
            Schedule Frequency
          </label>
          <select
            id="scheduleFrequency"
            value={scheduleFrequency}
            onChange={(e) => setScheduleFrequency(e.target.value)}
            className="mt-1 block w-full p-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a frequency</option>
            <option value="* * * * *">Every minute</option>
            <option value="0 0 * * *">Daily at midnight</option>
            <option value="0 12 * * 1">Every Monday at noon</option>
          </select>
          <p className="mt-2 text-sm text-gray-400">
            Examples:
            <br /> - Every minute (<code>* * * * *</code>)
            <br /> - Daily at midnight (<code>0 0 * * *</code>)
            <br /> - Every Monday at noon (<code>0 12 * * 1</code>)
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Add;
