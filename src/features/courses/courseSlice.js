import { createSlice } from "@reduxjs/toolkit";
import { fetchAllCourses, fetchCourseById } from "./courseThunk";

const initialState = {
  courses: [],
  selectedCourse: null,
  loading: false,
  error: null,
  filters: {
    category: "",
    search: "",
  },
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Courses
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        // Safely extract courses array from response object or use payload if it's already an array
        state.courses = action.payload?.courses || (Array.isArray(action.payload) ? action.payload : []);
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Course
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        // Safely extract course object from response
        state.selectedCourse = action.payload?.course || action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearSelectedCourse } = courseSlice.actions;
export default courseSlice.reducer;
