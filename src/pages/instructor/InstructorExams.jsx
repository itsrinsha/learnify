import React, { useState, useEffect } from "react";
import { 
  Award,
  Calendar,
  Clock,
  PlusCircle,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  User,
  BookOpen,
  FileText,
  AlertCircle,
  Loader2,
  Eye,
  Settings
} from "lucide-react";
import toast from "react-hot-toast";
import { getInstructorCourses } from "../../services/instructorService";
import { 
  getInstructorExams, 
  createExam, 
  updateExam, 
  deleteExam, 
  getInstructorAttemptRequests, 
  handleAttemptRequest 
} from "../../services/examService";

const InstructorExams = () => {
  const [activeTab, setActiveTab] = useState("all-exams");
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editExamId, setEditExamId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    scheduledDate: "",
    duration: 60,
    topics: "",
    attachment: "",
    maxAttempts: 3,
    passingMarks: 40
  });

  // Modal / Fine states for requests
  const [handlingRequestId, setHandlingRequestId] = useState(null);
  const [fineAmount, setFineAmount] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [coursesData, examsData, requestsData] = await Promise.all([
        getInstructorCourses(),
        getInstructorExams(),
        getInstructorAttemptRequests()
      ]);
      setCourses(coursesData);
      setExams(examsData);
      setRequests(requestsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load exams information");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course) {
      toast.error("Please select a course");
      return;
    }

    try {
      setSubmitting(true);
      const parsedTopics = formData.topics
        ? formData.topics.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        ...formData,
        topics: parsedTopics,
        duration: Number(formData.duration),
        maxAttempts: Number(formData.maxAttempts),
        passingMarks: Number(formData.passingMarks)
      };

      if (editExamId) {
        await updateExam(editExamId, payload);
        toast.success("Exam updated successfully");
      } else {
        await createExam(payload);
        toast.success("Exam created successfully");
      }

      // Reset Form & Switch Tab
      resetForm();
      const updatedExams = await getInstructorExams();
      setExams(updatedExams);
      setActiveTab("all-exams");
    } catch (error) {
      console.error("Error saving exam:", error);
      toast.error(error.response?.data?.message || "Failed to save exam");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (exam) => {
    setEditExamId(exam._id);
    setFormData({
      title: exam.title || "",
      description: exam.description || "",
      course: exam.course?._id || exam.course || "",
      scheduledDate: exam.scheduledDate ? new Date(exam.scheduledDate).toISOString().slice(0, 16) : "",
      duration: exam.duration || 60,
      topics: exam.topics ? exam.topics.join(", ") : "",
      attachment: exam.attachment || "",
      maxAttempts: exam.maxAttempts || 3,
      passingMarks: exam.passingMarks || 40
    });
    setActiveTab("create-exam");
  };

  const handleDeleteClick = async (examId) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      await deleteExam(examId);
      toast.success("Exam deleted successfully");
      setExams((prev) => prev.filter((exam) => exam._id !== examId));
    } catch (error) {
      console.error("Error deleting exam:", error);
      toast.error("Failed to delete exam");
    }
  };

  const resetForm = () => {
    setEditExamId(null);
    setFormData({
      title: "",
      description: "",
      course: "",
      scheduledDate: "",
      duration: 60,
      topics: "",
      attachment: "",
      maxAttempts: 3,
      passingMarks: 40
    });
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      await handleAttemptRequest(requestId, status, status === "approved" ? fineAmount : 0);
      toast.success(`Request ${status} successfully`);
      setHandlingRequestId(null);
      setFineAmount(0);
      const updatedRequests = await getInstructorAttemptRequests();
      setRequests(updatedRequests);
    } catch (error) {
      console.error("Error handling request:", error);
      toast.error("Failed to update request");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-white rounded-3xl border border-slate-200">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading Exam Module...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Exams & Assessments</h2>
          <p className="text-slate-500 mt-1">Schedule and manage examinations, topics, and extra attempt approval requests.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setActiveTab(activeTab === "create-exam" ? "all-exams" : "create-exam");
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm"
        >
          {activeTab === "create-exam" ? (
            <>
              <Eye size={18} /> View Exams
            </>
          ) : (
            <>
              <PlusCircle size={18} /> Create Exam
            </>
          )}
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("all-exams")}
          className={`px-6 py-3 border-b-2 text-sm font-semibold transition-all ${
            activeTab === "all-exams"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Active Exams ({exams.length})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-6 py-3 border-b-2 text-sm font-semibold transition-all relative ${
            activeTab === "requests"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Attempt Requests
          {requests.filter((r) => r.status === "pending").length > 0 && (
            <span className="absolute top-2 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => {
            if (activeTab !== "create-exam") resetForm();
            setActiveTab("create-exam");
          }}
          className={`px-6 py-3 border-b-2 text-sm font-semibold transition-all ${
            activeTab === "create-exam"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          {editExamId ? "Edit Exam" : "Create Exam"}
        </button>
      </div>

      {/* Content Area */}
      <div className="grid gap-6">
        {activeTab === "all-exams" && (
          <div className="grid gap-6">
            {exams.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 p-20 text-center flex flex-col items-center gap-4 bg-white rounded-3xl">
                <Award size={48} className="text-slate-300" />
                <p className="text-slate-500 font-medium italic">No exams scheduled yet.</p>
                <button
                  onClick={() => setActiveTab("create-exam")}
                  className="mt-2 text-sm font-bold text-blue-600 hover:underline"
                >
                  Create your first exam now
                </button>
              </div>
            ) : (
              exams.map((exam) => (
                <div key={exam._id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between gap-6 bg-slate-50/50">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText size={24} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-900">{exam.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                          <span className="flex items-center gap-1.5"><BookOpen size={14} /> {exam.course?.title}</span>
                          <span className="flex items-center gap-1.5 text-blue-600">
                            <Calendar size={14} /> 
                            {new Date(exam.scheduledDate).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1.5"><Clock size={14} /> {exam.duration} mins</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditClick(exam)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        title="Edit Exam"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(exam._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                        title="Delete Exam"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</h4>
                        <p className="text-sm text-slate-600 mt-1">{exam.description || "No description provided."}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Exam Topics</h4>
                        <div className="flex flex-wrap gap-2">
                          {exam.topics && exam.topics.length > 0 ? (
                            exam.topics.map((topic, i) => (
                              <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200 uppercase">
                                {topic}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">No specific topics defined</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Max Attempts</span>
                          <p className="text-lg font-bold text-slate-900 mt-0.5">{exam.maxAttempts}</p>
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Passing Score</span>
                          <p className="text-lg font-bold text-slate-900 mt-0.5">{exam.passingMarks}%</p>
                        </div>
                      </div>
                      {exam.attachment && (
                        <div className="text-xs text-blue-600 font-semibold truncate">
                          Attachment: <a href={exam.attachment} target="_blank" rel="noopener noreferrer" className="underline">{exam.attachment}</a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "requests" && (
          <div className="grid gap-6">
            {requests.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 p-20 text-center flex flex-col items-center gap-4 bg-white rounded-3xl">
                <CheckCircle className="text-slate-300" size={48} />
                <p className="text-slate-500 font-medium italic">No extra attempt requests found.</p>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request._id} className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                        {request.exam?.course?.title || "Course"}
                      </span>
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border ${
                        request.status === "pending"
                          ? "bg-amber-50 text-amber-600 border-amber-200"
                          : request.status === "approved"
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}>
                        {request.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 truncate">
                      Request for {request.exam?.title}
                    </h3>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <User size={14} /> {request.student?.name} ({request.student?.email})
                      </p>
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-700 block mb-1">Reason:</span>
                        {request.requestReason}
                      </p>
                    </div>

                    {request.status === "approved" && (
                      <p className="text-xs font-bold text-green-600">
                        Approved with Fine Amount: ${request.fineAmount} ({request.paymentStatus === "paid" ? "Paid" : "Unpaid"})
                      </p>
                    )}
                  </div>

                  {request.status === "pending" && (
                    <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                      {handlingRequestId === request._id ? (
                        <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Set Fine Amount ($)</label>
                          <input
                            type="number"
                            min="0"
                            value={fineAmount}
                            onChange={(e) => setFineAmount(Number(e.target.value))}
                            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm outline-none"
                            placeholder="0 for free"
                          />
                          <div className="flex gap-2 justify-end mt-1">
                            <button
                              onClick={() => handleRequestAction(request._id, "approved")}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setHandlingRequestId(null);
                                setFineAmount(0);
                              }}
                              className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setHandlingRequestId(request._id)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-all"
                          >
                            <CheckCircle size={14} /> Approve...
                          </button>
                          <button
                            onClick={() => handleRequestAction(request._id, "rejected")}
                            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "create-exam" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              {editExamId ? "Update Existing Exam" : "Configure New Assessment"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Select Course *</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                    disabled={!!editExamId}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  >
                    <option value="">-- Choose one of your courses --</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Exam Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Midterm Examination"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Description / Instruction</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Provide any instructions or resources here..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Scheduled Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Duration (Minutes) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Attachment URL (PDF)</label>
                  <input
                    type="text"
                    name="attachment"
                    value={formData.attachment}
                    onChange={handleInputChange}
                    placeholder="https://example.com/guidelines.pdf"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Topics (comma-separated)</label>
                  <input
                    type="text"
                    name="topics"
                    value={formData.topics}
                    onChange={handleInputChange}
                    placeholder="React, State Management, Hooks, Performance"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Max Attempts *</label>
                  <input
                    type="number"
                    name="maxAttempts"
                    value={formData.maxAttempts}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Passing Score (%) *</label>
                  <input
                    type="number"
                    name="passingMarks"
                    value={formData.passingMarks}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="100"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-blue-300 text-sm"
                >
                  {submitting ? "Saving..." : editExamId ? "Update Exam" : "Publish Exam"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorExams;
