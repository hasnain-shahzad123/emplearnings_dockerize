import { ReviewsProp } from '@/types'
import React, { useState } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
interface ReviewsComponentProps {
    reviews: ReviewsProp[];
}

export const arrowStyles : React.CSSProperties = {
    position: 'absolute',
    zIndex: 100000,
    top: 'calc(50% - 15px)',
    width: 30,
    height: 30,
    fontSize: "22px",
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
};

export const CustomPrevArrow = ({ onClick }: { onClick: () => void }) => (
    <div onClick={onClick} style={{ ...arrowStyles, left: '0px' }}>
        &#10094;
    </div>
);

export const CustomNextArrow = ({ onClick }: { onClick: () => void }) => (
    <div onClick={onClick} style={{ ...arrowStyles, right: '0px' }}>
        &#10095;
    </div>
);

const Reviews = ({reviews} : ReviewsComponentProps) => {
    const [showReview, setShowReview] = useState(reviews.slice(0, 4))
    const [reviewStartIndex, setReviewStartIndex] = useState(4)
    const [showMoreDisplay, setShowMoreDisplay] = useState<boolean>(true)
    const [activeIndex, setActiveIndex] = useState(0);
    
    const handlePrev = () => {
        setActiveIndex((prevIndex) => prevIndex === 0 ? reviews.length - 1 : prevIndex - 1);
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) => prevIndex === reviews.length - 1 ? 0 : prevIndex + 1);
    };
    const handleShowMore = () => {
        setShowReview(reviews.slice(reviewStartIndex, reviewStartIndex+4))
        setReviewStartIndex(prev=> prev+4);
    }
    const handleShowAll = () => {
        setShowReview(reviews);
        setShowMoreDisplay(false)
    }
  return (
    <div className="my-3">
      <div className="sm:flex flex-row items-center justify-between font-semibold text-xl text-[#4A148C] hidden">
        <div className="my-5">
          <h1>What students loved about me</h1>
        </div>
        <div>
          <button
            disabled={showReview.length < 4 ? true : false}
            onClick={handleShowMore}
            className={` ${
              showMoreDisplay ? "block" : "hidden"
            } hover:bg-white hover:text-black transition-all duration-300 bg-empoweredFlag text-white hover:border-empoweredFlag hover:border-[2px] text-sm px-5 py-2 rounded-3xl`}
          >
            Show More
          </button>
        </div>
      </div>
      <div className="hidden sm:block custom-shadow px-8 py-6 rounded-xl">
        <div className="grid grid-cols-2 gap-5 ">
          {showReview.map((rev, index) => {
            return (
              <div
                key={index}
                className="flex flex-row items-start justify-center gap-3"
              >
                <div className="rounded-full flex-shrink-0 overflow-hidden mt-1">
                  <Image
                    src={rev.reviewerProfile}
                    alt="Reviewer Profile Picture"
                    height={50}
                    width={50}
                    className="h-10 w-10 object-cover"
                  />
                </div>
                <div>
                  <div className="flex flex-row justify-between items-center">
                    <div>
                      <h1 className="flex flex-row items-center justify-between font-semibold text-lg text-[#4A148C]">
                        {rev.reviewerName}
                      </h1>
                    </div>
                    <div className="flex text-2xl items-center">
                      {/* Render stars based on rating */}
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-yellow-500 ${
                            i < rev.reviewerRating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[#666666] my-2">
                    {rev.reviewDate}
                  </p>
                  <p className="text-sm text-black">{rev.review}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <button
            onClick={handleShowAll}
            className={`${
              showMoreDisplay ? "inline-block" : "hidden"
            } text-white bg-[#4A148C] hover:bg-white hover:text-black transition-all duration-300 hover:border-empoweredFlag hover:border-[2px] text-sm px-5 py-2 rounded-3xl`}
          >
            Show All Reviews
          </button>
        </div>
      </div>
      {/* <div className='mx-auto max-w-xl sm:hidden'>
        <Carousel showArrows={true} 
        renderArrowPrev={(onClickHandler, hasPrev, labelPrev) => 
            hasPrev && <CustomPrevArrow onClick={onClickHandler} />
        }
        renderArrowNext={(onClickHandler, hasNext, labelNext) => 
            hasNext && <CustomNextArrow onClick={onClickHandler} />
        }
        showThumbs={false} 
        showStatus={false} 
        infiniteLoop={true}>
                {reviews.map((rev, index) => (
                    <div key={index} className='flex flex-col items-start justify-start text-left px-10'>
                        <div className="flex flex-row items-start justify-center gap-3">
                            <div className='rounded-[100%] overflow-hidden mt-1'>
                                <Image src={rev.reviewerProfile} alt='Reviewr Profile Picture ' height={50} width={50} className='h-6 w-32 object-cover' />
                            </div>
                            <div>
                                <h1 className="font-semibold text-lg text-[#4A148C]">{rev.reviewerName}</h1>
                            </div>
                        </div>
                        <div>
                            <div>
                                {rev.reviewerRating}
                            </div>
                            <p className='text-sm text-[#666666] my-2' >{rev.reviewDate}</p>
                            <p className='text-sm text-black'>{rev.review}</p>
                        </div>
                    </div>
                ))}
        </Carousel>
      </div> */}
      <div
        id="controls-carousel"
        className="relative w-full sm:hidden"
        data-carousel="slide"
      >
        <div className="relative h-[100%] overflow-hidden rounded-lg">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className={`px-4 text-left duration-700 ease-in-out ${
                index === activeIndex ? "block" : "hidden"
              }`}
              data-carousel-item
            >
              <div className="flex flex-col items-start justify-start text-left px-10">
                <div className="flex flex-row items-start justify-center gap-3">
                  <div className="rounded-[100%] overflow-hidden mt-1">
                    <Image
                      src={rev.reviewerProfile}
                      alt="Reviewr Profile Picture "
                      height={50}
                      width={50}
                      className="h-6 w-6 object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="font-semibold text-lg text-[#4A148C]">
                      {rev.reviewerName}
                    </h1>
                  </div>
                </div>
                <div>
                  <div>{rev.reviewerRating}</div>
                  <p className="text-sm text-[#666666] my-2">
                    {rev.reviewDate}
                  </p>
                  <p className="text-sm text-black">{rev.review}</p>
                </div>
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
      </div>
    </div>
  );
}

export default Reviews
