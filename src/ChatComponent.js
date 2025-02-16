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
  const [click, setClick] = useState("");

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
        <nav class="bg-gray-300 shadow-lg h-screen top-0 left-0 max-w-[130px] sm:min-w-[220px] sm:py-6 sm:px-6 font-[sans-serif] flex flex-col overflow-x-hidden ">
          <div class="flex flex-wrap items-center cursor-pointer justify-center ">
            <div class="relative  ">
              <img
                src={auth.currentUser.photoURL}
                alt="profile"
                className="w-8 h-8 sm:w-12 sm:h-12  rounded-full border-white"
              />
              <span class="h-3 w-3 rounded-full bg-green-600 border-2 border-white block absolute bottom-0 right-0"></span>
            </div>

            <div class="ml-4">
              <p
                class="text-sm  text-[#3949ab] font-bold"
                style={{
                  fontSize: "1.5vmax",
                  lineHeight: "22px",
                  textAlign: "center",
                }}
              >
                {auth.currentUser.displayName}
              </p>
            </div>
          </div>

          <div class="relative bg-gray-100 rounded-md m-1 max-w-15 sm:max-w-50  sm:px-4 sm:py-3  mt-6 flex">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#3949ab"
              class="w-4 mr-4 inline"
              viewBox="0 0 118.783 118.783"
            >
              <path
                d="M115.97 101.597 88.661 74.286a47.75 47.75 0 0 0 7.333-25.488c0-26.509-21.49-47.996-47.998-47.996S0 22.289 0 48.798c0 26.51 21.487 47.995 47.996 47.995a47.776 47.776 0 0 0 27.414-8.605l26.984 26.986a9.574 9.574 0 0 0 6.788 2.806 9.58 9.58 0 0 0 6.791-2.806 9.602 9.602 0 0 0-.003-13.577zM47.996 81.243c-17.917 0-32.443-14.525-32.443-32.443s14.526-32.444 32.443-32.444c17.918 0 32.443 14.526 32.443 32.444S65.914 81.243 47.996 81.243z"
                data-original="#000000"
              />
            </svg> */}
            <input
              class="text-sm text-[#3949ab] outline-none bg-transparent px-1 max-w-[130px]"
              placeholder="Search..."
            />
          </div>

          <ul class="space-y-8 pl-3 flex-1 mt-10">
            {users.map((user) => (
              <li
                key={user.uid}
                className="cursor-pointer hover:bg-gray-200 p-2 rounded flex justify-center items-center"
                style={{
                  backgroundColor: click === user && "#D4EBF8",
                }}
                onClick={() => {
                  createChatRoom(user);
                  setClick(user);
                }}
              >
                <img
                  src={user.photoURL}
                  alt={user.displayName} // Use displayName instead of name
                  className="max-w-8 max-h-8 rounded-full mr-3 inline-block"
                />
                <span style={{ fontSize: "1.5vmax" }}> {user.displayName}</span>
              </li>
            ))}
          </ul>

          <ul class="space-y-8 pl-3 mt-8 overflow-x-hidden">
            <li>
              <div
                onClick={logout}
                class=" cursor-pointer text-[#3949ab] font-semibold text-sm flex items-center rounded-md left-0 hover:left-1 relative transition-all"
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
        <div className="flex-1 flex flex-col w-full ">
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
