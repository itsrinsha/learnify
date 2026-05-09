import { 
  deleteCourseAdminService, 
  deleteUserService, 
  getAllCoursesAdminService, 
  getAllUsersService,
  getInstructorRequestsService,
  updateInstructorStatusService
} from "../services/adminServices.js";

// ✅ Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// ✅ Delete user
export const deleteUser = async (req, res, next) => {
  try {
    await deleteUserService(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

// ✅ Get all courses
export const getAllCoursesAdmin = async (req, res, next) => {
  try {
    const courses = await getAllCoursesAdminService();
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// ✅ Delete course
export const deleteCourseAdmin = async (req, res, next) => {
  try {
    await deleteCourseAdminService(req.params.id);
    res.json({ message: "Course deleted by admin" });
  } catch (error) {
    next(error);
  }
};

// ✅ Get instructor requests
export const getInstructorRequests = async (req, res, next) => {
  try {
    const requests = await getInstructorRequestsService();
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

// ✅ Approve instructor
export const approveInstructor = async (req, res, next) => {
  try {
    const user = await updateInstructorStatusService(req.params.id, "approved");
    res.json({ message: "Instructor approved", user });
  } catch (error) {
    next(error);
  }
};

// ✅ Reject instructor
export const rejectInstructor = async (req, res, next) => {
  try {
    const user = await updateInstructorStatusService(req.params.id, "rejected");
    res.json({ message: "Instructor rejected", user });
  } catch (error) {
    next(error);
  }
};
