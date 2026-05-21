import { io } from "socket.io-client";

let socket = null;

const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    const userStr = localStorage.getItem("user");
    if (userStr && userStr !== "null" && userStr !== "undefined") {
      try {
        const userObj = JSON.parse(userStr);
        userId = userObj?._id || userObj?.id;
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }
  return userId || "";
};

export const initSocket = () => {
  const userId = getUserId();

  if (!socket) {
    socket = io("http://localhost:5000", {
      query: { userId },
      autoConnect: true,
      reconnection: true,
    });

    // Re-register userId on every (re)connect so userSocketMap is always fresh
    socket.on("connect", () => {
      const uid = getUserId();
      if (uid) {
        socket.emit("addUser", uid);
        console.log("[Socket] Registered userId:", uid, "socket:", socket.id);
      }
    });

    socket.on("reconnect", () => {
      const uid = getUserId();
      if (uid) socket.emit("addUser", uid);
    });
  } else {
    // Socket already exists — just re-register in case userId changed after login
    const uid = getUserId();
    if (uid && socket.connected) {
      socket.emit("addUser", uid);
    }
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) return initSocket();
  return socket;
};

// Call this after login to register the newly logged-in user
export const registerUser = (userId) => {
  const s = getSocket();
  if (s && userId) {
    s.emit("addUser", userId);
    console.log("[Socket] Re-registered after login:", userId);
  }
};

export default getSocket;
