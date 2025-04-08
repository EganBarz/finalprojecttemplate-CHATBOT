import React from "react";
import ChatBox from "./components/ChatBox";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Mortgage AI Assistant</h1>
          <p>Get personalized mortgage advice 24/7</p>
        </div>
        <ChatBox />
      </div>
    </div>
  );
}

export default App;