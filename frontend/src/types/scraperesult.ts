// Interface for scrapeSchema
export interface Scrape {
  name?: string;
  gpu?: string;
  storage?: string;
  network?: string;
  egress?: string;
  price_monthly?: string;
  price_hourly?: string;
}

// Interface for metadataSchema
export interface Metadata {
  id?: string;
  priority?: "high" | "medium" | "low" | ""; // Restricted to these values
  scheduleFrequency?: string;
  addedAt?: string;
}

// Interface for finishedJobSchema
export interface ScrapeResult {
  _id?: string;
  id?: string;
  url?: string;
  selectors?: string; // Mixed type allows an arbitrary object
  createdAt?: Date;
  metadataId?: string;
  Metadata?: Metadata; // Embedded Metadata schema
  result?: Scrape[]; // Array of Scrape objects
}
