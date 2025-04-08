"use client";
import Spinner from "@/components/shared/spinner/Spinner";
import { useProgressBanner } from "@/contexts/ProgressBannerContext";
import React, { useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

const ProgressBanner = () => {
  const {
    isUploading,
    uploadLoadingText,
    uploadProgress,
    setIsProgressCompleted,
    isProgressCompleted,
    setIsUploading,
  } = useProgressBanner();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isUploading) {
        event.preventDefault();
        event.returnValue = "Changes you made may not be saved.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isUploading]);

  const closeButtonHandler = () => {
    setIsUploading(false);
    setIsProgressCompleted(false);
  };

  return (
    <div
      className={`fixed bottom-0 right-4 max-w-full grid ${
        isUploading ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      } transition-grid-rows duration-300 bg-white rounded-t-lg`}>
      {uploadProgress && (
        <span
          className="rounded-t-lg absolute top-0 left-0 right-0 bottom-0 bg-empoweredFlagLight"
          style={{ width: uploadProgress.percentage + "%" }}></span>
      )}

      {isProgressCompleted && (
        <button
          onClick={closeButtonHandler}
          className={`absolute z-[2] -top-2 -right-2 p-2 cursor-pointer bg-empoweredFlag text-white rounded-full`}>
          <FaX className="w-3 h-3" />
        </button>
      )}

      <div className="relative z-[1] overflow-hidden">
        <div className="flex flex-col items-center py-4 gap-2 px-6 border-2 border-empoweredFlag rounded-t-lg text-lg">
          <div className="flex flex-row items-center gap-4">
            {isProgressCompleted ? (
              <FaCheck className="text-empoweredFlag" />
            ) : (
              <Spinner size="sm" />
            )}
            <div>{uploadLoadingText}</div>
          </div>

          {uploadProgress && (
            <div className="text-sm">
              {uploadProgress.uploadedBytes} / {uploadProgress.totalBytes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBanner;
