import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true); // Loading state
  const [user, setUser] = useState(null); // User state
  //   const navigate = useNavigate();
  console.log(user, "usersssssss");
  // Track user authentication state and keep it persistent
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set the user state once authentication is resolved
      setLoading(false);
      console.log(user, "private");
      console.log(user, "usersssssss");
      console.log(user); // Set loading to false after auth state is checked
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array to ensure it runs only on mount

  // Show loading indicator while checking auth state
  if (loading) return <>...loading</>;
  // Render the children if authenticated, otherwise navigate to login
  console.log(user, "usersssssss");
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
