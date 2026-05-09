import express from "express";
import { claimCertificate, getMyCertificates, downloadCertificatePDF } from "../controllers/certificateController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/claim", authMiddleware, claimCertificate);
router.get("/my-certificates", authMiddleware, getMyCertificates);
router.get("/download/:id", authMiddleware, downloadCertificatePDF);

export default router;
