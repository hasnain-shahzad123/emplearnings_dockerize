import { Timestamp } from "firebase/firestore";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { FaLanguage } from "react-icons/fa";

export type PasswordVisibility = {
	password: boolean;
	confirmPassword: boolean;
};
export interface AccordianProp {
	onToggle: () => void;
	items: { Question: string; Answer: string }[] | undefined;
}
export interface TestimonialCardProps {
	imgSrc: string;
	name: string;
	title: string;
	testimonial: string;
	by: string;
	color: string;
}

export interface InputProps {
	suggestionData: TutorStoredCategoriesDataType;
	currentPage: number;
}

export interface GoogleTokenResponse {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	token_type: string;
}

//Events Mapped For Calendar
export interface MappedEvents {
	[year: number]: {
		[month: number]: {
			[day: number]: Event[];
		};
	};
}

export interface AccordianProp {
	onToggle: () => void;
	items: { Question: string; Answer: string }[] | undefined;
}
export interface TestimonialCardProps {
	imgSrc: string;
	name: string;
	title: string;
	testimonial: string;
	by: string;
	color: string;
}

export type SuggestionDataType = {
	[key: string]: string[];
};

export type TutorCategoryType = {
	sup_category: string;
	category_name: string;
	sub_category_name: string;
};

export type TutorPendingCategoryType = {
	sup_category: string;
	category_name: string;
	sub_category_name: string;
	pending_document_uid: string;
};

export interface InputProps {
	suggestionData: TutorStoredCategoriesDataType;
	currentPage: number;
}

export interface CustomInputProps {
	suggestionData: TutorStoredCategoriesDataType;
	currentPage: number;
	onSaveButtonClicked: (category: string, subCategory: string) => void;
	editObject: TutorCategoryType;
	onEditButtonClicked: (category: string, sub_category: string) => void;
	isCustomInput: boolean;
	setCustomInput: (value: boolean) => void;
}

export interface GoogleTokenResponse {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	token_type: string;
}
//calendar event
export interface Event {
	eventId: string;
	eventLink: string; // Link to the Google Calendar event
	meetingLink: string; // Google Meet conference link
	startTime: string; // Event start time
	endTime: string; // Event end time
	attendees: {
		email: string;
		name: string;
	}[]; // List of attendees' email addresses
	summary: string; // Event summary/description
	attendeeNames: string[]; //list of names of attendees
}

export interface selfIntroduction {
	tutorId: string;
	tagline: string;
	about: string;
}
export interface LanguageProficency {
	tutorId: string;
	languages: {
		language_name: string;
		proficiency_level: string;
	}[];
}
export interface tutorCountry {
	tutorId: string;
	country: string;
}
export interface ProfilePhoto {
	tutorId: string;
	profilePhoto: File;
}

export type NotificationType = {
	uid: string;
	read: boolean;
	notification: string;
	time: Timestamp;
};

export type NotificationTypeTemp = {
	uid: string;
	read: boolean;
	notification: string;
	time: Timestamp | null;
};
export interface CourseReview {
	student_uid: string;
	student_profileImage_url: string;
	number_of_stars: number;
	time: Timestamp;
	review: string;
}
export type TutorExperience = {
	experience_years: number;
	is_verified: boolean;
};
export type TutorDocumentDataType = {
	username: string;
	email: string;
	profilePhotoURL: string;
	pending_lessons: number;
	completed_lessons: number;
	total_reviews: number;
	total_students: number;
	uid: string;
	active_students: number;
	rating: number;
	per_lesson_rate: number;
	free_trail_lesson_enable: boolean;
	country: string;
	languages: LanguageType[];
	categories: TutorCategoryType[];
	pending_categories: TutorCategoryType[];
	number_of_reviews: number;
	tagline: string;
	about: string;
	experience_years: string;
	planType: string;
	subscription_status: string;
};

export type TutorEducationDataType = {
	highest_degree: string;
	field_of_study: string;
	institution_name: string;
	graduation_year: number;
	is_verified: boolean;
};

export type TutorCertificationsDataType = {
	uid: string;
	certification_heading: string;
	is_verified: boolean;
	image_url: string;
};

