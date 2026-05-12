import { LiveSession } from "../models/LiveSetion.js";
import Enrollment from "../models/Enrollment.js";


// create
export const createLiveSessionService = async ({
  course,
  instructor,
  title,
  startTime,
  meetingLink,
}) => {
  return await LiveSession.create({
    course,
    instructor,
    title,
    startTime,
    meetingLink,
  });
};

// get sessions
export const getLiveSessionsService = async (courseId) => {
  return await LiveSession.find({ course: courseId })
    .populate("instructor", "name");
};

// get my sessions (for student)
export const getMyLiveSessionsService = async (userId) => {
  const enrollments = await Enrollment.find({ user: userId });
  const courseIds = enrollments.map((e) => e.course);
  
  return await LiveSession.find({ course: { $in: courseIds } })
    .populate("course", "title")
    .populate("instructor", "name profileImage");
};

// get instructor sessions
export const getInstructorSessionsService = async (instructorId) => {
  return await LiveSession.find({ instructor: instructorId })
    .populate("course", "title")
    .sort({ startTime: 1 });
};

// start session
export const startLiveSessionService = async ({ sessionId, userId }) => {
  const session = await LiveSession.findById(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.instructor.toString() !== userId) {
    const err = new Error("Not authorized");
    err.statusCode = 403;
    throw err;
  }

  if (session.isLive) {
    throw new Error("Session already live");
  }

  session.isLive = true;
  await session.save();

  return true;
};

// end session
export const endLiveSessionService = async ({ sessionId, userId }) => {
  const session = await LiveSession.findById(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.instructor.toString() !== userId) {
    const err = new Error("Not authorized");
    err.statusCode = 403;
    throw err;
  }

  if (!session.isLive) {
    throw new Error("Session is not live");
  }

  session.isLive = false;
  await session.save();

  return true;
};