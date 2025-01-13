import type { NextApiRequest, NextApiResponse } from "next";
import type { ScrapeResult } from "@/types/scraperesult";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScrapeResult[] | ScrapeResult | { error: string }>
) {
  //delete repeatable
  const schedulerUrl = "http://localhost:5000/api/websites/delete";
  const resultUrl = "http://localhost:5000/api/results/delete";
  try {
    const { list } = req.body;

    const deleteList = {
      list: list,
    };

    //Delete repeatable jobs from scheduler
    const responseScheduler = await fetch(schedulerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteList),
    });

    if (!responseScheduler.ok) {
      const error = await responseScheduler.json();
      throw new Error(
        `Failed to create scrape result: ${responseScheduler.statusText}`
      );
    }

    // Now delete them from mongodb
    const responseResult = await fetch(resultUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteList),
    });

    if (!responseResult.ok) {
      const error = await responseResult.json();
      throw new Error(
        `Failed to create scrape result: ${responseResult.statusText}`
      );
    }

    res.status(200).json({
      error: "Selected ids deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch scrape results" });
  }
}
