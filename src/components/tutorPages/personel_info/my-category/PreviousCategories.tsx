"use client"
import CustomButton from '@/components/shared/CustomButton/CustomButton'
import React, { useEffect } from 'react'
import MyCategoryParent from "./MyCategoryParent"
import { useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import Modal from 'react-modal';
import { TutorCategoryType, TutorPendingCategoryType } from '@/types'
import ConfirmDeletion from '../Modaal/ConfirmDeletion'
import { IoClose } from "react-icons/io5";
import addTutorCategoryPreAdminToDB from '@/firebase/tutor/dashboard/categories/addTutorCategoryPreAdminToDB'
import addTutorCategoryToDB from '@/firebase/tutor/dashboard/categories/addTutorCategoryToDB'
import { useAlert } from '@/contexts/AlertContext'
import { useTutor } from '@/contexts/TutorContext'
import updateTutorCategoryToDB from '@/firebase/tutor/dashboard/categories/updateTutorCategoryToDB'
import ApprovedCategories from '../../category/ApprovedCategories'
import PendingCategories from '../../category/PendingCategories'
import deleteTutorCategoryFromDB from '@/firebase/tutor/dashboard/categories/deleteTutorCategoryFromDB'
import deleteTutorCategoryFromDBPreAdmin from '@/firebase/tutor/dashboard/categories/deleteTutorCategoryPreAdmin'

interface params {
    tutor_uid: string
}


const style = {
    color: "#4A148C", height: "20px",
    width: "20px"
}

const customStyle = {
    content: {
        borderRadius: "12px",
        maxWidth: "64rem",
        margin: "0 auto"
    }
}

type DeleteObjectType = {
    object: TutorCategoryType;
    type: "approved" | "pending";
}
const PreviousCategories = ({ tutor_uid }: params) => {
    const { showAlert } = useAlert();
    const [existingCategories, setExistingCategories] = useState<TutorCategoryType[]>([]);
    const [pendingCategories, setPendingCategories] = useState<TutorPendingCategoryType[]>([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [editObject, setEditObject] = useState<TutorCategoryType>({ sup_category: '', category_name: '', sub_category_name: '' });
    const [deleteObject, setDeleteObject] = useState<DeleteObjectType>();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number>(0);
    const [isPremiumUser, setIsPremiumUser] = useState<boolean>(true);
    const [isCustomInput, setCustomInput] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const { tutor } = useTutor();

    useEffect(() => {
        // Add safety checks for tutor data
        if (tutor) {
            setExistingCategories(tutor.categories || []);
            setPendingCategories(tutor.pending_categories  as TutorPendingCategoryType[] || []);
        }
    }, [tutor?.categories, tutor?.pending_categories]);

    useEffect(()=>{
     console.log("Tutor In Console: ", tutor);
    },[tutor])

    const handleEditFunction = (index: number) => {
        setEditIndex(index);
        setEditObject(existingCategories[index]);
        setIsEdit(true);
        setIsOpen(true);
    }

    const saveEditFunctionApprovedCategories = async (editedObject: TutorCategoryType) => {
        const response = await updateTutorCategoryToDB({ tutor_uid: tutor_uid, new_category: editedObject, old_category: existingCategories[editIndex], categories_array: existingCategories });
        if (response.type === "error") {
            showAlert("ohh, we faced an error while updating your category, please try again after few mins", "ERROR");
            console.log("Error: ", response);
            return;
        }
        showAlert("Your Category is successfully updated.", "SUCCESS");
        setExistingCategories(response.categories_array as TutorCategoryType[]);
        setIsOpen(false);
        setEditObject({ sup_category: '', category_name: '', sub_category_name: '' });
        setIsEdit(false);
    }

    const saveToPreviousCategories = async (field: string, category: string, subCategory: string) => {
        const newCategory = {
            sup_category: field,
            category_name: category,
            sub_category_name: subCategory,
        }


        if (existingCategories?.length + pendingCategories?.length >= 3) {
            showAlert("You can only have 3 categories at max. (Approved + Pending)", "WARNING");
            return
        }
        else if (existingCategories?.some(cat => (cat.sup_category === newCategory.sup_category && cat.category_name === newCategory.category_name && cat.sub_category_name === newCategory.sub_category_name))) {
            showAlert("Such Category already exists.", "WARNING");
            return;
        }
        else if (pendingCategories?.some(cat => (cat.sup_category === newCategory.sup_category && cat.category_name === newCategory.category_name && cat.sub_category_name === newCategory.sub_category_name))) {
            showAlert("Such Category already exists in Pending", "WARNING");
            return;
        }
        if (existingCategories?.some(cat => (cat.sup_category === newCategory.sup_category && newCategory.sup_category === "Skill Development"))) {
            showAlert("You can only have one category under Skill Development", "WARNING");
            return;
        }



        if (isCustomInput === true) {
            const response = await addTutorCategoryPreAdminToDB({ tutor_uid: tutor_uid, new_category: newCategory });
            if (response.type === "error") {
                console.log("Error while adding the category: ", response.message);
                showAlert("ohh, we faced an unexpected error while adding the category, please try again after few mins.", "ERROR");
                return;
            }

            showAlert("Successfully added new category.", "SUCCESS");


            setPendingCategories((prev) =>
                response.category ? [...(Array.isArray(prev) ? prev : []), response.category] : (Array.isArray(prev) ? prev : [])
            );


        }
        else {

            const response = await addTutorCategoryToDB({ tutor_uid: tutor_uid, new_category: newCategory });
            if (response.type === "error") {
                showAlert("ohh, we faced an unexpected error while adding the category, please try again after few mins.", "ERROR");
                return;
            }
            showAlert("Successfully added new category.", "SUCCESS");
            setExistingCategories((prev) => {
                return Array.isArray(prev) ? [...prev, newCategory] : [newCategory];
            });


        }

        setIsOpen(false);
    }
    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const onDeleteClickedApprovedCategory = (index: number) => {
        setDeleteObject({ object: existingCategories[index], type: "approved" });
        setDeleteModal(true);
    }


    const handleOnDeleteClickedApprovedCategories = async () => {
        setDeleteModal(false);

        if (existingCategories.length === 1) {
            showAlert("You must be enrolled in at least one category", "WARNING");
            return;
        } else {
            const response = await deleteTutorCategoryFromDB({ tutor_uid: tutor_uid, new_category: deleteObject?.object as TutorCategoryType });
            if (response.type === "error") {
                console.log("Error while deleting the category: ", response.message);
                showAlert("ohh, we faced an unexpected error while removing the category, please try again after few mins.", "ERROR");
                return;
            }
            showAlert("Category deleted successfully", "SUCCESS");
            setExistingCategories(existingCategories.filter(cat => (cat.sup_category != deleteObject?.object.sup_category || cat.category_name != deleteObject?.object.category_name || cat.sub_category_name != deleteObject?.object.sub_category_name)));
        }
    }

    const onDeleteClickedPendingCategory = (index: number) => {
        setDeleteObject({ object: pendingCategories[index], type: "pending" });
        setDeleteModal(true);
    }

    const handleOnDeleteClickedPendingCategories = async () => {
        setDeleteModal(false);
        const response = await deleteTutorCategoryFromDBPreAdmin({ tutor_uid: tutor_uid, new_category: deleteObject?.object as TutorPendingCategoryType });
        if (response.type === "error") {
            console.log("Error while deleting the category: ", response.message);
            showAlert("ohh, we faced an unexpected error while removing the category, please try again after few mins.", "ERROR");
            return;
        }
        showAlert("Category deleted successfully.", "SUCCESS");
        setPendingCategories(pendingCategories.filter(cat => (cat.sup_category != deleteObject?.object.sup_category || cat.category_name != deleteObject?.object.category_name || cat.sub_category_name != deleteObject?.object.sub_category_name)));

    }


    return (
        <div>
            <h1 className='text-lg sm:text-2xl font-semibold my-5'>You will be displayed under Categories  </h1>
            <div className={`${isPremiumUser ? "flex" : "hidden"} justify-end my-5`}>
                <CustomButton text='Add new Category' onclickEvent={openModal} className='bg-[#4A148C] px-6 py-3 sm:px-7 sm:py-3 rounded-full text-white text-xs sm:text-sm md:text-md' />
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                style={customStyle}
                appElement={document.getElementById('root') as HTMLElement}
            >
                <div className='flex justify-end items-end mr-5'>
                    <button className=' text-[35px]' onClick={() => setIsOpen(false)} ><IoClose /></button>
                </div>
                <MyCategoryParent saveEditedData={saveEditFunctionApprovedCategories} editObject={editObject as TutorCategoryType} isEdit={isEdit} saveCatData={saveToPreviousCategories} isCustomInput={isCustomInput} setCustomInput={setCustomInput} />
            </Modal>
            <ApprovedCategories approvedCategoriesOfTutor={existingCategories} handleEditFunction={handleEditFunction} onDeleteClicked={onDeleteClickedApprovedCategory} />
            <PendingCategories pendingCategories={pendingCategories} onDeleteClicked={onDeleteClickedPendingCategory} handleEditFunction={handleEditFunction} />
            {deleteModal && <ConfirmDeletion text='Are you sure you want to delete this Category?' handleDelete={deleteObject?.type === "approved" ? handleOnDeleteClickedApprovedCategories : handleOnDeleteClickedPendingCategories} setShowModal={setDeleteModal} />}

        </div>

    )
}

export default PreviousCategories