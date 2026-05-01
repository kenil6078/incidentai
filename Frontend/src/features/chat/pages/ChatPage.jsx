import React, { useEffect } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import { useSocket } from '../../../context/SocketContext';
import { useDispatch } from 'react-redux';
import { addMessage } from '../chat.slice';

export default function ChatPage() {
  const { subscribe } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = subscribe?.((evt) => {
      if (evt.type === 'receive_message') {
        dispatch(addMessage(evt));
      }
    });

    // Also manually listen if useSocket provides a way, 
    // but the current SocketContext seems to use a subscription model for custom events?
    // Let's check SocketContext.jsx
  }, [subscribe, dispatch]);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex overflow-hidden">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}
