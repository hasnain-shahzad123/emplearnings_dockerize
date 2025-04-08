import { adminDb } from "@/firebase/firebase_admin/initializeAdmin";

export default async function fetchAllTutorsFromDB(): Promise<{
  type: "success" | "error";
  data: string[];
}> {
  try {
    const tutorIds: string[] = [];
    const snapshot = await adminDb.collection("TUTORS").get();

    snapshot.forEach((doc) => {
      tutorIds.push(doc.id);
    });

    return {
      type: "success",
      data: tutorIds,
    };
  } catch (error) {
    console.error("Error fetching tutors from Firestore:", error);
    return {
      type: "error",
      data: [],
    };
  }
}
