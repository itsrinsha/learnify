import { 
  deleteCourseAdminService, 
  deleteUserService, 
  getAllCoursesAdminService, 
  getAllUsersService,
  getInstructorRequestsService,
  updateInstructorStatusService,
  getAdminStatsService,
  getAllCategoriesService,
  addCategoryService,
  deleteCategoryService,
  getAllOffersService,
  addOfferService,
  deleteOfferService,
  getEarningsService,
  getInstructorAvailabilityService,
  updateCourseStatusService,
  getAdminLiveSessionsService
} from "../services/adminServices.js";

// ✅ Get all live sessions for admin
export const getAdminLiveSessions = async (req, res, next) => {
  try {
    const sessions = await getAdminLiveSessionsService();
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// ✅ Get admin dashboard stats
export const getAdminStats = async (req, res, next) => {
  try {
    const stats = await getAdminStatsService();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

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

// ✅ Update course status
export const updateCourseStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const course = await updateCourseStatusService(req.params.id, status);
    res.json({ message: `Course ${status}`, course });
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

// ✅ Categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesService();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const addCategory = async (req, res, next) => {
  try {
    const category = await addCategoryService(req.body);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await deleteCategoryService(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    next(error);
  }
};

// ✅ Offers
export const getAllOffers = async (req, res, next) => {
  try {
    const offers = await getAllOffersService();
    res.json(offers);
  } catch (error) {
    next(error);
  }
};

export const addOffer = async (req, res, next) => {
  try {
    const offer = await addOfferService(req.body);
    res.json(offer);
  } catch (error) {
    next(error);
  }
};

export const deleteOffer = async (req, res, next) => {
  try {
    await deleteOfferService(req.params.id);
    res.json({ message: "Offer deleted" });
  } catch (error) {
    next(error);
  }
};

// ✅ Earnings
export const getEarnings = async (req, res, next) => {
  try {
    const earnings = await getEarningsService();
    res.json(earnings);
  } catch (error) {
    next(error);
  }
};

// ✅ Availability
export const getInstructorAvailability = async (req, res, next) => {
  try {
    const availability = await getInstructorAvailabilityService();
    res.json(availability);
  } catch (error) {
    next(error);
  }
};
