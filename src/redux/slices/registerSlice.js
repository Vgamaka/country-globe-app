import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser } from '../../services/authService';

export const registerUserThunk = createAsyncThunk('user/register', async ({ email, password }) => {
  const res = await registerUser(email, password);
  return res.data;
});

const registerSlice = createSlice({
  name: 'register',
  initialState: {
    status: null,
    error: null,
  },
  reducers: {
    clearRegisterStatus: (state) => {
      state.status = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { clearRegisterStatus } = registerSlice.actions;
export default registerSlice.reducer;
