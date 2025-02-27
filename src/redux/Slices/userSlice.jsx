import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'useradd',
  initialState: {
    value: {},
  },
  reducers: {
    addUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
