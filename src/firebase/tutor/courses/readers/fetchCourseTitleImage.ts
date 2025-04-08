import { storage } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { ref, StorageError, getDownloadURL } from "firebase/storage";
import { z } from "zod";

const fetchCourseTitleImageSchema = z.object({
  courseId: z.string().min(1, "course id is required"),
});

const fetchCourseTitleImage = async ({
  courseId,
}: z.infer<typeof fetchCourseTitleImageSchema>) => {
  const validationResult = fetchCourseTitleImageSchema.safeParse({ courseId });

  if (!validationResult.success) {
    return {
      type: "error",
      image: null,
      message: validationResult.error.errors[0].message,
    };
  }

  try {
    const storageRefPng = ref(storage, `COURSES/${courseId}/${courseId}.png`);
    const storageRefJpg = ref(storage, `COURSES/${courseId}/${courseId}.jpg`);

    let imageURL: string | null = null;

    try {
      imageURL = await getDownloadURL(storageRefPng);
    } catch {
      imageURL = await getDownloadURL(storageRefJpg);
    }

    if (imageURL) {
      return {
        type: "success",
        image: imageURL,
        message: "Title image URL fetched successfully",
      };
    } else {
      throw new Error("Title image not found in both .png and .jpg formats.");
    }
  } catch (e: any) {
    if (e instanceof StorageError || e instanceof FirebaseError) {
      return {
        type: "error",
        message: e.message,
        image: null,
      };
    } else {
      return {
        type: "error",
        image: null,
        message: "An unexpected error occurred while fetching the title image",
      };
    }
  }
};

export default fetchCourseTitleImage;
