import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SuccessState {
  successOpen: boolean;
  message: string;
}

const initialState: SuccessState = {
  successOpen: false,
  message: '',
};

export const successSlice = createSlice({
  name: 'success',
  initialState,
  reducers: {
    showSuccess: (state, action: PayloadAction<string>) => {
      state.successOpen = true;
      state.message = action.payload;
    },
    hideSuccess: (state) => {
      state.message = '';
      state.successOpen = false;
    },
  },
});

export const { showSuccess, hideSuccess } = successSlice.actions;

export default successSlice.reducer;
