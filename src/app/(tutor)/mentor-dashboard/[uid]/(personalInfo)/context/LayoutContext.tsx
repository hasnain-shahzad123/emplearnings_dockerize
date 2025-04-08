"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context value
interface AppContextType {
  Name: string;
}
//here make a db call and initiaalize the name
const TutorName = "Hasnain Shahzad"; 
const AppContext = createContext<AppContextType>({ Name: TutorName });

export function AppWrapper({ children }: { children: ReactNode }) {
  // State to hold context value
  const [name, setName] = useState<AppContextType>({ Name: "Hasnain Shahzad" });

  return <AppContext.Provider value={name}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
