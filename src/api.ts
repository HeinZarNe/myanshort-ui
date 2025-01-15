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
    if (error.status === 403) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}auth/refresh-token`, {
            refreshToken,
          });
          const { accessToken } = response.data;
          localStorage.setItem("token", accessToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error("Failed to refresh token:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const shortenUrl = async (
  originalUrl: string,
  name: string,
  userId?: string | undefined
): Promise<{ newLink: AdLink; exists?: boolean } | null> => {
  const isValid = validateURL(originalUrl);
  if (!isValid) {
    return null;
  }
  try {
    if (userId) {
      const payload: Record<string, string> = { originalUrl, name };
      payload.userId = userId;
      const response = await axiosInstance.post(`/urls/shorten`, payload);
      return response.data;
    } else {
      const payload: Record<string, string> = { originalUrl };

      const response = await axiosInstance.post(
        `/urls/public/shorten`,
        payload
      );
      return response.data;
    }
  } catch (error) {
    console.error("Error shortening URL:", error);
    throw error;
  }
};

export const modifyUrl = async (id: string, name?: string, link?: string) => {
  try {
    const response = await axiosInstance.post(`/urls/modify/${id}`, {
      name,
      link,
    });
    return response;
  } catch (err) {
    console.error("Error getting click counts:", err);
    throw err;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post(`/auth/forgot-password`, {
      email,
    });
    return response;
  } catch (error) {}
};
export const resetPassword = async (
  email: string,
  token: string,
  password: string
) => {
  try {
    const response = await axiosInstance.post(`/auth/reset-password`, {
      email,
      token,
      password,
    });
    return response;
  } catch (error) {}
};
export const getClickCounts = async (shortId: string) => {
  try {
    const response = await axiosInstance.get(`/urls/click_count/${shortId}`);
    return response;
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

export const getAdDetials = async (id: string): Promise<AdLink | undefined> => {
  try {
    const response = await axiosInstance.get(`/urls/detail/${id}`);
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

export const googleLogin = async () => {
  try {
    return await axiosInstance.get("/auth/google");
  } catch (err) {}
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
export const deleteAccount = async () => {
  try {
    const response = await axiosInstance.delete(`/users/delete-account`);
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
    const response = await axiosInstance.get(`/users/profile`);
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
