"use client";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { Acc_arrow, clock_icon, total_playHours } from "@/assets/index";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { FaX } from "react-icons/fa6";
import VideoModal from "./Modal/VideoModal";
import { VideoData } from "@/types";
import EditLecture from "./Modal/EditLecture";
import deleteVideoOfCourseFromDB from "@/firebase/tutor/courses/writers/deleteCourseVideoInDB";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { updateVideoSequence } from "@/firebase/tutor/courses/writers/updateVideoSequence";
import ConfirmDeletion from "./Modal/ConfirmDeletion";
import { useAlert } from "@/contexts/AlertContext";
import editCourseVideo from "@/firebase/tutor/courses/writers/editCourseVideo";
import { set } from "zod";
import { useProgressBanner } from "@/contexts/ProgressBannerContext";
interface AccordionItem {
  title: string | undefined;
  content: string | undefined;
  time: string;
  videoId: string;
  src: string;
}

const ContentSection = ({
  videosData,
  courseTags,
  courseId,
  videosSequence,
  course_lectures,
  course_hours
}: {
  videosData: VideoData[];
  courseTags: string[];
  courseId: string;
  videosSequence: string[];
  course_lectures: number;
  course_hours: number
}) => {

   const {
     isUploading,
     setIsUploading,
     setUploadingText,
     setUploadProgress,
     setIsProgressCompleted,
   } = useProgressBanner();


  const totalCourseHours = videosData.length;
  const pathname = usePathname();
  const [accordionData, setAccordionData] = useState<AccordionItem[]>([]);
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);
  const [visibleItems, setVisibleItems] = useState<Record<number, boolean>>({});
  const [courseVideoSrc, setCourseVideoSrc] = useState<string>("");
  const [isEditBtnClicked, setIsEditBtn] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number>(0);
  const [totalCourseTime, setTotalCourseTime] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [videoIdToDelete, setVideoIdToDelete] = useState<string>("");


    const {showAlert} = useAlert();
  const handleAccordianVisibility = (index: number) => {
    setVisibleItems((prev) => ({
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const totalTime = accordionData.reduce((acc, item) => {
      const timeArr = item.time.split(":");
      const hours = parseInt(timeArr[0]);
      const minutes = parseInt(timeArr[1]);
      const seconds = parseInt(timeArr[2]);
      return acc + (hours * 3600 + minutes * 60 + seconds);
    }, 0);
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    const seconds = totalTime % 60;
    setTotalCourseTime(`${hours}h ${minutes}m ${seconds}s`);
  }, [accordionData]);

  useEffect(() => {
    const persistSequenceChange = async () => {
      const updatedVideoIds = accordionData.map((item) => item.videoId);
      const response = await updateVideoSequence({
        courseId,
        videoIds: updatedVideoIds,
      });
      console.log(response);
    };
    persistSequenceChange();
  }, [accordionData, courseId]);

  const handleDragEnd = (result: DropResult) => {
    console.log("course id is  : ", courseId);
    const { source, destination } = result;
    if (!destination) return;

    const updatedData = Array.from(accordionData);
    const [movedItem] = updatedData.splice(source.index, 1);
    updatedData.splice(destination.index, 0, movedItem);
    setAccordionData(updatedData);
    console.log(accordionData);
  };


  useEffect(() => {
    const sortedVideosData = videosSequence
      .map((videoId) => videosData.find((video) => video.videoId === videoId))
      .filter(Boolean) as VideoData[];

    const initialAccordionData: AccordionItem[] = sortedVideosData.map(
      (item) => {
        return {
          title: item.title,
          content: item.description,
          time: item.video_duration,
          videoId: item.videoId,
          src: item.url,
        };
      }
    );
    console.log(initialAccordionData);

    setAccordionData((prev) =>
      prev.length === 0 ? initialAccordionData : prev
    );
  }, [videosData, videosSequence]);

  const handleDeleteVideo = async (videoId: string) => {
    const updatedData = accordionData.filter(
      (item) => item.videoId !== videoId
    );
    setAccordionData(updatedData);
    const response = await deleteVideoOfCourseFromDB(courseId, videoId, videosSequence);
    if (response.type === "error") {
      console.log(response.message);
      return;
    }
  };

  //this delete function will be called when the user confirms the deletion
  const handleDelete = () => {
    setIsDeleteModalOpen(false);
    handleDeleteVideo(videoIdToDelete);
    setVideoIdToDelete("");
    setIsDeleteModalOpen(!isDeleteModalOpen);
  }

  // this will be called when cancel button will be clicked
  const handleCancelDeletion = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  }

  const handleEditModal = (index: number) => {
    setEditIndex(index);
    if (isEditBtnClicked) document.body.style.overflow = "auto";
    else document.body.style.overflow = "hidden";
    setIsEditBtn(!isEditBtnClicked);
  };

  //this function will update the lesson
  const handleUpdateLesson  =async (
    srcFile: File | undefined,
    title: string | undefined,
    content: string | undefined,
    time: string
  ) => {
    // console.log(srcFile, title, content, time, editIndex, accordionData[editIndex].videoId,courseId);
   setAccordionData((prevData) => {
     const updatedData = [...prevData];
     updatedData[editIndex] = {
       ...updatedData[editIndex],
       title: title !== undefined ? title : updatedData[editIndex].title,
       content:
         content !== undefined ? content : updatedData[editIndex].content,
       time,
       src: srcFile ? URL.createObjectURL(srcFile) : updatedData[editIndex].src,
     };
     return updatedData;
   });
   setIsUploading(true);
   setUploadingText("Updating the video data...");
    // db call here to update the lesson
    let videoId = accordionData[editIndex].videoId;
    let description = content;
    const videoFile = srcFile || undefined;
    const video_duration = videoFile ? time : undefined;
    const response =await editCourseVideo({
      courseId,
      videoId,
      videoFile,
      video_duration,
      title,
      description,
    }
    );
    if (response.type === "success") {
     showAlert("Video Data Updated Successfully","SUCCESS")
     setIsUploading(false);
      
    } else {
      showAlert("Error Updating the Data","ERROR");
      setIsUploading(false);
    }

  };

  return (
    <>
      <div className="max-w-7xl my-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="w-full md:w-[90%] shadow-even-xl mx-auto rounded-xl">
          <div className="flex flex-col md:flex-row md:justify-between p-6 md:p-10">
            <div className="mb-4 md:mb-0">
              <h1 className="text-lg md:text-2xl font-semibold">
                Course Content
              </h1>
              <div className="flex gap-3 items-center font-semibold mt-2">
                <p className="text-sm text-[#4A148C] md:text-base">
                  {accordionData.length} lectures
                </p>
                <p className="h-[10px] w-[10px] bg-empoweredFlag rounded-full"></p>
                <p className="text-sm text-empoweredFlag md:text-base">
                  {totalCourseTime} total length
                </p>
              </div>
            </div>
            <div>
              <Link href={`${pathname}/add-video`}>
                <CustomButton
                  text="Add new Video"
                  className="bg-empoweredFlag rounded-full px-6 py-2 font-semibold text-white text-sm md:text-base"
                />
              </Link>
            </div>
          </div>

          {/* Drag and Drop Context */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="accordion-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="py-3 pb-7"
                >
                  {accordionData.map((item, index) => (
                    <Draggable
                      key={`accordion-item-${index}`}
                      draggableId={`accordion-item-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 md:p-5 border-y-[1px] border-black bg-white rounded-md mb-2 shadow-md"
                        >
                          {/* Accordion Header */}
                          <div
                            onClick={() => handleAccordianVisibility(index)}
                            role="button"
                            tabIndex={0}
                            aria-expanded={visibleItems[index] || false}
                            className="flex flex-col sm:flex-row cursor-pointer mx-5 justify-between font-semibold items-start sm:items-center"
                          >
                            <div className="flex gap-3 sm:gap-5 items-center mb-2 sm:mb-0">
                              <Image
                                src={Acc_arrow.src}
                                alt="Accordion Arrow"
                                height={10}
                                width={10}
                                className={`h-5 w-5 transition-transform duration-300 ${visibleItems[index] ? "rotate-90" : ""
                                  }`}
                              />
                              <h1 className="text-base md:text-lg">
                                {item.title}
                              </h1>
                            </div>
                            <div className="flex gap-2 items-center text-sm md:text-base">
                              <Image
                                src={clock_icon.src}
                                alt="Clock Icon"
                                height={10}
                                width={10}
                                className="h-5 w-5"
                              />
                              <p>{item.time}</p>
                            </div>
                          </div>

                          {/* Accordion Content */}
                          <div
                            className={`pl-5 transition-all duration-300 ease-in-out ${visibleItems[index]
                              ? "opacity-100 pointer-events-auto pt-2 h-auto translate-y-0"
                              : "opacity-0 pointer-events-none h-0 -translate-y-4"
                              }`}
                          >
                            <div className="flex gap-3 w-[90%] items-center">
                              <button
                                onClick={() => {
                                  document.body.style.overflow = "hidden";
                                  setCourseVideoSrc(item.src);
                                  setVideoModalOpen(!videoModalOpen);
                                }}
                                className="flex-shrink-0"
                              >
                                <Image
                                  src={total_playHours}
                                  alt="Play Hours"
                                  width={50}
                                  height={50}
                                  className="w-10 h-10"
                                />
                              </button>
                              <p className="text-sm md:text-base">
                                {item.content}
                              </p>
                              <div className="flex justify-end gap-3 ml-auto">
                                <button
                                  className="p-2 sm:p-1 rounded-full hover:bg-purple-100"
                                  onClick={() => {
                                    handleEditModal(index);
                                  }}
                                >
                                  <FiEdit className="text-[#4A148C] h-7 w-7" />
                                </button>
                                <button
                                  className="p-2 sm:p-1 rounded-full hover:bg-purple-100"
                                  onClick={() => {
                                    // handleDeleteVideo(item.videoId);
                                    setIsDeleteModalOpen(true);
                                    setVideoIdToDelete(item.videoId);
                                    document.body.style.overflow = "hidden";
                                  }}
                                >
                                  <MdDelete className="text-[#4A148C] h-7 w-7" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Tags Section */}
        <div className="w-full md:w-[90%] mx-auto py-10 text-[#666666] text-sm md:text-base">
          <div className="flex gap-3 items-center text-lg">
            <p className="font-bold ">Tags: </p>

            <p>{" #" + courseTags.join(" #")}</p>
          </div>
        </div>
      </div>

      {/* Video Section */}

      {videoModalOpen && (
        <div
          className="fixed top-0 inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center"
          style={{ zIndex: 10000 }}
        >
          <div className="mb-10">
            <div className="absolute right-10 top-3">
              <button
                className="py-5 px-5 rounded-full"
                onClick={() => {
                  setVideoModalOpen(false);
                  document.body.style.overflow = "auto";
                }}
              >
                <FaX className="text-white hover:text-empoweredFlag hover:bg-gray-100 p-2 rounded-full font-semibold h-12 w-12" />
              </button>
            </div>
          </div>
          <VideoModal videoSrc={courseVideoSrc} />
        </div>
      )}
      {isEditBtnClicked && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="fixed top-0 w-[85%] mx-auto inset-0 overflow-auto bg-white"
            style={{ zIndex: 10000 }}
          >
            <EditLecture
              src={accordionData[editIndex].src}
              title={accordionData[editIndex].title}
              content={accordionData[editIndex].content}
              time={accordionData[editIndex].time}
              closeModal={handleEditModal}
              handleUpdateLesson={handleUpdateLesson}
            />
          </div>
        </div>
      )}

      {
        isDeleteModalOpen &&
        <ConfirmDeletion
          text="video"
          handleDelete={handleDelete}
          handleCancelDeletion={handleCancelDeletion}
        />
      }
    </>
  );
};

export default ContentSection;
