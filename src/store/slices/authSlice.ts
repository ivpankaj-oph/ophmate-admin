
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


interface AuthState {
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}


const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};
const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;


export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await  axios.post(`${BASE_URL}/admin/login`, credentials);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginAdmin.fulfilled,
        (state, action: PayloadAction<{ token: string; data: any }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.data;
          state.isAuthenticated = true;
        }
      )
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
