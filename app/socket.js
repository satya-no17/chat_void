import { io } from "socket.io-client";
export function connectSocket(){
    return io("https://chat-void-back.onrender.com");
}