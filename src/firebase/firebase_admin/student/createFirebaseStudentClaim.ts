import { adminAuth } from "@/firebase/firebase_admin/initializeAdmin";

export default async function createFirebaseStudentClaim(uid: string): Promise<{
  type: string;
}> {
  try {
    await adminAuth.setCustomUserClaims(uid, {
      role: "student",
      isVerified: false,
    });
    return {
      type: "success",
    };
  } catch (error) {
    console.error("Error setting custom claims:", error);
    return {
      type: "error",
    };
  }
}
