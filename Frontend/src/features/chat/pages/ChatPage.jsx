import React, { useEffect } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import { useSocket } from '../../../context/SocketContext';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setTypingUser, clearTypingUser, incrementUnread } from '../chat.slice';

/**
 * ChatPage — the single source of truth for all chat socket events.
 *
 * Architecture decision: Socket listeners live HERE (parent), not inside
 * ChatWindow. This prevents duplicate listener registration when ChatWindow
 * re-renders or when currentChat changes. Redux handles routing messages
 * to the correct chat by chatId.
 */
export default function ChatPage() {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const currentChat = useSelector(state => state.chat.currentChat);

  // ── Socket: Real-time message listener ─────────────────
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      dispatch(addMessage(msg));
      if (msg.chatId) {
        dispatch(incrementUnread(msg.chatId));
      }
    };

    const handleTyping = ({ chatId, userId, userName }) => {
      dispatch(setTypingUser({ chatId, userId, userName }));
      // Auto-clear after 3 seconds (in case stop event is missed)
      setTimeout(() => {
        dispatch(clearTypingUser({ chatId, userId }));
      }, 3000);
    };

    const handleStopTyping = ({ chatId, userId }) => {
      dispatch(clearTypingUser({ chatId, userId }));
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleTyping);
    socket.on('user_stopped_typing', handleStopTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleTyping);
      socket.off('user_stopped_typing', handleStopTyping);
    };
  }, [socket, dispatch]);

  // ── Socket: Join/leave chat rooms for typing indicators ─
  useEffect(() => {
    if (!socket || !currentChat?._id) return;

    socket.emit('join_chat', currentChat._id);
    return () => {
      socket.emit('leave_chat', currentChat._id);
    };
  }, [socket, currentChat?._id]);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex overflow-hidden">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}
