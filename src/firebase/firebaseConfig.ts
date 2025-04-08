import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyCVtpYaXyTJ04or3hv-rhmvWhKpvQr-HLo",
	authDomain: "empowered-89ae1.firebaseapp.com",
	projectId: "empowered-89ae1",
	storageBucket: "empowered-89ae1.appspot.com",
	messagingSenderId: "563917280752",
	appId: "1:563917280752:web:224be4e0d037b870db7935",
	measurementId: "G-Y9LCJ66BBE",
};

// Ensure Firebase is initialized only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Check if running locally
// if (process.env.NEXT_PUBLIC_URL === "http://localhost:3000") {
// 	console.log("Running in development mode. Connecting to emulators...");

// 	// Connect Firebase services to their respective emulators
// 	// connectAuthEmulator(auth, "http://localhost:9099");
// 	connectFirestoreEmulator(firestore, "localhost", 8080);
// 	connectStorageEmulator(storage, "localhost", 9199);
// }

export { auth, firestore, storage };
