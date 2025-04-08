"use client";

import React, { createContext, useEffect, useState } from "react";

export type UploadProgressType = {
  percentage: number;
  uploadedBytes: string;
  totalBytes: string;
};

const ProgressBannerContext = createContext(
  {} as {
    isUploading: boolean;
    setIsUploading: (isUploading: boolean) => void;
    uploadLoadingText: string;
    setUploadingText: (loadingText: string) => void;
    uploadProgress: UploadProgressType | null;
    setUploadProgress: (progress: UploadProgressType | null) => void;
    isProgressCompleted: boolean;
    setIsProgressCompleted: (isProgressCompleted: boolean) => void;
  }
);

type ProgressBannerProviderProps = {
  children: React.ReactNode;
};

const ProgressBannerProvider = ({ children }: ProgressBannerProviderProps) => {
  // Tracks if the file is being uploaded
  const [isUploading, setIsUploading] = useState(false);
  // Text to display while uploading or after upload is completed
  const [uploadLoadingText, setUploadingText] = useState("");
  // Progress of the file upload (percentage, uploaded bytes, total bytes)
  const [uploadProgress, setUploadProgress] =
    useState<UploadProgressType | null>(null);
  // Tracks if the file upload is completed to display the close button and success message
  const [isProgressCompleted, setIsProgressCompleted] = useState(false);

  useEffect(() => {
    if (isProgressCompleted) {
      setUploadingText("Upload Completed");
    }
  }, [isProgressCompleted]);

  return (
    <ProgressBannerContext.Provider
      value={{
        isUploading,
        setIsUploading,
        uploadLoadingText,
        setUploadingText,
        uploadProgress,
        setUploadProgress,
        isProgressCompleted,
        setIsProgressCompleted,
      }}>
      {children}
    </ProgressBannerContext.Provider>
  );
};

const useProgressBanner = () => React.useContext(ProgressBannerContext);

export { ProgressBannerContext, ProgressBannerProvider, useProgressBanner };
