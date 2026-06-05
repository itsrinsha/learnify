<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  CheckCheck,
  MessageSquare,
  Loader2,
  User,
  Phone
} from 'lucide-react';
import chatService from '../../services/chatService';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';
import { getMyInstructors } from '../../services/userService';
import AudioCall from '../../components/live/AudioCall';

const InstructorMessages = () => {
  const { socket, onlineUsers } = useSocket();
  const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = userFromStorage?._id || userFromStorage?.id || '';

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [callInfo, setCallInfo] = useState({
    status: 'idle', // 'idle' | 'outgoing' | 'incoming' | 'ongoing'
    roomId: '',
    peerId: '',
    peerName: '',
    peerAvatar: '',
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat]);

  // Real-time message & read status listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const isFromActiveChat = 
        newMessage.sender === selectedChat || 
        newMessage.sender?._id === selectedChat;

      if (isFromActiveChat) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
        chatService.markAsRead(selectedChat).catch((err) => console.error(err));
      }

      setConversations((prev) => {
        const chatIndex = prev.findIndex(
          (c) => c._id === newMessage.sender || c._id === newMessage.sender?._id || c._id === newMessage.receiver || c._id === newMessage.receiver?._id
        );

        if (chatIndex !== -1) {
          const updatedConversations = [...prev];
          const targetChat = { ...updatedConversations[chatIndex] };

          targetChat.lastMessage = newMessage.message;
          targetChat.lastMessageTime = newMessage.createdAt;

          // Increment unread if not active chat and not sent by current user
          const isOwn = newMessage.sender === currentUserId || newMessage.sender?._id === currentUserId;
          if (!isFromActiveChat && !isOwn) {
            targetChat.unreadCount = (targetChat.unreadCount || 0) + 1;
          }

          updatedConversations.splice(chatIndex, 1);
          updatedConversations.unshift(targetChat);
          return updatedConversations;
        } else {
          fetchConversations(true);
          return prev;
        }
      });
    };

    const handleMessagesRead = ({ senderId, receiverId }) => {
      if (selectedChat === receiverId) {
        setMessages((prev) =>
          prev.map((msg) => {
            const isOwn = msg.sender === currentUserId || msg.sender?._id === currentUserId;
            if (isOwn && !msg.read) {
              return { ...msg, read: true };
            }
            return msg;
          })
        );
      }
    };

    const handleIncomingCall = ({ from, callerName, roomId }) => {
      console.log("[Socket] Incoming call from:", from);
      const callerConversation = conversations.find(c => c._id === from);
      setCallInfo({
        status: 'incoming',
        roomId,
        peerId: from,
        peerName: callerName,
        peerAvatar: callerConversation?.profileImage || '',
      });
    };

    const handleCallAccepted = ({ from }) => {
      console.log("[Socket] Call accepted by:", from);
      setCallInfo(prev => ({
        ...prev,
        status: 'ongoing',
      }));
    };

    const handleCallRejected = ({ from }) => {
      console.log("[Socket] Call rejected by:", from);
      toast.error("Call declined");
      setCallInfo({
        status: 'idle',
        roomId: '',
        peerId: '',
        peerName: '',
        peerAvatar: '',
      });
    };

    const handleCallEnded = ({ from }) => {
      console.log("[Socket] Call ended by:", from);
      toast("Call ended");
      setCallInfo({
        status: 'idle',
        roomId: '',
        peerId: '',
        peerName: '',
        peerAvatar: '',
      });
    };

    const handleCallError = ({ message }) => {
      toast.error(message);
      setCallInfo({
        status: 'idle',
        roomId: '',
        peerId: '',
        peerName: '',
        peerAvatar: '',
      });
    };

    socket.on("new-message", handleNewMessage);
    socket.on("messages-read", handleMessagesRead);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("call-rejected", handleCallRejected);
    socket.on("call-ended", handleCallEnded);
    socket.on("call-error", handleCallError);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("messages-read", handleMessagesRead);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("call-rejected", handleCallRejected);
      socket.off("call-ended", handleCallEnded);
      socket.off("call-error", handleCallError);
    };
  }, [socket, selectedChat, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const fetchConversations = async (isPolling = false) => {
    try {
      if (!isPolling) {
        setLoading(true);
      }

      // Fetch active conversations
      const data = await chatService.getConversations();
      const conversationsData = Array.isArray(data)
        ? data
        : (data?.conversations || []);

      // Fetch enrolled instructors
      let instructors = [];
      try {
        instructors = await getMyInstructors();
      } catch (err) {
        console.error("Failed to fetch enrolled instructors:", err);
      }

      // Merge active conversations with enrolled instructors (preventing duplicates)
      const mergedConversations = [...conversationsData];
      const instructorsList = Array.isArray(instructors) ? instructors : [];
      
      const uniqueInstructors = [];
      const seenIds = new Set();
      instructorsList.forEach(inst => {
        if (inst && inst._id && !seenIds.has(inst._id.toString())) {
          seenIds.add(inst._id.toString());
          uniqueInstructors.push(inst);
        }
      });

      uniqueInstructors.forEach((instructor) => {
        const hasConversation = conversationsData.some(
          (c) => c._id.toString() === instructor._id.toString()
        );

        if (!hasConversation) {
          mergedConversations.push({
            _id: instructor._id,
            name: instructor.name,
            email: instructor.email,
            profileImage: instructor.profileImage,
            lastMessage: "No messages yet. Click to start chatting!",
            lastMessageTime: new Date(0).toISOString(),
            unreadCount: 0,
            isInstructorOnly: true,
          });
        }
      });

      // Sort: active chats first, new instructors at the bottom
      mergedConversations.sort((a, b) => {
        const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
        const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
        return timeB - timeA;
      });

      setConversations(mergedConversations);

      if (mergedConversations.length > 0 && !selectedChat && !isPolling) {
        const defaultChatId = mergedConversations[0]._id;
        setSelectedChat(defaultChatId);
        chatService.markAsRead(defaultChatId).catch((err) => console.error("Error marking default chat as read:", err));
        const activeChat = mergedConversations.find(c => c._id === defaultChatId);
        if (activeChat) activeChat.unreadCount = 0;
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (!isPolling) {
        setLoading(false);
      }
    }
  };

  const fetchMessages = async (
    userId,
    isPolling = false
  ) => {

    try {

      if (!isPolling) {
        setMessagesLoading(true);
      }

      const data = await chatService.getMessages(userId);

      setMessages(
        Array.isArray(data)
          ? data
          : (data?.messages || [])
      );

    } catch (error) {

      console.log(error);

    } finally {

      if (!isPolling) {
        setMessagesLoading(false);
      }

    }

  };

  const openConversation = async (chatId) => {

    setSelectedChat(chatId);

    try {

      await chatService.markAsRead(chatId);

      setConversations((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                unreadCount: 0
              }
            : chat
        )
      );

    } catch (error) {

      console.log(error);

    }

  };

  const handleSendMessage = async (e) => {

    e.preventDefault();

    if (!messageText.trim() || !selectedChat) {
      return;
    }

    try {

      const tempMessage = messageText;

      setMessageText('');

      const sentMsg = await chatService.sendMessage(
        selectedChat,
        tempMessage
      );

      // Append immediately
      setMessages((prev) => {
        if (prev.some((m) => m._id === sentMsg._id)) return prev;
        return [...prev, sentMsg];
      });

      // Update sidebar locally (bubble to top)
      setConversations((prev) => {
        const chatIndex = prev.findIndex((c) => c._id === selectedChat);
        if (chatIndex !== -1) {
          const updatedConversations = [...prev];
          const targetChat = { ...updatedConversations[chatIndex] };
          targetChat.lastMessage = sentMsg.message;
          targetChat.lastMessageTime = sentMsg.createdAt;
          updatedConversations.splice(chatIndex, 1);
          updatedConversations.unshift(targetChat);
          return updatedConversations;
        } else {
          fetchConversations(true);
          return prev;
        }
      });

    } catch (error) {

      toast.error('Failed to send message');

    }

  };

  // Derived: must be before any function that uses selectedContact
  const selectedContact = Array.isArray(conversations)
    ? conversations.find((c) => c._id === selectedChat)
    : null;

  const handleStartCall = () => {
    if (!selectedChat || !selectedContact || !socket) return;

    if (!onlineUsers.includes(selectedChat)) {
      toast.error(`${selectedContact.name} is offline`);
      return;
    }

    const roomId = `call-${currentUserId}-${selectedChat}-${Date.now()}`;
    const callerName = userFromStorage?.name || "Student";

    // Caller joins the room immediately so they're ready for the WebRTC offer
    socket.emit("join-room", roomId);

    setCallInfo({
      status: 'outgoing',
      roomId,
      peerId: selectedChat,
      peerName: selectedContact.name,
      peerAvatar: selectedContact.profileImage || '',
    });

    socket.emit("call-user", {
      userToCall: selectedChat,
      callerName,
      roomId,
    });
  };

  const handleAcceptCall = () => {
    if (!socket || !callInfo.peerId) return;
    // Callee must join the WebRTC room BEFORE accepting so offer/answer relay works
    if (callInfo.roomId) {
      socket.emit("join-room", callInfo.roomId);
    }
    socket.emit("accept-call", { to: callInfo.peerId });
    setCallInfo((prev) => ({
      ...prev,
      status: 'ongoing',
    }));
  };

  const handleRejectCall = () => {
    if (!socket || !callInfo.peerId) return;
    socket.emit("reject-call", { to: callInfo.peerId });
    setCallInfo({
      status: 'idle',
      roomId: '',
      peerId: '',
      peerName: '',
      peerAvatar: '',
    });
  };

  const handleEndCall = () => {
    if (!socket) return;
    if (callInfo.peerId) {
      socket.emit("end-call", { to: callInfo.peerId, roomId: callInfo.roomId });
    }
    setCallInfo({
      status: 'idle',
      roomId: '',
      peerId: '',
      peerName: '',
      peerAvatar: '',
    });
  };

  if (loading) {

    return (
      <div className="h-full flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );

=======
import React, { useState, useEffect } from 'react';
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
import { getMyInstructors } from '../../services/userService';

const StudentMessage = () => {
  const [instructors, setInstructors] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMessages] = useState([]); // Will be used for real-time messages later

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const data = await getMyInstructors();
      setInstructors(data);
      if (data.length > 0) {
        setSelectedChat(data[0]._id);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching instructors:", err);
      setError("Failed to load instructors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const selectedInstructor = instructors.find(i => i._id === selectedChat);

  if (loading) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center bg-white rounded-[2.5rem] border border-slate-200">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading your instructors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center bg-white rounded-[2.5rem] border border-slate-200">
        <div className="flex flex-col items-center gap-4 text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-bold text-slate-900">Oops! Something went wrong</h3>
          <p className="text-slate-500 max-w-md">{error}</p>
          <button 
            onClick={fetchInstructors}
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (instructors.length === 0) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center bg-white rounded-[2.5rem] border border-slate-200">
        <div className="flex flex-col items-center gap-4 text-center p-6">
          <div className="p-6 bg-blue-50 text-blue-600 rounded-[2rem] mb-2">
            <User size={48} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">No Instructors Yet</h3>
          <p className="text-slate-500 max-w-sm">
            Enrolled in a course to start chatting with your instructors and clearing your doubts.
          </p>
        </div>
      </div>
    );
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
  }

  return (
    <div className="h-full flex flex-col lg:flex-row bg-white overflow-hidden">

      {/* Sidebar */}
      <aside className="w-full lg:w-96 border-r border-slate-100 flex flex-col overflow-hidden">

        <div className="p-6 border-b border-slate-100 flex items-center justify-between">

          <h2 className="text-xl font-bold text-slate-900">
            Messages
          </h2>

          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <MessageSquare size={20} />
          </div>

        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
<<<<<<< HEAD

          {
            conversations.length > 0 ? (
              conversations.map((chat) => (

                <div
                  key={chat._id}
                  onClick={() => openConversation(chat._id)}
                  className={`p-5 flex gap-4 cursor-pointer transition-all relative group ${
                    selectedChat === chat._id
                      ? 'bg-blue-50/50'
                      : 'hover:bg-slate-50'
                  }`}
                >

                  {
                    selectedChat === chat._id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                    )
                  }

                  <div className="relative flex-shrink-0">

                    <img
                      src={
                        chat.profileImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=2563eb&color=fff`
                      }
                      alt={chat.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                    />

                    {onlineUsers.includes(chat._id) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}

                  </div>

                  <div className="flex-1 min-w-0">

                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {chat.name}
                        </h4>
                        {chat.unreadCount > 0 && (
                          <span className="shrink-0 min-w-[20px] h-[20px] px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 font-bold shrink-0">
                        {chat.lastMessageTime && new Date(chat.lastMessageTime).getTime() > 0 ? (
                          new Date(chat.lastMessageTime).toLocaleTimeString(
                            [],
                            {
                              hour: '2-digit',
                              minute: '2-digit'
                            }
                          )
                        ) : (
                          ''
                        )}
                      </span>

                    </div>

                    <p className="text-xs text-slate-500 truncate leading-relaxed font-medium">
                      {chat.lastMessage}
                    </p>

                  </div>

                </div>

              ))
            ) : (

              <div className="p-10 text-center space-y-4 opacity-50">

                <User
                  className="mx-auto text-slate-300"
                  size={40}
                />

                <p className="text-sm text-slate-500 font-medium">
                  No conversations yet.
=======
          {instructors.map((instructor) => (
            <div 
              key={instructor._id + (instructor.course?._id || '')} 
              onClick={() => setSelectedChat(instructor._id)}
              className={`p-5 flex gap-4 cursor-pointer transition-all hover:bg-slate-50 ${
                selectedChat === instructor._id ? 'bg-blue-50/50 border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <img 
                  src={instructor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=random`} 
                  alt={instructor.name} 
                  className="w-14 h-14 rounded-2xl object-cover" 
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  instructor.status === 'online' ? 'bg-green-500' : 'bg-slate-300'
                }`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{instructor.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{instructor.time || ''}</span>
                </div>
                <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mb-1 truncate">
                  <BookOpen size={10} /> {instructor.course?.title || 'No Course Info'}
                </p>
                <p className="text-xs text-slate-400 truncate leading-relaxed">
                  {instructor.lastMessage || 'Start a conversation...'}
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
                </p>

              </div>

            )
          }

        </div>

      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
<<<<<<< HEAD

        {
          selectedChat ? (
            <>

              {/* Header */}
              <header className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">

              <div className="flex items-center gap-4">

                  <img
                    src={
                      selectedContact?.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedContact?.name || 'User')}&background=random`
                    }
                    className="w-12 h-12 rounded-2xl object-cover shadow-sm border-2 border-white"
                    alt="Avatar"
                  />

                  <div>

                    <h3 className="font-bold text-slate-900 text-base">
                      {selectedContact?.name}
                    </h3>

                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-500">
                        {selectedContact?.email}
                      </p>
                      <span className="text-[10px] text-slate-300">•</span>
                      <p className="text-xs flex items-center gap-1">
                        {onlineUsers.map(String).includes(String(selectedContact?._id)) ? (
                          <>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
                            <span className="text-green-600 font-bold">Online</span>
                          </>
                        ) : (
                          <span className="text-slate-400 font-medium">Offline</span>
                        )}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Call Button - Always Visible */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleStartCall}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 ${
                      onlineUsers.map(String).includes(String(selectedContact?._id))
                        ? "bg-green-500 hover:bg-green-600 text-white shadow-green-200 cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                    title={onlineUsers.map(String).includes(String(selectedContact?._id)) ? "Start Voice Call" : `${selectedContact?.name || 'Instructor'} is offline`}
                  >
                    <Phone size={16} className={onlineUsers.map(String).includes(String(selectedContact?._id)) ? "animate-pulse" : ""} />
                    <span>Voice Call</span>
                  </button>
                </div>

              </header>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">

                {
                  messages.length === 0 ? (

                    <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">

                      <MessageSquare
                        size={48}
                        className="text-slate-300"
                      />

                      <p className="text-slate-500 font-medium">
                        No messages yet.
                      </p>

                    </div>

                  ) : (

                    messages.map((msg) => {

                      const isOwn =
                        msg.sender === currentUserId ||
                        msg.sender?._id === currentUserId;

                      return (

                        <div
                          key={msg._id}
                          className={`flex ${
                            isOwn
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >

                          <div className={`max-w-[75%] space-y-1 ${
                            isOwn
                              ? 'items-end'
                              : 'items-start'
                          }`}>

                            <div
                              className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm font-medium ${
                                isOwn
                                  ? 'bg-blue-600 text-white rounded-tr-none'
                                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                              }`}
                            >
                              {msg.message}
                            </div>

                            <div className="flex items-center gap-1.5 px-2">

                              <span className="text-[10px] text-slate-400 font-bold">

                                {
                                  new Date(
                                    msg.createdAt
                                  ).toLocaleTimeString(
                                    [],
                                    {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }
                                  )
                                }

                              </span>

                              {
                                isOwn && (
                                  <CheckCheck
                                    size={12}
                                    className={
                                      msg.read
                                        ? 'text-blue-500'
                                        : 'text-slate-300'
                                    }
                                  />
                                )
                              }

                            </div>

                          </div>

                        </div>

                      );

                    })

                  )
                }

                <div ref={messagesEndRef} />

              </div>
=======
        {/* Chat Header */}
        <header className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
            <img 
              src={selectedInstructor?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedInstructor?.name || 'User')}&background=random`} 
              className="w-12 h-12 rounded-2xl object-cover shadow-sm border-2 border-white" 
              alt="Avatar"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {selectedInstructor?.name}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${selectedInstructor?.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                {selectedInstructor?.course?.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-slate-500 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all">
              <Info size={20} />
            </button>
            <button className="p-2.5 text-slate-500 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
        </header>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
          {currentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
              <MessageCircle size={48} className="text-slate-300" />
              <p className="text-slate-500 font-medium">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <span className="px-4 py-1.5 bg-white rounded-full border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">
                  Today
                </span>
              </div>

              {currentMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] space-y-2 ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'student' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-bold ${
                      msg.sender === 'student' ? 'flex-row-reverse text-slate-400' : 'text-slate-400'
                    }`}>
                      <span>{msg.time}</span>
                      {msg.sender === 'student' && <CheckCheck size={14} className="text-blue-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)

              {/* Input */}
              <footer className="p-6 border-t border-slate-100 bg-white">

                <form
                  onSubmit={handleSendMessage}
                  className="p-4 bg-slate-50 rounded-3xl border border-slate-200 flex items-center gap-3"
                >

                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) =>
                      setMessageText(e.target.value)
                    }
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 outline-none"
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

                <MessageSquare
                  size={80}
                  className="text-slate-300"
                />

              </div>

              <p className="text-xl font-bold text-slate-500">
                Select a conversation to start chatting
              </p>

            </div>

          )
        }

      </main>

      {callInfo.status !== 'idle' && (
        <AudioCall
          roomId={callInfo.roomId}
          peerId={callInfo.peerId}
          peerName={callInfo.peerName}
          peerAvatar={callInfo.peerAvatar}
          callDirection={callInfo.status}
          socket={socket}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
          onEndCall={handleEndCall}
        />
      )}

    </div>
  );

};

export default InstructorMessages;