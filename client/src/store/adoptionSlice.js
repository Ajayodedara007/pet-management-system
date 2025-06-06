import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axios";

const initialState = {
  applications: [],
  loading: false,
  error: null,
};

export const fetchMyApplications = createAsyncThunk(
  "adoptions/fetchMyApplications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/adoption/my");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAllApplications = createAsyncThunk(
  "adoptions/fetchAllApplications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/adoption");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "adoptions/updateApplicationStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/adoption/${id}`, { status });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const adoptionSlice = createSlice({
  name: "adoptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMyApplications.fulfilled, (state, action) => {
      state.loading = false;
      state.applications = action.payload;
    });
    builder.addCase(fetchAllApplications.fulfilled, (state, action) => {
      state.loading = false;
      state.applications = action.payload;
    });
  },
});

export default adoptionSlice.reducer;
