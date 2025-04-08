import { ExternalReviewsProp, TutorExternalReviewsDataType } from "@/types";
import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
interface ExternalReviewsComponentProps {
  reviews: TutorExternalReviewsDataType[];
}
const arrowStyles: React.CSSProperties = {
  position: "absolute",
  zIndex: 100000,
  top: "calc(50% - 15px)",
  width: 30,
  height: 30,
  fontSize: "22px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
};

const CustomPrevArrow = ({ onClick }: { onClick: () => void }) => (
  <div onClick={onClick} style={{ ...arrowStyles, left: "0px" }}>
    &#10094;
  </div>
);

const CustomNextArrow = ({ onClick }: { onClick: () => void }) => (
  <div onClick={onClick} style={{ ...arrowStyles, right: "0px" }}>
    &#10095;
  </div>
);
const ExternalReviewsModel = ({ reviews }: ExternalReviewsComponentProps) => {
  const [showReview, setShowReview] = useState(reviews.slice(0, 4));
  const [reviewStartIndex, setReviewStartIndex] = useState(4);
  const [showMoreDisplay, setShowMoreDisplay] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleShowMore = () => {
    setShowReview(reviews.slice(reviewStartIndex, reviewStartIndex + 4));
    setReviewStartIndex((prev) => prev + 4);
  };
  const handleShowAll = () => {
    setShowReview(reviews);
    setShowMoreDisplay(false);
  };
  return (
    <div className="my-3">
      <div className="sm:flex flex-row items-center justify-between font-semibold text-xl text-[#4A148C] hidden">
        <div className="my-5">
          <h1>Check the Reviews from other Platforms</h1>
        </div>
        {reviews.length > 4 && (
          <div>
            <button
              disabled={showReview.length < 4}
              onClick={handleShowMore}
              className={`${
                showMoreDisplay ? "block" : "hidden"
              } text-sm px-5 py-2 rounded-3xl text-white bg-[#4A148C]`}
            >
              Show More
            </button>
          </div>
        )}
      </div>
      <div className="hidden sm:block custom-shadow px-8 py-6 rounded-xl">
        {reviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {showReview.map((rev, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-row justify-between items-center mb-4">
                    <h1 className="font-semibold text-lg text-[#4A148C]">
                      {rev.review_from}
                    </h1>
                    <div className="text-yellow-500 text-sm flex items-center">
                      <span className="font-bold text-lg">5</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 ml-1"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex flex-row items-center justify-between mb-4">
                    <h1 className="font-semibold text-md text-gray-700">
                      {rev.external_platform}
                    </h1>
                    <a
                      href={rev.review_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#4A148C] underline hover:text-[#6A1B9A]"
                    >
                      View Review
                    </a>
                  </div>
                  <p className="text-sm text-gray-800">{rev.review_content}</p>
                </div>
              ))}
            </div>
            {reviews.length > 4 && (
              <div className="text-center mt-10">
                <CustomButton
                  onclickEvent={handleShowAll}
                  className={`${
                    showMoreDisplay ? "inline-block" : "hidden"
                  } text-white bg-[#4A148C] text-sm px-5 py-2 rounded-3xl`}
                  text="Show All Reviews"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">
              This tutor hasn't received any external reviews yet.
            </p>
          </div>
        )}
      </div>

      {/* Mobile view */}
      <div
        id="controls-carousel"
        className="relative w-full sm:hidden"
        data-carousel="slide"
      >
        {reviews.length > 0 ? (
          <>
            <div className="relative h-[100%] overflow-hidden rounded-lg">
              {reviews.map((rev, index) => (
                <div
                  key={index}
                  className={`px-10 text-left duration-700 ease-in-out ${
                    index === activeIndex ? "block" : "hidden"
                  }`}
                  data-carousel-item
                >
                  <div>
                    <div className="flex flex-row justify-between items-center">
                      <div>
                        <h1 className="flex flex-row items-center justify-between font-semibold text-lg text-[#4A148C]">
                          {rev.review_from}
                        </h1>
                      </div>
                      <div>{"5"}</div>
                    </div>
                    <p className="text-sm text-[#666666] my-2">
                      {"review date"}
                    </p>
                    <div className="flex flex-row items-center justify-between mb-2">
                      <div>
                        <h1 className="font-semibold text-lg">
                          {rev.external_platform}
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-[#4A148C]">Check it out now!</h1>
                      </div>
                    </div>
                    <p className="text-sm text-black">{rev.review_content}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none text-lg text-[#4A148C]"
              onClick={handlePrev}
              data-carousel-prev
            >
              &#10094;
            </button>
            <button
              type="button"
              className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none text-lg text-[#4A148C]"
              onClick={handleNext}
              data-carousel-next
            >
              &#10095;
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">
              This tutor hasn't received any external reviews yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExternalReviewsModel;
