import User from "../models/User.js";
import Course from "../models/Course.js";
import Category from "../models/Category.js";
import Offer from "../models/Offer.js";
import Payment from "../models/Payment.js";
import { LiveSession } from "../models/LiveSetion.js";

// get all users
export const getAllUsersService = async () => {
  return await User.find().select("-password");
};

// delete user
export const deleteUserService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await user.deleteOne();

  return true;
};

// get all courses
export const getAllCoursesAdminService = async () => {
  return await Course.find().populate("instructor", "name");
};

// delete course
export const deleteCourseAdminService = async (courseId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  await course.deleteOne();

  return true;
};

// ✅ Update course approval status
export const updateCourseStatusService = async (courseId, status) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  course.approvalStatus = status;
  await course.save();
  return course;
};

// ✅ Get instructor requests (pending verification)
export const getInstructorRequestsService = async () => {
  return await User.find({ 
    role: "instructor", 
    approvalStatus: "pending" 
  }).select("-password");
};

// ✅ Update instructor approval status
export const updateInstructorStatusService = async (userId, status) => {
  const user = await User.findById(userId);

  if (!user || user.role !== "instructor") {
    throw new Error("Instructor not found");
  }

  user.approvalStatus = status;
  await user.save();

  return user;
};

// ✅ Get admin dashboard stats
export const getAdminStatsService = async () => {
  const [totalStudents, totalInstructors, totalCourses, pendingApprovals, totalRevenueAgg] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "instructor" }),
    Course.countDocuments(),
    User.countDocuments({ role: "instructor", approvalStatus: "pending" }),
    Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
  ]);

  // Weekly/Monthly chart data
  const monthlyData = await Payment.aggregate([
    { $match: { status: "paid" } },
    { $group: { 
        _id: { $month: "$createdAt" }, 
        revenue: { $sum: "$amount" } 
      } 
    },
    { $sort: { "_id": 1 } }
  ]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = monthlyData.map(d => ({
    name: months[d._id - 1],
    revenue: d.revenue
  }));

  return {
    totalStudents,
    totalInstructors,
    totalCourses,
    pendingApprovals,
    totalRevenue: totalRevenueAgg[0]?.total || 0,
    chartData
  };
};

// ✅ Categories Services
export const getAllCategoriesService = async () => {
  return await Category.find();
};

export const addCategoryService = async (data) => {
  return await Category.create(data);
};

export const deleteCategoryService = async (id) => {
  return await Category.findByIdAndDelete(id);
};

// ✅ Offers Services
export const getAllOffersService = async () => {
  return await Offer.find();
};

export const addOfferService = async (data) => {
  return await Offer.create(data);
};

export const deleteOfferService = async (id) => {
  return await Offer.findByIdAndDelete(id);
};

// ✅ Earnings Service
export const getEarningsService = async () => {
  const payments = await Payment.find({ status: "paid" }).populate("course", "title");
  
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const platformProfit = totalRevenue * 0.2; // Assuming 20% platform fee
  const instructorPayouts = totalRevenue * 0.8;

  // Monthly breakdown for chart (simple version)
  const monthlyData = await Payment.aggregate([
    { $match: { status: "paid" } },
    { $group: { 
        _id: { $month: "$createdAt" }, 
        revenue: { $sum: "$amount" } 
      } 
    },
    { $sort: { "_id": 1 } }
  ]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = monthlyData.map(d => ({
    name: months[d._id - 1],
    revenue: d.revenue
  }));

  return {
    totalRevenue,
    platformProfit,
    instructorPayouts,
    pendingPayouts: 0, // Placeholder
    chartData
  };
};

// ✅ Instructor Availability Service (Used for Instructor Availability page)
export const getInstructorAvailabilityService = async () => {
  return await LiveSession.find().populate("instructor", "name").populate("course", "title");
};

// ✅ Admin Live Sessions Service (Used for AdminLiveClasses page)
export const getAdminLiveSessionsService = async () => {
  return await LiveSession.find()
    .populate("instructor", "name email")
    .populate("course", "title")
    .sort({ startTime: -1 });
};