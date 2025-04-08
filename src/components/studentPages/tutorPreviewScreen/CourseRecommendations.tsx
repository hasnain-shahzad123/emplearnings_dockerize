import React from 'react'
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
export const courses = [
    {
      id: 1,
      price: 40,
      heading: "Figma Full Course: Tools & Interface",
      part: "Part I",
      reviews_Count: 105,
      total_lectures: 224,
      total_hours: "20.1 total hours",
      description: "Master Figma for UI/UX with practical projects. Learn about tools, shortcuts, and workflows to enhance your designs.",
      course_rating: 5,
      tutor: {
        name: "Muhammad Haseeb",
        categories: [
          { id: 1, name: "Life Coaching", subCategory: "Time Management" },
          { id: 2, name: "Life Coaching", subCategory: "Career Growth" }
        ],
        per_lesson_rate: "US 40$/lesson"
      },
      image_url: "https://via.placeholder.com/300x200"
    },
    {
        id: 2,
        price: 40,
        heading: "Figma Full Course: Tools & Interface",
        part: "Part I",
        reviews_Count: 105,
        total_lectures: 224,
        total_hours: "20.1 total hours",
        description: "Master Figma for UI/UX with practical projects. Learn about tools, shortcuts, and workflows to enhance your designs.",
        course_rating: 5,
        tutor: {
          name: "Muhammad Haseeb",
          categories: [
            { id: 1, name: "Life Coaching", subCategory: "Time Management" },
            { id: 2, name: "Life Coaching", subCategory: "Career Growth" }
          ],
          per_lesson_rate: "US 40$/lesson"
        },
        image_url: "https://via.placeholder.com/300x200"
      }
  ];
  
export const style = {
    color: "yellow"
}
const CourseRecommendations = () => {
  return (
    <div className='p-4'>
        <h1 className='font-semibold text-xl my-5'>Other Recommended Mentors for you</h1>
        <div className='flex flex-wrap justify-center gap-6'>
            {courses.map((course, index) => (
            <div key={index} className="bg-white rounded-xl custom-shadow max-w-80 p-4">
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
        </div>
  </div>
  )
}

export default CourseRecommendations
