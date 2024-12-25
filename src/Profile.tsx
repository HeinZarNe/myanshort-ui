import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/authStore";
import "react-toastify/dist/ReactToastify.css";
import { deleteAccount } from "./api";
import { notify } from "./Routes";
import { ConfirmModal } from "./ConfirmModal";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    notify("Logged out successfully!", "success");
    navigate("/");
  };

  const handleDelete = async () => {
    try {
      await deleteAccount();
      notify("Account deleted successfully!", "success");
      // Perform any additional actions after successful account deletion
      logout();
    } catch (error) {
      console.error("Error deleting account:", error);
      notify("Failed to delete account. Please try again.", "error");
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center  p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-lg font-semibold">
          Username: <span className="text-blue-500">{user.username}</span>
        </p>
        <p className="text-lg font-semibold">
          Email: <span className="text-blue-500">{user.email}</span>
        </p>
        <div className="flex flex-row items-center gap-2">
          <button
            onClick={openModal}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold"
          >
            Delete Account
          </button>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Logout
          </button>
        </div>
      </div>

      {showModal && (
        <ConfirmModal handleAction={handleDelete} closeModal={closeModal} />
      )}
    </div>
  );
}
