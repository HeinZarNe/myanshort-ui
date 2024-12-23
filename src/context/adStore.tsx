import { createContext, useState, ReactNode } from "react";
import { AdLink, AdLinkContextType } from "../types";

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
