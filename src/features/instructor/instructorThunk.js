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
