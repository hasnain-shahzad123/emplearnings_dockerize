"use client";
import { useState, useEffect } from "react";
interface AlertProps {
    alertMessage: string;
    changeState: () => void;
}
export const Alert = ({ alertMessage,changeState }: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        changeState();
      setIsVisible(false);
    }, 5000); 

    return () => clearTimeout(timer); 
  }, [changeState]);

  if (!isVisible) return null;

  const cssClass =
    "fixed z-50 top-0 right-0 mx-4 mt-8 bg-white border-2 border-accent-1-base shadow-xl rounded-lg flex items-center gap-4 overflow-hidden w-3/5 md:w-2/5";

  return (
    <div className={cssClass}>
      <div className="flex-1 p-4 px-2">
        <span className="font-bold">INFO</span>: {alertMessage}
      </div>
      <button
        onClick={() =>{ setIsVisible(false)
            changeState();
        }}
        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
      >
        Close
      </button>
    </div>
  );
};

