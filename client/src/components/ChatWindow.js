import React, { useEffect, useState } from "react";

function ChatWindow({ socket }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Подписываемся на события
    socket.on("new message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Отписываемся от событий при размонтировании
      if (socket) socket.off("new message");
    };
  }, [socket]);

  return (
    <div>
      <h2>Чат</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default ChatWindow;
