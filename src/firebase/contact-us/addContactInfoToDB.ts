import z from "zod";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { ZodError } from "zod";
import { FirebaseError } from "firebase/app";
import { verify } from "crypto";
const contactUsSchema = z.object({
	name: z.string().min(1, "Name cannot be empty"),
	email: z.string().email("Please provide a valid email address"),
	subject: z.string().min(1, "Subject cannot be empty"),
	message: z.string().min(1, "Message cannot be empty"),
});

type ContactUsParams = z.infer<typeof contactUsSchema>;
export default async function addContactInfoToDB({
	name,
	email,
	subject,
	message,
}: ContactUsParams) {
	try {
		contactUsSchema.parse({ name, email, subject, message });

		const ref = collection(firestore, "CONTACT_US");
		await addDoc(ref, {
			name,
			email,
			subject,
			message,
		});

		return {
			type: "success",
			message: "Contact-Us info added successfully",
		};
	} catch (e: any) {
		if (e instanceof FirebaseError) {
			return {
				type: "error",
				message:
					"Firebase Error while marking the notification read: " + e.message,
			};
		} else if (e instanceof ZodError) {
			const errors = e.errors.map(({ error }: any) => error.message);
			return {
				type: "error",
				message: "Zod validation error(s): " + errors.join(", "),
			};
		}

		return {
			type: "error",
			message:
				"an unexpected error occurred while trying to mark the notification as read " +
				e.message
					? e.message
					: "",
		};
	}
}
