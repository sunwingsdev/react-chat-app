import { io } from "socket.io-client";
import "./App.css";
import JoinChatForm from "./components/JoinChatForm/JoinChatForm";
import { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow/ChatWindow";

// Initializing the connection
const socket = io(import.meta.env.VITE_CHAT_SERVER);

function App() {
  const [isInRoom, setIsInRoom] = useState(false);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connection has been established");
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  const handleJoinRoom = () => {
    console.log(username);
    console.log(roomId);
    // adding user to the room
    socket.emit("user_join_room", { username, roomId });
    setIsInRoom(true);
    // toggle user to window page
  };

  return (
    <>
      {isInRoom ? (
        <ChatWindow username={username} roomId={roomId} socket={socket} />
      ) : (
        <JoinChatForm
          onJoin={handleJoinRoom}
          username={username}
          setUsername={setUsername}
          roomId={roomId}
          setRoomId={setRoomId}
        />
      )}
    </>
  );
}

export default App;
