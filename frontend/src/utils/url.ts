export const extractHostname = (url: string): string => {
  try {
    const { hostname } = new URL(url);
    const parts = hostname.split(".");
    if (parts[0] === "www") {
      return parts[1];
    }
    return parts[0];
  } catch (error) {
    console.error(`Invalid URL: ${url}`, error);
    return "Unknown";
  }
};
