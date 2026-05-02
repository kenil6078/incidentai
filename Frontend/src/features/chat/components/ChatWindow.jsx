import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, addMessage } from '../chat.slice';
import { useSocket } from '../../../context/SocketContext';
import { Send, Paperclip, MoreVertical, Shield, Trash2, MessageSquare } from 'lucide-react';
import { ChatWindowSkeleton } from '../../../components/ui/skeleton';
import { toast } from 'sonner';

export default function ChatWindow() {
  const dispatch = useDispatch();
  const { currentChat, messages, loading, loadingMore, hasMore } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);
  const { socket } = useSocket();
  const [content, setContent] = useState('');
  const scrollRef = useRef(null);
  const topRef = useRef(null);
  const throttleRef = useRef(0);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const handleScroll = () => {
    const now = Date.now();
    if (now - throttleRef.current > 100) {
      setShouldScrollToBottom(false);
      throttleRef.current = now;
    }
  };

  useEffect(() => {
    if (currentChat?._id) {
      dispatch(fetchMessages({ chatId: currentChat._id }));
      setShouldScrollToBottom(true);
    }
  }, [currentChat?._id, dispatch]);

  useEffect(() => {
    if (shouldScrollToBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, shouldScrollToBottom]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    if (!currentChat?._id) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore[currentChat._id] && !loadingMore && !loading) {
          const chatMsgs = messages[currentChat._id] || [];
          const oldestMsg = chatMsgs[0];
          if (oldestMsg) {
            setShouldScrollToBottom(false);
            const scrollPos = scrollRef.current.scrollHeight - scrollRef.current.scrollTop;
            
            dispatch(fetchMessages({ 
              chatId: currentChat._id, 
              before: oldestMsg.createdAt 
            })).then(() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight - scrollPos;
              }
            });
          }
        }
      },
      { threshold: 0.1 }
    );
    
    if (topRef.current) observer.observe(topRef.current);
    return () => observer.disconnect();
  }, [currentChat?._id, hasMore, loadingMore, loading, messages, dispatch]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!content.trim() || !currentChat || !socket) return;

    const tempMsg = {
      _id: `temp-${Date.now()}`,
      chatId: currentChat._id,
      content: content.trim(),
      sender: user,
      createdAt: new Date().toISOString(),
      optimistic: true
    };

    setShouldScrollToBottom(true);
    dispatch(addMessage(tempMsg));

    socket.emit('send_message', {
      chatId: currentChat._id,
      content: content.trim(),
      type: 'text'
    });

    setContent('');
  };

  const [showMenu, setShowMenu] = useState(false);

  const handleDeleteChat = async () => {
    if (window.confirm("Are you sure you want to delete this chat? This will remove all messages for everyone.")) {
      try {
        await dispatch(deleteChat(currentChat._id)).unwrap();
        toast.success("Chat deleted successfully");
        setShowMenu(false);
      } catch (err) {
        toast.error(err || "Failed to delete chat");
      }
    }
  };

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
      </div>
    );
  }

  if (loading && !messages[currentChat?._id]) {
    return <ChatWindowSkeleton />;
  }

  const chatMessages = messages[currentChat._id] || [];
  const otherParticipant = currentChat.participants?.find(p => p && p._id !== user?._id);

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="h-16 border-b-2 border-black flex items-center justify-between px-6 bg-[#D4F4E4] relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-950 text-white border-2 border-black flex items-center justify-center font-bold">
            {currentChat.type === 'group' ? 'G' : otherParticipant?.name?.[0].toUpperCase() || '?'}
          </div>
          <div>
            <div className="text-sm font-black">{currentChat.type === 'group' ? currentChat.name : otherParticipant?.name}</div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-600 font-mono">
              <Shield className="w-2.5 h-2.5 text-green-600" /> End-to-end encrypted
            </div>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-black/5 rounded-none border-2 border-transparent active:border-black transition-all"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-black neo-shadow p-1 z-50">
              <button 
                onClick={handleDeleteChat}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <Trash2 className="w-4 h-4" /> Delete Chat
              </button>
            </div>
          )}
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAFAFA]"
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
              <MessageSquare className="w-8 h-8 text-zinc-400" />
            </div>
            <h4 className="text-lg font-black uppercase tracking-tight">No messages yet</h4>
            <p className="text-xs text-zinc-500 max-w-[200px] mt-1 font-medium italic">
              No messages found in this conversation. Start messaging now!
            </p>
          </div>
        )}
        {chatMessages.map((msg, i) => {
          const isMe = msg.sender?._id === user._id || msg.sender === user._id;
          return (
            <div 
              key={msg._id || i}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] group`}>
                {!isMe && (
                  <div className="text-[10px] font-mono text-zinc-500 mb-1 ml-1">
                    {msg.sender?.name}
                  </div>
                )}
                <div className={`
                  p-3 text-sm border-2 border-black neo-shadow
                  ${isMe ? 'bg-[#FF6B6B] text-black' : 'bg-white text-black'}
                `}>
                  {msg.content}
                </div>
                <div className={`text-[9px] font-mono text-zinc-400 mt-1 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t-2 border-black bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          {/* <button type="button" className="p-2 border-2 border-black neo-shadow bg-zinc-100 hover:bg-zinc-200">
            <Paperclip className="w-4 h-4" />
          </button> */}
          <input 
            type="text"
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-black focus:outline-none focus:bg-zinc-50 text-sm font-medium"
          />
          <button 
            type="submit" 
            disabled={!content.trim()}
            className="px-4 border-2 border-black neo-shadow bg-[#FF6B6B] hover:bg-[#ff5252] disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// End of file
