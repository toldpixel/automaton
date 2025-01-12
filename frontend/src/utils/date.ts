export const formatDate = (date: string): string => {
  const formattedDate = date
    ? new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Use 12-hour format
      })
    : "Unknown Date";
  return formattedDate;
};
