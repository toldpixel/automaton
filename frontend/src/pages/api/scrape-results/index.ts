import type { NextApiRequest, NextApiResponse } from "next";
import type { ScrapeResult } from "@/types/scraperesult";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScrapeResult[] | ScrapeResult | { error: string }>
) {
  //Management endpoint
  const resultUrl = "http://localhost:5000/api/results";
  const newJobUrl = "http://localhost:5000/api/websites";

  if (req.method === "GET") {
    //! Get the results from mongodb
    try {
      const response = await fetch(resultUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const scrapeResults: ScrapeResult[] = await response.json();
      res.status(200).json(scrapeResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch scrape results" });
    }
  } else if (req.method === "POST") {
    //! Post new websites to scrape to the bullmq queue through management
    try {
      const newWebsite: ScrapeResult = req.body;

      if (!newWebsite.url || !newWebsite.selectors || !newWebsite.Metadata) {
        res
          .status(400)
          .json({ error: "Missing required fields in request body" });
        return;
      }

      const response = await fetch(newJobUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWebsite),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to create scrape result: ${response.statusText}`
        );
      }
      const createdWebsite: ScrapeResult = await response.json();
      res.status(201).json(createdWebsite);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create scrape result" });
    }
  } else if (req.method === "PUT") {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Invalid or missing ID" });
      return;
    }
    try {
      const updatedResult = req.body;
      const response = await fetch(`${resultUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedResult),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to update scrape result: ${response.statusText}`
        );
      }
      const result: ScrapeResult = await response.json();
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update scrape result" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Invalid or missing ID" });
      return;
    }
    try {
      const response = await fetch(`${resultUrl}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to delete scrape result: ${response.statusText}`
        );
      }
      res.status(200).json({ error: "Scrape result deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete scrape result" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
