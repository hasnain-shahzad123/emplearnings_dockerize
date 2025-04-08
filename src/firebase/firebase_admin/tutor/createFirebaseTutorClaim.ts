import { adminAuth } from "@/firebase/firebase_admin/initializeAdmin";

export default async function createFirebaseTutorClaim(uid: string): Promise<{
  type: string;
}> {
  try {
    await adminAuth.setCustomUserClaims(uid, {
      role: "tutor",
      isVerifed: false,
    });
    return {
      type: "success",
    };
  } catch (error) {
    console.error("Error creating custom token:", error);
    return {
      type: "error",
    };
  }
}
