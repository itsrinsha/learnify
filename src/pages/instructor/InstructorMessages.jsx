import React, { useState } from 'react';
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
  Link as LinkIcon,
  X
} from 'lucide-react';

const InstructorMessages = () => {
  const [selectedChat, setSelectedChat] = useState(1);

  const chats = [
    {
      id: 1,
      student: 'Alice Johnson',
      course: 'Advanced React 19',
      lastMessage: 'I am having trouble with the new useActionState hook in React 19.',
      time: '10:30 AM',
      unread: 2,
      avatar: 'https://i.pravatar.cc/100?u=alice'
    },
    {
      id: 2,
      student: 'Bob Smith',
      course: 'Node.js Microservices',
      lastMessage: 'Is the Kafka setup covered in the next module?',
      time: 'Yesterday',
      unread: 0,
      avatar: 'https://i.pravatar.cc/100?u=bob'
    },
    {
      id: 3,
      student: 'Charlie Brown',
      course: 'Advanced React 19',
      lastMessage: 'The assignment submission is not working for me.',
      time: 'May 01',
      unread: 0,
      avatar: 'https://i.pravatar.cc/100?u=charlie'
    },
    {
      id: 4,
      student: 'David Miller',
      course: 'UI/UX Fundamentals',
      lastMessage: 'Thanks for the feedback on my Figma design!',
      time: 'Apr 28',
      unread: 0,
      avatar: 'https://i.pravatar.cc/100?u=david'
    }
  ];

  const messages = [
    { id: 1, sender: 'student', text: 'Hi Professor, I was going through the module on React 19 Server Components.', time: '10:25 AM' },
    { id: 2, sender: 'student', text: 'I am having trouble with the new useActionState hook. Could you explain it once more?', time: '10:26 AM' },
    { id: 3, sender: 'instructor', text: 'Hello Alice! useActionState is designed to handle form actions with pending states automatically.', time: '10:30 AM' },
    { id: 4, sender: 'instructor', text: 'Have you checked the documentation link I posted in the resources section?', time: '10:31 AM' },
  ];

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
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search students or courses..."
              className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">All</button>
            <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Unread</button>
            <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Archived</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-8">
          <div className="space-y-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 rounded-[2rem] flex items-center gap-4 transition-all ${
                  selectedChat === chat.id ? 'bg-blue-600 shadow-xl shadow-blue-100' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <img src={chat.avatar} alt={chat.student} className="w-14 h-14 rounded-2xl object-cover" />
                  {chat.unread > 0 && selectedChat !== chat.id && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className={`text-sm font-black ${selectedChat === chat.id ? 'text-white' : 'text-slate-900'}`}>{chat.student}</h4>
                    <span className={`text-[9px] font-bold ${selectedChat === chat.id ? 'text-blue-100' : 'text-slate-400'}`}>{chat.time}</span>
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${selectedChat === chat.id ? 'text-blue-200' : 'text-blue-600'}`}>
                    {chat.course}
                  </p>
                  <p className={`text-xs truncate max-w-[180px] font-medium ${selectedChat === chat.id ? 'text-white/80' : 'text-slate-500'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
              </button>
            ))}
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
                <img src={chats.find(c => c.id === selectedChat)?.avatar} alt="avatar" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="text-lg font-black text-slate-900 leading-tight">{chats.find(c => c.id === selectedChat)?.student}</h4>
                  <p className="text-xs font-bold text-blue-600 flex items-center gap-2 mt-1">
                    <BookOpen size={12} />
                    {chats.find(c => c.id === selectedChat)?.course}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                  <Search size={20} />
                </button>
                <button className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="flex justify-center">
                <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Today, May 02
                </span>
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'instructor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md space-y-2 ${msg.sender === 'instructor' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-5 rounded-[2rem] text-sm font-medium shadow-sm ${
                      msg.sender === 'instructor' 
                        ? 'bg-slate-900 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 ${msg.sender === 'instructor' ? 'flex-row-reverse' : ''}`}>
                      <span>{msg.time}</span>
                      {msg.sender === 'instructor' && <CheckCheck size={12} className="text-blue-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-8 bg-white border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors">
                    <Paperclip size={20} />
                  </button>
                  <button className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors">
                    <ImageIcon size={20} />
                  </button>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type your reply here..."
                    className="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-6">
            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-4">
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
