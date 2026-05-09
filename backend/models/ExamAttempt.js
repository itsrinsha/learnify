import mongoose from "mongoose";

const examAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    attemptNumber: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    result: {
      type: String,
      enum: ["pass", "fail"],
      required: true,
    },
    feedback: String,
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ExamAttempt", examAttemptSchema);
