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
        <div className="bg-gray-800 text-white w-[250px] p-4">
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
        </div>

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
              <>click to add chat</>
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
