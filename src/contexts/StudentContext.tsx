"use client";

import getStudentDocumentData from "@/firebase/student/dashboard/getStudentDocumentData";
import { StudentDocumentDataType } from "@/types";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface StudentContextType {
  student: StudentDocumentDataType | null;
  refreshStudent: () => Promise<void>;
  isLoading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{
  children: ReactNode;
  initialStudentData: StudentDocumentDataType ;
}> = ({ children, initialStudentData }) => {
  const [student, setStudent] = useState<StudentDocumentDataType>(initialStudentData);
  const [isLoading, setIsLoading] = useState(false);

  const refreshStudent = async () => {
    setIsLoading(true);
    try {
      const freshStudentData = await getStudentDocumentData({
        uid: student.uid,
      });
      if (freshStudentData.type === "success" && freshStudentData.data) {
        setStudent(freshStudentData.data);
      }
    } catch (error) {
      console.error("Failed to refresh student data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentContext.Provider value={{ student, refreshStudent, isLoading }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
};
