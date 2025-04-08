import admin from "firebase-admin";

// Load service account
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: "https://empowered-89ae1-default-rtdb.firebaseio.com",
	});
}


export const adminAuth = admin.auth();
export const adminDb =  admin.firestore();