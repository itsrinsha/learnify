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
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
      {/* Sidebar - Instructor List */}
      <aside className="w-full lg:w-96 border-r border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Doubt Clearing</h2>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <MessageCircle size={20} />
          </div>
        </div>

        <div className="p-4 bg-slate-50/50">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search instructors..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
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
                </p>
              </div>
              {instructor.unread > 0 && (
                <div className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-lg flex items-center justify-center">
                  {instructor.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
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

        {/* Message Input */}
        <footer className="p-6 border-t border-slate-100 bg-white">
          <div className="p-4 bg-slate-50 rounded-3xl border border-slate-200 flex items-center gap-3 shadow-inner">
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Type your doubt here..." 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700"
            />
            <button 
              className={`p-3 rounded-2xl transition-all shadow-lg flex items-center justify-center ${
                messageText.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default StudentMessage;
