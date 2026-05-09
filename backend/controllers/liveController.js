import { asyncHandler } from "../middleware/trycatchmiddleware.js";
import { createLiveSessionService, endLiveSessionService, getLiveSessionsService, startLiveSessionService, getMyLiveSessionsService } from "../services/liveServices.js";


// ✅ Create
export const createLiveSession = async (req, res, next) => {
  
    const session = await createLiveSessionService({
      ...req.body,
      instructor: req.user.id,
    });

    res.status(201).json(session);
  next()
};

// ✅ Get
export const getLiveSessions = async (req, res, next) => {
  
    const sessions = await getLiveSessionsService(req.params.courseId);
    res.json(sessions);
  next()
};

// ✅ Get My Live Sessions
export const getMyLiveSessions = async (req, res, next) => {
  try {
    const sessions = await getMyLiveSessionsService(req.user.id);
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// ✅ Start
export const startLiveSession = async (req, res, next) => {
  
    await startLiveSessionService({
      sessionId: req.params.id,
      userId: req.user.id,
    });

    res.json({ message: "Live session started" });
 next()
};

// ✅ End
export const endLiveSession = async (req, res, next) => {
  
    await endLiveSessionService({
      sessionId: req.params.id,
      userId: req.user.id,
    });

    res.json({ message: "Live session ended" });
 next()
};