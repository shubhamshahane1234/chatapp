// import React, { useState, useEffect } from "react";
// import { database, auth } from "./firebase";
// import { ref, push, onValue } from "firebase/database";
// import Profiles from "./Profiles";
// import ProfilePage from "./Profile";

// const ChatComponent = ({ name, photoURL }) => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   // const [username, setUsername] = useState("");

//   // Send message to Firebase
//   const sendMessage = () => {
//     if (message) {
//       const messagesRef = ref(database, "messages"); // Reference 'messages' node
//       const newMessage = {
//         uid: auth.currentUser.uid,
//         username: name,
//         text: message,
//         timestamp: Date.now(),
//         photoURL: auth.currentUser.photoURL,
//       };
//       push(messagesRef, newMessage); // Push new message to Firebase
//       setMessage(""); // Clear the input field after sending
//     }
//   };

//   // Listen for real-time message updates
//   useEffect(() => {
//     const messagesRef = ref(database, "messages"); // Reference 'messages' node

//     // Fetch messages from Firebase Realtime Database in real-time
//     onValue(messagesRef, (snapshot) => {
//       const data = snapshot.val();
//       const loadedMessages = [];
//       for (let id in data) {
//         loadedMessages.push(data[id]);
//       }
//       loadedMessages.sort((a, b) => a.timestamp - b.timestamp); // Sort messages by timestamp
//       setMessages(loadedMessages); // Update the messages state with the new messages
//     });
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold underline mb-5">CHAT ROOM</h1>
//       <h1 className="text-2xl  mb-5">Welcome {name}!</h1>
//       <div className="flex justify-stretch">
//         <ProfilePage />
//         <div className="w-[400px] h-[500px]  bg-white p-4 shadow-lg rounded-lg flex flex-col gap-2 justify-between ">
//           <div className="flex flex-col gap-2 mb-4  overflow-y-scroll ">
//             {messages.map((msg, index) => (
//               <div key={index} className="text-left flex">
//                 <img
//                   class="w-8 h-8 p-1 rounded-full "
//                   src={
//                     // msg.uid === auth.currentUser.uid
//                     msg.photoURL
//                   }
//                   // : "https://via.placeholder.com/96"
//                   // Display correct avatar based on uid
//                   alt="Profile"
//                 />
//                 <span className="block bg-[#94e6ef] text-gray-800 text-sm p-2 rounded-lg shadow-sm break-words ml-1">
//                   <strong>{msg.username}:</strong> {msg.text}
//                 </span>
//               </div>
//             ))}

//             {/* {messages.map((msg, index) => (
//               <div key={index} className="text-left flex">
//                 <img
//                   className="w-8 h-8 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
//                   src={
//                     msg.uid === auth.currentUser.uid
//                       ? photoURL
//                       : "https://via.placeholder.com/96"
//                   } // Display correct avatar based on uid
//                   alt="Profile"
//                 />
//                 <span className="block bg-[#94e6ef] text-gray-800 text-sm p-2 rounded-lg shadow-sm break-words ml-1">
//                   <strong>{msg.username}:</strong> {msg.text}
//                 </span>
//               </div>
//             ))} */}
//           </div>

//           <div className="sticky bottom-0 left-0 w-full flex space-x-2 h-10">
//             {/* <input
//             type="text"
//             placeholder="Username"
//             className="w-1/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             onChange={(e) => setUsername(e.target.value)}
//             value={username}
//           /> */}
//             <input
//               type="text"
//               placeholder="Type your message..."
//               className="w-3/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               onChange={(e) => setMessage(e.target.value)}
//               value={message}
//             />
//             <button
//               onClick={sendMessage}
//               className="w-40 h-10 bg-white cursor-pointer rounded-3xl border-2 border-[#565656] shadow-[inset_0px_-2px_0px_1px_#565656] group hover:bg-[#565656] transition duration-300 ease-in-out"
//             >
//               <span class="font-medium text-[#333] group-hover:text-white">
//                 send
//               </span>
//             </button>
//           </div>
//         </div>
//         {/* <Profiles /> */}
//       </div>
//     </div>
//   );
// };

// export default ChatComponent;

