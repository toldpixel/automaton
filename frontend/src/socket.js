"use client";
import { io } from "socket.io-client";

export const socket = io("http://localhost:4000"); //! Remember no bad ports like 6666 !!!
//! or requests getting blocked

socket.on("connect", () => {
  setTimeout(() => {
    // complete the handshake delay helps to wait for connection established
    console.log("Socket connected (delayed):", socket.id);
  }, 1000);
});

/*socket.on("worker-ready", (data) => {
  console.log("Received worker-ready:", data.status);
});
*/
