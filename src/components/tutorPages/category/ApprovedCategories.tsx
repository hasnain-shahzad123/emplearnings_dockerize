"use client";
import { approved } from '@/assets'
import { useTutor } from '@/contexts/TutorContext'
import { TutorCategoryType } from '@/types'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'

const style = {
  color: "#4A148C", height: "20px",
  width: "20px"
}

type props = {
  approvedCategoriesOfTutor: TutorCategoryType[];
  handleEditFunction: (index: number) => void;
  onDeleteClicked: (index: number) => void;
}
const ApprovedCategories = ({ approvedCategoriesOfTutor, handleEditFunction,onDeleteClicked }: props) => {

  


  

  return (
    <div className='my-5'>
      <div className="w-full bg-[#F1F1FF] px-6 py-5 mb-5">
        <div className='max-w-6xl mx-auto flex items-center gap-5'>
          <div className="font-semibold text-[24px] text-[#4A148C]">
            Approved
          </div>
          <div>
            <Image src={approved} alt="approved" />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <div>
          {approvedCategoriesOfTutor?.map((category, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-sm transition-colors hover:bg-gray-50"
            >
              <div className="text-[#7A7A7A] text-[11px] sm:text-[16px]">{category.sup_category}</div>
              <div className="text-[#7A7A7A] text-[11px] sm:text-[16px]">{category.category_name}</div>
              <div className="text-[#7A7A7A] text-[11px] sm:text-[16px]">{category.sub_category_name}</div>
              <div className="text-[#7A7A7A] text-[16px] sm:text-[16px] flex gap-4">
                <button className='cursor-pointer text-2xl' onClick={() => { handleEditFunction(index) }} style={style}>
                  <FiEdit />
                </button>
                <button className='cursor-pointer text-2xl' onClick={() => { onDeleteClicked(index) }} style={style}>
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default ApprovedCategories
