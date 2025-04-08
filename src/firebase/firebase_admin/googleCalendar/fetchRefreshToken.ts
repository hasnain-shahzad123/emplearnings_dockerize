import admin from "firebase-admin";
const fetchRefreshToken = async ({ uid }: { uid: string }) => {
  try {
    const docSnapshot = await admin
      .firestore()
      .collection("TUTORS")
      .doc(uid)
      .collection("TUTOR_SECRETS")
      .doc("REFRESH_TOKEN")
      .get();

    if (!docSnapshot.exists) {
      return {
        type: "success",
        token: null,
      };
    }
    const data = docSnapshot.data();
    return {
      type: "success",
      token: data?.refreshToken || null,
    };
  } catch (error) {
    console.error("Error fetching refresh token:", error);
    return {
      type: "error",
      token: null,
    };
  }
};

export default fetchRefreshToken;
