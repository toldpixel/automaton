export interface JobInformation {
  id: string;
  url: string;
  selectors: string | Record<string, any>;
  createdAt: Date;
  metadataId: string;
  metadata: {
    id: string;
    priority: "high" | "medium" | "low";
    scheduleFrequency: string; //!add only valid cron string!!
    addedAt: string;
  };
}
