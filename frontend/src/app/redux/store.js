import { configureStore } from '@reduxjs/toolkit';
import musicUploadsReducer from './slices/musicUploadsSlice';


export const store = configureStore({
  reducer: {
    musicUploads: musicUploadsReducer,
    },
});

export default store;