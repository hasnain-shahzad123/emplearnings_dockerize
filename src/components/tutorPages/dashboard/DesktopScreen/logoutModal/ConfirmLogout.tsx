import React from "react";

interface ConfirmDeletionProps {
  handleLogout: () => void; // Function to handle the delete action
  setShowModal: (value: boolean) => void; // Function to toggle modal visibility
}

const ConfirmLogout = ({
  handleLogout,
  setShowModal,
}: ConfirmDeletionProps) => {
  return (
    <div className="fixed inset-0   bg-black bg-opacity-60 flex justify-center items-center"
    style={{zIndex: 1000}}
    >
      <div className="bg-white p-8 w-[40%] mx-auto max-w-[7xl] rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
        <p>Are you sure you want to logout ?</p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => {
              document.body.style.overflow = "auto";
              setShowModal(false);
            }}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-empoweredFlag text-white rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogout;
