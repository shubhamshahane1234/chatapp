import React, { useState, useEffect } from "react";
import { logout } from "./firebase";
import { database, auth } from "./firebase";
import {
  ref,
  push,
  onValue,
  onDisconnect,
  update,
  get,
} from "firebase/database";
import { v4 as uuidv4 } from "uuid"; // Use uuid for generating unique IDs

const ChatComponent = ({ name, photoURL }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatID, setChatID] = useState(""); // Store the current chat room ID
  const [users, setUsers] = useState([]); // List of users
  const [click, setClick] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch list of users  start
  useEffect(() => {
    if (!auth.currentUser) {
      console.error("No authenticated user found.");
      return;
    }

    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();

      const userList = [];
      for (let id in data) {
        if (id !== auth.currentUser.uid) {
          userList.push({ ...data[id], uid: id });
        }
      }

      setUsers(userList);
    });
  }, []);
  // Fetch list of users  start end

  // Create or join a chat room start
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
  // Create or join a chat room end

  // Send message to Firebase in the current chat room  start
  const sendMessage = () => {
    if (message && chatID) {
      const messagesRef = ref(database, `chatRooms/${chatID}/messages`);
      const newMessage = {
        uid: auth.currentUser.uid,
        username: name,
        text: message,
        timestamp: Date.now(),
        photoURL: auth.currentUser.photoURL,
        seenBy: {
          [auth.currentUser.uid]: true, // sender sees their own message
        },
      };
      push(messagesRef, newMessage);
      setMessage(""); // Clear the input field after sending
    }
  };
  // Send message to Firebase in the current chat room  end

  // Listen for real-time message updates for the current chat room start
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
  // Listen for real-time message updates for the current chat room start end

  // send button enter event start
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  // send button enter event end

  // check online status start
  // useEffect(() => {
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   const userStatusRef = ref(database, `users/${user.uid}`);

  //   const connectedRef = ref(database, ".info/connected");

  //   const isOnline = {
  //     online: true,
  //     lastOnline: Date.now(),
  //   };

  //   const isOffline = {
  //     online: false,
  //     lastOnline: Date.now(),
  //   };

  //   const handleUnload = () => {
  //     // Try to update status immediately on tab close
  //     update(userStatusRef, isOffline);
  //   };

  //   const unsubscribe = onValue(connectedRef, (snapshot) => {
  //     if (snapshot.val() === false) return;

  //     onDisconnect(userStatusRef)
  //       .update(isOffline)
  //       .then(() => {
  //         update(userStatusRef, isOnline);
  //       });
  //   });
  //   window.addEventListener("beforeunload", handleUnload);
  //   return () => {
  //     unsubscribe();
  //     window.removeEventListener("beforeunload", handleUnload);
  //   };
  // }, []);
  // check online status start end

  // update seen status start
  const markMessageAsSeen = async () => {
    try {
      const messagesRef = ref(database, `chatRooms/${chatID}/messages`);
      const snapshot = await get(messagesRef);

      if (snapshot.exists()) {
        const messages = snapshot.val();
        const messageKeys = Object.keys(messages);
        const lastMessageID = messageKeys[messageKeys.length - 1];

        const seenRef = ref(
          database,
          `chatRooms/${chatID}/messages/${lastMessageID}/seenBy`
        );

        update(seenRef, {
          [auth.currentUser.uid]: true,
        });
      }
    } catch (error) {
      console.error("Error updating seen status:", error);
    }
  };

  useEffect(() => {
    markMessageAsSeen();
  }, [chatID]);

  // update seen status end

  return (
    <>
      {/* // new one */}
      <div className="flex h-screen bg-gray-100">
        <div
          className={`w-full md:w-80 bg-white shadow-md flex flex-col ${
            isMobileMenuOpen ? "" : "hidden md:flex"
          }`}
        >
          {/* <ProfileSection /> */}
          <div className="p-4 bg-[#727D73] text-white">
            <div className="flex items-center space-x-4">
              <img
                src={auth.currentUser.photoURL}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <div>
                <h2 className="font-bold text-lg">
                  {" "}
                  {auth.currentUser.displayName}
                </h2>
                <p className="text-indigo-200 text-sm">Online</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                onClick={() => alert("Edit Functionality Coming Soon")}
              >
                Edit Profile
              </button>
            </div>
          </div>
          {/* global friends  start side bar  */}
          <div className="flex-1 overflow-y-auto">
            <h2 className="text-xl font-semibold p-4 border-b">
              Global Friends
            </h2>
            <ul>
              {users.map((user) => (
                <li
                  key={user.uid}
                  className={`p-4 border-b hover:bg-gray-100 cursor-pointer ${
                    click.displayName === user.displayName ? "bg-gray-200" : ""
                  }`}
                  onClick={() => {
                    createChatRoom(user);
                    setClick(user);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                      {user.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.displayName}
                      </p>
                      {/* <p className="text-sm text-gray-500 truncate">{friend.lastMessage}</p> */}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-auto text-white hover:bg-[#727d73]  bg-[#565656]  transition"
          >
            Logout
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="md:hidden bg-white p-4 shadow-md">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          {/* global friends  start side bar  */}
          {console.log(chatID, "chat id")}
          {/* chat screen open start  */}
          {!chatID ? (
            <div className="flex items-center justify-center h-full bg-gray-50 ">
              <p className="text-xl text-gray-500">
                Select a friend to start chatting
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full ">
              <div className="p-4 border-b flex items-center space-x-4 bg-[#E3E1D9]">
                <img
                  src={click.photoURL}
                  alt="Friend"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-bold">{click.displayName}</h2>
                  {/* <p className="text-sm text-gray-500">Online</p> */}
                </div>
              </div>
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {console.log(click)}
                {messages.map((msg, index) => {
                  const senderid = msg.uid;
                  const receiverid = click.uid;

                  console.log(senderid, receiverid);
                  console.log(msg.seenBy);
                  const hasSeen =
                    msg?.seenBy[receiverid] && msg.uid === auth.currentUser.uid;
                  return (
                    <div
                      key={index}
                      className={`flex ${
                        msg.uid === auth.currentUser.uid
                          ? "justify-end"
                          : "justify-start"
                      } ${
                        index === messages.length ? "hover:bg-[#727D73]" : ""
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.uid === auth.currentUser.uid
                            ? "bg-[#D0DDD0] text-[#727D73]"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {/* <strong>{msg.username}</strong>: */}
                        {msg.text}
                        {hasSeen && (
                          <span
                            style={{
                              color: "green",
                              fontSize: "15px",
                              marginLeft: "2vw",
                            }}
                          >
                            seen
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-grow px-4 py-2 border rounded-full "
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={!chatID}
                  />
                  <button
                    className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-[#727D73] "
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* chat screen open end  */}
        </div>
      </div>
    </>
  );
};

export default ChatComponent;
