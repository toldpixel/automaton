import type { NextApiRequest, NextApiResponse } from "next";
import type { ScrapeResult } from "@/types/scraperesult";

// Prepare for downloading xlsx or csv
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScrapeResult[] | ScrapeResult | { error: string }>
) {
  const resultDownloadURL = "http://localhost:5000/api/results/download";

  try {
    const { list, format } = req.body;

    if (!list || !Array.isArray(list) || list.length === 0) {
      return res.status(400).json({ error: "at least one valid ID." });
    }

    const response = await fetch(resultDownloadURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ list, format }),
    });

    console.log(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create scrape result: ${response.statusText}`);
    }

    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream";
    const contentDisposition =
      response.headers.get("Content-Disposition") || "";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", contentDisposition);

    // Stream chunks to frontend
    const reader = response.body?.getReader();
    if (reader) {
      const writer = res.write.bind(res);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        writer(value);
      }
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch scrape results" });
  }
}
