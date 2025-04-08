"use client";
import { createContext, useState, ReactNode, useContext } from "react";

type AlertContextType = {
  message: string;
  type: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
  cssClass: string;
  showAlert: (message: string, type: "SUCCESS" | "ERROR" | "INFO" | "WARNING") => void;
  hideAlert: () => void;
};

export const AlertContext = createContext({} as AlertContextType);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"SUCCESS" | "ERROR" | "INFO" | "WARNING">("INFO");
  const [cssClass, setCssClass] = useState("hidden");

  const showAlert = (message: string, type: "SUCCESS" | "ERROR" | "INFO" | "WARNING") => {
    setMessage(message);
    setType(type);
    setCssClass(
      "fixed z-50 top-0 right-0 mx-4 mt-8 bg-white border-2 border-accent-1-base shadow-xl rounded-lg flex items-center gap-4 overflow-hidden w-3/5 md:w-2/5"
    );

    setTimeout(() => {
      hideAlert();
    }, 5000);
  };

  const hideAlert = () => {
    setCssClass("hidden");
  };

  return (
    <AlertContext.Provider
      value={{ message, type, cssClass, showAlert, hideAlert }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
