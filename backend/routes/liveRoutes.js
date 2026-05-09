import express from "express";
import {
  createLiveSession,
  getLiveSessions,
  startLiveSession,
  endLiveSession,
  getMyLiveSessions,
} from "../controllers/liveController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";



const router = express.Router();

router.post("/", authMiddleware, createLiveSession);
router.get("/my-sessions", authMiddleware, getMyLiveSessions);
router.get("/:courseId", getLiveSessions);

router.put("/:id/start", authMiddleware, startLiveSession);
router.put("/:id/end", authMiddleware, endLiveSession);

export default router;