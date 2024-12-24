export interface AdLink {
  userId?: string;
  originalUrl: string;
  shortId: string;
  clicks: number;
  createdAt: string;
}

export interface AdLinkContextType {
  data: AdLink[];
  setData: (data: AdLink[]) => void;
}

export interface AdGridCardProps {
  index: number;
  item: {
    originalUrl: string;
    shortId: string;
    clicks: number;
  };
  handleDelete: (arg0: string) => void;
}
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
}
