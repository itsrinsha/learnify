import React, { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  MoreVertical,
  ArrowRight,
  Loader2,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Link } from "react-router-dom";

import StatCard from "../../components/admin/StatCard";
import StatusBadge from "../../components/admin/StatusBadge";

import adminService from "../../services/adminService";

const data = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 2000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
  { name: "Jul", revenue: 3490 },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    chartData: []
  });

  const [requests, setRequests] = useState([]);

  const [latestUsers, setLatestUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          dashboardStats,
          pendingReqs,
          allUsers,
        ] = await Promise.all([
          adminService.getAdminStats(),
          adminService.getInstructorRequests(),
          adminService.getAllUsers(),
        ]);

        setStats(dashboardStats);

        setRequests(
          pendingReqs.slice(0, 5)
        );

        const sortedUsers = [...allUsers].sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

        setLatestUsers(sortedUsers);

      } catch (error) {

        console.error(
          "Failed to fetch dashboard data",
          error
        );

      } finally {

        setLoading(false);
      }
    };

    fetchDashboardData();

  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />

        <p className="text-slate-500 font-medium">
          Loading platform overview...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h2>

          <p className="text-slate-500 font-medium">
            Welcome back! Here's what's happening on Learnify today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            Download Report
          </button>

          <button className="px-6 py-3 bg-blue-600 rounded-2xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
            Platform Settings
          </button>
        </div>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Total Instructors"
          value={stats.totalInstructors.toLocaleString()}
          icon={GraduationCap}
          color="purple"
        />

        <StatCard
          title="Total Courses"
          value={stats.totalCourses.toLocaleString()}
          icon={BookOpen}
          color="green"
        />

        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Chart + Activity */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Revenue Chart */}

        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">

          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Revenue Overview
              </h3>

              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Real-time earnings tracking
              </p>
            </div>

            <select className="bg-slate-50 border-none text-xs font-black uppercase tracking-widest text-slate-500 rounded-xl focus:ring-0 px-4 py-2 cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData.length > 0 ? stats.chartData : data}>

                <defs>
                  <linearGradient
                    id="colorRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#2563eb"
                      stopOpacity={0.1}
                    />

                    <stop
                      offset="95%"
                      stopColor="#2563eb"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users */}

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">

          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900">
              Recent Users
            </h3>

            <Link
              to="/admin/users"
              className="text-blue-600 hover:text-blue-700 text-xs font-black uppercase tracking-widest"
            >
              View All
            </Link>
          </div>

          <div className="space-y-6">

            {latestUsers.slice(0, 5).map((user) => (

              <div
                key={user._id}
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-4">

                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      user.role === "instructor"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {user.name?.charAt(0) || "?"}
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      {user.name}
                    </p>

                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-300 font-bold">
                  {new Date(
                    user.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            ))}

            {latestUsers.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-4">
                No recent activity.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Instructor Requests */}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-8 border-b border-slate-100 flex items-center justify-between">

          <div>
            <h3 className="text-xl font-black text-slate-900">
              Pending Instructor Requests
            </h3>

            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Review and approve new teaching talent
            </p>
          </div>

          <Link
            to="/admin/instructors"
            className="p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100"
          >
            <MoreVertical
              size={20}
              className="text-slate-400"
            />
          </Link>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Instructor
                </th>

                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Expertise
                </th>

                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Status
                </th>

                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">

              {requests.map((req) => (

                <tr
                  key={req._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >

                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">

                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs">
                        {req.name?.charAt(0) || "?"}
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {req.name}
                        </p>

                        <p className="text-xs text-slate-400 font-medium">
                          {req.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-700">
                      {req.verificationDetails?.expertise || "N/A"}
                    </p>
                  </td>

                  <td className="px-8 py-6">
                    <StatusBadge status="Pending" />
                  </td>

                  <td className="px-8 py-6">
                    <Link
                      to="/admin/instructors"
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"
                    >
                      Review Application
                    </Link>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <Link
            to="/admin/instructors"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all"
          >
            Manage All Instructors
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Students Section */}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-8 border-b border-slate-100 flex items-center justify-between">

          <div>
            <h3 className="text-xl font-black text-slate-900">
              Recent Students
            </h3>

            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Overview of latest student registrations
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="bg-slate-50/50">

                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Student
                </th>

                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Email
                </th>

                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">

              {latestUsers
                .filter(
                  (u) => u.role === "student"
                )
                .slice(0, 5)
                .map((student) => (

                  <tr key={student._id}>

                    <td className="px-8 py-6">
                      {student.name}
                    </td>

                    <td className="px-8 py-6">
                      {student.email}
                    </td>

                    <td className="px-8 py-6">
                      {new Date(
                        student.createdAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;