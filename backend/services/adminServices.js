import User from "../models/User.js";
import Course from "../models/Course.js";

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