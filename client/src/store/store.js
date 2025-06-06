import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import petReducer from "./petSlice";
import adoptionReducer from "./adoptionSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petReducer,
    adoption: adoptionReducer,
  },
});
