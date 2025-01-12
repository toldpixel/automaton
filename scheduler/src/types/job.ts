export interface JobInformation {
  id: string;
  url: string;
  selectors: string | Record<string, any>;
  createdAt: Date;
  metadataId: string;
  Metadata: {
    id: string;
    priority: "high" | "medium" | "low" | "";
    scheduleFrequency: string; //!add only valid cron string or empty for non repeatable job!!
    addedAt: string;
  };
}
