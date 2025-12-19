"use client";
import { connectSocket } from "../socket";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
export default function chatroom() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const secretName = searchParams.get("name");

  const [inpu, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);
  const sendMsg = () => {
    
    setMessages((prev) => [...prev, { text: inpu, type: "sent" }]);
    socket.current.emit("message",{msg:inpu,type:"recieved",secretName:secretName,time:Date.now()})
    setInput("");
  };

  useEffect(() => {
    if (!code) return;

    socket.current = connectSocket();

    socket.current.emit("join-room", {
      code,
      secretName,
    });

    socket.current.on("user-joined", (data) => {
      console.log("user joined: ", data.name);
    });

    socket.current.on("message", (msg) => {
      console.log("message: ", msg);
      setMessages((prev) => [
        ...prev,
        { text: msg.msg, type: "recieved", secretName: msg.secretName ,time:msg.time},
      ]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [code]);
  return (
    <div className="void-wrapper main">
      <div className="void-hero chat-section">
        <div className="chat">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.type === "sent" ? "sent" : "received"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>
      <div className="newmessage">
        <input
          type="text"
          placeholder=""
          value={inpu}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="sendbtn" onClick={sendMsg}>
          V
        </button>
      </div>
    </div>
  );
}
