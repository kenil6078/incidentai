import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../features/auth/hook/useAuth";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const catchAllListeners = React.useRef(new Set());

  useEffect(() => {
    if (!user) return;

    const newSocket = io("/", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setConnected(true);
      const orgId = user.organizationId || user.orgId;
      if (orgId) {
        newSocket.emit("join", orgId);
      }
      if (user.id) {
        newSocket.emit("join", user.id);
      }
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    // Handle any event for backward compatibility with raw WebSocket implementation
    newSocket.onAny((eventName, ...args) => {
      const data = args[0];
      const enrichedData = typeof data === "object" ? { ...data, eventName } : { data, eventName };
      
      // If data is an object, we can add the eventName as type if it doesn't exist (for backward compat)
      if (data && typeof data === "object" && !data.type) {
        enrichedData.type = eventName;
      }
      
      // Notify all catch-all listeners
      catchAllListeners.current.forEach((fn) => fn(enrichedData));
    });

    return () => {
      newSocket.close();
    };
  }, [user]);

  const subscribe = (eventOrFn, maybeFn) => {
    if (typeof eventOrFn === "function") {
      // Catch-all subscription
      catchAllListeners.current.add(eventOrFn);
      return () => catchAllListeners.current.delete(eventOrFn);
    }
    
    // Named event subscription
    if (!socket) return () => {};
    socket.on(eventOrFn, maybeFn);
    return () => socket.off(eventOrFn, maybeFn);
  };

  return (
    <SocketContext.Provider value={{ connected, subscribe, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    return { connected: false, subscribe: () => {}, socket: null };
  }
  return context;
};
