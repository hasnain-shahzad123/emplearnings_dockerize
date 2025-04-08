import Image from 'next/image'
import { useState } from 'react';
import { FaStar } from 'react-icons/fa'
import { courses, style } from './CourseRecommendations'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel'
import { CustomPrevArrow, CustomNextArrow } from './Reviews';

const CourseRecommendationsMobile = () => {
    const [activeIndex, setActiveIndex] = useState(0);
        
    const handlePrev = () => {
        setActiveIndex((prevIndex) => prevIndex === 0 ? courses.length - 1 : prevIndex - 1);
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) => prevIndex === courses.length - 1 ? 0 : prevIndex + 1);
    };
  return (
    <div className='p-4'>
        <h1 className='font-semibold text-xl my-5'>Other Recommended Mentors for you</h1>
        {/* <Carousel
            renderArrowPrev={(onClickHandler, hasPrev, labelPrev) => 
                hasPrev && <CustomPrevArrow onClick={onClickHandler} />
            }
            renderArrowNext={(onClickHandler, hasNext, labelNext) => 
                hasNext && <CustomNextArrow onClick={onClickHandler} />
            }
            showThumbs={false} 
            showStatus={false} 
            infiniteLoop={true}>
            {courses.map((course, index) => (
                <div key={index} className="bg-white rounded-xl custom-shadow max-w-sm mx-auto text-left p-4">
                    <div className="flex items-center mb-4 space-x-2">
                    <Image src={course.image_url} alt="Figma Logo" width={300} height={200} className='rounded-xl' />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <h3 className="text-[14px] font-bold text-purple-700 mb-1">{course.tutor.name}</h3> 
                        </div>
                        <div>
                            <div className="flex items-center">
                                <FaStar style={style} />
                                <div className="text-gray-500 text-[10px] ml-1">({course.reviews_Count} reviews)</div>
                            </div>
                        </div>
                    </div>
                    {course.tutor.categories.map((cat, i) => (
                    <div key={i} className="text-xs text-gray-500">{`${cat.name}: ${cat.subCategory}`}</div>
                    ))}
                    <p className="text-xs text-gray-500 my-2">{course.description}</p>
                    <div className="flex justify-end my-2">
                    <div className="text-purple-600 font-bold">{course.tutor.per_lesson_rate}</div>
                    </div>
                </div>
            ))}
        </Carousel> */}
        <div id="controls-carousel" className="relative w-full sm:hidden" data-carousel="slide">
            <div className="relative h-[100%] overflow-hidden rounded-lg">
            {courses.map((course, index) => (
                <div key={index} className={`px-4 duration-700 ease-in-out ${index === activeIndex ? 'block' : 'hidden'}`} data-carousel-item>        
                    <div className="bg-white rounded-xl custom-shadow max-w-sm mx-auto p-4">
                        <div className="flex justify-center items-center mb-4 space-x-2">
                            <Image src={course.image_url} alt="Figma Logo" width={300} height={200} className='rounded-xl' />
                        </div>
                        <div className='text-left'>
                            <div className="flex flex-row items-center justify-between">
                                <div>
                                    <h3 className="text-[14px] font-bold text-purple-700 mb-1">{course.tutor.name}</h3> 
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        <FaStar style={style} />
                                        <div className="text-gray-500 text-[10px] ml-1">({course.reviews_Count} reviews)</div>
                                    </div>
                                </div>
                            </div>
                            {course.tutor.categories.map((cat, i) => (
                            <div key={i} className="text-xs text-gray-500">{`${cat.name}: ${cat.subCategory}`}</div>
                            ))}
                            <p className="text-xs text-gray-500 my-2">{course.description}</p>
                            <div className="flex justify-end my-2">
                                <div className="text-purple-600 font-bold">{course.tutor.per_lesson_rate}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            </div>
            <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full pr-4 cursor-pointer group focus:outline-none text-lg text-[#4A148C]" onClick={handlePrev} data-carousel-prev>
                &#10094;
            </button>
            <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full pl-4 cursor-pointer group focus:outline-none text-lg text-[#4A148C]" onClick={handleNext} data-carousel-next>
                &#10095;
            </button>
        </div>
  </div>
  )
}

export default CourseRecommendationsMobile
