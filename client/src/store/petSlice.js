import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axios";

const initialState = {
  pets: [],
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,
  pet: {},
};

export const fetchPets = createAsyncThunk(
  "pets/fetchPets",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/pets?page=${page}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPetById = createAsyncThunk(
  "pets/fetchPetById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/pets/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addPet = createAsyncThunk(
  "pets/addPet",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/pets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || "Failed to add pet");
    }
  }
);

export const updatePet = createAsyncThunk(
  "pets/updatePet",
  async ({ id, petData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/pets/${id}`, petData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deletePet = createAsyncThunk(
  "pets/deletePet",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/pets/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const petSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPets.fulfilled, (state, action) => {
      state.loading = false;
      state.pets = action.payload.pets;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    });

    builder.addCase(fetchPetById.fulfilled, (state, action) => {
      state.loading = false;
      state.pet = action.payload;
    });

    builder.addCase(deletePet.fulfilled, (state, action) => {
      state.pets = state.pets.filter((pet) => pet._id !== action.payload);
    });
  },
});

export default petSlice.reducer;
