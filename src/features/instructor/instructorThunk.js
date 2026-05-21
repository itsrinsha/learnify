import { createAsyncThunk } from "@reduxjs/toolkit";
import instructorService from "../../services/instructorService";

export const fetchInstructorDashboard = createAsyncThunk(
  "instructor/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const data = await instructorService.getInstructorDashboard();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch instructor dashboard");
    }
  }
);
export const fetchInstructorStudents = createAsyncThunk(
  "instructor/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const data = await instructorService.getInstructorStudents();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch instructor students");
    }
  }
);

export const fetchReviewHistory = createAsyncThunk(
  "instructor/fetchReviewHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instructorService.getReviewHistory();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch review history");
    }
  }
);

export const scheduleReviewThunk = createAsyncThunk(
  "instructor/scheduleReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await instructorService.scheduleReview(reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to schedule review");
    }
  }
);

export const updateReviewMarkThunk = createAsyncThunk(
  "instructor/updateReviewMark",
  async ({ reviewId, updateData }, { rejectWithValue }) => {
    try {
      const response = await instructorService.updateReviewMark(reviewId, updateData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update review mark");
    }
  }
);
