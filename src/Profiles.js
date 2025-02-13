import React, { useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "./firebase";

const Profiles = () => {
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const updateUserProfile = async () => {
    if (!displayName) {
      setErrorMessage("Display name cannot be empty.");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
        setSuccessMessage("Profile updated successfully!");
      }
    } catch (error) {
      setErrorMessage("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      <input
        type="text"
        placeholder="Enter new display name"
        className="border p-2 mb-2 w-full rounded"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />

      <button
        onClick={updateUserProfile}
        disabled={loading}
        className={`w-full p-2 rounded bg-blue-500 text-white ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {loading ? "Updating..." : "Save Changes"}
      </button>

      {successMessage && (
        <p className="text-green-500 mt-2">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default Profiles;