// import React, { useState, useEffect } from "react";
// import { database, auth } from "./firebase";
// import { ref, push, onValue } from "firebase/database";
// import Profiles from "./Profiles";
// import ProfilePage from "./Profile";

// const ChatComponent = ({ name, photoURL }) => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   // const [username, setUsername] = useState("");

//   // Send message to Firebase
//   const sendMessage = () => {
//     if (message) {
//       const messagesRef = ref(database, "messages"); // Reference 'messages' node
//       const newMessage = {
//         uid: auth.currentUser.uid,
//         username: name,
//         text: message,
//         timestamp: Date.now(),
//         photoURL: auth.currentUser.photoURL,
//       };
//       push(messagesRef, newMessage); // Push new message to Firebase
//       setMessage(""); // Clear the input field after sending
//     }
//   };

//   // Listen for real-time message updates
//   useEffect(() => {
//     const messagesRef = ref(database, "messages"); // Reference 'messages' node

//     // Fetch messages from Firebase Realtime Database in real-time
//     onValue(messagesRef, (snapshot) => {
//       const data = snapshot.val();
//       const loadedMessages = [];
//       for (let id in data) {
//         loadedMessages.push(data[id]);
//       }
//       loadedMessages.sort((a, b) => a.timestamp - b.timestamp); // Sort messages by timestamp
//       setMessages(loadedMessages); // Update the messages state with the new messages
//     });
//   }, []);

//   return (
//     <>
//       <div style={{ display: "flex" }}>
//         <div class="bg-[#211636] shadow-lg h-screen  min-w-[270px] py-6 px-4 font-[sans-serif] flex flex-col overflow-auto">
//           <div class="flex flex-wrap items-center cursor-pointer">
//             <div class="relative">
//               <img
//                 src={auth.currentUser.photoURL}
//                 class="w-12 h-12 p-1 rounded-full border-2 border-gray-300"
//               />
//               <span class="h-3 w-3 rounded-full bg-green-600 block absolute bottom-1 right-0"></span>
//             </div>

//             <div class="ml-6">
//               <p class="text-xs text-gray-300">Hello</p>
//               <h6 class="text-base text-white">
//                 {auth.currentUser.displayName}
//               </h6>
//             </div>
//           </div>

//           <hr class="border-gray-500 mt-8" />

//           <div class="my-8 flex-1">
//             <h6 class="text-sm text-white inline-block">Teams</h6>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="#fff"
//               class="w-[15px] h-[15px] float-right cursor-pointer ml-auto"
//               viewBox="0 0 118.783 118.783"
//             >
//               <path
//                 d="M115.97 101.597 88.661 74.286a47.75 47.75 0 0 0 7.333-25.488c0-26.509-21.49-47.996-47.998-47.996S0 22.289 0 48.798c0 26.51 21.487 47.995 47.996 47.995a47.776 47.776 0 0 0 27.414-8.605l26.984 26.986a9.574 9.574 0 0 0 6.788 2.806 9.58 9.58 0 0 0 6.791-2.806 9.602 9.602 0 0 0-.003-13.577zM47.996 81.243c-17.917 0-32.443-14.525-32.443-32.443s14.526-32.444 32.443-32.444c17.918 0 32.443 14.526 32.443 32.444S65.914 81.243 47.996 81.243z"
//                 data-original="#000000"
//               ></path>
//             </svg>

