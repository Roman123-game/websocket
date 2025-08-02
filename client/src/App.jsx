import React, { useEffect, useRef, useState } from "react";
import "./App.css"; // Ensure you have this CSS file for styling

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(""); // new state for user input
  const socketRef = useRef(null);
  const tabId = useRef(Math.random().toString(36).slice(2, 8)); 

useEffect(() => {
  socketRef.current = new WebSocket("https://websocket-nc60.onrender.com");

  socketRef.current.onopen = () => {
    console.log("WebSocket opened");
    socketRef.current.send(`Tab ${tabId.current} connected`);
  };

  socketRef.current.onmessage = async (event) => {
    let message;
    if (event.data instanceof Blob) {
      message = await event.data.text();
    } else {
      message = event.data;
    }
    setMessages((prev) => [...prev, message]);
  };

  socketRef.current.onclose = () => {
    console.log("WebSocket closed");
  };

  socketRef.current.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  // Cleanup on unmount
  return () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };
}, []);


  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && input.trim() !== "") {
      socketRef.current.send(input);
      setInput(""); // clear input after sending
    }
  };

  // Optional: Send message on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>WebSocket Chat</h2>
      <p>Tab ID: <strong>{tabId.current}</strong></p>

      <input
      className="input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here"
      />
      <button onClick={sendMessage}>Send Message</button>

      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
