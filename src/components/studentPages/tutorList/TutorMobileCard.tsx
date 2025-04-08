import React from 'react'
import { TutorCardInterface } from './TutorCard'
import Image from 'next/image'
import { Crown, user_profile } from '@/assets'
import { FaStar } from 'react-icons/fa'
const style = {
    color: "yellow",
    display: "inline"
}
const TutorMobileCard = ({tutor} : TutorCardInterface) => {
  return (
    <div className="max-w-sm mx-auto rounded-xl my-5 custom-shadow bg-white p-5">
      <div className="flex items-center space-x-4">
        <Image className="w-24 h-24 rounded-full object-cover" src={user_profile} alt={tutor.name} />
        <div className='text-[11px]'>
            <div className="flex flex-row items-center justify-start gap-3">
                <div>
                    <h1 className='font-semibold text-xl text-[#4A148C]'>{tutor.name.split(' ')[0][0]}. {tutor.name.split(' ')[1]}</h1>
                </div>
                <div className={`${tutor.plan_type === "Premium" ? "block" : "hidden"}`}>
                    <Image src={Crown} alt='crown image' height={20} width={20} />
                </div>
            </div>
          <div className="flex items-center justify-between gap-4">
            <div className='flex flex-row items-center justify-start gap-3'>
                <div><FaStar style={style} /></div>
                <div className='mt-1'>
                <h1 className='font-semibold text-[#4A148C]'>{tutor.rating}</h1>
                </div>
            </div>
            <div>
                <h1 className="ml-1 font-semibold text-black">US$ {tutor.per_lesson_rate}</h1>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
                <h1 className="ml-1 font-semibold text-[#4A148C]">{tutor.number_of_reviews} reviews</h1>
            </div>
            <div>
                <h1 className="ml-1 text-[#4A148C]">50-min lesson</h1>
            </div>
          </div>
          <div>
            <h1 className='text-[#08A935]'>{tutor.experience_years} of teaching</h1>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-1 my-2'>
        {tutor.categories.map((teach,index) => {
            return (
                <div key={index} className='text-[10px] flex flex-row items-center justify-start gap-3'>
                    <div><h1 className='font-semibold text-[#7A7A7A]'>{teach.sup_category},</h1></div>
                    <div><h1 className='text-[#DD5D00]'>{teach.category_name}  </h1></div>
                </div>
            )
        })}
       </div>
       <div className="flex items-center text-[10px] justify-start gap-3">
           <div><h1 className='text-[#7A7A7A]'>{tutor.active_students} active students</h1></div>
           <div><h1 className='text-[#7A7A7A]'>{tutor.completed_lessons} Total Lessons</h1></div>
       </div>
       <div className='my-2'>
        <p className='text-[10px]'>{tutor.tagline}</p>
       </div>
       <div className="border-[#4A148C] border-2 rounded-xl relative mt-7">
            <p className='absolute text-[11px] -top-4 left-4 bg-white px-4 py-1'>Very experienced and kind tutor</p>
            <p className='text-[10px] italic px-5 py-3'>{tutor.about}</p>
        </div>
        <div className="max-w-56 mx-auto my-3">
            <div className="my-2 px-5 text-[10px] py-3 bg-white border-2 border-black rounded-full text-center">
                <button className='text-[#4A148C]'>Book Free 25-Minute Session</button>
            </div>
            <div className="px-5 py-3 text-[10px] bg-[#4A148C] rounded-full text-center">
                <button className='text-white'>Book Standard 50-Minute Session</button>
            </div>
        </div>
    </div>
  )
}

export default TutorMobileCard
