"use client";

import z from "zod";
import { firestore } from "@/firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Define the schema for the form values
const addTutorToDBSchema = z.object({
    uid: z.string().min(4, "UID is required"),
    username: z.string().min(4, "Username is required"),
    email: z.string().email(),
});