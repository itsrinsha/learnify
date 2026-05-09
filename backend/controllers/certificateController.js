import { checkEligibilityAndGenerateService, getStudentCertificatesService } from "../services/certificateService.js";
import { asyncHandler } from "../middleware/trycatchmiddleware.js";
import { generateCertificatePDF } from "../utils/pdfGenerator.js";
import Certificate from "../models/Certificate.js";

// ✅ Claim Certificate
export const claimCertificate = asyncHandler(async (req, res) => {
  const { examId } = req.body;
  const certificate = await checkEligibilityAndGenerateService(req.user.id, examId);
  res.status(201).json(certificate);
});

// ✅ Get My Certificates
export const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await getStudentCertificatesService(req.user.id);
  res.status(200).json(certificates);
});

// ✅ Download Certificate PDF
export const downloadCertificatePDF = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const certificate = await Certificate.findById(id)
    .populate("student", "name")
    .populate("course", "title")
    .populate("instructor", "name");

  if (!certificate) throw new Error("Certificate not found");
  if (certificate.student._id.toString() !== req.user.id) throw new Error("Not authorized");

  const certData = {
    studentName: certificate.student.name,
    courseTitle: certificate.course.title,
    instructorName: certificate.instructor.name,
    date: new Date(certificate.issueDate).toLocaleDateString(),
    certificateId: certificate.certificateId,
  };

  const pdfBuffer = await generateCertificatePDF(certData);

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=Certificate-${certificate.certificateId}.pdf`,
    "Content-Length": pdfBuffer.length,
  });

  res.send(pdfBuffer);
});
