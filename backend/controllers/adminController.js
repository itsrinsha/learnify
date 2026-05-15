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
  getAdminLiveSessionsService,
  getAllPaymentsService,
  getPaymentByIdService,
  getBlockedUsersService,
  blockUserService,
  unblockUserService,
  getActivityFeedService,
  getReportsDataService
} from "../services/adminServices.js";

// ✅ Get admin dashboard stats
export const getAdminStats = async (req, res, next) => {
  try {
    const stats = await getAdminStatsService();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// ✅ Users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await deleteUserService(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

// ✅ Courses
export const getAllCoursesAdmin = async (req, res, next) => {
  try {
    const courses = await getAllCoursesAdminService();
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

export const deleteCourseAdmin = async (req, res, next) => {
  try {
    await deleteCourseAdminService(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateCourseStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`[AdminController] Updating course ${id} status to: ${status}`);
    
    const course = await updateCourseStatusService(id, status);
    res.json({ 
      success: true,
      message: `Course ${status} successfully`, 
      course 
    });
  } catch (error) {
    console.error(`[AdminController] Error updating course status:`, error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Internal server error during course status update"
    });
  }
};

// ✅ Instructor Requests
export const getInstructorRequests = async (req, res, next) => {
  try {
    const requests = await getInstructorRequestsService();
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

export const approveInstructor = async (req, res, next) => {
  try {
    const user = await updateInstructorStatusService(req.params.id, "approved");
    res.json({ message: "Instructor approved", user });
  } catch (error) {
    next(error);
  }
};

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

// ✅ Earnings & Payments
export const getEarnings = async (req, res, next) => {
  try {
    const earnings = await getEarningsService();
    res.json(earnings);
  } catch (error) {
    next(error);
  }
};

export const getAllPayments = async (req, res, next) => {
  try {
    const payments = await getAllPaymentsService();
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await getPaymentByIdService(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

// ✅ Availability & Live Sessions
export const getInstructorAvailability = async (req, res, next) => {
  try {
    const availability = await getInstructorAvailabilityService();
    res.json(availability);
  } catch (error) {
    next(error);
  }
};

export const getAdminLiveSessions = async (req, res, next) => {
  try {
    const sessions = await getAdminLiveSessionsService();
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// ✅ User Blocking
export const getBlockedUsers = async (req, res, next) => {
  try {
    const users = await getBlockedUsersService();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const user = await blockUserService(req.params.id, reason, req.user.id);
    res.json({ message: "User blocked successfully", user });
  } catch (error) {
    next(error);
  }
};

export const unblockUser = async (req, res, next) => {
  try {
    const user = await unblockUserService(req.params.id);
    res.json({ message: "User unblocked successfully", user });
  } catch (error) {
    next(error);
  }
};

export const getActivityFeed = async (req, res, next) => {
  try {
    const activities = await getActivityFeedService();
    res.json(activities);
  } catch (error) {
    next(error);
  }
};

export const getReportsData = async (req, res, next) => {
  try {
    const reports = await getReportsDataService();
    res.json(reports);
  } catch (error) {
    next(error);
  }
};
