import { createContext, useState, ReactNode } from "react";

export interface AdLink {
  originalUrl: string;
  shortId: string;
  clicks: number;
  createdAt: string;
}

export interface AdLinkContextType {
  data: AdLink[];
  setData: (data: AdLink[]) => void;
}

export const AdLinkContext = createContext<AdLinkContextType | undefined>(
  undefined
);

export const AdLinkProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AdLink[]>([]);

  return (
    <AdLinkContext.Provider value={{ data, setData }}>
      {children}
    </AdLinkContext.Provider>
  );
};
