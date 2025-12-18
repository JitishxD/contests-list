import React from "react";

const DonationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Donation"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-lg font-semibold text-gray-800">
            Enjoyed the extension? <br />
            <span className="text-sm font-normal">
              Buy me a coffee to show your support!
            </span>
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <img src="/icons/close.svg" alt="Close" className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 flex justify-center">
          <img
            src="/upi_donation.png"
            alt="Donate via UPI"
            className="max-w-full h-auto"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/img/logo-128.png";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
