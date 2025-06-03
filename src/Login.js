import React, { useState } from "react";
import { database, signinWithGoogle } from "./firebase"; // Make sure loginWithGoogle is properly defined
import { ref, set, get } from "firebase/database"; // Import necessary Firebase methods
import { useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";
const LoginComponent = ({ checklogin }) => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  // google signup
  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      // Log in with Google
      const result = await signinWithGoogle();
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
    // window.location.href = "/";
    navigate("/");
  };
  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("✅ Password reset email sent!");
      // Show success message to user in UI
    } catch (error) {
      console.error("❌ Error sending password reset email:", error);
      // Handle errors, e.g., invalid email, user not found, etc.
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in:", userCredential.user);
      setError("");
      navigate("/");
      // redirect or show success message
    } catch (err) {
      console.error(err.message);
      //   setError(err.message);
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="font-serif text-center font-bold text-2xl bg-gradient-to-r from-blue-900 to-blue-200 text-transparent bg-clip-text">
          Talk-Trove
        </h1>
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login</h2>
          <form className="flex flex-col">
            <input
              type="email"
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center justify-between flex-wrap">
              <label
                htmlFor="remember-me"
                className="text-sm text-gray-900 cursor-pointer"
              >
                <input type="checkbox" id="remember-me" className="mr-2" />
                Remember me
              </label>
              <a
                onClick={() => {
                  forgotPassword(email);
                }}
                className="text-sm text-blue-500 hover:underline mb-0.5"
              >
                Forgot password?
              </a>
              <p className="text-gray-900 mt-4">
                {" "}
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-sm text-blue-500 -200 hover:underline mt-4"
                >
                  Signup
                </a>
              </p>
            </div>
            <button
              onClick={handleLogin}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginComponent;
