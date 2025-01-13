import type { NextApiRequest, NextApiResponse } from "next";
import type { ScrapeResult } from "@/types/scraperesult";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScrapeResult[] | ScrapeResult | { error: string }>
) {
  //delete repeatable
  const resultUrl = "http://localhost:5000/api/websites/delete";
  try {
    const { list } = req.body;

    const deleteList = {
      list: list,
    };

    console.log(deleteList);
    const response = await fetch(resultUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteList),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create scrape result: ${response.statusText}`);
    }

    res.status(200).json({
      error: "Selected ids deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch scrape results" });
  }
}
