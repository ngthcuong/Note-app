import { createSlice } from '@reduxjs/toolkit';

interface SnackbarState {
  isOpen: boolean;
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
}

const initialState: SnackbarState = {
  isOpen: false,
  message: '',
  severity: 'success',
};

export const snackBarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackbar: (
      state,
      action: {
        payload: {
          message: string;
          severity?: 'success' | 'error' | 'warning' | 'info';
        };
      }
    ) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    closeSnackbar: () => {
      return;
    },
  },
});

export const { openSnackbar, closeSnackbar } = snackBarSlice.actions;
export default snackBarSlice.reducer;
