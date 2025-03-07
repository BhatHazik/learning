import { io } from 'socket.io-client';
import { BASE_URI } from './Config/url';
export let socket;

export const socketConnect = async (token = null) => {
//   console.log(token);
  const socketUrl = `${BASE_URI}/?token=${token}`;
//   console.log(`Connecting to socket at ${socketUrl}`);

  try {
    socket = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: false, // Don't auto-connect
    //   timeout:20000
    });

    socket.connect();

    // socket.on("connect", () => {
    //   console.log("✅ Socket connected successfully!", socket.id);
    // });

    // socket.on("connect_error", (err) => {
    //   console.error("❌ Connection error:", err);
    // });

    // socket.on("disconnect", (reason) => {
    //   console.log("❌ Socket disconnected:", reason);
    // });

  } catch (e) {
    console.log("❌ Error in socket connection:", e);
  }
};