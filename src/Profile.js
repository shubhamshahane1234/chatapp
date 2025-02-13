import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import ReactDOM from "react-dom";
import Modal from "./Modal";
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  const {
    displayName,
    email,
    emailVerified,
    metadata: { lastSignInTime, creationTime },
    phoneNumber,
    photoURL,
  } = user;

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>

      <div className="flex items-center space-x-4 mb-4">
        <img
          src={photoURL || "https://via.placeholder.com/96"}
          alt="Profile"
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold">{displayName || "No Name"}</h2>
          <p className="text-gray-500">{email}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm">
          <strong>Email Verified:</strong> {emailVerified ? "Yes" : "No"}
        </p>
        <p className="text-sm">
          <strong>Phone Number:</strong> {phoneNumber || "Not Provided"}
        </p>
        <p className="text-sm">
          <strong>Last Sign-In Time:</strong>{" "}
          {new Date(lastSignInTime).toLocaleString()}
        </p>
        <p className="text-sm">
          <strong>Account Creation Time:</strong>{" "}
          {new Date(creationTime).toLocaleString()}
        </p>
      </div>

      <button
        data-modal-target="popup-modal"
        data-modal-toggle="popup-modal"
        class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setModal(true)}
      >
        Edit Profile
      </button>
      {false &&
        ReactDOM.createPortal(
          <Modal onClose={() => setModal(false)} />, // Close modal on clicking close
          document.getElementById("modal") // Ensure this div exists in your HTML
        )}
    </div>
  );
};

export default ProfilePage;
