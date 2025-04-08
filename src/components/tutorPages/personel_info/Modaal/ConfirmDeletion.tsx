import React, { useState } from "react";

interface ConfirmDeletionProps {
  text: string;
  handleDelete: () => Promise<void>; // Function to handle the delete action
  setShowModal: (value: boolean) => void; // Function to toggle modal visibility
}

const ConfirmDeletion = ({
  text,
  handleDelete,
  setShowModal,
}: ConfirmDeletionProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    try {
      await handleDelete();
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this {text}?</p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => {
              document.body.style.overflow = "auto";
              setShowModal(false);
            }}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteClick}
            className="px-4 py-2 bg-empoweredFlag text-white rounded-md"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletion;
