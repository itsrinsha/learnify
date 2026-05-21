import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  CheckCheck, 
  Clock, 
  BookOpen, 
  MessageCircle,
  X,
  FileText,
  User,
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import chatService from '../../services/chatService';
import { toast } from 'react-hot-toast';

const StudentMessage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
      // Poll for new messages every 5 seconds
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
      // Ensure data is an array
      const conversationList = Array.isArray(data) ? data : (data?.conversations || []);
      setConversations(conversationList);
      
      if (conversationList.length > 0 && !selectedChat) {
        setSelectedChat(conversationList[0]._id);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError("Failed to load conversations.");
      setConversations([]);
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
      fetchConversations(); // Refresh last message in list
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const selectedContact = Array.isArray(conversations) ? conversations.find(c => c._id === selectedChat) : null;

  if (loading) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center bg-white rounded-[2.5rem] border border-slate-200">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
      {/* Sidebar - Contacts List */}
      <aside className="w-full lg:w-96 border-r border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Messages</h2>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <MessageCircle size={20} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {conversations.length > 0 ? conversations.map((contact) => (
            <div 
              key={contact._id} 
              onClick={() => setSelectedChat(contact._id)}
              className={`p-5 flex gap-4 cursor-pointer transition-all relative group ${
                selectedChat === contact._id ? 'bg-blue-50/50' : 'hover:bg-slate-50'
              }`}
            >
              {selectedChat === contact._id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
              <div className="relative flex-shrink-0">
                <img 
                  src={contact.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=2563eb&color=fff`} 
                  alt={contact.name} 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" 
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{contact.name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold">{new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-slate-500 truncate leading-relaxed font-medium">
                  {contact.lastMessage}
                </p>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center space-y-4 opacity-50">
              <User className="mx-auto text-slate-300" size={40} />
              <p className="text-sm text-slate-500 font-medium">No conversations yet.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {selectedChat ? (
          <>
            <header className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedContact?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedContact?.name || 'User')}&background=random`} 
                  className="w-12 h-12 rounded-2xl object-cover shadow-sm border-2 border-white" 
                  alt="Avatar"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {selectedContact?.name}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedContact?.email}</p>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                  <MessageCircle size={48} className="text-slate-300" />
                  <p className="text-slate-500 font-medium">No messages yet.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender === localStorage.getItem('userId') || msg.sender?._id === localStorage.getItem('userId');
                  return (
                    <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] space-y-1 ${isOwn ? 'items-end' : 'items-start'}`}>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm font-medium ${
                          isOwn 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                        }`}>
                          {msg.message}
                        </div>
                        <div className="flex items-center gap-1.5 px-2">
                          <span className="text-[10px] text-slate-400 font-bold">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isOwn && (
                            <CheckCheck size={12} className={msg.read ? 'text-blue-500' : 'text-slate-300'} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-6 border-t border-slate-100 bg-white">
              <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 rounded-3xl border border-slate-200 flex items-center gap-3">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700"
                />
                <button 
                  type="submit"
                  disabled={!messageText.trim()}
                  className={`p-3 rounded-2xl transition-all shadow-lg flex items-center justify-center ${
                    messageText.trim() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={20} />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40 space-y-6">
            <div className="p-10 bg-slate-100 rounded-full">
               <MessageCircle size={80} className="text-slate-300" />
            </div>
            <p className="text-xl font-bold text-slate-500">Select a conversation to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentMessage;
