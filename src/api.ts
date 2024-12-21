import axios from "axios";
import { validateURL } from "./ShortUrl";
import { AdLink } from "./contexStore";
const API_URL = import.meta.env.VITE_BACKEND_API;

export const shortenUrl = async (
  originalUrl: string
): Promise<AdLink | null> => {
  const isValid = validateURL(originalUrl);
  if (!isValid) {
    return null;
  }
  try {
    const response = await axios.post(`${API_URL}/shorten`, {
      originalUrl,
    });
    return response.data;
  } catch (error) {
    console.error("Error shortening URL:", error);
    throw error;
  }
};

export const getClickCounts = async (shortId: string) => {
  try {
    const response = await axios.get(`${API_URL}/click_count/${shortId}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const getAdLinks = async (): Promise<AdLink[] | undefined> => {
  try {
    const response = await axios.get(`${API_URL}/adlink`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteAd = async (shortId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/adlink/${shortId}`);
  } catch (err) {
    console.error(err);
  }
};
