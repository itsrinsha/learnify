import { asyncHandler } from "../middleware/trycatchmiddleware.js";
import { 
  createLiveSessionService, 
  endLiveSessionService, 
  getLiveSessionsService, 
  startLiveSessionService, 
  getMyLiveSessionsService,
  getInstructorSessionsService 
} from "../services/liveServices.js";


// ✅ Create
export const createLiveSession = async (req, res, next) => {
  try {
    const session = await createLiveSessionService({
      ...req.body,
      instructor: req.user.id,
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

// ✅ Get for a course
export const getLiveSessions = async (req, res, next) => {
  try {
    const sessions = await getLiveSessionsService(req.params.courseId);
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// ✅ Get My Live Sessions (for Student)
export const getMyLiveSessions = async (req, res, next) => {
  try {
    const sessions = await getMyLiveSessionsService(req.user.id);
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// ✅ Get Instructor Sessions
export const getInstructorSessions = async (req, res, next) => {
  try {
    const sessions = await getInstructorSessionsService(req.user.id);
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// ✅ Start
export const startLiveSession = async (req, res, next) => {
  try {
    await startLiveSessionService({
      sessionId: req.params.id,
      userId: req.user.id,
    });

    res.json({ message: "Live session started" });
  } catch (error) {
    next(error);
  }
};

// ✅ End
export const endLiveSession = async (req, res, next) => {
  try {
    await endLiveSessionService({
      sessionId: req.params.id,
      userId: req.user.id,
    });

    res.json({ message: "Live session ended" });
  } catch (error) {
    next(error);
  }
};