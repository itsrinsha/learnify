import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    duration: Number, // in minutes
    topics: [String],
    attachment: String, // PDF URL
    maxAttempts: {
      type: Number,
      default: 3,
    },
    passingMarks: {
      type: Number,
      default: 40,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
