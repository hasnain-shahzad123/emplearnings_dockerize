"use client";

import { TutorDashboardDataType, TutorDocumentDataType } from "@/types";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { NotificationType } from "@/types";
import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
interface TutorContextType {
  tutor: TutorDocumentDataType | null;
  setTutorData: (data: TutorDocumentDataType) => void;
  isLoading: boolean;
  refreshTutor: () => Promise<void>;
}

const TutorContext = createContext<TutorContextType | undefined>(undefined);

export const TutorProvider: React.FC<{
  children: ReactNode;
  initialTutorData?: TutorDocumentDataType | null;
}> = ({ children, initialTutorData = null }) => {
  const [tutor, setTutorData] = useState<TutorDocumentDataType | null>(
    initialTutorData
  );
  const [isLoading, setIsLoading] = useState(false);

  const refreshTutor = async () => {
    if (!tutor?.uid) return;

    setIsLoading(true);
    try {
      const docRef = doc(firestore, "TUTORS", tutor.uid);

      const [docSnap] = await Promise.all([getDoc(docRef)]);

      if (docSnap.exists()) {
        const TutorDocumentData = docSnap.data() as TutorDocumentDataType;
        setTutorData(TutorDocumentData);
      }
    } catch (error) {
      console.error("Failed to refresh tutor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TutorContext.Provider
      value={{
        tutor,
        setTutorData,
        isLoading,
        refreshTutor,
      }}
    >
      {children}
    </TutorContext.Provider>
  );
};

export const useTutor = () => {
  const context = useContext(TutorContext);
  if (context === undefined) {
    throw new Error("useTutor must be used within a TutorProvider");
  }
  return context;
};
