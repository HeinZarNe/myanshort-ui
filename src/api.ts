import axios, { AxiosResponse } from "axios";
import { validateURL } from "./ShortUrl";
import { AdLink } from "./types";

const API_URL = import.meta.env.VITE_BACKEND_API;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
          });
          const { token } = response.data;
          localStorage.setItem("token", token);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error("Failed to refresh token:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const shortenUrl = async (
  originalUrl: string
): Promise<AdLink | null> => {
  const isValid = validateURL(originalUrl);
  if (!isValid) {
    return null;
  }
  try {
    const response = await axiosInstance.post(`/shorten`, {
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
    const response = await axiosInstance.get(`/click_count/${shortId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting click counts:", error);
    throw error;
  }
};

export const getAdLinks = async (): Promise<AdLink[] | undefined> => {
  try {
    const response = await axiosInstance.get(`/urls`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteAd = async (shortId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/urls/${shortId}`);
  } catch (err) {
    console.error(err);
  }
};

export const registerUser = async (formData: {}): Promise<
  AxiosResponse<any, any> | undefined
> => {
  try {
    const response = await axiosInstance.post(`/auth/register`, formData);
    return response;
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (formData: {}): Promise<
  AxiosResponse<any, any> | undefined
> => {
  try {
    const response = await axiosInstance.post(`/auth/login`, formData);
    return response;
  } catch (err) {
    throw err;
  }
};
export const verifyEmail = async (email: string) => {
  try {
    const response = await axiosInstance.get(
      `/auth/request-email-verify?email=${email}`
    );
    return response;
  } catch (err) {
    throw err;
  }
};

export const getProfile = async (): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axiosInstance.get(`/profile`);
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
