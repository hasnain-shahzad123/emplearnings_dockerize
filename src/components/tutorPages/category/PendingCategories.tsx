"use client";
import { pending } from '@/assets'
import { TutorCategoryType, TutorPendingCategoryType } from '@/types'
import Image from 'next/image'
import React from 'react'
import { useState, useEffect } from 'react';
import { useTutor } from '@/contexts/TutorContext';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';

type params = {
  pendingCategories: TutorPendingCategoryType[];
  handleEditFunction: (index: number) => void;
  onDeleteClicked: (index: number) => void;
}
const PendingCategories = ({ pendingCategories,handleEditFunction, onDeleteClicked }: params) => {


  return (
    <div className={`my-5 ${pendingCategories?.length === 0 ? 'hidden' : 'block'}`}>
      <div className="w-full bg-[#F1F1FF] px-6 py-5 mb-5">
        <div className='max-w-6xl mx-auto flex items-center gap-5'>
          <div className="font-semibold text-[24px] text-[#4A148C]">
            Pending
          </div>
          <div>
            <Image src={pending} alt="approved" />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <div>
          {pendingCategories?.map((category, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-sm transition-colors hover:bg-gray-50"
            >
              <div className="text-[#7A7A7A] text-[11px] sm:text-[16px]">{category.sup_category}</div>
              <div className="text-[#7A7A7A] text-[11px] sm:text-[16px]">{category.category_name}</div>
              <div className="text-[#7A7A7A] text-[11px] sm:text-[16px]">{category.sub_category_name}</div>
              <div className="text-[#7A7A7A] text-[16px] sm:text-[16px] flex gap-4">
                <div className='cursor-pointer' onClick={() => { handleEditFunction(index) }}>
                  <FiEdit />
                </div>
                <div className='cursor-pointer' onClick={() => { onDeleteClicked(index) }}>
                  <MdDelete />
                </div>
              </div>
            </div>

          ))}
        </div>
      </div>
    </div>
  )
}

export default PendingCategories