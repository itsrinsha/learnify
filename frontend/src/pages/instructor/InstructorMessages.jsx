import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  CheckCheck, 
  Filter, 
  MessageSquare,
  BookOpen,
  Image as ImageIcon,
  Loader2,
  User
} from 'lucide-react';
import chatService from '../../services/chatService';
import { toast } from 'react-hot-toast';

const InstructorMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
      const interval = setInterval(() => fetchMessages(selectedChat, true), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await chatService.getConversations();
      const conversationsData = Array.isArray(data) ? data : (data?.conversations || []);
      setConversations(conversationsData);
      
      if (conversationsData.length > 0 && !selectedChat) {
        setSelectedChat(conversationsData[0]._id);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId, isPolling = false) => {
    try {
      if (!isPolling) setMessagesLoading(true);
      const data = await chatService.getMessages(userId);
      setMessages(Array.isArray(data) ? data : (data?.messages || []));
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      if (!isPolling) setMessagesLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    try {
      const tempMsg = messageText;
      setMessageText('');
      await chatService.sendMessage(selectedChat, tempMsg);
      fetchMessages(selectedChat, true);
      fetchConversations();
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const selectedContact = Array.isArray(conversations) 
    ? conversations.find(c => c._id === selectedChat) 
    : null;

  if (loading) {
    return (
      <div className="h-[calc(100vh-12rem)] flex items-center justify-center bg-white rounded-[3rem] border border-slate-200">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col md:flex-row bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl">
      {/* Sidebar - Chat List */}
      <div className="w-full md:w-96 border-r border-slate-100 flex flex-col">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900">Messages</h3>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <div className="space-y-2">
            {conversations.length > 0 ? conversations.map((chat) => (
              <button
                key={chat._id}
                onClick={() => setSelectedChat(chat._id)}
                className={`w-full p-4 rounded-[2rem] flex items-center gap-4 transition-all ${
                  selectedChat === chat._id ? 'bg-blue-600 shadow-xl shadow-blue-100' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img 
                    src={chat.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=random`} 
                    alt={chat.name} 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" 
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className={`text-sm font-black truncate ${selectedChat === chat._id ? 'text-white' : 'text-slate-900'}`}>{chat.name}</h4>
                    <span className={`text-[9px] font-bold ${selectedChat === chat._id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-xs truncate font-medium ${selectedChat === chat._id ? 'text-white/80' : 'text-slate-500'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
              </button>
            )) : (
              <div className="text-center py-10 opacity-40">
                <User size={40} className="mx-auto text-slate-300" />
                <p className="mt-4 text-sm font-bold text-slate-500">No chats found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main - Chat Window */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-8 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <img 
                  src={selectedContact?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedContact?.name || 'User')}&background=random`} 
                  alt="avatar" 
                  className="w-12 h-12 rounded-xl object-cover border-2 border-slate-50 shadow-sm" 
                />
                <div>
                  <h4 className="text-lg font-black text-slate-900 leading-tight">{selectedContact?.name}</h4>
                  <p className="text-xs font-bold text-blue-600 mt-1">{selectedContact?.email}</p>
                </div>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {Array.isArray(messages) && messages.map((msg) => {
                const isOwn = msg.sender === localStorage.getItem('userId') || msg.sender?._id === localStorage.getItem('userId');
                return (
                  <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md space-y-1 ${isOwn ? 'items-end' : 'items-start'}`}>
                      <div className={`p-5 rounded-[2rem] text-sm font-medium shadow-sm ${
                        isOwn 
                          ? 'bg-slate-900 text-white rounded-tr-none' 
                          : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                      }`}>
                        {msg.message}
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-8 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type your reply here..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                  />
                  <button 
                    type="submit"
                    disabled={!messageText.trim()}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                      messageText.trim() ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg active:scale-95' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-6">
            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-4 shadow-inner">
              <MessageSquare size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Select a Conversation</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">Choose a student from the sidebar to start addressing their doubts.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorMessages;
