import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, fetchUsers, setCurrentChat, createChat } from '../chat.slice';
import { Search, Plus, Users, MessageSquare } from 'lucide-react';
import { ChatSidebarSkeleton } from '../../../components/ui/skeleton';

export default function ChatSidebar() {
  const dispatch = useDispatch();
  const { chats, users, currentChat, loading } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    dispatch(fetchChats());
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredChats = chats.filter(chat => {
    if (!user?._id) return false;
    const otherParticipant = chat.participants?.find(p => p && p._id !== user._id);
    const name = chat.type === 'group' ? chat.name : otherParticipant?.name;
    return name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleStartDirectChat = (otherUser) => {
    dispatch(createChat({
      participants: [user._id, otherUser._id],
      type: 'direct'
    }));
    setShowUserList(false);
  };

  return (
    <div className="w-80 border-r-2 border-black bg-white flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b-2 border-black space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight">Messages</h2>
          <button 
            onClick={() => setShowUserList(!showUserList)}
            className="p-1.5 border-2 border-black neo-shadow bg-[#FDE68A] hover:bg-[#FACC15] transition"
          >
            {showUserList ? <MessageSquare className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border-2 border-black focus:outline-none focus:bg-zinc-50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showUserList ? (
          <div className="p-2 space-y-1">
            <div className="px-2 py-1 text-[10px] font-mono uppercase text-zinc-500">Start new conversation</div>
            {users.map(u => (
              <button
                key={u._id}
                onClick={() => handleStartDirectChat(u)}
                className="w-full flex items-center gap-3 p-2 hover:bg-[#D4F4E4] border-2 border-transparent hover:border-black transition text-left"
              >
                <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                  {u.name[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold">{u.name}</div>
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">{u.role}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {loading && chats.length === 0 ? (
              <ChatSidebarSkeleton />
            ) : filteredChats.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm italic">
                No conversations found.
              </div>
            ) : (
              filteredChats.map(chat => {
                const otherParticipant = chat.participants?.find(p => p && p._id !== user?._id);
                const isActive = currentChat?._id === chat._id;
                
                return (
                  <button
                    key={chat._id}
                    onClick={() => dispatch(setCurrentChat(chat))}
                    className={`w-full flex items-center gap-3 p-4 transition-all text-left ${
                      isActive ? 'bg-[#D4F4E4] border-l-4 border-black' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-zinc-200 border-2 border-black flex items-center justify-center font-black relative">
                      {chat.type === 'group' ? <Users className="w-6 h-6" /> : otherParticipant?.name[0].toUpperCase()}
                      {/* Status dot could go here */}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <div className="text-sm font-black truncate">
                          {chat.type === 'group' ? chat.name : otherParticipant?.name}
                        </div>
                        {chat.lastMessage && (
                          <div className="text-[10px] font-mono text-zinc-500">
                            {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 truncate mt-0.5">
                        {chat.lastMessage ? (
                          <span className={isActive ? 'text-black' : ''}>
                            {chat.lastMessage.sender?._id === user._id ? 'You: ' : ''}
                            {chat.lastMessage.content}
                          </span>
                        ) : 'No messages yet'}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