//             <ul class="mt-6 space-y-6">
//               <li class="flex items-center text-sm text-gray-300 hover:text-white cursor-pointer">
//                 <span class="relative inline-block mr-4">
//                   <img
//                     src="https://readymadeui.com/profile_3.webp"
//                     class="w-10 h-10 p-1 rounded-full border-2 border-gray-300"
//                   />
//                   <span class="h-3 w-3 rounded-full bg-green-600 block absolute bottom-1 right-0"></span>
//                 </span>
//                 Peter Taylor
//                 <span class="bg-red-500 min-w-[20px] min-h-[20px] px-1 flex items-center justify-center text-white text-[11px] font-bold rounded-full ml-auto">
//                   1
//                 </span>
//               </li>
//             </ul>
//           </div>
//         </div>
//         <div className="flex flex-col h-screen w-[100%]">
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {messages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`flex ${
//                   msg.uid === auth.currentUser.uid
//                     ? "justify-end"
//                     : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`max-w-xs px-4 py-2 rounded-lg ${
//                     msg.uid === auth.currentUser.uid
//                       ? "bg-indigo-500 text-white"
//                       : "bg-gray-200 text-gray-800"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="border-t p-4 flex space-x-2">
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//             <button
//               type="submit"
//               className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
//               onClick={sendMessage}
//             >
//               Send
//             </button>
//           </div>
//         </div>

//         {/* <Profiles /> */}
//       </div>
//     </>
//   );
// };

// export default ChatComponent;

import React, { useState, useEffect } from "react";
import { logout } from "./firebase";
import { database, auth } from "./firebase";
import { ref, push, onValue } from "firebase/database";
import { v4 as uuidv4 } from "uuid"; // Use uuid for generating unique IDs

const ChatComponent = ({ name, photoURL }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatID, setChatID] = useState(""); // Store the current chat room ID
  const [chatRooms, setChatRooms] = useState([]); // List of chat rooms
  const [users, setUsers] = useState([]); // List of users

  // Fetch list of users
  useEffect(() => {
    console.log("Current User:", auth.currentUser); // Logs the current authenticated user
    if (!auth.currentUser) {
      console.error("No authenticated user found.");
      return;
    }

    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Fetched data:", data); // Logs the fetched data

      const userList = [];
      for (let id in data) {
        if (id !== auth.currentUser.uid) {
          userList.push({ ...data[id], uid: id });
        }
      }

      console.log("Filtered userList:", userList);
      setUsers(userList);
    });
  }, []);

  // Create or join a chat room
  const createChatRoom = (selectedUser) => {
    // Generate a chat room ID based on both user IDs (to ensure uniqueness)
    const newChatID = [auth.currentUser.uid, selectedUser.uid].sort().join("-");
    setChatID(newChatID); // Set the chat room ID

    // Check if this chat room exists, if not, create it
    const chatRoomRef = ref(database, `chatRooms/${newChatID}`);
    onValue(chatRoomRef, (snapshot) => {
      if (!snapshot.exists()) {
        // If the chat room doesn't exist, create it
        push(chatRoomRef, {
          participants: [auth.currentUser.uid, selectedUser.uid],
        });
      }
    });
  };

  // Send message to Firebase in the current chat room
  const sendMessage = () => {
    if (message && chatID) {
      const messagesRef = ref(database, `chatRooms/${chatID}/messages`);
      const newMessage = {
        uid: auth.currentUser.uid,
        username: name,
        text: message,
        timestamp: Date.now(),
        photoURL: auth.currentUser.photoURL,
      };
      push(messagesRef, newMessage);
      setMessage(""); // Clear the input field after sending
    }
  };

  // Listen for real-time message updates for the current chat room
  useEffect(() => {
    if (chatID) {
      const messagesRef = ref(database, `chatRooms/${chatID}/messages`);
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const loadedMessages = [];
        for (let id in data) {
          loadedMessages.push(data[id]);
        }
        loadedMessages.sort((a, b) => a.timestamp - b.timestamp); // Sort messages by timestamp
        setMessages(loadedMessages); // Update the messages state with the new messages
      });
    }
  }, [chatID]);

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar for Users */}
        {/* <div className="bg-gray-800 text-white w-[250px] p-4">
          <h2 className="text-lg font-bold mb-4">Users</h2>
          {console.log(users)}
          <ul>
            {users.map((user) => (
              <li
                key={user.uid}
                className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                onClick={() => createChatRoom(user)}
              >
                <img
                  src={user.photoURL}
                  alt={user.displayName} // Use displayName instead of name
                  className="w-8 h-8 rounded-full mr-4 inline-block"
                />
                {user.displayName}
              </li>
            ))}
          </ul>
        </div> */}
        <nav class="bg-gray-300 shadow-lg h-screen top-0 left-0 min-w-[220px] py-6 px-6 font-[sans-serif] flex flex-col overflow-auto">
          <div class="flex flex-wrap items-center cursor-pointer">
            <div class="relative">
              <img
                src={auth.currentUser.photoURL}
                alt="profile"
                className="w-12 h-12 rounded-full border-white"
              />
              <span class="h-3 w-3 rounded-full bg-green-600 border-2 border-white block absolute bottom-0 right-0"></span>
            </div>

            <div class="ml-4">
              <p class="text-sm text-[#3949ab] font-semibold">
                {auth.currentUser.displayName}
              </p>
              {/* <p class="text-xs text-gray-500 mt-0.5">D.IN Medicine</p> */}
            </div>
          </div>

          <div class="relative bg-gray-100 px-4 py-3 rounded-md mt-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#3949ab"
              class="w-4 mr-4 inline"
              viewBox="0 0 118.783 118.783"
            >
              <path
                d="M115.97 101.597 88.661 74.286a47.75 47.75 0 0 0 7.333-25.488c0-26.509-21.49-47.996-47.998-47.996S0 22.289 0 48.798c0 26.51 21.487 47.995 47.996 47.995a47.776 47.776 0 0 0 27.414-8.605l26.984 26.986a9.574 9.574 0 0 0 6.788 2.806 9.58 9.58 0 0 0 6.791-2.806 9.602 9.602 0 0 0-.003-13.577zM47.996 81.243c-17.917 0-32.443-14.525-32.443-32.443s14.526-32.444 32.443-32.444c17.918 0 32.443 14.526 32.443 32.444S65.914 81.243 47.996 81.243z"
                data-original="#000000"
              />
            </svg>
            <input
              class="text-sm text-[#3949ab] outline-none bg-transparent px-1 max-w-[130px]"
              placeholder="Search..."
            />
          </div>

          <ul class="space-y-8 pl-3 flex-1 mt-10">
            {users.map((user) => (
              <li
                key={user.uid}
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                onClick={() => createChatRoom(user)}
              >
                <img
                  src={user.photoURL}
                  alt={user.displayName} // Use displayName instead of name
                  className="w-8 h-8 rounded-full mr-4 inline-block"
                />
                {user.displayName}
              </li>
            ))}
          </ul>

          <ul class="space-y-8 pl-3 mt-8">
            {/* <li>
              <a
                href="javascript:void(0)"
                class="text-[#3949ab] font-semibold text-sm flex items-center rounded-md left-0 hover:left-1 relative transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  class="w-[18px] h-[18px] mr-4"
                  viewBox="0 0 512 512"
                >
                  <circle cx="256" cy="378.5" r="25" data-original="#000000" />
                  <path
                    d="M256 0C114.516 0 0 114.497 0 256c0 141.484 114.497 256 256 256 141.484 0 256-114.497 256-256C512 114.516 397.503 0 256 0zm0 472c-119.377 0-216-96.607-216-216 0-119.377 96.607-216 216-216 119.377 0 216 96.607 216 216 0 119.377-96.607 216-216 216z"
                    data-original="#000000"
                  />
                  <path
                    d="M256 128.5c-44.112 0-80 35.888-80 80 0 11.046 8.954 20 20 20s20-8.954 20-20c0-22.056 17.944-40 40-40s40 17.944 40 40-17.944 40-40 40c-11.046 0-20 8.954-20 20v50c0 11.046 8.954 20 20 20s20-8.954 20-20v-32.531c34.466-8.903 60-40.26 60-77.469 0-44.112-35.888-80-80-80z"
                    data-original="#000000"
                  />
                </svg>
                <span>Help Center</span>
              </a>
            </li> */}
            <li>
              <div
                onClick={logout}
                class=" cursor-pointertext-[#3949ab] font-semibold text-sm flex items-center rounded-md left-0 hover:left-1 relative transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  class="w-[18px] h-[18px] mr-4"
                  viewBox="0 0 6.35 6.35"
                >
                  <path
                    d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                    data-original="#000000"
                  />
                </svg>
                <span>Logout</span>
              </div>
            </li>
          </ul>
        </nav>
        {/* Main Chat Window */}
        <div className="flex-1 flex flex-col h-screen w-full">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatID ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.uid === auth.currentUser.uid
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.uid === auth.currentUser.uid
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <strong>{msg.username}</strong>: {msg.text}
                  </div>
                </div>
              ))
            ) : (
              <>
                <h1 style={{ textAlign: "center" }}>CLICK TO ADD CHAT</h1>
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t p-4 flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={!chatID} // Disable input if no chat room is selected
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={sendMessage}
              disabled={!chatID} // Disable button if no chat room is selected
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatComponent;
