import { createAsyncThunk } from "@reduxjs/toolkit";
import courseService from "../../services/courseService";

// Fetch all courses
export const fetchAllCourses = createAsyncThunk(
  "courses/fetchAll",
  async (filters, { rejectWithValue }) => {
    try {
      const data = await courseService.getAllCourses(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch courses");
    }
  }
);

// Fetch course by ID
export const fetchCourseById = createAsyncThunk(
  "courses/fetchById",
  async (courseId, { rejectWithValue }) => {
    try {
      const data = await courseService.getCourseById(courseId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch course details");
    }
  }
);

// Enroll in a course
export const enrollInCourse = createAsyncThunk(
  "courses/enroll",
  async (courseId, { rejectWithValue }) => {
    try {
      const data = await courseService.enrollCourse(courseId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Enrollment failed");
    }
  }
);
