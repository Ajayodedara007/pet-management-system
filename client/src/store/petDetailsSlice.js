import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axios";

export const fetchPetById = createAsyncThunk(
  "petDetails/fetchPetById",
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`/pets/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const petDetailsSlice = createSlice({
  name: "petDetails",
  initialState: {
    pet: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPetById.fulfilled, (state, action) => {
      state.loading = false;
      state.pet = action.payload;
    });
  },
});

export default petDetailsSlice.reducer;
