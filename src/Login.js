import React, { useState } from "react";
import { database, loginWithGoogle } from "./firebase"; // Make sure loginWithGoogle is properly defined
import { ref, set, get } from "firebase/database"; // Import necessary Firebase methods

const LoginComponent = ({ checklogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Log in with Google
      const result = await loginWithGoogle();
      const loggedInUser = result.user;

      // Check if the user exists in the database
      const userRef = ref(database, `users/${loggedInUser.uid}`); // Reference to the user in the 'users' node
      const userSnapshot = await get(userRef); // Check if user exists in Firebase

      if (!userSnapshot.exists()) {
        // User does not exist, create their profile in the 'users' node
        const newUser = {
          uid: loggedInUser.uid,
          displayName: loggedInUser.displayName || loggedInUser.email, // Use displayName or email if displayName is not available
          email: loggedInUser.email,
          photoURL: loggedInUser.photoURL,
          online: true, // Track if the user is online
          lastOnline: Date.now(),
        };

        // Set new user data in Firebase
        await set(userRef, newUser);
      }

      // Pass the logged-in user data to the parent component (if needed)
      checklogin(loggedInUser); // Assuming this function updates the parent component's state
    } catch (error) {
      console.error("Login Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {/* Google Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {loading ? "Logging in..." : "Sign in with Google"}
        </button>

        {/* Or Separator */}
        {/* <div className="my-6 flex items-center justify-center">
          <span className="bg-white px-4 text-gray-500">or</span>
        </div> */}

        {/* Email & Password Inputs */}
        {/* <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        /> */}
        {/* <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        /> */}

        {/* Login Button */}
        {/* <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Login
        </button> */}

        {/* Sign-up Link */}
        {/* <div className="mt-6 text-center text-gray-500">
          Don't have an account?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default LoginComponent;
