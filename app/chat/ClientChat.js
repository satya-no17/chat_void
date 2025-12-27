"use client";
import React, { useState, useRef, useEffect } from "react";
import { connectSocket } from "../socket";

export default function ClientChat({ code, name }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);

  const sendMsg = () => {
    if (!input) return;
    setMessages((prev) => [
      ...prev,
      {
        text: input,
        type: "sent",
        time: new Date(Date.now()).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      },
    ]);
    socket.current?.emit("message", {
      msg: input,
      type: "received",
      secretName: name,
      time: Date.now(),
    });
    setInput("");
  };

  useEffect(() => {
    if (!code) return;

    socket.current = connectSocket();

    socket.current.emit("join-room", {
      code,
      secretName: name,
    });

    socket.current.on("user-joined", (data) => {
      console.log("user joined: ", data.name);
    });

    socket.current.on("message", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          text: msg.msg,
          type: "received",
          secretName: msg.secretName,
          time: new Date(msg.time).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        },
      ]);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [code, name]);

  return (
    <div className="void-wrapper main">
      <div className="void-hero chat-section">
        <div className="chat">
          {messages.map((msg, index) => (
            <div className="chatbox" key={index}>
              <div className={`message ${msg.type === "sent" ? "sent" : "received"}`}>
                {msg.text}
              </div>

              <div className="timeDate">
                {msg.type === "received" ? (
                  <div className={`secretName  ${msg.type === "sent" ? "sent" : "received"}`}>
                    {msg.secretName}
                  </div>
                ) : null}

                <div className="time">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="newmessage">
        <input type="text" placeholder="" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="sendbtn" onClick={sendMsg}>
          V
        </button>
      </div>
    </div>
  );
}
