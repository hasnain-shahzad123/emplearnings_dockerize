"use client";
import PreviewScreen from "@/components/studentPages/tutorPreviewScreen/PreviewScreen";
import getTutorDocumentDataClient from "@/firebase/tutor/dashboard/getTutorDocumentDataClient";
import { TutorDocumentDataType } from "@/types";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/shared/spinner/Spinner";

const TutorPreviewScreen = () => {
  const router = useRouter();
  const { tutorId } = useParams<{ tutorId: string }>();
  const [tutor, setTutor] = useState<TutorDocumentDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTutorData = async () => {
      if (!tutorId) {
        router.replace("/tutor-list");
        return;
      }

      const response = await getTutorDocumentDataClient({ uid: tutorId });
      if (response.type === "success" && response.data) {
        setTutor(response.data);
      } else {
        console.error(response.message);
        router.replace("/tutor-list");
      }
      setIsLoading(false);
    };

    getTutorData();
  }, [tutorId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return tutor ? <PreviewScreen /> : null;
};

export default TutorPreviewScreen;
