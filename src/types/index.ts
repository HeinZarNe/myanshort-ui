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

export interface ConfrimModalProps {
  closeModal?: () => void; // Function to close the modal
  handleAction: () => void; // Function to handle the confirm action
  message?: string; // The message to display in the modal
  cancelText?: string; // Text for the cancel button
  confirmText?: string; // Text for the confirm button
  cancelClassname?: string; // Optional CSS class for the cancel button
  confirmClassname?: string; // Optional CSS class for the confirm button
}
