"use client";
import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { upload, play_icon, back, circle_desclaimer } from "@/assets/index";
import { Course } from "@/types";
import { useAlert } from "@/contexts/AlertContext";
import editCourse from "@/firebase/tutor/courses/writers/editCourse";
interface EditCourseProps {
  toggleModal: (idx: number) => void;
  courseData: Course;
  finishEditingCourse: () => void;
}
const EditCourse = ({
  toggleModal,
  courseData,
  finishEditingCourse,
}: EditCourseProps) => {
  const { showAlert } = useAlert();
  const [courseVideo, setCourseVideo] = useState<File | null>(); // this is for getting video in file and showing its name
  const [Editedcourse, setEditedCourseData] = useState<Course>(courseData); //this state is for editing course data
  const [videoPreview, setVideoPreview] = useState<string>(
    courseData.intro_video_url
  ); //this is for previewing video and storing video link in string
  const saveEditedCourse = async () => {
    const response = await editCourse({
      courseId: courseData.courseId,
      videoFile: courseVideo || undefined,
      title:
        Editedcourse.title !== courseData.title
          ? Editedcourse.title
          : undefined,
      level:
        Editedcourse.levels !== courseData.levels
          ? Editedcourse.levels
          : undefined,
      description:
        Editedcourse.description !== courseData.description
          ? Editedcourse.description
          : undefined,
      price:
          Editedcourse.price !== courseData.price
            ? Editedcourse.price
            : undefined,
    });



    if (response.type === "success") {
      showAlert("Course edited successfully", "SUCCESS");
      toggleModal(0);
    } else {
      showAlert("ohh, we faced some issue while updating your course, please try again after few mins.", "ERROR");
      console.error(response.message);
    }
    finishEditingCourse();
  };
  return (
    <>
      <div className="max-w-7xl w-[90%] overflow-auto bg-white mx-auto">
        <div className="flex bg-[#F1F1FF] justify-center">
          <h1 className="text-xl md:text-2xl  my-[50px] lg:text-4xl text-center font-semibold">
            Let’s Edit this Course
          </h1>
        </div>
        <button
          onClick={() => toggleModal(0)}
          className="cursor-pointer mt-10 mx-5 sticky top-5"
        >
          <Image
            src={back}
            alt="back"
            height={50}
            width={50}
            className="h-10 w-10"
          />
        </button>

        <div className="flex justify-center">
          {/* preview Image */}
          <div className="relative flex h-[250px] rounded-md justify-center mt-10 w-[40%] group">
            <Image
              src={courseData.title_img_url}
              alt="Course Image"
              height={250}
              width={400}
              className="w-full max-w-full h-auto object-cover group-hover:opacity-0 transition-opacity duration-300"
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
              controls={true}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              autoPlay
              muted
              loop
              key={videoPreview}
            >
              <source src={videoPreview} type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="relative w-[40%] mt-10  mx-auto">
            {/* <label className="absolute p-1 -top-2 bg-white left-2 text-xs">
              Add Introductory Video
            </label> */}
            <h1 className="mb-1 font-semibold text-lg">Add New Video</h1>
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
                        Only .mp4, .mov, .avi, .flv, .mkv formats are accessible
                      </p>
                    </div>
                    <input
                      id="video-upload"
                      name="video-upload"
                      onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        if (file) {
                          setCourseVideo(file);
                          const previewUrl = URL.createObjectURL(file);
                          setVideoPreview(previewUrl);
                          setEditedCourseData({
                            ...Editedcourse,
                            intro_video_url: previewUrl,
                          });
                        }
                      }}
                      type="file"
                      className="sr-only hidden"
                      accept=".mp4"
                    />
                  </div>
                </label>
              </div>
            </div>
            {courseVideo && (
              <p className="text-center text-sm mt-2">
                Selected Video: {courseVideo.name}
              </p>
            )}
          </div>
          <div className="mt-[5%] pl-10 px-5 w-[70%] text-sm gap-3 flex justify-center items-center">
            <Image
              src={circle_desclaimer}
              alt="circle_desclaimer"
              height={20}
              width={20}
              className="h-8 w-8"
            />
            <p>
              Provide a title and description that accurately defines what your course is about
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-[8%] items-center">
          <div className="w-[80%] mx-auto relative">
            <label className="absolute p-1 -top-5 bg-white left-2 text-lg">
              Edit Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Introduction to Figma....."
              value={Editedcourse.title}
              onChange={(e) => {
                setEditedCourseData({
                  ...Editedcourse,
                  title: e.target.value,
                });
              }}
              className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
            />
          </div>
          <div className="w-[80%] mx-auto my-[60px] relative">
            <label className="absolute p-1 text-lg -top-5 bg-white left-2">
              Level
            </label>
            <select
              name="Level"
              value={Editedcourse.levels}
              onChange={(e) => {
                setEditedCourseData({
                  ...Editedcourse,
                  levels: e.target.value,
                });
              }}
              className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800 bg-white"
            >
              <option value="All levels">All levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
              <option value="Guru">Guru</option>
            </select>
          </div>

          <div className="w-[80%] mx-auto relative">
            <label className="absolute p-1 text-lg -top-5 bg-white left-2">
              Edit Description
            </label>
            <textarea
              name="description"
              rows={7}
              value={Editedcourse.description}
              onChange={(e) => {
                setEditedCourseData({
                  ...Editedcourse,
                  description: e.target.value,
                });
              }}
              className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
              placeholder="write video description here"
            ></textarea>
          </div>
          <div className="w-[80%] my-[50px] mx-auto relative">
            <label className="absolute p-1 -top-5 bg-white left-2 text-lg">
              Price *
            </label>
            <input
              type="number"
              name="price"
              placeholder="$ 0.00"
              value={Editedcourse.price}
              onChange={(e) => {
                setEditedCourseData({
                  ...Editedcourse,
                  price: e.target.value,
                });
              }}
              className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
            />
          </div>
        </div>
        <div className="flex my-10 justify-end items-center w-[90%] mx-auto">
          {/* <button onClick={() => toggleModal(0)} className="cursor-pointer">
            <Image
              src={back}
              alt="back"
              height={50}
              width={50}
              className="h-10 w-10"
            />
          </button> */}
          <div>
            <CustomButton
              text="Save changes"
              onclickEvent={() => {
                saveEditedCourse();
              }}
              className="px-8 py-2 text-white rounded-full bg-empoweredFlag"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default EditCourse;
