import { ConfrimModalProps } from "./types";

export const ConfirmModal: React.FC<ConfrimModalProps> = ({
  closeModal,
  handleAction,
  message,
  cancelText,
  confirmText,
  cancelClassname,
  confirmClassname,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-4">
          {message ||
            "Are you sure you want to delete your account? Your Urls will be erased too. This action cannot be undone."}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={closeModal}
            className={`px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ${cancelClassname}`}
          >
            {cancelText || "Cancel"}
          </button>
          <button
            onClick={() => {
              handleAction();
              closeModal?.();
            }}
            className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold ${confirmClassname}`}
          >
            {confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};
