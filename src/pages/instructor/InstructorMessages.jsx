import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Send, 
  MoreVertical, 
  CheckCheck, 
  MessageSquare,
  User,
  Loader2,
  Phone,
  Image as ImageIcon
} from 'lucide-react';
import chatService from '../../services/chatService';
import { toast } from 'react-hot-toast';
import { getSocket } from '../../sockets/socket';
import AudioCallModal from '../../components/call/AudioCallModal';

const InstructorMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [callModal, setCallModal] = useState({ open: false, phase: null, contact: null, incomingMeta: null });
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const queryUserId = new URLSearchParams(location.search).get('userId');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    fetchConversations();
  }, []);

  useEffect(() => {
    if (queryUserId && !selectedChat) {
      setSelectedChat(queryUserId);
    }
  }, [queryUserId, selectedChat]);

  // Incoming call listener + ensure socket is registered
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    // Guarantee this user is registered in the backend userSocketMap
    const uid = currentUser._id || currentUser.id;
    if (uid) socket.emit('addUser', uid);

    const handleIncomingCall = ({ callerInfo, callerSocketId }) => {
      setCallModal({ open: true, phase: 'incoming', contact: callerInfo, incomingMeta: { callerSocketId } });
    };
    socket.on('incoming-call', handleIncomingCall);
    return () => socket.off('incoming-call', handleIncomingCall);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
    
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (
        selectedChat && 
        (newMessage.sender === selectedChat || 
         newMessage.sender?._id === selectedChat || 
         newMessage.receiver === selectedChat || 
         newMessage.receiver?._id === selectedChat)
      ) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === newMessage._id);
          return exists ? prev : [...prev, newMessage];
        });
      }
      fetchConversations();
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
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
      let conversationList = Array.isArray(data) ? data : (data?.conversations || []);
      
      const queryName = new URLSearchParams(location.search).get('name') || "Student";

      if (queryUserId) {
        const exists = conversationList.find(c => c._id === queryUserId);
        if (!exists) {
          const tempContact = {
            _id: queryUserId,
            name: queryName,
            profileImage: "",
            lastMessage: "Start a conversation",
            lastMessageTime: new Date()
          };
          conversationList = [tempContact, ...conversationList];
        }
      }

      setConversations(conversationList);

      // Only auto-select when navigating from dashboard with a specific userId
      if (queryUserId) {
        setSelectedChat(queryUserId);
        setShowChat(false);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const data = await chatService.getMessages(userId);
      setMessages(Array.isArray(data) ? data : (data?.messages || []));
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    try {
      const tempMsg = messageText;
      setMessageText('');
      await chatService.sendMessage(selectedChat, tempMsg);
      fetchMessages(selectedChat);
      fetchConversations();
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const selectedContact = Array.isArray(conversations) ? conversations.find(c => c._id === selectedChat) : null;

  if (loading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center bg-white/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/50 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-2xl shadow-xl shadow-blue-500/10">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <p className="text-slate-500 font-medium text-sm animate-pulse">Loading student queries...</p>
        </div>
      </div>
    );
  }

  const handleSelectChat = (id) => {
    setSelectedChat(id);
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
  };

  const handleStartCall = () => {
    if (!selectedContact) return;
    const socket = getSocket();
    const callerId = currentUser._id || currentUser.id;
    console.log('[Call] Calling receiverId:', selectedChat, 'from caller:', callerId);
    socket.emit('call-user', {
      receiverId: selectedChat,
      callerInfo: {
        _id: callerId,
        name: currentUser.name,
        profileImage: currentUser.profileImage || currentUser.avatar || '',
      },
    });
    setCallModal({ open: true, phase: 'outgoing', contact: selectedContact, incomingMeta: null });
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row bg-slate-50/50 rounded-[2.5rem] border border-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>

      {/* Sidebar - Contacts List */}
      <aside className={`w-full lg:w-[380px] bg-white/70 backdrop-blur-2xl border-r border-white/60 overflow-hidden z-10 ${
        showChat ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'
      }`}>
        <div className="p-6 border-b border-slate-100/50 flex items-center justify-between bg-white/40">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Messages</h2>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Student Inquiries</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <MessageSquare size={20} className="fill-white/20" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {conversations.length > 0 ? conversations.map((contact) => (
            <button 
              key={contact._id} 
              onClick={() => handleSelectChat(contact._id)}
              className={`w-full text-left p-4 rounded-2xl flex gap-4 transition-all duration-300 relative group overflow-hidden ${
                selectedChat === contact._id 
                  ? 'bg-white shadow-xl shadow-slate-200/40 border border-white scale-[1.02]' 
                  : 'hover:bg-white/60 hover:shadow-md border border-transparent'
              }`}
            >
              {selectedChat === contact._id && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
              )}
              <div className="relative flex-shrink-0">
                <img 
                  src={contact.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=2563eb&color=fff`} 
                  alt={contact.name} 
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-105" 
                />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-bold truncate transition-colors ${selectedChat === contact._id ? 'text-slate-900' : 'text-slate-700'}`}>
                    {contact.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap ml-2">
                    {new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-xs truncate font-medium ${selectedChat === contact._id ? 'text-slate-600' : 'text-slate-500'}`}>
                  {contact.lastMessage}
                </p>
              </div>
            </button>
          )) : (
            <div className="p-10 text-center space-y-4 opacity-50 mt-10">
              <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto rotate-3">
                <User className="text-slate-400" size={28} />
              </div>
              <p className="text-sm font-bold text-slate-500">No student queries yet.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={`flex-1 overflow-hidden bg-transparent z-10 ${
        !showChat ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'
      }`}>
        {selectedChat ? (
          <>
            <header className="px-8 py-5 border-b border-white/60 flex items-center justify-between bg-white/60 backdrop-blur-xl">
              {/* Back button — mobile only */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="lg:hidden p-2 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                </button>
                <div className="relative">
                  <img 
                    src={selectedContact?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedContact?.name || 'User')}&background=random`} 
                    className="w-12 h-12 rounded-xl object-cover shadow-sm border-2 border-white" 
                    alt="Avatar"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base tracking-tight">
                    {selectedContact?.name}
                  </h3>
                  <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Student Online</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartCall}
                  title="Start audio call"
                  className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                  <Phone size={18} />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors ml-2">
                  <MoreVertical size={18} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 bg-slate-50/30">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <MessageSquare size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-bold text-sm">Start resolving the student's doubts.</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                  const currentUserId = currentUser._id || currentUser.id;
                  const isOwn = msg.sender === currentUserId || msg.sender?._id === currentUserId;
                  const prevMsg = idx > 0 ? messages[idx - 1] : null;
                  const showAvatar = !isOwn && (!prevMsg || prevMsg.sender !== msg.sender);
                  
                  return (
                    <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`flex gap-3 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isOwn && (
                          <div className="flex-shrink-0 w-8">
                            {showAvatar && (
                              <img 
                                src={selectedContact?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedContact?.name || 'User')}&background=random`} 
                                className="w-8 h-8 rounded-lg object-cover shadow-sm mt-1" 
                                alt="avatar"
                              />
                            )}
                          </div>
                        )}
                        <div className={`space-y-1 ${isOwn ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
                          <div className={`px-5 py-3.5 text-[15px] leading-relaxed font-medium shadow-sm relative group ${
                            isOwn 
                            ? 'bg-slate-900 text-white rounded-2xl rounded-tr-sm shadow-slate-900/10' 
                            : 'bg-white text-slate-700 rounded-2xl rounded-tl-sm border border-slate-100'
                          }`}>
                            {msg.message}
                          </div>
                          <div className={`flex items-center gap-1.5 px-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isOwn && (
                              <CheckCheck size={14} className={msg.read ? 'text-blue-500' : 'text-slate-300'} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-5 border-t border-white/60 bg-white/70 backdrop-blur-xl">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3 max-w-4xl mx-auto">
                <button type="button" className="p-3.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shrink-0 bg-white border border-slate-100 shadow-sm">
                  <ImageIcon size={20} />
                </button>
                <div className="flex-1 relative bg-white border border-slate-200 shadow-sm rounded-3xl flex items-center p-1 focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-500/10 transition-all">
                  <input 
                    type="text" 
                    placeholder="Type your reply..." 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-[15px] font-medium text-slate-700 px-5 py-3 outline-none"
                  />
                  <button 
                    type="submit"
                    disabled={!messageText.trim()}
                    className={`p-3 rounded-2xl transition-all flex items-center justify-center shrink-0 ${
                      messageText.trim() 
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 active:translate-y-0' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Send size={18} className={messageText.trim() ? 'ml-0.5' : ''} />
                  </button>
                </div>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-80 space-y-6 bg-slate-50/50">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-10 rounded-full"></div>
              <div className="p-8 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white relative">
                <MessageSquare size={64} className="text-blue-600/80" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Select a Conversation</h3>
              <p className="text-slate-500 font-medium mt-2 max-w-xs mx-auto">Choose a student from the sidebar to start addressing their doubts.</p>
            </div>
          </div>
        )}
      </main>

      {callModal.open && (
        <AudioCallModal
          phase={callModal.phase}
          contact={callModal.contact}
          incomingMeta={callModal.incomingMeta}
          socket={getSocket()}
          currentUser={currentUser}
          onClose={() => setCallModal({ open: false, phase: null, contact: null, incomingMeta: null })}
        />
      )}
    </div>
  );
};

export default InstructorMessages;
