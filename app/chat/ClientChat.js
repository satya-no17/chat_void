"use client";
import React, { useState, useRef, useEffect } from "react";
import { connectSocket } from "../socket";

export default function ClientChat({ code, name }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const socket = useRef(null);
    const scroller = useRef(null);
    const [users,setUsers] = useState([]);
    useEffect(() => {
        scroller.current?.scrollIntoView({ behavior: "smooth" });

    }, [messages])
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
            setUsers((prev)=>[...prev,{name:data.name,type:"joined"}])
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
        socket.current.on("user left ",(data)=>{
            console.log(data.name," left")
            setUsers((prev)=>[...prev,{name:data.name,type:"left"}])
        })

        return () => {
            socket.current?.disconnect();
        };
    }, [code, name]);


    return (
        <div className="main">
            <div className="detail">
                <div className="Users">
                    <h2>Void Status</h2>
                </div>
                <div className="allUser">
                    {users.map((user,index)=>(
                        <div className={`user `} key={index}>
                            <div >
                                {user.name} {user.type}
                                </div> 
                        </div>
                    ))}
                </div>
            </div>
            <div className=" chat-section">
                <div className="group">
                    <h2>Void Code: {code}</h2>
                </div>
                <div className="chat">
                    {messages.map((msg, index) => (
                        <div className="chatbox" key={index}>
                            <div className={`message ${msg.type === "sent" ? "sent" : "received"}`}>
                                {msg.text}
                            </div>

                            <div className={`timeDate ${msg.type === "sent" ? "sent" : "received"}`}>
                                {msg.type === "received" ? (
                                    <div className={`secretName  ${msg.type === "sent" ? "sent" : "received"}`}>
                                        <div>
                                            {msg.secretName}</div>
                                        <div>
                                            {msg.time}
                                        </div>
                                    </div>
                                ) : null}

                                <div className="time">{msg.time}</div>
                            </div>
                        </div>
                    ))}
                    <div ref={scroller}></div>

                </div>

                <div className="newmessage">
                    <input type="text" placeholder="" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            sendMsg();
                        }
                    }} />
                    <button className="sendbtn" onClick={sendMsg}>
                        ▶
                    </button>
                </div>
            </div>


        </div>
    );
}
