import Image from "next/image";
import { upload, back, circle_desclaimer, cross } from "@/assets/index";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cross_icon } from "@/assets/index";
interface EditLectureProps {
  src: string;
  title: string | undefined;
  content: string | undefined;
  time: string;
  closeModal: (index: number) => void;
  handleUpdateLesson: (
    src: File | undefined,
    title: string | undefined,
    content: string | undefined,
    time: string
  ) => void;
}
const EditLecture =({src,title,content,time,closeModal,handleUpdateLesson}:EditLectureProps)=>{
    const [uploadedVideo, setUploadedVideo] = useState<string>(src);
    const [file, setFile] = useState<File | null>(null);
    const [videoDuration, setVideoDuration] = useState<string>(time);
    const [editedTitle, setEditedTitle] = useState<string | undefined>(title);
    const [editedContent, setEditedContent] = useState<string | undefined>(content);
    const formatDuration = (duration: number) => {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${hours}:${minutes}:${seconds}`;
    };
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]; // Correctly accessing the first file
      if (file) {
        const videoUrl  = URL.createObjectURL(file);
        setUploadedVideo(videoUrl);
        setFile(file);
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          const formattedDuration = formatDuration(video.duration);
          setVideoDuration(formattedDuration);
        };
        video.src = videoUrl;
        
      }
    };

    const router = useRouter();
    return (
      <div>
        <div>
          <div className="max-w-7xl  bg-[#F1F1FF] p-10 mx-auto">
            <div className="flex justify-center">
              <h1 className="text-xl md:text-2xl lg:text-4xl text-center font-semibold">
                Let’s Update the Lesson
              </h1>
            </div>
          </div>
        </div>

        <div className="p-5">
          <button
            className="hover:bg-gray-100 z-50  sticky top-0 p-2 rounded-full"
            onClick={() => closeModal(0)}
          >
            <Image
              src={back}
              alt="back"
              height={50}
              width={50}
              className="h-10 w-10"
            />
          </button>
        </div>

        {/* //preview video */}
        { <div className="max-w-7xl mx-auto mt-10">
          <div className="flex justify-center">
            <video
              controls
              key={uploadedVideo}
              className="w-[50%] h-[300px] object-cover rounded-md"
            >
              <source src={uploadedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
}
        <div className="max-w-7xl w-[60%] mx-auto mt-10">
          <div className="flex flex-col items-center">
            <div className="relative w-[60%] mt-10  mx-auto">
              {/* <label className="absolute p-1 -top-2 bg-white left-2 text-xs">
              Add Introductory Video
            </label> */}
              <h1 className="mb-1 font-semibold text-lg">Edit the Video</h1>
              <div className="mt-1 text-center flex justify-center border-dashed px-6 pt-5 pb-6 border-2 border-gray-300 rounded-md">
                <div className="text-center">
                  <label
                    htmlFor="video-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
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
                          Only .mp4, .mov, .avi, .flv, .mkv formats are
                          accessible
                        </p>
                      </div>
                      <input
                        id="video-upload"
                        name="video-upload"
                        onChange={(e) => {
                          handleVideoChange(e);
                        }
                        }
                        type="file"
                        className="sr-only hidden"
                        accept=".mp4"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* {uploadedVideo && (
                <p className="text-center text-sm mt-2">
                  Selected Video: {uploadedVideo.name} with duration{" "}
                  {formatDuration(videoDuration)}
                </p>
              )}
              {errors.video && <p className="text-red-500">{errors.video}</p>} */}
            </div>
            <div className="mt-[5%] pl-10 px-5  gap-5 flex items-center">
              <Image
                src={circle_desclaimer}
                alt="circle_desclaimer"
                height={20}
                width={20}
                className="h-8 w-8"
              />
              <p>
                Provide a title and description that accurately defines what your video is about
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
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Introduction to Figma....."
                className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
              />
              {/* {errors.title && <p className="text-red-500">{errors.title}</p>} */}
            </div>

            <div className="w-[90%] mx-auto my-[60px] relative">
              <label className="absolute p-1 text-lg -top-5 bg-white left-2">
                Description
              </label>
              <textarea
                name="description"
                rows={7}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                // onChange={handleInputChange}
                className="w-full resize-none p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
                placeholder="write video description here"
              ></textarea>
              {/* {errors.description && (
                <p className="text-red-500">{errors.description}</p>
              )} */}
            </div>
          </div>
          <div className="flex mb-10 justify-end w-[90%] mx-auto">
            <div>
              <CustomButton

              onclickEvent={() => {
                handleUpdateLesson(
                  file!== null ? file : undefined,
                  editedTitle!==title ? editedTitle : undefined,
                  editedContent!==content ? editedContent : undefined,
                  videoDuration
                );
                closeModal(0);
              }
              }
                text="Update Lesson"
                className="px-8 py-2 text-white rounded-full bg-empoweredFlag"
              />
            </div>
          </div>
        </div>
      </div>
    );
}
export default EditLecture;