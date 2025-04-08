import React from 'react';

const CoursesSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Add Course Button Skeleton */}
      <div className="flex justify-center md:justify-end py-6">
        <div className="animate-pulse bg-gray-200 h-10 w-40 rounded-full"></div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6">
        <div className="w-full md:w-[60%] relative">
          <div className="animate-pulse bg-gray-200 h-10 w-full rounded-md"></div>
        </div>
        <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
      </div>

      {/* Course Skeletons */}
      {[1, 2, 3].map((_, index) => (
        <div 
          key={index} 
          className="flex flex-col md:flex-row items-center md:justify-between gap-6 p-6 border-b animate-pulse"
        >
          {/* Course Details Skeleton */}
          <div className="w-full md:w-[60%]">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
              <div className="bg-gray-200 h-8 w-8 rounded-full"></div>
            </div>
            <div className="bg-gray-200 h-4 w-full mb-4 rounded"></div>
            <div className="bg-gray-200 h-4 w-1/2 mb-4 rounded"></div>
            <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
          </div>

          {/* Course Image Skeleton */}
          <div className="w-full md:w-[35%]">
            <div className="bg-gray-200 h-48 w-full rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursesSkeleton;
