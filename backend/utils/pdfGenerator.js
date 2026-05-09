import PDFDocument from "pdfkit";

export const generateCertificatePDF = (certData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
      });

      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // --- Certificate Design ---

      // Background Border
      doc
        .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(5)
        .stroke("#1e293b");

      doc
        .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .lineWidth(1)
        .stroke("#3b82f6");

      // Header
      doc
        .fillColor("#1e293b")
        .fontSize(40)
        .text("CERTIFICATE OF COMPLETION", 0, 100, { align: "center" });

      doc
        .fillColor("#64748b")
        .fontSize(16)
        .text("This is to certify that", 0, 160, { align: "center" });

      // Student Name
      doc
        .fillColor("#3b82f6")
        .fontSize(32)
        .text(certData.studentName.toUpperCase(), 0, 200, { align: "center" });

      doc
        .fillColor("#64748b")
        .fontSize(16)
        .text("has successfully completed the course", 0, 260, { align: "center" });

      // Course Name
      doc
        .fillColor("#1e293b")
        .fontSize(24)
        .text(certData.courseTitle, 0, 300, { align: "center" });

      // Instructor & Date
      doc
        .fillColor("#64748b")
        .fontSize(14)
        .text(`Issued on: ${certData.date}`, 100, 450);

      doc
        .fillColor("#64748b")
        .fontSize(14)
        .text(`Instructor: ${certData.instructorName}`, 0, 450, { align: "right", right: 100 });

      // ID & Verification
      doc
        .fillColor("#94a3b8")
        .fontSize(10)
        .text(`Certificate ID: ${certData.certificateId}`, 0, 520, { align: "center" });

      doc
        .fillColor("#3b82f6")
        .fontSize(10)
        .text("Verify at: learnify.com/verify", 0, 540, { align: "center", underline: true });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
