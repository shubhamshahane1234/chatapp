import logo from "./logo.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ChatApp from "./ChatComponent";
import LoginComponent from "./Login";
import { logout } from "./firebase";
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  const [login, setLogin] = useState(null);
  // Handle Log-Out
  const handleLogout = () => {
    logout()
      .then(() => {
        checklogin(null);
        // setUser(null);
        // setUsername("");
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };

  const checklogin = (data) => {
    setLogin(data);
  };

  // Track user authentication state and keep it persistent
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      console.log(login);
      if (user) {
        checklogin(user);
        // setUsername(user.displayName || user.email);
        // Set the username based on user data
      } else {
        checklogin(null);
        // setUsername("");
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      {" "}
      {/* <div className="">
        {console.log(auth)}
        {auth.currentUser != null && (
          <>
            <ChatApp
              name={auth.currentUser.displayName}
              photoURL={auth.currentUser.photoURL}
            />
          </>
        )}
        {auth.currentUser === null && (
          <LoginComponent checklogin={checklogin} />
        )}
      </div> */}
      {/* // new */}
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<LoginComponent checklogin={checklogin} />}
          />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <ChatApp
                  name={auth.currentUser?.displayName}
                  photoURL={auth.currentUser?.photoURL}
                />
              </PrivateRoute>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
