"use client";
import { useState } from "react";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import Image from "next/image";
import { tutor_profile, five_stars } from "@/assets";
import deleteCourse from "@/firebase/tutor/courses/writers/deleteCourse";
import Spinner from "@/components/shared/spinner/Spinner";
import { useRouter } from "next/navigation";

const ReviewsSection = ({ courseId }: { courseId: string }) => {
  const router = useRouter();
  const reviews = [
    {
      id: 1,
      name: "Hasnain Shahzad",
      date: "Dec 12, 2024",
      rating: 5,
      review:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam eum dolorem vel dolor iste est reprehenderit magnam nulla alias odit.",
      profileImage: tutor_profile.src,
    },
    {
      id: 2,
      name: "Ayesha Khan",
      date: "Dec 10, 2024",
      rating: 4.5,
      review:
        "Great course! I learned a lot and the instructor was very helpful.",
      profileImage: tutor_profile.src,
    },
    {
      id: 3,
      name: "",
      date: "Dec 11, 2024",
      rating: 4.8,
      review:
        "Haseeb is a highly experienced and expert tutor. Haseeb is a highly experienced and expert tutor.",
      profileImage: tutor_profile.src,
    },
    {
      id: 4,
      name: "Zain Ali",
      date: "Dec 9, 2024",
      rating: 4.7,
      review:
        "Very informative course with great insights and practical examples.",
      profileImage: tutor_profile.src,
    },
    {
      id: 5,
      name: "Ali Ahmed",
      date: "Dec 8, 2024",
      rating: 5,
      review:
        "This course changed my perspective and enhanced my skills greatly!",
      profileImage: tutor_profile.src,
    },
    {
      id: 6,
      name: "Sara Malik",
      date: "Dec 7, 2024",
      rating: 4.5,
      review:
        "Highly recommend this course to anyone looking to improve their skills.",
      profileImage: tutor_profile.src,
    },
  ];

  const [displayedReviews, setDisplayedReviews] = useState(reviews.slice(0, 4));
  const [isAllReviewsShown, setIsAllReviewsShown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleMoreReviews = () => {
    const nextReviews = reviews.slice(
      displayedReviews.length,
      displayedReviews.length + 4
    );
    setDisplayedReviews(nextReviews.length ? nextReviews : reviews.slice(0, 4));
  };

  const handleShowAllReviews = () => {
    setIsAllReviewsShown(true);
    setDisplayedReviews(reviews);
  };

  const handleDeleteCourse = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCourse({ courseId });
      if (result.type === "success") {
        console.log("Course deleted successfully");
      } else {
        console.error("Failed to delete course:", result.message);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      router.back();
    }
  };

  return (
    <div className="max-w-7xl w-[90%] mx-auto">
      <div className="text-center">
        <h1 className="font-semibold text-3xl text-empoweredFlag inline-block border-b-[4px] border-empoweredFlag">
          Reviews
        </h1>
      </div>
      <div className="flex md:flex-row flex-col text-center md:text-left my-10 items-center justify-between">
        <div>
          <h1 className="text-lg md:text-2xl text-empoweredFlag font-semibold">
            What students loved about this course
          </h1>
        </div>
        {!isAllReviewsShown && (
          <CustomButton
            text="More Reviews"
            onclickEvent={handleMoreReviews}
            className="bg-empoweredFlag md:mt-0 mt-5 rounded-full px-8 py-2 md:text-base text-sm font-semibold text-white"
          />
        )}
      </div>
      <div className="rounded-xl shadow-even-xl">
        <div className="flex flex-wrap py-10 justify-center gap-5">
          {displayedReviews.map((review) => (
            <div
              key={review.id}
              className="w-[90%] mx-auto mt-5 px-10 md:w-[45%]"
            >
              <div className="flex text-empoweredFlag items-center gap-3">
                <Image
                  src={review.profileImage}
                  alt={`${review.name} Profile`}
                  height={50}
                  width={50}
                  className="rounded-full h-12 w-12"
                />
                <h1 className="text-xl font-semibold">{review.name}</h1>
                <div className="flex items-center gap-1">
                  <Image
                    src={five_stars}
                    alt="Rating stars"
                    height={20}
                    width={80}
                    className="w-20 h-5"
                  />
                  <p className="font-semibold text-xl">{review.rating}</p>
                </div>
              </div>
              <p className="text-[#666666] mt-2">{review.date}</p>
              <p className="mt-3 text-center md:text-left">{review.review}</p>
            </div>
          ))}
        </div>
        {!isAllReviewsShown && (
          <div className="flex justify-center">
            <CustomButton
              text="Show All Reviews"
              onclickEvent={handleShowAllReviews}
              className="bg-empoweredFlag rounded-full px-8 py-2 text-white mx-auto mb-10"
            />
          </div>
        )}
      </div>
      <div className="my-[8%] flex justify-center">
        <CustomButton
          text="Delete this course"
          onclickEvent={() => setShowDeleteDialog(true)}
          className="bg-red-700 font-semibold rounded-full px-8 py-2 text-white"
          disabled={isDeleting}
        />
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-[90%] mx-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Are you sure?</h2>
              <p className="text-gray-600">
                This action cannot be undone. This will permanently delete the
                course and all associated data.
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Spinner size="xs" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete Course"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
