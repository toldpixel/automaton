import axios from axios;

const MANAGEMENT_API_URL = process.env.MANAGEMENT_API_URL;

export async function getWebsites() {
  try {
    const response = await axios.get(`${MANAGEMENT_API_URL}/websites`);
    return response.data;
  } catch (error) {
    console.error('Error fetching websites', error.message);
    throw error;
  }
}

