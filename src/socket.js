import { io } from "socket.io-client";

// Dynamically use local or production server
const SERVER_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5001";

// Initialize socket connection
export const socket = io(SERVER_URL, {
  withCredentials: true,
});

// Event listeners (optional)
socket.on("connect", () => {
  console.log("Connected to server with socket ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
