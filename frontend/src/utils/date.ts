export const formatDate = (date: string): string => {
  const formattedDate = date
    ? new Date().toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "Unknown Date";
  return formattedDate;
};
