import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  dateOption: number;
}

const initialState: UIState = {
  dateOption: 0,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDateOption: (state, action) => {
      state.dateOption = action.payload;
    },
  },
});

export const { setDateOption } = uiSlice.actions;
export default uiSlice.reducer;