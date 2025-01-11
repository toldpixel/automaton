import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function notifyManagement(event, payload) {
  const managementApiBaseUrl = `http://${process.env.MANAGEMENT_HOST}:5000/api/events`;
  try {
    const response = await axios.post(
      `${managementApiBaseUrl}/${event}`,
      payload
    );
    console.log(`Management notified for event ${event}:`, response.data);
  } catch (error) {
    console.error(
      `Failed to notify management for event ${event}:`,
      error.message
    );
  }
}