export type TutorStoredCategoriesItemDataType = {
	category_name: string;
	sub_categories: string[];
};

export type TutorStoredCategoriesDataType = {
	academic_tutoring: TutorStoredCategoriesItemDataType[];
	skill_development: TutorStoredCategoriesItemDataType[];
	life_coaching: TutorStoredCategoriesItemDataType[];
};

export type TutorExternalReviewsDataType = {
	external_platform: string;
	review_from: string;
	is_verified: boolean;
	review_link: string;
	review_content: string;
};

export type TutorStrengthDataType = {
	description: string;
};

export type TutorLessonScheduleDataType = {
	week_one: {
		Sun: string[];
		Mon: string[];
		Tue: string[];
		Wed: string[];
		Thu: string[];
		Fri: string[];
		Sat: string[];
	};
	week_two: {
		Sun: string[];
		Mon: string[];
		Tue: string[];
		Wed: string[];
		Thu: string[];
		Fri: string[];
		Sat: string[];
	};
};

export type TutorTrialLessonScheduleDataType = {
	week_one: {
		Sun: string[];
		Mon: string[];
		Tue: string[];
		Wed: string[];
		Thu: string[];
		Fri: string[];
		Sat: string[];
	};
};

export type StudentDocumentDataType = {
	username: string;
	email: string;
	profilePhotoURL: string;
	pending_lessons: number;
	completed_lessons: number;
	booked_lessons: number;
	total_reviews: number;
	total_courses: number;
	uid: string;
	active_students: number;
	rating: number;
	per_lesson_rate: number;
	free_trail_lesson_enable: boolean;
	country: string;
	languages: LanguageType[];
	categories: CategoryType[];
	number_of_reviews: number;
	tagline: string;
	about: string;
	experience_years: number;
	plan_type: string;
	subscription_status: string;
	notifications?: NotificationTypeTemp[];
};

export type ReviewsProp = {
	reviewerProfile: StaticImport;
	reviewerName: string;
	reviewerRating: number;
	reviewDate: string;
	review: string;
};

export type ExternalReviewsProp = {
	reviewerName: string;
	reviewerRating: number;
	platform: string;
	reviewDate: string;
	review: string;
};

export type TutorDashboardDataType = {
	tutorDocumentData: TutorDocumentDataType;
	notifications: NotificationType[];
};

export type StudentDashboardDataType = {
	studentDocumentData: StudentDocumentDataType;
	notifications: NotificationTypeTemp[];
};

export type LanguageType = {
	language_name: string;
	proficiency_level: string;
};

type CategoryType = {
	sup_category: string;
	category_name: string;
	sub_category: string;
};

export type TutorCardType = {
	name: string;
	tagline: string;
	categories: CategoryType[];
	rating: number;
	completed_lessons: number;
	active_students: number;
	about: string;
	number_of_reviews: number;
	experience_years: number;
	plan_type: string;
	per_lesson_rate: number;
	country: string;
	languages: LanguageType[];
};

export interface Education {
	uid: string;
	name: string;
	field: string;
	institute: string;
	graduationYear: number;
	degreePhoto: File | null;
}

export interface Course {
	title: string;
	total_hours: number;
	total_lectures: number;
	total_purchases: number;
	tutorId: string;
	description: string;
	levels: string;
	price: string;
	tags: string[];
	rating: number;
	title_img_url: string;
	intro_video_url: string;
	courseId: string;
	videoSequence: string[];
}

export interface VideoData {
	videoId: string;
	title: string;
	description: string;
	url: string;
	video_duration: string;
}

export type TutorStudentLessonDataType = {
	uid: string;
	category: CategoryType;
	duration: number;
	time: Timestamp;
	lesson_status: string;
	meeting_link: string;
};

export type TutorStudentDocumentData = {
	categories: CategoryType[];
	enrolled_on: Date;
	pending_lessons: Number;
	student_uid: string;
	completed_lessons: 0;
	previous_lesson?: Timestamp;
	next_lesson?: Timestamp;
	name?: string;
	profilePhotoURL?: string;
	student_status?: string;
	lessons?: TutorStudentLessonDataType[];
};
