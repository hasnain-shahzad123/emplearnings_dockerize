"use client";
import { useState } from "react";
import Image from "next/image";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { upload,Figma_course,play_icon, back, circle_desclaimer } from "@/assets/index";
interface EditCourseProps {
  toggleModal: () => void;
}
const EditCourse =({toggleModal}:EditCourseProps)=>{
    const [courseVideo,setCourseVideo] = useState<File | null>(null);
    return (
      <>
        <div className="max-w-7xl overflow-auto bg-white mx-auto mt-10">
          <div className="flex bg-[#F1F1FF] justify-center">
            <h1 className="text-xl md:text-2xl  my-[50px] lg:text-4xl text-center font-semibold">
              Let’s Edit this Video
            </h1>
          </div>
          <div className="flex justify-center">
            {/* preview Image */}
            <div className="relative flex justify-center mt-10 w-[35%] group">
              <Image
                src={Figma_course}
                alt="Course Image"
                height={250}
                width={400}
                className="w-full max-w-full h-auto group-hover:opacity-0 transition-opacity duration-300"
              />
              <div className="absolute inset-0 flex justify-center items-center group-hover:opacity-0 transition-opacity duration-300">
                <Image
                  src={play_icon.src}
                  alt="Play Icon"
                  height={50}
                  width={50}
                  className="h-12 w-12 sm:h-20 sm:w-20 cursor-pointer"
                />
              </div>
              <video
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                autoPlay
                muted
                loop
              >
                <source src="/videos/course_1.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          <div className="flex w-full flex-col items-center">
            <div className="relative w-[40%] mt-10  mx-auto">
              {/* <label className="absolute p-1 -top-2 bg-white left-2 text-xs">
              Add Introductory Video
            </label> */}
              <h1 className="mb-1 font-semibold text-lg">Add a Video</h1>
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
                Selected Video: {uploadedVideo.name}
              </p>
            )} */}
            </div>
            <div className="mt-[5%] pl-10 px-5 w-[70%] text-sm gap-3 flex items-center">
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
                name="title"
                placeholder="Introduction to Figma....."
                //   value={formData.title}
                //     onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
              />
            </div>

            <div className="w-[90%] mx-auto my-[60px] relative">
              <label className="absolute p-1 text-lg -top-5 bg-white left-2">
                Description
              </label>
              <textarea
                name="description"
                rows={7}
                // value={formData.description}
                // onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
                placeholder="write video description here"
              ></textarea>
            </div>
          </div>
          <div className="flex mb-10 justify-between w-[90%] mx-auto">
            <button onClick={toggleModal} className="cursor-pointer">
              <Image
                src={back}
                alt="back"
                height={50}
                width={50}
                className="h-10 w-10"
              />
            </button>
            <div>
              <CustomButton
                text="Save this video"
                //   onclickEvent={handleSubmission}
                className="px-8 py-2 text-white rounded-full bg-empoweredFlag"
              />
            </div>
          </div>
        </div>
      </>
    );
}
export default EditCourse;