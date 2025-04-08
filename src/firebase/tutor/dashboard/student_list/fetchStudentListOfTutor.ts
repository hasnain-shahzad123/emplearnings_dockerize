import { firestore } from "@/firebase/firebaseConfig";
import {
	StudentDocumentDataType,
	TutorStudentDocumentData,
	TutorStudentLessonDataType,
} from "@/types";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { z } from "zod";

const functionParams = z.object({
	tutorId: z.string().min(1, "Tutor id is required"),
});

export const fetchStudentListOfTutor = async (
	params: z.infer<typeof functionParams>
): Promise<{
	type: "success" | "error";
	message: string;
	data: TutorStudentDocumentData[] | null;
}> => {
	// Validate params
	const validationResult = functionParams.safeParse(params);
	if (!validationResult.success) {
		return {
			type: "error",
			message: validationResult.error.errors.map((e) => e.message).join(", "),
			data: null,
		};
	}

	try {
		const tutorSubCollectionRef = collection(
			doc(firestore, "TUTORS", params.tutorId),
			"TUTOR_STUDENTS"
		);

		// Fetch all students under the tutor
		const studentsSnapshot = await getDocs(tutorSubCollectionRef);
		const studentList: TutorStudentDocumentData[] = studentsSnapshot.docs.map(
			(s) => s.data() as TutorStudentDocumentData
		);

		// Fetch student details in parallel
		const studentDetails = await Promise.all(
			studentList.map(async (student) => {
				const studentDoc = await getDoc(
					doc(firestore, "STUDENTS", student.student_uid)
				);
				if (studentDoc.exists()) {
					const studentData = studentDoc.data() as StudentDocumentDataType;
					return {
						...student,
						name: studentData.username,
						profilePhotoURL: studentData.profilePhotoURL,
					};
				}
				return student; 
			})
		);


		const studentsWithLessons = await Promise.all(
			studentDetails.map(async (student) => {
				const lessonsSnapshot = await getDocs(
					collection(tutorSubCollectionRef, student.student_uid, "LESSONS")
				);
				const lessonsArray = lessonsSnapshot.docs.map(
					(lesson) => lesson.data() as TutorStudentLessonDataType
				);
				return { ...student, lessons: lessonsArray };
			})
		);

		return {
			type: "success",
			message: "Student list fetched successfully",
			data: studentsWithLessons,
		};
	} catch (error) {
		return {
			type: "error",
			message:
				error instanceof Error ? error.message : "An unknown error occurred",
			data: null,
		};
	}
};
