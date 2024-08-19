/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "./ChatWindow.module.css";
import { getFormattedTime } from "../../util";
import { v4 as uuidv4 } from "uuid";

const ChatWindow = ({ username, roomId, socket }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [activityMessage, setActivityMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setCurrentMessage(e.target.value);

    // handle activity
    socket.emit("user_typing", { username, roomId });
  };

  useEffect(() => {
    let timer;
    socket.on("user_typing", (username) => {
      setActivityMessage(`${username} is typing...`);
      clearTimeout(timer);

      timer = setTimeout(() => {
        setActivityMessage("");
      }, 3000);
    });

    return () => {
      socket.off("user_typing");
    };
  });

  useEffect(() => {
    // receiving messages from the server

    socket.on("message", ({ username, text, type }) => {
      const uuid = uuidv4();
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: uuid, username, text, type },
      ]);
    });

    return () => {
      socket.off("message");
    };
  });

  useEffect(() => {
    socket.on("user_join_room", (message) => {
      const uuid = uuidv4();
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: uuid, text: message, type: "notif" },
      ]);
    });

    return () => {
      socket.off("user_join_room");
    };
  });

  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.emit("user_left_room", { username, roomId });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    const uuid = uuidv4();

    // adding message in state
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: uuid,
        username,
        text: currentMessage,
      },
    ]);
    // broadcast message to other users

    socket.emit("send_message", {
      roomId,
      username,
      text: currentMessage,
    });
    setCurrentMessage("");
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h2>Room Name: {roomId}</h2>
        <p>
          Welcome, <span>{username}</span>
        </p>
        <div className={styles.chatMessages}>
          {messages.map((message) => {
            // const { id, text, type,username } = message || {};
            if (message.type === "notif") {
              return (
                <div key={message.id} className={styles.notif}>
                  {message.text}
                </div>
              );
            } else {
              return (
                <div
                  key={message.id}
                  className={`${styles.chatMessage} ${
                    message?.username === username
                      ? styles.myMessage
                      : styles.otherMessage
                  }`}
                >
                  <div className={styles.messageText}>
                    <span className={styles.messageName}>
                      {message?.username}
                    </span>
                    <span>{message?.text}</span>
                  </div>
                  <div className={styles.time}>{getFormattedTime()}</div>
                </div>
              );
            }
          })}
          <div className={styles.activityText}>{activityMessage}</div>
        </div>
        <form onSubmit={handleSendMessage} className={styles.messageForm}>
          <input
            type="text"
            name=""
            id=""
            placeholder="Type your messages..."
            onChange={handleInputChange}
            value={currentMessage}
            className={styles.messageInput}
            required
          />
          <button className={styles.sendButton} type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
