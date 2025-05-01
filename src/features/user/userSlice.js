import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from '../../services/authService';

// Async thunk
export const loginThunk = createAsyncThunk('user/login', async ({ email, password }) => {
  const res = await loginUser(email, password);
  const { token, user } = res.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    status: null,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearLoginStatus: (state) => {
      state.status = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setUser, clearUser, clearLoginStatus } = userSlice.actions;
export default userSlice.reducer;
