import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { redirect, useNavigate } from "react-router-dom";
import { getProfile } from "../api";
import { AuthContextType, User } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedUser && token && refreshToken) {
      setToken(token);
      setRefreshToken(refreshToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false); // Mark initialization as complete
  }, []);

  const login = useCallback(
    async (token: string, refreshToken: string, user: User) => {
      setLoading(true); // Set loading during login
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        setToken(token);
        setRefreshToken(refreshToken);
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
          setIsAuthenticated(true);
        } else {
          throw new Error("User data is missing");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setIsAuthenticated(false);
        navigate("/login");
      } finally {
        setLoading(false); // Loading complete
      }
    },
    [navigate]
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        refreshToken,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
