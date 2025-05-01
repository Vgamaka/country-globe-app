import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import registerReducer from '../redux/slices/registerSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    register: registerReducer,    
  },
});
