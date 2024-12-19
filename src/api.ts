import axios from "axios";
import { validateURL } from "./Home";
const API_URL = "http://localhost:5000";

export const shortenUrl = async (originalUrl: string) => {
  const isValid = validateURL(originalUrl);
  if (!isValid) {
    return;
  }
  try {
    const response = await axios.post(`${API_URL}/shorten`, { originalUrl });
    return response.data;
  } catch (error) {
    console.error("Error shortening URL:", error);
    throw error;
  }
};

export const getOriginalUrl = async (shortId: string) => {
  try {
    const response = await axios.get(`${API_URL}/${shortId}`);
    return response;
  } catch (error) {
    console.error("Error geting Url:", error);
    throw error;
  }
};
