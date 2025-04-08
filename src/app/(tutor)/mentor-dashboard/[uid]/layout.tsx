import ProgressBanner from "@/components/tutorPages/courses_info/addCourse/ProgressBanner";
import { ProgressBannerProvider } from "@/contexts/ProgressBannerContext";
import { TutorProvider } from "@/contexts/TutorContext";
import getTutorDocumentData from "@/firebase/tutor/dashboard/getTutorDocumentData";
import { TutorDocumentDataType } from "@/types";
import Link from "next/link";

export default async function TutorDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { uid: string };
}) {
  // Fetch the initial tutor data
  const initialTutorData = await getTutorDocumentData({ uid: params.uid });

  return (
    <TutorProvider initialTutorData={initialTutorData.data}>
      <ProgressBannerProvider>
        <div className="mentor-dashboard-layout">
          <nav className="bg-gray-800 text-white p-4">
            <Link href={"/"} className="text-xl font-bold">Mentor Dashboard</Link>
          </nav>
          <div className="p-4">{children}</div>
        </div>
        <ProgressBanner />
      </ProgressBannerProvider>
    </TutorProvider>
  );
}
