import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.js"; // Подключено с .js
import "../styles.css";

function MainPage({ socket }) {
  const [channels, setChannels] = useState(["general", "gaming", "music-room"]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChannel, setCurrentChannel] = useState("general");
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("user list", (userList) => {
      setUsers(userList);
    });

    socket.on("new message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("user list");
      socket.off("new message");
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = { channel: currentChannel, text: message };
      socket.emit("send message", newMessage);
      setMessage("");
    }
  };

  return (
    <div className="main-page">
      <div className="sidebar">
        <h2 className="section-title">КАНАЛЫ</h2>
        <ul className="channel-list">
          {channels.map((channel, index) => (
            <li
              key={index}
              className={`channel-item ${
                channel === currentChannel ? "active-channel" : ""
              }`}
              onClick={() => setCurrentChannel(channel)}
            >
              #{channel}
            </li>
          ))}
        </ul>

        <h2 className="section-title">ПОЛЬЗОВАТЕЛИ</h2>
        <ul className="user-list">
          {users.length > 0 ? (
            users.map((user, index) => (
              <li key={index} className="user-item">
                {user.username}
              </li>
            ))
          ) : (
            <p>Нет пользователей</p>
          )}
        </ul>
      </div>
      <div className="chat-container">
        <div className="chat-header">
          <h2># {currentChannel}</h2>
        </div>
        <div className="chat-window">
          {messages
            .filter((msg) => msg.channel === currentChannel)
            .map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.sender === "Вы" ? "sent-message" : "received-message"
                }`}
              >
                <span className="message-sender">{msg.sender}:</span>
                <span className="message-text">{msg.text}</span>
              </div>
            ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            className="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение..."
          />
          <button className="send-button" onClick={handleSendMessage}>
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
