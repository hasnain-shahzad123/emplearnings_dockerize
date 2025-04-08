"use client";
import Image from "next/image";
import { upload, back } from "@/assets/index";
import { circle_desclaimer } from "@/assets/index";
import { useState, useEffect } from "react";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import addTutorCourseToDB from "@/firebase/tutor/courses/writers/addTutorCourseToDB";
import { useAlert } from "@/contexts/AlertContext";
import { useRouter } from "next/navigation";
import addCourseIntroductoryVideo from "@/firebase/tutor/courses/writers/addCourseIntroductoryVideo";
import addCourseTitleImage from "@/firebase/tutor/courses/writers/addCourseTitleImage";
import { useProgressBanner } from "@/contexts/ProgressBannerContext";

const AddFiles = ({ uid }: { uid: string }) => {
  const {
    isUploading,
    setIsUploading,
    setUploadingText,
    setIsProgressCompleted,
    setUploadProgress,
  } = useProgressBanner();
  const { showAlert } = useAlert();
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();
  const [courseId, setCourseId] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    level: "",
    description: "",
    price: "",
    tagInput: "",
    tags: [] as string[],
  });
  const [errors, setErrors] = useState({
    title: "",
    tags: "",
    description: "",
    price: "",
    level: "",
    image: "",
    video: "",
  });

  const validateForm = () => {
    let newErrors = {
      title: "",
      tags: "",
      price: "",
      level: "",
      description: "",
      image: "",
      video: "",
    };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    if (!formData.level.trim()) {
      newErrors.level = "Level is required";
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
      isValid = false;
    }
    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
      isValid = false;
    }
    if (!uploadedImage) {
      newErrors.image = "An image file is required.";
      isValid = false;
    }
    if (!uploadedVideo) {
      newErrors.video = "A video file is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = e.target.files?.[0] || null;
    if (type === "image") setUploadedImage(file);
    if (type === "video") setUploadedVideo(file);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && formData.tagInput.trim()) {
      setFormData((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, formData.tagInput.trim()],
      }));
      setFormData((prevState) => ({
        ...prevState,
        tagInput: "",
      }));
      e.preventDefault();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((tag) => tag !== tagToRemove),
    }));

    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmission = async () => {
    if (!validateForm()) {
      return;
    }
    setIsUploading(true);
    setUploadingText("Initializing submission...");

    if (!uploadedImage || !uploadedVideo) {
      setIsUploading(false);
      showAlert(
        "Please upload both a title image and an introductory video.",
        "WARNING"
      );
      return;
    }

    const newCourse = {
      tutorId: uid,
      title: formData.title,
      description: formData.description,
      levels: formData.level,
      tags: formData.tags,
      price: parseFloat(formData.price),
    };

    setUploadingText("Creating new course...");
    const result = await addTutorCourseToDB(newCourse);

    if (result.type === "error") {
      setIsUploading(false);
      if (Array.isArray(result.message)) {
        showAlert(
          result.message.map((item) => item.message).join(", "),
          "ERROR"
        );
      } else {
        // alert(result.message);
        showAlert(result.message, "ERROR");
      }
      return;
    }

    const newCourseId = result.courseId || "";
    setCourseId(newCourseId);
    console.log("course id of the created course is :", newCourseId);
    if (uploadedImage !== null) {
      setUploadingText("Uploading title image...");
      const imageResult = await addCourseTitleImage({
        imageFile: uploadedImage,
        courseId: newCourseId,
      });

      if (imageResult.type === "success") {
        setImageUrl(imageResult.downloadURL || "");
      } else {
        console.error(imageResult.message);
        //alert(`Couldn't save title image\n${imageResult.message}`);
        showAlert(`Couldn't save title image\n${imageResult.message}`, "ERROR");
        setIsUploading(false);
        return;
      }
    } else {
      setIsUploading(false);
      // alert("Please upload a title image");
      showAlert("Please upload a title image", "WARNING");
      return;
    }

    if (uploadedVideo !== null) {
      setUploadingText("Uploading course video...");
      const videoResult = await addCourseIntroductoryVideo({
        videoFile: uploadedVideo,
        courseId: newCourseId,
        setUploadProgress: setUploadProgress,
      });

      if (videoResult.type === "success") {
        //    alert("Successfully created");
        showAlert("Successfully created.", "SUCCESS");
      } else {
        setIsUploading(false);
        //  alert("Couldn't upload introductory video");
        showAlert("Couldn't upload introductory video", "ERROR");
        return;
      }
    } else {
      setIsUploading(false);
      //  alert("Please upload an introductory video");
      showAlert("Please upload an introductory video", "WARNING");
      return;
    }

    setIsProgressCompleted(true);
    setUploadProgress(null);
    router.push(
      `/mentor-dashboard/${uid}/course/${newCourseId}/course-content`
    );
  };

  useEffect(() => {
    if (uploadedImage) {
      const url = URL.createObjectURL(uploadedImage);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [uploadedImage]);

  useEffect(() => {
    if (uploadedVideo) {
      const url = URL.createObjectURL(uploadedVideo);
      setVideoPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [uploadedVideo]);

  return (
    <>
      <div className="max-w-7xl mt-[4%] mx-auto">
        <button onClick={router.back} className="mb-[5%] mx-10">
          <Image
            src={back}
            alt="back"
            height={50}
            width={50}
            className="h-10 w-10"
          />
        </button>
        <div className="flex flex-col md:flex-row justify-evenly flex-wrap gap-6 md:gap-10">
          {/* Certification Image Upload */}
          <div className="mb-4 w-[90%] md:w-[40%] mx-auto items-center relative">
            {/* <label className="block absolute -top-2 left-3 text-[10px] sm:text-sm font-medium text-gray-700 bg-white p-1">
              Add Title Image
            </label> */}
            <h1 className="text-center mb-3 text-lg">Add Title Image</h1>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-dashed border-2 border-gray-300 rounded-md">
              <div className="text-center">
                <label
                  htmlFor="Add_file"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <div className="flex flex-col gap-5 px-5 py-3 items-center justify-center">
                    {imageUrl === "" ? (
                      <>
                        <div>
                          <Image src={upload} alt="Upload Picture" />
                        </div>
                        <div className="text-left">
                          <h1 className="text-[#7A7A7A] text-center md:text-left md:text-xl">
                            Upload a File
                          </h1>
                          <p className="text-[#7A7A7A] text-xs mt-1">
                            JPG, PNG
                          </p>
                        </div>
                      </>
                    ) : (
                      <Image
                        alt="uploaded image"
                        width={100}
                        height={200}
                        src={imageUrl}></Image>
                    )}
                  </div>
                </label>
                <input
                  id="Add_file"
                  name="AddTutor_file"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleFileChange(e, "image")}
                />
              </div>
            </div>
            {uploadedImage && (
              //

              <div className="text-center mt-7">
                <Image
                  src={imagePreviewUrl}
                  alt="uploaded image"
                  width={1500}
                  height={2200}
                  className="mx-auto object-contain h-48 w-full"
                />
                <p className="text-sm mt-2">
                  <span className="font-bold">Selected Image:</span>{" "}
                  {uploadedImage.name}
                </p>
              </div>
            )}
            {errors.image && <p className="text-red-500">{errors.image}</p>}
          </div>

          {/* Introductory Video Upload */}
          <div className="relative w-[90%] md:w-[40%] mx-auto">
            {/* <label className="absolute p-1 -top-2 bg-white left-2 text-xs">
              Add Introductory Video
            </label> */}
            <h1 className="text-center mb-3 text-lg">
              Add an introductory Video
            </h1>
            <div className="mt-1 text-center flex justify-center border-dashed px-6 pt-5 pb-6 border-2 border-gray-300 rounded-md">
              <div className="text-center">
                <label
                  htmlFor="video-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <div className="flex flex-col gap-5 px-5 py-10 items-center justify-center">
                    <div>
                      <Image
                        src={upload}
                        alt="Upload Video"
                        height={50}
                        width={50}
                      />
                    </div>
                    <div>
                      <p className="pl-1 text-[12px] text-[#4A148C]">
                        Only .mp4, .mov, .avi, .flv, .mkv formats are accessible
                      </p>
                    </div>
                    <input
                      id="video-upload"
                      name="video-upload"
                      type="file"
                      className="sr-only hidden"
                      accept=".mp4"
                      onChange={(e) => handleFileChange(e, "video")}
                    />
                  </div>
                </label>
              </div>
            </div>

            {uploadedVideo && (
              <div className="text-center mt-7">
                <video
                  controls
                  src={videoPreviewUrl}
                  className="mx-auto h-48 w-full object-contain mt-10"
                />
                <p className="text-sm mt-2">
                  <span className="font-bold">Selected Video:</span>{" "}
                  {uploadedVideo.name}
                </p>
              </div>
            )}
            {errors.video && <p className="text-red-500">{errors.video}</p>}
          </div>
        </div>
        <div className="mt-[5%] pl-10 px-5 gap-5 flex items-center">
          <Image
            src={circle_desclaimer}
            alt="circle_desclaimer"
            height={20}
            width={20}
            className="h-8 w-8"
          />
          <p>
            Provide a course title that accurately defines what your course is
            about
          </p>
        </div>

        <div className="flex flex-col my-[50px] items-center">
          <div className="w-[90%] mx-auto relative">
            <label className="absolute p-1 -top-5 bg-white left-2 text-lg">
              Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="Introduction to Figma....."
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>

          <div className="w-[90%] my-[50px] mx-auto relative">
            <label className="absolute p-1 -top-5 bg-white left-2 text-lg">
              Levels
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800 bg-white">
              <option value="">Select Level</option>
              <option value="All levels">All levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
              <option value="Guru">Guru</option>
            </select>
            {errors.level && <p className="text-red-500">{errors.level}</p>}
          </div>

          <div className="w-[90%] mx-auto relative">
            <label className="absolute p-1 -top-5 bg-white left-2 text-lg">
              Description
            </label>
            <textarea
              name="description"
              rows={7}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
              placeholder="Write your review here"></textarea>
            {errors.description && (
              <p className="text-red-500">{errors.description}</p>
            )}
          </div>
          <div className="w-[90%] my-[50px] mx-auto relative">
            <label className="absolute p-1 -top-5 bg-white left-2 text-lg">
              Price *
            </label>
            <input
              type="number"
              name="price"
              placeholder="$ 0.00"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
            />
            {errors.price && <p className="text-red-500">{errors.price}</p>}
          </div>
          <div className="w-[90%] mx-auto relative">
            <label className="absolute p-1 -top-5 bg-white left-2 text-lg">
              Add Tags *
            </label>
            <input
              type="text"
              name="tagInput"
              onKeyDown={handleAddTag}
              value={formData.tagInput}
              onChange={handleInputChange}
              placeholder="Press Enter to add tags..."
              className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
            />
            {errors.tags && <p className="text-red-500">{errors.tags}</p>}
          </div>
          {/* Tags Display */}
          <div className="w-[90%] mx-auto mt-4 flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-purple-100 text-purple-700 rounded-full px-4 py-2 text-sm">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-xl text-purple-700 hover:text-purple-900">
                  ×
                </button>
              </div>
            ))}
          </div>
          {/* {
            error && <p className="text-red-500">{error}</p>
          } */}
        </div>

        <div className="flex mb-10 justify-end w-[90%] mx-auto">
          {/* <button onClick={router.back}>
            <div className="cursor-pointer">
              <Image
                src={back}
                alt="back"
                height={50}
                width={50}
                className="h-10 w-10"
              />
            </div>
          </button> */}
          <div>
            <CustomButton
              text={"Confirm"}
              disabled={isUploading}
              onclickEvent={handleSubmission}
              className="px-8 py-2 text-white rounded-full bg-empoweredFlag"
            />
          </div>
        </div>
      </div>
      {/* {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 p-8 rounded-lg flex flex-col items-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A148C] font-medium">{loadingText}</p>
          </div>
        </div>
      )} */}
    </>
  );
};

export default AddFiles;
