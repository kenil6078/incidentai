import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, addMessage, deleteChat } from '../chat.slice';
import { useSocket } from '../../../context/SocketContext';
import {
  Send,
  MoreVertical,
  Shield,
  Trash2,
  MessageSquare,
  Check,
  CheckCheck,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { ChatWindowSkeleton } from '../../../components/ui/skeleton';
import { toast } from 'sonner';

// ─────────────────────────────────────────────────────────
//  Helper: group messages by date for WhatsApp-style separators
// ─────────────────────────────────────────────────────────
const formatDateSeparator = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
};

const groupMessagesByDate = (messages) => {
  const groups = [];
  let lastDate = null;

  messages.forEach((msg) => {
    const msgDate = new Date(msg.createdAt).toDateString();
    if (msgDate !== lastDate) {
      groups.push({ type: 'date', date: msg.createdAt, key: `date-${msgDate}` });
      lastDate = msgDate;
    }
    groups.push({ type: 'message', data: msg, key: msg._id || `temp-${msg.createdAt}` });
  });

  return groups;
};

// ─────────────────────────────────────────────────────────
//  Message Bubble Component
// ─────────────────────────────────────────────────────────
const MessageBubble = React.memo(({ msg, isMe, showSender }) => {
  const statusIcon = msg.optimistic ? (
    <Check className="w-3 h-3 text-zinc-400 inline-block ml-1" />
  ) : (
    <CheckCheck className="w-3 h-3 text-emerald-500 inline-block ml-1" />
  );

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in`}>
      <div className="max-w-[70%] group">
        {showSender && !isMe && (
          <div className="text-[10px] font-mono text-zinc-500 mb-1 ml-1">
            {msg.sender?.name}
          </div>
        )}
        <div
          className={`
            p-3 text-sm border-2 border-black
            ${msg.optimistic ? 'opacity-80' : ''}
            ${isMe
              ? 'bg-[#FF6B6B] text-black neo-shadow'
              : 'bg-white text-black neo-shadow'
            }
          `}
        >
          <span className="whitespace-pre-wrap break-words">{msg.content}</span>
        </div>
        <div className={`text-[9px] font-mono text-zinc-400 mt-1 flex items-center gap-0.5 ${isMe ? 'justify-end mr-1' : 'ml-1'}`}>
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isMe && statusIcon}
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

// ─────────────────────────────────────────────────────────
//  Typing Indicator Component
// ─────────────────────────────────────────────────────────
const TypingIndicator = ({ typingUsers }) => {
  if (!typingUsers || Object.keys(typingUsers).length === 0) return null;

  const names = Object.values(typingUsers);
  const text = names.length === 1
    ? `${names[0]} is typing`
    : `${names.slice(0, 2).join(', ')} are typing`;

  return (
    <div className="flex justify-start">
      <div className="max-w-[70%]">
        <div className="p-3 text-sm bg-zinc-100 border-2 border-zinc-200 text-zinc-500 italic flex items-center gap-2">
          <span>{text}</span>
          <span className="flex gap-0.5">
            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
//  Main ChatWindow Component
// ─────────────────────────────────────────────────────────
export default function ChatWindow() {
  const dispatch = useDispatch();
  const { currentChat, messages, loading, loadingMore, hasMore, typingUsers } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);
  const { socket } = useSocket();
  const [content, setContent] = useState('');
  const scrollRef = useRef(null);
  const topRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const chatId = currentChat?._id;
  const chatMessages = useMemo(() => messages[chatId] || [], [messages, chatId]);
  
  // Filter out the current user from typing indicators
  const currentTypingUsers = useMemo(() => {
    const list = typingUsers[chatId] || {};
    const filtered = { ...list };
    if (user?._id) delete filtered[user._id];
    return filtered;
  }, [typingUsers, chatId, user?._id]);

  // ── Fetch messages when chat changes ─────────────────
  useEffect(() => {
    if (chatId) {
      dispatch(fetchMessages({ chatId }));
      setIsNearBottom(true);
      // Auto-focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [chatId, dispatch]);

  // ── Smart auto-scroll ────────────────────────────────
  // Only auto-scroll if user is near the bottom (like WhatsApp)
  useEffect(() => {
    if (isNearBottom && scrollRef.current) {
      // Use requestAnimationFrame for smooth scroll after DOM paint
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [chatMessages, isNearBottom]);

  // ── Scroll tracking ──────────────────────────────────
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom < 100;
    setIsNearBottom(nearBottom);
    setShowScrollDown(!nearBottom && distanceFromBottom > 300);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setIsNearBottom(true);
      setShowScrollDown(false);
    }
  }, []);

  // ── Infinite scroll (load older messages) ────────────
  useEffect(() => {
    if (!chatId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore[chatId] && !loadingMore && !loading) {
          const oldestMsg = chatMessages[0];
          if (oldestMsg) {
            const scrollPos = scrollRef.current.scrollHeight - scrollRef.current.scrollTop;
            dispatch(fetchMessages({ chatId, before: oldestMsg.createdAt })).then(() => {
              // Preserve scroll position after prepending older messages
              requestAnimationFrame(() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollTop = scrollRef.current.scrollHeight - scrollPos;
                }
              });
            });
          }
        }
      },
      { threshold: 0.1 }
    );

    if (topRef.current) observer.observe(topRef.current);
    return () => observer.disconnect();
  }, [chatId, hasMore, loadingMore, loading, chatMessages, dispatch]);

  // ── Typing indicator emission ────────────────────────
  const emitTyping = useCallback(() => {
    if (!socket || !chatId) return;
    socket.emit('typing_start', { chatId });

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Auto-stop typing after 1.5s of no input
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { chatId });
    }, 1500);
  }, [socket, chatId]);

  const handleInputChange = useCallback((e) => {
    setContent(e.target.value);
    emitTyping();
  }, [emitTyping]);

  // ── Send message ─────────────────────────────────────
  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || !currentChat || !socket) return;

    // Stop typing indicator
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit('typing_stop', { chatId: currentChat._id });

    // 1. Optimistic update — message appears INSTANTLY
    const tempMsg = {
      _id: `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      chatId: currentChat._id,
      content: trimmed,
      sender: user,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    setIsNearBottom(true);
    dispatch(addMessage(tempMsg));

    // 2. Emit to server (encryption happens server-side)
    socket.emit('send_message', {
      chatId: currentChat._id,
      content: trimmed,
      type: 'text',
    });

    // 3. Clear input
    setContent('');
    inputRef.current?.focus();
  }, [content, currentChat, socket, user, dispatch]);

  // ── Keyboard shortcut: Enter to send ─────────────────
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  }, [handleSendMessage]);

  // ── Delete chat ──────────────────────────────────────
  const handleDeleteChat = useCallback(async () => {
    if (!window.confirm('Delete this entire conversation? All messages will be permanently removed for everyone.')) return;
    try {
      await dispatch(deleteChat(currentChat._id)).unwrap();
      toast.success('Chat deleted');
      setShowMenu(false);
    } catch (err) {
      toast.error(err || 'Failed to delete chat');
    }
  }, [dispatch, currentChat]);

  // ── Click outside to close menu ──────────────────────
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // ── Group messages by date ───────────────────────────
  const groupedItems = useMemo(() => groupMessagesByDate(chatMessages), [chatMessages]);

  // ── Empty state: no chat selected ────────────────────
  if (!currentChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 p-8 text-center">
        <div className="w-20 h-20 bg-[#D4F4E4] border-2 border-black neo-shadow flex items-center justify-center mb-6">
          <MessageSquare className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black tracking-tight mb-2">Select a conversation</h3>
        <p className="text-zinc-500 max-w-xs mx-auto">
          Choose a teammate to start chatting or view historical discussions.
        </p>
        <div className="flex items-center gap-1.5 mt-4 text-[10px] text-zinc-400 font-mono">
          <Lock className="w-3 h-3" /> Messages are end-to-end encrypted
        </div>
      </div>
    );
  }

  // ── Loading state ────────────────────────────────────
  if (loading && !messages[chatId]) {
    return <ChatWindowSkeleton />;
  }

  const otherParticipant = currentChat.participants?.find(p => p && p._id !== user?._id);

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* ── Header ────────────────────────────────────── */}
      <div className="h-16 border-b-2 border-black flex items-center justify-between px-6 bg-[#D4F4E4] relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-950 text-white border-2 border-black flex items-center justify-center font-bold text-base">
            {currentChat.type === 'group' ? 'G' : otherParticipant?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="text-sm font-black">
              {currentChat.type === 'group' ? currentChat.name : otherParticipant?.name}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-600 font-mono">
              <Shield className="w-2.5 h-2.5 text-green-600" /> End-to-end encrypted
            </div>
          </div>
        </div>

        {/* ── Three-dot menu ──────────────────────────── */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(prev => !prev)}
            className="p-2 hover:bg-black/5 rounded-none border-2 border-transparent active:border-black transition-all"
            aria-label="Chat options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white border-2 border-black neo-shadow z-50 overflow-hidden">
              <button
                onClick={handleDeleteChat}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <Trash2 className="w-4 h-4" />
                <div>
                  <div>Delete Chat</div>
                  <div className="text-[10px] font-normal text-red-400 mt-0.5">Remove for everyone</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Messages Area ─────────────────────────────── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#FAFAFA]"
      >
        <div ref={topRef} className="h-1" />

        {loadingMore && (
          <div className="flex justify-center p-2">
            <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin rounded-full" />
          </div>
        )}

        {chatMessages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-white border-2 border-black neo-shadow flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-zinc-400" />
            </div>
            <h4 className="text-lg font-black uppercase tracking-tight">Messages are encrypted</h4>
            <p className="text-xs text-zinc-500 max-w-[240px] mt-1 font-medium">
              Messages in this chat are secured with end-to-end encryption. Start the conversation!
            </p>
          </div>
        )}

        {groupedItems.map((item) => {
          if (item.type === 'date') {
            return (
              <div key={item.key} className="flex justify-center my-4">
                <span className="px-3 py-1 bg-white border border-zinc-200 text-[10px] font-mono text-zinc-500 uppercase tracking-wider shadow-sm">
                  {formatDateSeparator(item.date)}
                </span>
              </div>
            );
          }

          const msg = item.data;
          const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;

          return (
            <MessageBubble
              key={item.key}
              msg={msg}
              isMe={isMe}
              showSender={currentChat.type === 'group'}
            />
          );
        })}

        {/* Typing indicator */}
        <TypingIndicator typingUsers={currentTypingUsers} />
      </div>

      {/* ── Scroll-to-bottom FAB ──────────────────────── */}
      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-8 w-10 h-10 bg-white border-2 border-black neo-shadow flex items-center justify-center hover:bg-zinc-100 transition-all z-10"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}

      {/* ── Input Area ────────────────────────────────── */}
      <div className="p-4 border-t-2 border-black bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={content}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2.5 border-2 border-black focus:outline-none focus:bg-zinc-50 text-sm font-medium transition-colors"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-4 border-2 border-black neo-shadow bg-[#FF6B6B] hover:bg-[#ff5252] disabled:opacity-40 disabled:cursor-not-allowed disabled:neo-shadow-none transition-all font-bold text-sm active:translate-y-[1px] active:shadow-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
