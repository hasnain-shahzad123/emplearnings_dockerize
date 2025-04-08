"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { upload, back, circle_desclaimer } from "@/assets/index";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import addVideoToCourse from "@/firebase/tutor/courses/writers/addVideoToCourse";
import { useAlert } from "@/contexts/AlertContext";
import { useRouter } from "next/navigation";
import { useProgressBanner } from "@/contexts/ProgressBannerContext";

const AddVideoSection = ({
  tutorId,
  courseId,
}: {
  tutorId: string;
  courseId: string;
}) => {
  const {
    isUploading,
    setIsUploading,
    setUploadingText,
    setUploadProgress,
    setIsProgressCompleted,
  } = useProgressBanner();

  const { showAlert } = useAlert();
  const router = useRouter();
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>("");

  useEffect(() => {
    if (uploadedVideo) {
      setUploadedVideoUrl(URL.createObjectURL(uploadedVideo));
    }
  }, [uploadedVideo]);

  useEffect(() => {
    if (submitted) {
      router.back();
    }
  }, [submitted, router]);

  const [formData, setFormData] = useState({
    head: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    video: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    //getting video duration here
    if (file) {
      const video = document.createElement("video");
      //here the meaning of this line is we are only loading metadata like duration,height,width etc
      video.preload = "metadata";
      //this is triggered when the metadata is loaded
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        //setting the video duration
        setVideoDuration(video.duration);
      };
      //initializing the video source
      video.src = URL.createObjectURL(file);
    }
    //setting the uploaded video
    setUploadedVideo(file);
  };
  const validateForm = () => {
    let newErrors = {
      title: "",
      description: "",
      video: "",
    };
    let isValid = true;

    if (!formData.head.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (formData.head.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
      isValid = false;
    }

    if (!uploadedVideo) {
      newErrors.video = "A video file is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmission = async () => {
    if (!validateForm()) {
      return;
    }

    if (!uploadedVideo) {
      // alert("Please upload a video.");
      showAlert("Please upload a video.", "INFO");
      return;
    }

    setIsUploading(true);
    setUploadingText("Uploading video...");

    try {
      // Calling the function to add the video to the course

      //Note: also Add the duration here
      const result = await addVideoToCourse(
        courseId,
        tutorId,
        uploadedVideo,
        formData.head,
        formData.description,
        formatDuration(videoDuration),
        setUploadProgress
      );

      if (result.type === "success") {
        setFormData({
          head: "",
          description: "",
        });
        setUploadedVideo(null);
        //   alert(result.message);
        showAlert(result.message, "SUCCESS");
      } else {
        //alert(`Error: ${result.message}`);
        showAlert(`Error: ${result.message}`, "ERROR");
      }
    } catch (error) {
      showAlert("An unexpected error occurred during video upload.", "ERROR");
      console.error(error);
    } finally {
      setSubmitted(true);
      setIsProgressCompleted(true);
      setUploadProgress(null);
    }
  };
  return (
    <>
      <div className="max-w-7xl mx-auto mt-10">
        <button onClick={router.back} className="mx-10">
          <div className="cursor-pointer">
            <Image
              src={back}
              alt="back"
              height={50}
              width={50}
              className="h-10 w-10"
            />
          </div>
        </button>
        <div className="flex flex-col items-center">
          <div className="relative w-[40%] mt-10  mx-auto">
            {/* <label className="absolute p-1 -top-2 bg-white left-2 text-xs">
              Add Introductory Video
            </label> */}
            <h1 className="mb-1 font-semibold text-lg">Add a Video</h1>
            <div className="mt-1 text-center flex justify-center border-dashed px-6 pt-5 pb-6 border-2 border-gray-300 rounded-md">
              <div className="text-center">
                <label
                  htmlFor="video-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <div className="flex flex-col gap-5 px-5 py-3 items-center justify-center">
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
                      onChange={(e) => handleFileChange(e)}
                    />
                  </div>
                </label>
              </div>
            </div>

            {uploadedVideo && (
              <div className="text-center mt-7">
                <video
                  controls
                  src={uploadedVideoUrl}
                  className="mx-auto h-48 w-full object-contain"
                />
                <p className="text-sm mt-2">
                  Selected Video: {uploadedVideo.name} with duration{" "}
                  {formatDuration(videoDuration)}
                </p>
              </div>
            )}
            {errors.video && <p className="text-red-500">{errors.video}</p>}
          </div>
          <div className="mt-[5%] pl-10 px-5 w-[40%] gap-5 flex items-center">
            <Image
              src={circle_desclaimer}
              alt="circle_desclaimer"
              height={20}
              width={20}
              className="h-8 w-8"
            />
            <p>
              Provide a title and description that accurately defines what your
              video is about
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-[8%] items-center">
          <div className="w-[90%] mx-auto relative">
            <label className="absolute p-1 -top-5 bg-white left-2 text-lg">
              Title *
            </label>
            <input
              type="text"
              name="head"
              placeholder="Introduction to Figma....."
              value={formData.head}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>

          <div className="w-[90%] mx-auto my-[60px] relative">
            <label className="absolute p-1 text-lg -top-5 bg-white left-2">
              Description
            </label>
            <textarea
              name="description"
              rows={7}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
              placeholder="write video description here"></textarea>
            {errors.description && (
              <p className="text-red-500">{errors.description}</p>
            )}
          </div>
        </div>
        <div className="flex mb-10 justify-end w-[90%] mx-auto">
          <div>
            <CustomButton
              disabled={isUploading}
              text="Add Video"
              onclickEvent={handleSubmission}
              className="px-8 py-2 text-white rounded-full bg-empoweredFlag"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default AddVideoSection;
