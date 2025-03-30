import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTrack: null,
  musicFiles: [],
  loading: false,
  error: null,
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setMusicFiles: (state, action) => {   
      state.musicFiles = action.payload;
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

export const fetchAllMusicFiles = () => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      // debugger;
  
      const response = await fetch('/api/music', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('All Music Files:', data);
        dispatch(setMusicFiles(data || []));
      } else {
        throw new Error("Failed to fetch music files");
      }
    } catch (error) {   
      console.error("Error fetching music files:", error);
      dispatch(setError(error.message));
    }
  };

export const { setMusicFiles, setCurrentTrack, setLoading, setError, clearError } = musicSlice.actions;

export default musicSlice.reducer;   