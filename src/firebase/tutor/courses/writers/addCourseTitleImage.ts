import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { z } from "zod";
import { doc, setDoc } from "firebase/firestore";
import { firestore, storage } from "@/firebase/firebaseConfig";

const ImageFileSchema = z.object({
  courseId: z.string().min(1, "course id is required"),
  imageFile: z.instanceof(File).refine(
    (file) => {
      const validMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
      return (
        validMimeTypes.includes(file.type) &&
        /\.(png|jpg|jpeg)$/i.test(file.name)
      );
    },
    {
      message: "File must be a JPG or PNG image .",
    }
  ),
});
type UploadResponse = {
  type: "success" | "error";
  message: string;
  downloadURL?: string;
};

const addCourseTitleImage = async ({
  imageFile,
  courseId,
}: z.infer<typeof ImageFileSchema>): Promise<UploadResponse> => {
  const validationResult = ImageFileSchema.safeParse({ imageFile, courseId });

  if (!validationResult.success) {
    return {
      type: "error",
      message: validationResult.error.errors
        .map((err) => err.message)
        .join(", "),
    };
  }

  try {
    const fileExtension = imageFile.name.substring(
      imageFile.name.lastIndexOf(".") + 1
    );

    const storageRef = ref(
      storage,
      `COURSES/${courseId}/${courseId}.${fileExtension}`
    );

    // Uploading the file
    await uploadBytes(storageRef, imageFile);

    // Getting the download URL for the uploaded image
    const downloadURL = await getDownloadURL(storageRef);
    const docRef = doc(firestore, "COURSES", courseId);
    await setDoc(docRef, { title_img_url: downloadURL }, { merge: true });

    return {
      type: "success",
      message: "File uploaded successfully",
      downloadURL,
    };
  } catch (error) {
    console.error("Error uploading the image:", error);
    return {
      type: "error",
      message: "Failed to upload the image.",
    };
  }
};

export default addCourseTitleImage;
