import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentTrack: null,
  musicUploads: [],
  loading: false,
  error: null,
};

const musicUploadsSlice = createSlice({
  name: 'musicUploads',
  initialState,
  reducers: {
    setMusicUploads: (state, action) => {   
      state.musicUploads = action.payload;
    },
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },  
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },  
  },
});

export const fetchAllMusicUploads = () => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      // debugger;
  
      const response = await fetch('/api/musicUploads', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('All Music Uploads:', data.musicUploads);
        dispatch(setCurrentTrack(data.musicUploads[0]));
        dispatch(setMusicUploads(data.musicUploads || []));
      } else {
        throw new Error("Failed to fetch music uploads");
      }
    } catch (error) {   
      console.error("Error fetching music uploads:", error);
      dispatch(setError(error.message));
    }
  };

export const { setMusicUploads, setCurrentTrack, setLoading, setError, clearError } = musicUploadsSlice.actions;

export default musicUploadsSlice.reducer;   