"use client";

import React, { useState, useEffect, useRef } from "react";
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
      alert("U cant enter a Void without its Number");
      return;
    }
    console.log(code, "  ", secretName);
    setChatMode(true);
    router.push(
      `/chat?code=${encodeURIComponent(code)}&name=${encodeURIComponent(secretName)}`
    );
  };


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
              Create/Join The Void
            </button>
          </div>
        </section>
      )}
      {mode === "create" && (
        <div className="joinbox void-hero">
          <h1>Create or Join The VOID...</h1>
          <input
            type="text"
            placeholder="Enter Your Name in Void "
            value={secretName}
            onChange={(e) => setSecretName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Void Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key ==="Enter"){
                e.preventDefault();
                joinFunction();
              }
            }}
          />
          <div className="btns">
            <button className="bttn" onClick={joinFunction}>
           Proceed
          </button>
          <button className="bttn bck" onClick={()=>setMode(null)}>
            Return
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
