"use client";
import { StudentProvider } from "@/contexts/StudentContext";
import getStudentDocumentData from "@/firebase/student/dashboard/getStudentDocumentData";

export default async function StudentDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { uid: string };
}) {
  const initialStudentData = await getStudentDocumentData({ uid: params.uid });

  if (!initialStudentData.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Error: Unable to load student data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <StudentProvider initialStudentData={initialStudentData.data}>
      <div className="student-dashboard-layout">
        <nav className="bg-gray-800 text-white p-4">
          <h1 className="text-xl font-bold">Student Dashboard</h1>
        </nav>
        <div className="p-4">{children}</div>
      </div>
    </StudentProvider>
  );
}
