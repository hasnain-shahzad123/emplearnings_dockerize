"use client";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import Image from "next/image";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import ConfirmDeletion from "../Modaal/ConfirmDeletion";
import { desclaimer } from "@/assets";
import { useAlert } from "@/contexts/AlertContext";
import Spinner from "@/components/shared/spinner/Spinner";
import { useRef } from "react";
import getTutorExternalReviewsFromDB from "@/firebase/tutor/dashboard/externel_reviews/getExternalReviewsFromDB";
import addTutorExternalReviewsToDB from "@/firebase/tutor/dashboard/externel_reviews/addExternalReviewToDB";
import deleteTutorExternalReviewsFromDB from "@/firebase/tutor/dashboard/externel_reviews/deleteTutorExternalReviewFromDB";
import updateTutorExternalReviewFromDB from "@/firebase/tutor/dashboard/externel_reviews/updateTutorExternalReviewAtDB";

export type TutorExternalReviewsDataType = {
  external_platform: string;
  review_from: string;
  is_verified: boolean;
  review_link: string;
  review_content: string;
};

type params = {
  uid: string;
};

const ExternalReviews = ({ uid }: params) => {
  const { showAlert } = useAlert();
  const [reviews, setReviews] = useState<TutorExternalReviewsDataType[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showInputFields, setShowInputFields] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [newReview, setNewReview] = useState<TutorExternalReviewsDataType>({
    external_platform: "",
    review_from: "",
    is_verified: false,
    review_link: "",
    review_content: "",
  });
  const [isExternalExpEmpty, setIsExternalExpEmpty] = useState({
    external_platform: false,
    review_from: false,
    review_link: false,
    review_content: false,
  });

  useEffect(() => {
    const fetchExternalReviews = async () => {
      const response = await getTutorExternalReviewsFromDB({ uid });
      if (response.type === "success") {
        setReviews(
          (response.ExternalReviewsData as TutorExternalReviewsDataType[]) ||
            ([] as TutorExternalReviewsDataType[])
        );
        setIsLoadingReviews(false);
      } else {
        // console.error(response.message)
        showAlert("An error while fetching the review ", "ERROR");
        setIsLoadingReviews(false);
      }
    };
    fetchExternalReviews();
  }, [uid]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIsExternalExpEmpty({ ...isExternalExpEmpty, [name]: false });
    setNewReview({ ...newReview, [name]: value });
  };

  const handleDelete = async () => {
    if (deleteIndex !== null) {
      const response = await deleteTutorExternalReviewsFromDB({
        uid,
        deleteIndex,
        external_reviews: reviews,
      });
      if (response.type === "success") {
        setReviews(response.external_reviews as TutorExternalReviewsDataType[]);
      }
      setDeleteIndex(null);
    }
    setShowModal(false);
  };

  const handleAddReview = async () => {
    // const emptyExpCopy = {
    //   external_platform: newReview.external_platform === "",
    //   review_from: newReview.review_from === "",
    //   review_link: newReview.review_link === "",
    //   review_content: newReview.review_content === "",
    // }
    // if (Object.values(emptyExpCopy).includes(true)) {
    //   setIsExternalExpEmpty(emptyExpCopy);
    //   return;
    // }

    const response = await addTutorExternalReviewsToDB({
      uid,
      external_review: newReview,
    });
    if (response.type === "success") {
      setReviews([...reviews, newReview]);
    } else {
      console.error(response.message);
    }

    setNewReview({
      external_platform: "",
      review_from: "",
      is_verified: false,
      review_link: "",
      review_content: "",
    });
    setShowInputFields(false);
  };

  const handleEditReview = async () => {
    if (editingIndex !== null) {
      const response = await updateTutorExternalReviewFromDB({
        uid,
        updateIndex: editingIndex,
        newReview,
        external_reviews: reviews,
      });
      if (response.type === "success") {
        console.log("Updated Reviews: ", response);
        setReviews(response.external_reviews as TutorExternalReviewsDataType[]);
        setNewReview({
          external_platform: "",
          review_from: "",
          is_verified: false,
          review_link: "",
          review_content: "",
        });
      } else {
        console.error(response.message);
      }

      setEditingIndex(null);
      setShowInputFields(false);
    }
  };

  const handleEditButtonClick = (index: number) => {
    setEditingIndex(index);
    setNewReview(reviews[index]);
    setShowInputFields(true);
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  return (
    <div className="max-w-5xl custom-shadow rounded-xl px-0 sm:px-5 py-3 pb-7">
      <h1 className="md:text-xl font-semibold px-5 mb-7">External Reviews</h1>

      {/* List of Reviews */}
      {isLoadingReviews && <Spinner />}
      {!isLoadingReviews &&
        reviews.length !== 0 &&
        reviews?.map((review, index) => (
          <div
            key={index}
            className="border-[1px] p-5 flex flex-col my-10 border-[#4A148C] rounded-xl 
               sm:p-6 md:p-8"
          >
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xl sm:text-lg md:text-xl">
                From: {review.review_from}
              </h1>
              <div className="flex gap-3 sm:gap-4 md:gap-5">
                <button
                  className="p-2 sm:p-1 rounded-full hover:bg-purple-100"
                  onClick={() => handleEditButtonClick(index)}
                >
                  <FiEdit className="text-[#4A148C] h-6 w-6 sm:h-7 sm:w-7" />
                </button>
                <button
                  className="p-2 sm:p-1 rounded-full hover:bg-purple-100"
                  onClick={() => {
                    setShowModal(true);
                    setDeleteIndex(index);
                  }}
                >
                  <MdDelete className="text-[#4A148C] h-6 w-6 sm:h-7 sm:w-7" />
                </button>
              </div>
            </div>
            <div className="my-5">
              <h3 className="text-sm sm:text-lg md:text-xl">
                {review.external_platform} -{" "}
                <a
                  href={review.review_link}
                  className="text-[#4A148C] underline"
                >
                  {review.review_link}
                </a>
              </h3>
              <p className="mt-3 text-sm sm:text-base md:text-lg">
                {review.review_content}
              </p>
            </div>
          </div>
        ))}

      {!isLoadingReviews && reviews.length === 0 && (
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold text-empoweredFlag">
            No reviews added yet
          </h1>
        </div>
      )}

      {/* Add New Review Button */}
      {!showInputFields && (
        <div className="flex px-5 justify-end">
          <CustomButton
            text={"Add Review"}
            onclickEvent={() => {
              setShowInputFields(true);
              setTimeout(() => {
                inputRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }, 0);
            }}
            className="bg-[#4A148C] text-white px-8 text-sm my-7 md:mr-10 mt-5 py-3 rounded-3xl"
          />
        </div>
      )}

      {/* Input Fields for Adding or Editing a Review */}
      {showInputFields && (
        <>
          <div className="flex flex-col md:flex-row mx-5  justify-between items-center gap-10">
            <div className="flex-1 w-full relative">
              <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
                External Platform
              </label>
              <input
                type="text"
                ref={inputRef}
                name="external_platform"
                value={newReview.external_platform}
                onChange={handleInputChange}
                placeholder="Google"
                className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
              />
              {isExternalExpEmpty.external_platform && (
                <p className="text-red-500 text-md p-2">
                  Please enter the platform
                </p>
              )}
            </div>
            <div className="bg-[#EAEAF9] flex-1 items-start flex gap-3 px-4 py-2 rounded-xl border-[#4A148C] border-[2px]">
              <Image
                src={desclaimer.src || "/placeholder.svg"}
                alt="disclaimer"
                width={15}
                height={15}
              />
              <h1 className="text-xs">
                External reviews will strengthen your profile but require admin
                approval for publishing.
              </h1>
            </div>
          </div>
          <div className="flex flex-col mx-5 md:flex-row justify-between items-center gap-10 my-10">
            <div className="flex-1 w-full relative">
              <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
                From
              </label>
              <input
                type="text"
                name="review_from"
                value={newReview.review_from}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
              />
              {isExternalExpEmpty.review_from && (
                <p className="text-red-500 text-md p-2">
                  Please enter the source
                </p>
              )}
            </div>
            <div className="flex-1 w-full relative">
              <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
                External Link
              </label>
              <input
                type="text"
                name="review_link"
                value={newReview.review_link}
                onChange={handleInputChange}
                placeholder="https://google.com/review"
                className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
              />
              {isExternalExpEmpty.review_link && (
                <p className="text-red-500 text-md p-2">
                  Please enter the link
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col mx-5 md:flex-row justify-between items-center gap-10 my-10">
            <div className="flex-1 w-full relative">
              <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
                Review Content
              </label>
              <textarea
                name="review_content"
                rows={7}
                value={newReview.review_content}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
                placeholder="Write your review here"
              ></textarea>
              {isExternalExpEmpty.review_content && (
                <p className="text-red-500 text-md p-2">
                  Please enter the review content
                </p>
              )}
            </div>
            <div className="bg-[#EAEAF9] flex-1 items-start flex gap-3 px-4 py-2 rounded-xl border-[#4A148C] border-[2px]">
              <Image
                src={desclaimer.src || "/placeholder.svg"}
                alt="disclaimer"
                width={15}
                height={15}
              />
              <h1 className="text-xs">
                Pro and Premium tutors can display published reviews on their
                profiles.
              </h1>
            </div>
          </div>
          <div className="flex md:flex-row flex-col md:justify-end">
            <CustomButton
              text={"Cancel"}
              onclickEvent={() => {
                setNewReview({
                  external_platform: "",
                  review_from: "",
                  is_verified: false,
                  review_link: "",
                  review_content: "",
                });
                setShowInputFields(false);
              }}
              className="bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
            />
            <CustomButton
              text={editingIndex !== null ? "Save Changes" : "Save"}
              onclickEvent={
                editingIndex !== null ? handleEditReview : handleAddReview
              }
              className="bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
            />
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <ConfirmDeletion
          text="review"
          handleDelete={handleDelete}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default ExternalReviews;
