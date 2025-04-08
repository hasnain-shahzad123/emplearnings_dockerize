import React from "react";

interface ConfirmDeletionProps {
  text: string;
  handleDelete: () => void; // Function to handle the delete action
  handleCancelDeletion: () => void; // Function to toggle modal visibility
}

const ConfirmDeletion = ({
  text,
  handleDelete,
  handleCancelDeletion,
}: ConfirmDeletionProps) => {
  return (
    <div className="fixed inset-0 z-10 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white p-8 w-[50%] mx-auto rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this {text}?</p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => {
              document.body.style.overflow = "auto";
              handleCancelDeletion();
            }}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={()=>{
              document.body.style.overflow = "auto";
              handleDelete();
            }}
            className="px-4 py-2 bg-empoweredFlag text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletion;
