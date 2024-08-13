/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./ChatWindow.module.css";
import { getFormattedTime } from "../../util";
import { v4 as uuidv4 } from "uuid";

const ChatWindow = ({ username, roomId }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  // const [activityMessage, setActivityMessage] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(messages);

  const handleInputChange = (e) => {
    e.preventDefault();
    setCurrentMessage(e.target.value);
  };

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
