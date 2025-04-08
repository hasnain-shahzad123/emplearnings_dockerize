import React from "react";

interface SpinnerProps {
 
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "lg",
  className = "",
}) => {
  const containerSizeStyles = {
    xs: "gap-1",
    sm: "gap-1",
    md: "gap-3",
    lg: "gap-6",
  };

  const spinnerSizeStyles = {
    xs: "w-4 h-4 border-2",
    sm: "w-6 h-6 border-4",
    md: "w-20 h-20",
    lg: "w-20 h-20 border-8",
  };

  const textSizeStyles = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <>
      <div
        className={`${className} flex flex-col items-center   justify-center ${containerSizeStyles[size]}`}
      >
        <div
          className={`${spinnerSizeStyles[size]} border-accent-2-base border-b-[#4A148C] rounded-full animate-spin`}
        ></div>
      
      </div>
    </>
  );
};

export default Spinner;
