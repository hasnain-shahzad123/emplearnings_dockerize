const {
	initializeTestEnvironment,
	assertSucceeds,
	assertFails,
} = require("@firebase/rules-unit-testing");
const { profile } = require("console");
const exp = require("constants");
const { Certificate } = require("crypto");
const {
	doc,
	getDoc,
	setDoc,
	updateDoc,
	Timestamp,
	deleteDoc,
	arrayUnion,
	arrayRemove,
	addDoc,
} = require("firebase/firestore");
const { readFileSync } = require("fs");

const PROJECT_ID = "empowered-89ae1";

let firebaseEnv;

beforeEach(async () => {
	firebaseEnv = await initializeTestEnvironment({
		projectId: PROJECT_ID,
		firestore: {
			rules: readFileSync("firestore.rules", "utf8"),
			host: "127.0.0.1",
			port: 8080,
			ssl: false,
		},
	});
	// await firebaseEnv.clearFirestore();
});

const getFirestore = (context) => {
	return context.firestore();
};

describe("TUTORS", () => {
	// it("should allow Authenticated users to read from TUTORS", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"ISCGKGSCHVCHGKAEVHDJCVD",
	// 		{ role: "tutor" }
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA7";

	// 	await assertSucceeds(getDoc(doc(firestore, userRef)));
	// });

	// it("should NOT allow Un-authenticated TUTORS to read TUTORS", async () => {
	// 	const unauthContext = firebaseEnv.unauthenticatedContext();
	// 	const firestore = getFirestore(unauthContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA7";

	// 	await assertFails(getDoc(doc(firestore, userRef)));
	// });

	// it("should allow Authenticated TUTORS to write TUTORS", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"ISCGKGSCHVCHGKAEVHDJCVD",
	// 		{ role: "tutor" }
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

	// 	await assertSucceeds(
	// 		setDoc(doc(firestore, userRef), {
	// 			username: "John Doe",
	// 			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
	// 			email: "John.Doe@gmail.com",
	// 			total_students: 0,
	// 			active_students: 0,
	// 			completed_lessons: 0,
	// 			pending_lessons: 0,
	// 			total_reviews: 0,
	// 			rating: 0,
	// 			profilePhotoURL: "",
	// 			per_lesson_rate: 0,
	// 			free_trail_lesson_enable: true,
	// 			country: "",
	// 			languages: [],
	// 			categories: [],
	// 			number_of_reviews: 0,
	// 			tagline: "",
	// 			about: "",
	// 			experience_years: 0,
	// 			plan_type: "trial",
	// 			subscription_status: "active",
	// 			pending_categories: [],
	// 		})
	// 	);
	// });

	// it("should NOT allow Un-authenticated TUTORS to write TUTORS", async () => {
	// 	const authContext = firebaseEnv.unauthenticatedContext();
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await assertFails(
	// 		setDoc(doc(firestore, userRef), {
	// 			username: "John Doe",
	// 			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
	// 			email: "John.Doe@gmail.com",
	// 			total_students: 0,
	// 			active_students: 0,
	// 			completed_lessons: 0,
	// 			pending_lessons: 0,
	// 			total_reviews: 0,
	// 			rating: 0,
	// 			profilePhotoURL: "",
	// 			per_lesson_rate: 0,
	// 			free_trail_lesson_enable: true,
	// 			country: "",
	// 			languages: [],
	// 			categories: [],
	// 			number_of_reviews: 0,
	// 			tagline: "",
	// 			about: "",
	// 			experience_years: 0,
	// 			plan_type: "trial",
	// 			subscription_status: "active",
	// 			pending_categories: [],
	// 		})
	// 	);
	// });

	// it("should NOT allow if docId is not equal to uid", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcvv3"
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcvv3";

	// 	await assertFails(
	// 		setDoc(doc(firestore, userRef), {
	// 			username: "John Doe",
	// 			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
	// 			email: "John.Doe@gmail.com",
	// 			total_students: 0,
	// 			active_students: 0,
	// 			completed_lessons: 0,
	// 			pending_lessons: 0,
	// 			total_reviews: 0,
	// 			rating: 0,
	// 			profilePhotoURL: "",
	// 			per_lesson_rate: 0,
	// 			free_trail_lesson_enable: true,
	// 			country: "",
	// 			languages: [],
	// 			categories: [],
	// 			number_of_reviews: 0,
	// 			tagline: "",
	// 			about: "",
	// 			experience_years: 0,
	// 			plan_type: "trial",
	// 			subscription_status: "active",
	// 			pending_categories: [],
	// 		})
	// 	);
	// });

	// it("should NOT allow write if user id is not equal to document uid", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA5",
	// 		{ role: "tutor" }
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await assertFails(
	// 		setDoc(doc(firestore, userRef), {
	// 			username: "John Doe",
	// 			uid: "50Ma6fnMfxvEiGyeZcA3",
	// 			email: "John.Doe@gmail.com",
	// 		})
	// 	);
	// });

	// it("should allow write if docId is equal to uid", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3",
	// 		{ role: "tutor" }
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await assertSucceeds(
	// 		setDoc(doc(firestore, userRef), {
	// 			username: "John Doe",
	// 			uid: "50Ma6fnMfxvEiGyeZcA3",
	// 			email: "John.Doe@gmail.com",
	// 			total_students: 0,
	// 			active_students: 0,
	// 			completed_lessons: 0,
	// 			pending_lessons: 0,
	// 			total_reviews: 0,
	// 			rating: 0,
	// 			profilePhotoURL: "",
	// 			per_lesson_rate: 0,
	// 			free_trail_lesson_enable: true,
	// 			country: "",
	// 			languages: [],
	// 			categories: [],
	// 			number_of_reviews: 0,
	// 			tagline: "",
	// 			about: "",
	// 			experience_years: 0,
	// 			plan_type: "trial",
	// 			subscription_status: "active",
	// 			pending_categories: [],
	// 		})
	// 	);
	// });

	// it("should NOT allow write if uid is missing", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcvv3"
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcvv3";

	// 	await assertFails(
	// 		setDoc(doc(firestore, userRef), {
	// 			username: "John Doe",
	// 			email: "John.Doe@gmail.com",
	// 		})
	// 	);
	// });

	// it("should NOT allow write if Email is missing", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3"
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await assertFails(
	// 		setDoc(doc(firestore, userRef), {
	// 			username: "John Doe",
	// 			uid: "50Ma6fnMfxvEiGyeZcA3",
	// 		})
	// 	);
	// });

	// it("should NOT allow write if Username is missing", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3"
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await assertFails(
	// 		setDoc(doc(firestore, userRef), {
	// 			uid: "50Ma6fnMfxvEiGyeZcA3",
	// 			email: "John.Doe@gmail.com",
	// 		})
	// 	);
	// });

	// it("should NOT allow write if Username is not a string", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3"
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await assertFails(
	// 		setDoc(doc(firestore, userRef), {
	// 			username: 123,
	// 			uid: "50Ma6fnMfxvEiGyeZcA3",
	// 			email: "John.Doe@gmail.com",
	// 		})
	// 	);
	// });

	// it("should NOT allow write if Email is not a string", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3"
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await assertFails(
	// 		setDoc(doc(firestore, userRef), {
	// 			username: "123",
	// 			uid: "50Ma6fnMfxvEiGyeZcA3",
	// 			email: 123,
	// 		})
	// 	);
	// });

	// it("should NOT allow write if Email is not a string", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3"
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await assertFails(
	// 		setDoc(doc(firestore, userRef), {
	// 			username: "123",
	// 			uid: "50Ma6fnMfxvEiGyeZcA3",
	// 			email: 123,
	// 		})
	// 	);
	// });

	// it("should allow Update TUTORS if user is Correct and uid is not changed", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3",
	// 		{ role: "tutor" }
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await setDoc(doc(firestore, userRef), {
	// 		username: "John Doe",
	// 		uid: "50Ma6fnMfxvEiGyeZcA3",
	// 		email: "John.Doe@gmail.com",
	// 		total_students: 0,
	// 		active_students: 0,
	// 		completed_lessons: 0,
	// 		pending_lessons: 0,
	// 		total_reviews: 0,
	// 		rating: 0,
	// 		profilePhotoURL: "",
	// 		per_lesson_rate: 0,
	// 		free_trail_lesson_enable: true,
	// 		country: "",
	// 		languages: [],
	// 		categories: [],
	// 		number_of_reviews: 0,
	// 		tagline: "",
	// 		about: "",
	// 		experience_years: 0,
	// 		plan_type: "trial",
	// 		subscription_status: "active",
	// 		pending_categories: [],
	// 	});

	// 	await assertSucceeds(
	// 		updateDoc(doc(firestore, userRef), {
	// 			username: "12355",
	// 			email: "helloG@example.com",
	// 		})
	// 	);
	// });

	// it("should NOT allow Update TUTORS if user is Correct and uid is changed", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3",
	// 		{ role: "tutor" }
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await setDoc(doc(firestore, userRef), {
	// 		username: "John Doe",
	// 		uid: "50Ma6fnMfxvEiGyeZcA3",
	// 		email: "John.Doe@gmail.com",
	// 		total_students: 0,
	// 		active_students: 0,
	// 		completed_lessons: 0,
	// 		pending_lessons: 0,
	// 		total_reviews: 0,
	// 		rating: 0,
	// 		profilePhotoURL: "",
	// 		per_lesson_rate: 0,
	// 		free_trail_lesson_enable: true,
	// 		country: "",
	// 		languages: [],
	// 		categories: [],
	// 		number_of_reviews: 0,
	// 		tagline: "",
	// 		about: "",
	// 		experience_years: 0,
	// 		plan_type: "trial",
	// 		subscription_status: "active",
	// 		pending_categories: [],
	// 	});

	// 	await assertFails(
	// 		updateDoc(doc(firestore, userRef), {
	// 			uid: "50Ma6fnMfxvEiGyeZcB7",
	// 			username: "12355",
	// 			email: "helloG@example.com",
	// 		})
	// 	);
	// });

	// it("should NOT allow Update TUTORS if not allowed keys are provided", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3",
	// 		{ role: "tutor" }
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await setDoc(doc(firestore, userRef), {
	// 		username: "John Doe",
	// 		uid: "50Ma6fnMfxvEiGyeZcA3",
	// 		email: "John.Doe@gmail.com",
	// 		total_students: 0,
	// 		active_students: 0,
	// 		completed_lessons: 0,
	// 		pending_lessons: 0,
	// 		total_reviews: 0,
	// 		rating: 0,
	// 		profilePhotoURL: "",
	// 		per_lesson_rate: 0,
	// 		free_trail_lesson_enable: true,
	// 		country: "",
	// 		languages: [],
	// 		categories: [],
	// 		number_of_reviews: 0,
	// 		tagline: "",
	// 		about: "",
	// 		experience_years: 0,
	// 		plan_type: "trial",
	// 		subscription_status: "active",
	// 		pending_categories: [],
	// 	});

	// 	await assertFails(
	// 		updateDoc(doc(firestore, userRef), {
	// 			extra: "50Ma6fnMfxvEiGyeZcA7",
	// 			username: "12355",
	// 			email: "helloG@example.com",
	// 		})
	// 	);
	// });

	// it("should allow Update TUTORS if tagline and about is provided", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3",
	// 		{ role: "tutor" }
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await setDoc(doc(firestore, userRef), {
	// 		username: "John Doe",
	// 		uid: "50Ma6fnMfxvEiGyeZcA3",
	// 		email: "John.Doe@gmail.com",
	// 		total_students: 0,
	// 		active_students: 0,
	// 		completed_lessons: 0,
	// 		pending_lessons: 0,
	// 		total_reviews: 0,
	// 		rating: 0,
	// 		profilePhotoURL: "",
	// 		per_lesson_rate: 0,
	// 		free_trail_lesson_enable: true,
	// 		country: "",
	// 		languages: [],
	// 		categories: [],
	// 		number_of_reviews: 0,
	// 		tagline: "",
	// 		about: "",
	// 		experience_years: 0,
	// 		plan_type: "trial",
	// 		subscription_status: "active",
	// 		pending_categories: [],
	// 	});

	// 	await updateDoc(doc(firestore, userRef), {
	// 		tagline:
	// 			"This is my Tagline Lorem ipsum dolor sit amet consectetur, adipisicing elit. Temporibus alias itaque libero illo atque eligendi eius voluptate aliquam. Non, nemo autem dignissimos fugit dolor odit! Sit ex illum quae suscipit.",
	// 		about: "This is my about",
	// 	});

	// 	await assertSucceeds(
	// 		updateDoc(doc(firestore, userRef), {
	// 			tagline:
	// 				"This is my Tagline Lorem ipsum dolor sit amet consectetur, adipisicing elit. Temporibus alias itaque libero illo atque eligendi eius voluptate aliquam. Non, nemo autem dignissimos fugit dolor odit! Sit ex illum quae suscipit.",
	// 			about: "This is my about",
	// 		})
	// 	);
	// });

	// it("should allow Update TUTORS if a new Language is provided", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3",
	// 		{ role: "tutor" }
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await setDoc(doc(firestore, userRef), {
	// 		username: "John Doe",
	// 		uid: "50Ma6fnMfxvEiGyeZcA3",
	// 		email: "John.Doe@gmail.com",
	// 		total_students: 0,
	// 		active_students: 0,
	// 		completed_lessons: 0,
	// 		pending_lessons: 0,
	// 		total_reviews: 0,
	// 		rating: 0,
	// 		profilePhotoURL: "",
	// 		per_lesson_rate: 0,
	// 		free_trail_lesson_enable: true,
	// 		country: "",
	// 		languages: [],
	// 		categories: [],
	// 		number_of_reviews: 0,
	// 		tagline: "",
	// 		about: "",
	// 		experience_years: 0,
	// 		plan_type: "trial",
	// 		subscription_status: "active",
	// 		pending_categories: [],
	// 	});

	// 	await updateDoc(doc(firestore, userRef), {
	// 		tagline:
	// 			"Hello world, this is me. Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi mollitia necessitatibus corrupti distinctio quibusdam voluptates repudiandae, ut enim amet sunt aliquam sit voluptate nihil at modi! Tempore pariatur dolorem at.",
	// 	});

	// 	await assertSucceeds(
	// 		updateDoc(doc(firestore, userRef), {
	// 			about: "English, Spanish",
	// 			languages: arrayUnion({
	// 				languageName: "Spanish",
	// 				proficiencyLevel: "Native",
	// 			}),
	// 		})
	// 	);
	// });

	// it("should allow Update TUTORS if a tagline is provided", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3",
	// 		{ role: "tutor" }
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await setDoc(doc(firestore, userRef), {
	// 		username: "John Doe",
	// 		uid: "50Ma6fnMfxvEiGyeZcA3",
	// 		email: "John.Doe@gmail.com",
	// 		total_students: 0,
	// 		active_students: 0,
	// 		completed_lessons: 0,
	// 		pending_lessons: 0,
	// 		total_reviews: 0,
	// 		rating: 0,
	// 		profilePhotoURL: "",
	// 		per_lesson_rate: 0,
	// 		free_trail_lesson_enable: true,
	// 		country: "",
	// 		languages: [],
	// 		categories: [],
	// 		number_of_reviews: 0,
	// 		tagline: "",
	// 		about: "",
	// 		experience_years: 0,
	// 		plan_type: "trial",
	// 		subscription_status: "active",
	// 		pending_categories: [],
	// 	});

	// 	await updateDoc(doc(firestore, userRef), {
	// 		about: "English, Spanish",
	// 		languages: arrayUnion({
	// 			languageName: "Spanish",
	// 			proficiencyLevel: "Native",
	// 		}),
	// 	});

	// 	await assertSucceeds(
	// 		updateDoc(doc(firestore, userRef), {
	// 			tagline: "English, Spanish",
	// 		})
	// 	);
	// });

	// it("should allow Update TUTORS if a profile photo is provided", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3",
	// 		{ role: "tutor" }
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await setDoc(doc(firestore, userRef), {
	// 		username: "John Doe",
	// 		uid: "50Ma6fnMfxvEiGyeZcA3",
	// 		email: "John.Doe@gmail.com",
	// 		total_students: 0,
	// 		active_students: 0,
	// 		completed_lessons: 0,
	// 		pending_lessons: 0,
	// 		total_reviews: 0,
	// 		rating: 0,
	// 		profilePhotoURL: "",
	// 		per_lesson_rate: 0,
	// 		free_trail_lesson_enable: true,
	// 		country: "",
	// 		languages: [],
	// 		categories: [],
	// 		number_of_reviews: 0,
	// 		tagline: "",
	// 		about: "",
	// 		experience_years: 0,
	// 		plan_type: "trial",
	// 		subscription_status: "active",
	// 		pending_categories: [],
	// 	});

	// 	await assertSucceeds(
	// 		updateDoc(doc(firestore, userRef), {
	// 			profilePhotoURL: "a long lengthy URL string of the Tutor photo.",
	// 		})
	// 	);
	// });

	// it("should allow update TUTORS if a profile photo is provided", async () => {
	// 	const authContext = firebaseEnv.authenticatedContext(
	// 		"50Ma6fnMfxvEiGyeZcA3",
	// 		{ role: "tutor" }
	// 	);
	// 	const firestore = getFirestore(authContext);
	// 	const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

	// 	await setDoc(doc(firestore, userRef), {
	// 		username: "John Doe",
	// 		uid: "50Ma6fnMfxvEiGyeZcA3",
	// 		email: "John.Doe@gmail.com",
	// 		total_students: 0,
	// 		active_students: 0,
	// 		completed_lessons: 0,
	// 		pending_lessons: 0,
	// 		total_reviews: 0,
	// 		rating: 0,
	// 		profilePhotoURL: "",
	// 		per_lesson_rate: 0,
	// 		free_trail_lesson_enable: true,
	// 		country: "",
	// 		languages: [],
	// 		categories: [],
	// 		number_of_reviews: 0,
	// 		tagline: "",
	// 		about: "",
	// 		experience_years: 0,
	// 		plan_type: "trial",
	// 		subscription_status: "active",
	// 		pending_categories: [],
	// 	});

	// 	await updateDoc(doc(firestore, userRef), {
	// 		about: "English, Spanish",
	// 		languages: arrayUnion({
	// 			languageName: "Spanish",
	// 			proficiencyLevel: "Native",
	// 		}),
	// 	});

	// 	await assertSucceeds(
	// 		updateDoc(doc(firestore, userRef), {
	// 			profilePhotoURL:
	// 				"a long lengthy URL string of the Tutor photo. a very Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
	// 		})
	// 	);
	// });

	it("should allow update TUTORS if a new language is removed", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"50Ma6fnMfxvEiGyeZcA3",
			{ role: "tutor" }
		);
		const firestore = getFirestore(authContext);
		const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

		await setDoc(doc(firestore, userRef), {
			username: "John Doe",
			uid: "50Ma6fnMfxvEiGyeZcA3",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		await updateDoc(doc(firestore, userRef), {
			about: "English, Spanish",
			languages: arrayUnion({
				languageName: "Spanish",
				proficiencyLevel: "Native",
			}),
		});

		await assertSucceeds(
			updateDoc(doc(firestore, userRef), {
				languages: arrayRemove({
					languageName: "Spanish",
					proficiencyLevel: "Native",
				}),
			})
		);
	});

	it("should allow update TUTORS if a experience years are provided", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"50Ma6fnMfxvEiGyeZcA3",
			{ role: "tutor" }
		);
		const firestore = getFirestore(authContext);
		const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

		await setDoc(doc(firestore, userRef), {
			username: "John Doe",
			uid: "50Ma6fnMfxvEiGyeZcA3",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		await updateDoc(doc(firestore, userRef), {
			about: "English, Spanish",
			languages: arrayUnion({
				languageName: "Spanish",
				proficiencyLevel: "Native",
			}),
		});

		await assertSucceeds(
			updateDoc(doc(firestore, userRef), {
				experience_years: 5,
			})
		);
	});

	it("should NOT allow update TUTORS if a right experience years are NOT provided", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"50Ma6fnMfxvEiGyeZcA3",
			{ role: "tutor" }
		);
		const firestore = getFirestore(authContext);
		const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

		await setDoc(doc(firestore, userRef), {
			username: "John Doe",
			uid: "50Ma6fnMfxvEiGyeZcA3",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		await updateDoc(doc(firestore, userRef), {
			about: "English, Spanish",
			languages: arrayUnion({
				languageName: "Spanish",
				proficiencyLevel: "Native",
			}),
		});

		await assertFails(
			updateDoc(doc(firestore, userRef), {
				experience_years: 555,
			})
		);
	});

	it("should NOT allow DELETE TUTORS if user is NOT admin", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"50Ma6fnMfxvEiGyeZcA3",
			{ role: "tutor" }
		);
		const firestore = getFirestore(authContext);
		const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

		await assertFails(deleteDoc(doc(firestore, userRef)));
	});

	it("should allow DELETE TUTORS if user is admin", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"50Ma6fnMfxvEiGyeZcA3",
			{ role: "admin" }
		);
		const firestore = getFirestore(authContext);
		const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

		await assertSucceeds(deleteDoc(doc(firestore, userRef)));
	});
});

// describe("DEMO_ANSWERS", () => {
// 	it("should allow to write DEMO_ANSWERS if data is correct", async () => {
// 		const authContext = firebaseEnv.authenticatedContext(
// 			"ISCGKGSCHVCHGKAEVHDJCVD"
// 		);

// 		const firestore = getFirestore(authContext);
// 		const demoRef = "DEMO_ANSWERS/50Ma6fnMfxvEiGyeZcA7";

// 		await assertSucceeds(
// 			setDoc(doc(firestore, demoRef), {
// 				time: Timestamp.now(),
// 				uid: "50Ma6fnMfxvEiGyeZcA7",
// 				email: "John.Doe@gmail.com",
// 				answers: {
// 					question_1: ["Yes please"],
// 					question_2: ["Yes please"],
// 					question_3: ["Yes please"],
// 					question_4: ["Yes please"],
// 				},
// 			})
// 		);
// 	});

// 	it("should NOT allow to write DEMO_ANSWERS if data is NOT correct (1)", async () => {
// 		const authContext = firebaseEnv.authenticatedContext(
// 			"ISCGKGSCHVCHGKAEVHDJCVD"
// 		);

// 		const firestore = getFirestore(authContext);
// 		const demoRef = "DEMO_ANSWERS/50Ma6fnMfxvEiGyeZcA7";

// 		await assertFails(
// 			setDoc(doc(firestore, demoRef), {
// 				time: Timestamp.now(),
// 				uid: "50Ma6fnMfxvEiGyeZcA7",
// 				email: "John.Doe@gmail.com",
// 				answers: {
// 					question_1: ["Yes please"],
// 					question_2: ["Yes please"],
// 					question_3: ["Yes please"],
// 					question_4: ["Yes please"],
// 					question_5: ["Yes please"],
// 				},
// 			})
// 		);
// 	});

// 	it("should NOT allow to write DEMO_ANSWERS if data is NOT correct (2)", async () => {
// 		const authContext = firebaseEnv.authenticatedContext(
// 			"ISCGKGSCHVCHGKAEVHDJCVD"
// 		);

// 		const firestore = getFirestore(authContext);
// 		const demoRef = "DEMO_ANSWERS/50Ma6fnMfxvEiGyeZcA7";

// 		await assertFails(
// 			setDoc(doc(firestore, demoRef), {
// 				time: Timestamp.now(),
// 				uid: "50Ma6fnMfxvEiGyeZcA7",
// 				email: "John.Doe@gmail.com",
// 				answers: {
// 					question_1: ["Yes please"],
// 					question_2: ["Yes please"],
// 					question_3: ["Yes please"],
// 					question_5: ["Yes please"],
// 				},
// 			})
// 		);
// 	});

// 	it("should NOT allow to write DEMO_ANSWERS if data is NOT correct (3)", async () => {
// 		const authContext = firebaseEnv.authenticatedContext(
// 			"ISCGKGSCHVCHGKAEVHDJCVD"
// 		);

// 		const firestore = getFirestore(authContext);
// 		const demoRef = "DEMO_ANSWERS/50Ma6fnMfxvEiGyeZcA7";

// 		await assertFails(
// 			setDoc(doc(firestore, demoRef), {
// 				time: Timestamp.now(),
// 				uid: "50Ma6fnMfxvEiGyeZcA7",
// 				email: "John.Doe@gmail.com",
// 				answers: {
// 					question_1: ["Yes please"],
// 					question_2: ["Yes please"],
// 					question_3: ["Yes please"],
// 					question_4: ["Yes please"],
// 					question_4: ["Yes please"], // firebase only retains the last one (so duplicate keys are actually considered 1 key.)
// 					question_5: ["Yes please"],
// 				},
// 			})
// 		);
// 	});

// 	it("should allow to read from DEMO_ANSWERS if user is signed in and is admin", async () => {
// 		const authContext = firebaseEnv.authenticatedContext(
// 			"ISCGKGSCHVCHGKAEVHDJCVD",
// 			{ role: "admin" }
// 		);

// 		const firestore = getFirestore(authContext);
// 		const demoRef = "DEMO_ANSWERS/50Ma6fnMfxvEiGyeZcA7";

// 		await assertSucceeds(getDoc(doc(firestore, demoRef)));
// 	});

// 	it("should NOT allow to read from DEMO_ANSWERS if user is not admin", async () => {
// 		const authContext = firebaseEnv.authenticatedContext(
// 			"ISCGKGSCHVCHGKAEVHDJCVD",
// 			{ role: "tutor" }
// 		);

// 		const firestore = getFirestore(authContext);
// 		const demoRef = "DEMO_ANSWERS/50Ma6fnMfxvEiGyeZcA7";

// 		await assertFails(getDoc(doc(firestore, demoRef)));
// 	});

// 	it("should NOT allow to update from DEMO_ANSWERS", async () => {
// 		const authContext = firebaseEnv.authenticatedContext(
// 			"ISCGKGSCHVCHGKAEVHDJCVD",
// 			{ role: "admin" }
// 		);

// 		const firestore = getFirestore(authContext);
// 		const demoRef = "DEMO_ANSWERS/50Ma6fnMfxvEiGyeZcA7";

// 		await assertFails(
// 			updateDoc(doc(firestore, demoRef), {
// 				time: Timestamp.now(),
// 				uid: "50Ma6fnMfxvEiGyeZcA7",
// 				email: "John.Doe@gmail.com",
// 				answers: {
// 					question_1: ["Yes please"],
// 					question_2: ["Yes please"],
// 					question_3: ["Yes please"],
// 					question_4: ["Yes please"],
// 				},
// 			})
// 		);
// 	});

// 	it("should allow to delete from DEMO_ANSWERS only if user is signed in and is admin", async () => {
// 		const authContext = firebaseEnv.authenticatedContext(
// 			"ISCGKGSCHVCHGKAEVHDJCVD",
// 			{ role: "admin" }
// 		);

// 		const firestore = getFirestore(authContext);
// 		const demoRef = "DEMO_ANSWERS/50Ma6fnMfxvEiGyeZcA7";

// 		// Attempt to delete the document as an admin
// 		await assertSucceeds(deleteDoc(doc(firestore, demoRef)));
// 	});

// 	it("should NOT allow to delete from DEMO_ANSWERS only if user is not admin", async () => {
// 		const authContext = firebaseEnv.authenticatedContext(
// 			"ISCGKGSCHVCHGKAEVHDJCVD",
// 			{ role: "tutor" }
// 		);

// 		const firestore = getFirestore(authContext);
// 		const demoRef = "DEMO_ANSWERS/50Ma6fnMfxvEiGyeZcA7";

// 		// Attempt to delete the document as an admin
// 		await assertFails(deleteDoc(doc(firestore, demoRef)));
// 	});
// });

describe("TUTOR_NOTIFICATIONS", () => {
	it("should allow to create a Notification if user is correct", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"ISCGKGSCHVCHGKAEVHDJCVD",
			{ role: "tutor" }
		);

		const firestore = getFirestore(authContext);
		const tutorRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

		await setDoc(doc(firestore, tutorRef), {
			username: "John Doe",
			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const uid = crypto.randomUUID();

		const notificationsRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVD/TUTOR_NOTIFICATIONS/${uid}`;

		await assertSucceeds(
			setDoc(doc(firestore, notificationsRef), {
				notification: "Hello World, this is a test notification",
				time: Timestamp.now(),
				read: false,
				uid,
			})
		);
	});

	it("should NOT allow to create an empty Notification", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"ISCGKGSCHVCHGKAEVHDJCVD",
			{ role: "tutor" }
		);

		const firestore = getFirestore(authContext);
		const tutorRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

		await setDoc(doc(firestore, tutorRef), {
			username: "John Doe",
			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const uid = crypto.randomUUID();

		const notificationsRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVD/TUTOR_NOTIFICATIONS/${uid}`;

		await assertFails(
			setDoc(doc(firestore, notificationsRef), {
				notification: "",
				time: Timestamp.now(),
				read: false,
				uid,
			})
		);
	});

	it("should allow to Update an Notification if Data is correct", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"ISCGKGSCHVCHGKAEVHDJCVD",
			{ role: "tutor" }
		);

		const firestore = getFirestore(authContext);
		const tutorRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

		await setDoc(doc(firestore, tutorRef), {
			username: "John Doe",
			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const uid = crypto.randomUUID();

		const notificationsRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVD/TUTOR_NOTIFICATIONS/${uid}`;

		await setDoc(doc(firestore, notificationsRef), {
			notification: "Hello world",
			time: Timestamp.now(),
			read: false,
			uid,
		});

		await assertSucceeds(
			updateDoc(doc(firestore, notificationsRef), {
				read: true,
			})
		);
	});

	it("should NOT allow to Add to Notifications array, Update if data is not correct (1)", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"ISCGKGSCHVCHGKAEVHDJCVD",
			{ role: "tutor" }
		);

		const firestore = getFirestore(authContext);
		const tutorRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

		await setDoc(doc(firestore, tutorRef), {
			username: "John Doe",
			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const uid = crypto.randomUUID();

		const notificationsRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVD/TUTOR_NOTIFICATIONS/${uid}`;

		await setDoc(doc(firestore, notificationsRef), {
			notification: "Hello world",
			time: Timestamp.now(),
			read: false,
			uid,
		});

		await assertFails(
			updateDoc(doc(firestore, notificationsRef), {
				read: true,
				uid: "hello world",
			})
		);
	});

	it("should NOT allow to Add to Notifications array, Update if data is not correct (2)", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"ISCGKGSCHVCHGKAEVHDJCVD",
			{ role: "tutor" }
		);

		const firestore = getFirestore(authContext);
		const tutorRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

		await setDoc(doc(firestore, tutorRef), {
			username: "John Doe",
			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const uid = crypto.randomUUID();

		const notificationsRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVD/TUTOR_NOTIFICATIONS/${uid}`;

		await setDoc(doc(firestore, notificationsRef), {
			notification: "Hello world",
			time: Timestamp.now(),
			read: false,
			uid,
		});

		await assertFails(
			updateDoc(doc(firestore, notificationsRef), {
				uid: "hello world",
			})
		);
	});

	it("should NOT allow to Add to Notifications array, Update if data is not correct (3)", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"ISCGKGSCHVCHGKAEVHDJCVD",
			{ role: "tutor" }
		);

		const firestore = getFirestore(authContext);
		const tutorRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

		await setDoc(doc(firestore, tutorRef), {
			username: "John Doe",
			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const uid = crypto.randomUUID();

		const notificationsRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVD/TUTOR_NOTIFICATIONS/${uid}`;

		await setDoc(doc(firestore, notificationsRef), {
			notification: "Hello world",
			time: Timestamp.now(),
			read: false,
			uid,
		});

		await assertFails(
			updateDoc(doc(firestore, notificationsRef), {
				read: "hello world",
			})
		);
	});

	it("should allow to Remove a Notification if data is correct", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"ISCGKGSCHVCHGKAEVHDJCVD",
			{ role: "tutor" }
		);

		const firestore = getFirestore(authContext);
		const tutorRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

		await setDoc(doc(firestore, tutorRef), {
			username: "John Doe",
			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const uid = crypto.randomUUID();

		const notificationsRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVD/TUTOR_NOTIFICATIONS/${uid}`;

		await setDoc(doc(firestore, notificationsRef), {
			notification: "Hello world",
			time: Timestamp.now(),
			read: false,
			uid,
		});

		await assertSucceeds(deleteDoc(doc(firestore, notificationsRef)));
	});

	it("should NOT allow to Create Notifications to other tutors collection", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"ISCGKGSCHVCHGKAEVHDJCVD",
			{ role: "tutor" }
		);

		const firestore = getFirestore(authContext);
		const tutorRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

		await setDoc(doc(firestore, tutorRef), {
			username: "John Doe",
			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const uid = crypto.randomUUID();

		const notificationsRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVC/TUTOR_NOTIFICATIONS/${uid}`;

		await assertFails(
			setDoc(doc(firestore, notificationsRef), {
				notification: "Hello world",
				time: Timestamp.now(),
				read: false,
				uid,
			})
		);
	});

	it("should NOT allow to Read Notifications to other tutors collection", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"ISCGKGSCHVCHGKAEVHDJCVD",
			{ role: "tutor" }
		);

		const firestore = getFirestore(authContext);
		const tutorRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

		await setDoc(doc(firestore, tutorRef), {
			username: "John Doe",
			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const uid = crypto.randomUUID();

		let notificationsRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVD/TUTOR_NOTIFICATIONS/${uid}`;

		await setDoc(doc(firestore, notificationsRef), {
			notification: "Hello world",
			time: Timestamp.now(),
			read: false,
			uid,
		});

		notificationsRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVC/TUTOR_NOTIFICATIONS/${uid}`;

		await assertFails(getDoc(doc(firestore, notificationsRef)));
	});

	it("should allow to Read Notifications tutors own collection", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"ISCGKGSCHVCHGKAEVHDJCVD",
			{ role: "tutor" }
		);

		const firestore = getFirestore(authContext);
		const tutorRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

		await setDoc(doc(firestore, tutorRef), {
			username: "John Doe",
			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const uid = crypto.randomUUID();

		const notificationsRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVD/TUTOR_NOTIFICATIONS/${uid}`;

		await assertSucceeds(getDoc(doc(firestore, notificationsRef)));
	});
});

describe("TUTOR_EDUCATION", () => {
	it("should NOT allow to Add Educational details tutors own collection if data is not correct", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"ISCGKGSCHVCHGKAEVHDJCVD",
			{ role: "tutor" }
		);

		const firestore = getFirestore(authContext);
		const tutorRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

		await setDoc(doc(firestore, tutorRef), {
			username: "John Doe",
			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const educationRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVD/TUTOR_EDUCATION/ISCGKGSCHVCHGKAEVHDJCVD`;

		await assertFails(
			setDoc(doc(firestore, educationRef), {
				highest_degree: "",
				field_of_study: true,
				institution_name: "",
				graduation_year: 2030,
				is_verified: true,
			})
		);
	});

	it("should NOT allow to Add Educational details tutors in other tutor collection", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"ISCGKGSCHVCHGKAEVHDJCVD",
			{ role: "tutor" }
		);

		const firestore = getFirestore(authContext);
		const tutorRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

		await setDoc(doc(firestore, tutorRef), {
			username: "John Doe",
			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const educationRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVC/TUTOR_EDUCATION/ISCGKGSCHVCHGKAEVHDJCVC`;

		await assertFails(
			setDoc(doc(firestore, educationRef), {
				highest_degree: "",
				field_of_study: "Good work",
				institution_name: "Punjab University",
				graduation_year: 2025,
				is_verified: true,
			})
		);
	});

	it("should allow to Add Educational details tutors own collection(2)", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"ISCGKGSCHVCHGKAEVHDJCVD",
			{ role: "tutor" }
		);

		const firestore = getFirestore(authContext);
		const tutorRef = "TUTORS/ISCGKGSCHVCHGKAEVHDJCVD";

		await setDoc(doc(firestore, tutorRef), {
			username: "John Doe",
			uid: "ISCGKGSCHVCHGKAEVHDJCVD",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const educationRef = `TUTORS/ISCGKGSCHVCHGKAEVHDJCVD/TUTOR_EDUCATION/ISCGKGSCHVCHGKAEVHDJCVD`;

		await assertSucceeds(
			setDoc(doc(firestore, educationRef), {
				highest_degree: "Bachelors",
				field_of_study: "Computer Science",
				institution_name: "University of California",
				graduation_year: 2024,
				is_verified: true,
			})
		);
	});

	it("should allow To Update to Tutor Education if data is correct", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"50Ma6fnMfxvEiGyeZcA3",
			{ role: "tutor" }
		);
		const firestore = getFirestore(authContext);
		const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

		await setDoc(doc(firestore, userRef), {
			username: "John Doe",
			uid: "50Ma6fnMfxvEiGyeZcA3",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const educationRef = doc(
			firestore,
			"TUTORS/50Ma6fnMfxvEiGyeZcA3/TUTOR_EDUCATION/50Ma6fnMfxvEiGyeZcA3"
		);

		await setDoc(educationRef, {
			highest_degree: "",
			field_of_study: "",
			institution_name: "",
			graduation_year: 0,
			is_verified: false,
		});

		await assertSucceeds(
			updateDoc(educationRef, {
				highest_degree: "Bachelors",
				field_of_study: "Computer Science",
				institution_name: "University of California",
				graduation_year: 2024,
				is_verified: true,
			})
		);
	});

	it("should allow To Update to Tutor Education if data is correct (2)", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"50Ma6fnMfxvEiGyeZcA3",
			{ role: "tutor" }
		);
		const firestore = getFirestore(authContext);
		const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

		await setDoc(doc(firestore, userRef), {
			username: "John Doe",
			uid: "50Ma6fnMfxvEiGyeZcA3",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const educationRef = doc(
			firestore,
			"TUTORS/50Ma6fnMfxvEiGyeZcA3/TUTOR_EDUCATION/50Ma6fnMfxvEiGyeZcA3"
		);

		await setDoc(educationRef, {
			highest_degree: "",
			field_of_study: "",
			institution_name: "",
			graduation_year: 0,
			is_verified: false,
		});

		await assertSucceeds(
			updateDoc(educationRef, {
				is_verified: true,
			})
		);
	});

	it("should NOT allow To Update to Tutor Education if data is not correct", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"50Ma6fnMfxvEiGyeZcA3",
			{ role: "tutor" }
		);
		const firestore = getFirestore(authContext);
		const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

		await setDoc(doc(firestore, userRef), {
			username: "John Doe",
			uid: "50Ma6fnMfxvEiGyeZcA3",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const educationRef = doc(
			firestore,
			"TUTORS/50Ma6fnMfxvEiGyeZcA3/TUTOR_EDUCATION/50Ma6fnMfxvEiGyeZcA3"
		);

		await setDoc(educationRef, {
			highest_degree: "",
			field_of_study: "",
			institution_name: "",
			graduation_year: 0,
			is_verified: false,
		});

		await assertFails(
			updateDoc(educationRef, {
				highest_degree: "Bachelors",
				field_of_study: "Computer Science",
				institution_name: "University of California",
				graduation_month: 2024,
				verified: true,
			})
		);
	});

	it("should NOT allow To Update to Tutor Education if data is not correct (2)", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"50Ma6fnMfxvEiGyeZcA3",
			{ role: "tutor" }
		);
		const firestore = getFirestore(authContext);
		const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

		await setDoc(doc(firestore, userRef), {
			username: "John Doe",
			uid: "50Ma6fnMfxvEiGyeZcA3",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const educationRef = doc(
			firestore,
			"TUTORS/50Ma6fnMfxvEiGyeZcA3/TUTOR_EDUCATION/50Ma6fnMfxvEiGyeZcA3"
		);

		await setDoc(educationRef, {
			highest_degree: "",
			field_of_study: "",
			institution_name: "",
			graduation_year: 0,
			is_verified: false,
		});

		await assertFails(
			updateDoc(educationRef, {
				verified: true,
			})
		);
	});

	it("should NOT allow to delete Education document", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"50Ma6fnMfxvEiGyeZcA3",
			{ role: "tutor" }
		);
		const firestore = getFirestore(authContext);
		const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

		await setDoc(doc(firestore, userRef), {
			username: "John Doe",
			uid: "50Ma6fnMfxvEiGyeZcA3",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const educationRef = doc(
			firestore,
			"TUTORS/50Ma6fnMfxvEiGyeZcA3/TUTOR_EDUCATION/50Ma6fnMfxvEiGyeZcA3"
		);

		await setDoc(educationRef, {
			highest_degree: "",
			field_of_study: "",
			institution_name: "",
			graduation_year: 0,
			is_verified: false,
		});

		await assertFails(deleteDoc(educationRef));
	});
});

describe("TUTOR_CERTIFICATIONS", () => {
	it("should allow to Add Data to TUTOR CERTIFICATIONS collection", async () => {
		const authContext = firebaseEnv.authenticatedContext(
			"50Ma6fnMfxvEiGyeZcA3",
			{ role: "tutor" }
		);
		const firestore = getFirestore(authContext);
		const userRef = "TUTORS/50Ma6fnMfxvEiGyeZcA3";

		await setDoc(doc(firestore, userRef), {
			username: "John Doe",
			uid: "50Ma6fnMfxvEiGyeZcA3",
			email: "John.Doe@gmail.com",
			total_students: 0,
			active_students: 0,
			completed_lessons: 0,
			pending_lessons: 0,
			total_reviews: 0,
			rating: 0,
			profilePhotoURL: "",
			per_lesson_rate: 0,
			free_trail_lesson_enable: true,
			country: "",
			languages: [],
			categories: [],
			number_of_reviews: 0,
			tagline: "",
			about: "",
			experience_years: 0,
			plan_type: "trial",
			subscription_status: "active",
			pending_categories: [],
		});

		const certificationsRef = doc(
			firestore,
			"TUTORS/50Ma6fnMfxvEiGyeZcA3/TUTOR_CERTIFICATIONS/50Ma6fnMfxvEiGyeZcA3"
		);

		await setDoc(certificationsRef, {
			certifications: [],
		});

		await assertSucceeds(
			updateDoc(certificationsRef, {
				certifications: arrayUnion({
					certification_heading: "AWS Certified Developer",
					certification_institution: "AWS",
					image_url: "https://www.softbuses.com",
					is_verified: true,
				}),
			})
		);
	});
});
