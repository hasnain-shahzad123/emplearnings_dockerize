import React from 'react'
import Image from 'next/image'
import { Crown, user_profile } from '@/assets'
import { TutorCardType } from '@/types';
import { FaStar } from 'react-icons/fa';
import { fontSize } from 'fluid-tailwind';
export interface TutorCardInterface {
    tutor: TutorCardType
}
const style = {
    color: "yellow",
    fontSize: '10px'
}
const TutorCard = ({tutor} : TutorCardInterface) => {

    const tutorInfoObject = tutor;

  return (
    <div className='custom-shadow rounded-xl px-8 py-6 max-w-5xl mb-10'>
        <div className='flex flex-row items-start justify-center gap-5 mb-4'>
            <div className=' mt-1'>
                <div className='rounded-full overflow-hidden'>
                    <Image src={user_profile} alt='User Profile Photo' height={300} width={300} className='md:h-28 md:w-56 w-28 h-[3rem] object-cover' />
                </div>
                <p className='mt-1 inline mr-2 -ml-3'>{Array.from({ length: Math.floor(tutorInfoObject.rating) }, (_, i) => (
                    <span className='inline-block' key={i}><FaStar style={style} /></span>
                ))}</p>
                <p className="inline text-[#4A148C] text-[9px]">{tutorInfoObject.rating}  ({tutorInfoObject.number_of_reviews} Reviews)</p>
            </div>
            <div>
                <div className="flex flex-row items-center justify-start gap-7">
                    <div>
                    <h1 className='font-semibold text-xl text-[#4A148C]'>{tutorInfoObject.name}</h1>
                    </div>
                    <div className={`${tutorInfoObject.plan_type === "Premium" ? "block" : "hidden"}`}>
                        <Image src={Crown} alt='crown image' height={20} width={20} />
                    </div>
                    <div>
                        <h1 className="text-[#08A935]">{tutorInfoObject.experience_years} years of teaching</h1>
                    </div>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {tutorInfoObject.categories.map((teach,index) => {
                        return (
                            <div key={index}>
                                <h1 className='font-semibold text-[#7A7A7A] text-sm'>{teach.sup_category}</h1>
                                <h1 className='text-[#4A148C] text-sm'>{teach.category_name} <span className='text-black'>{teach.sub_category}</span> </h1>
                            </div>
                        )
                    })}
                </div>
                <div className="flex items-center justify-start gap-4">
                    <div><h1 className='text-[#7A7A7A]'>{tutorInfoObject.active_students} active students</h1></div>
                    <div><h1 className='text-[#7A7A7A]'>{tutorInfoObject.completed_lessons} Total Lessons</h1></div>
                </div>
                {/* <h1 className='my-2 font-semibold text-lg text-[#4A148C]'>{tutorInfoObject.Level}</h1> */}
                <p className='text-sm text-[#666666]'>{tutorInfoObject.tagline}</p>
            </div>
            <div className="w-[50%]">
                <h1 className='font-semibold text-lg mb-7'>US$ {tutorInfoObject.per_lesson_rate}<span className='text-[#4A148C] ml-2'>50-min lesson</span></h1>
                <div className="px-5 py-3 text-[10px] bg-[#4A148C] rounded-xl text-center">
                    <button className='text-white'>Book 50 - min lesson</button>
                </div>
                <div className="my-2 px-5 text-[10px] py-3 bg-white border-2 border-black rounded-xl text-center">
                    <button className='text-black'>Book 25 - min free trial lesson</button>
                </div>
            </div>
        </div>
        <div className="border-[#4A148C] border-2 rounded-xl relative mt-7">
            <p className='absolute -top-6 left-10 bg-white px-4 py-1'>Brilliant Mentor</p>
            <p className='text-[12px] italic px-5 py-3'>{tutorInfoObject.about}</p>
        </div>
    </div>
  )
}

export default TutorCard
