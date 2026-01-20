import { createSlice } from "@reduxjs/toolkit";

const companyProfileSlice = createSlice({
  name: "companyProfile",
  initialState: {
    isEdit: false,
    info: {},
  },
  reducers: {
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
    setProfile: (state, action) => {
      state.info = action.payload;
    },
  },
});

export const { setIsEdit, setProfile } = companyProfileSlice.actions;

export default companyProfileSlice.reducer;
