"use client";

import React, { useState, useEffect, useRef } from "react";
import { connectSocket } from "./socket";
import { useRouter } from "next/navigation";
const Home = () => {
  const socket = useRef(null);
  const router = useRouter();
  const [mode, setMode] = useState(null);
  const [code, setCode] = useState("");
  const [secretName, setSecretName] = useState("");
  const [chatMode, setChatMode] = useState(false);
  const joinFunction = () => {
    if (!code.trim() || !secretName.trim()) {
      alert("code required");
      return;
    }
    console.log(code, "  ", secretName);
    setChatMode(true);
     router.push(
      `/chat?code=${encodeURIComponent(code)}&name=${encodeURIComponent(secretName)}`
    );
  };

  // useEffect(() => {
  //   if (!chatMode) return;

  //   socket.current = connectSocket();

  //   socket.current.emit("join-room", {
  //     code,
  //     secretName,
  //   });
  //   socket.current.on("user-joined", (data) => {
  //     console.log("user joined: ", data.name);
  //   });
  // }, [chatMode]);

  return (
    <div className="void-wrapper">
      <nav className="void-nav">
        <h3>Chat Void</h3>
        <div className="nav-right">
          <span className="ncon">Docs</span>
          <span className="ncon">About</span>
        </div>
      </nav>
      {mode === null && (
        <section className="void-hero">
          <div className="void-pill">
            <span>Anonymous conversations · No history</span>
          </div>
          <h1>
            Where conversations
            <br />
            fall into the void
          </h1>
          <p>Anonymous by design. Temporary by nature.</p>
          <div className="void-actions">
            <button className="primary btn" onClick={() => setMode("create")}>
              Create Void
            </button>
            <button className="secondary btn" onClick={() => setMode("join")}>
              Join Void
            </button>
          </div>
        </section>
      )}
      {mode === "join" && (
        <div className="joinbox void-hero">
          <h1>Join the secret VOID...</h1>
          <input
            type="text"
            placeholder="Enter Void Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Your Name in Void "
            value={secretName}
            onChange={(e) => setSecretName(e.target.value)}
          />
          <button className="bttn" onClick={joinFunction}>
            Join
          </button>
        </div>
      )}
      {mode === "create" && (
        <div className="joinbox void-hero">
          <h1>Create the secret VOID...</h1>
          <input
            type="text"
            placeholder="Enter Your Name in Void "
            value={secretName}
            onChange={(e) => setSecretName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Create Void Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="bttn" onClick={joinFunction}>
            Create Void
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
