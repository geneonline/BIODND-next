import { configureStore } from "@reduxjs/toolkit";
import companyProfileSlice from "./companyProfileSlice";

export default configureStore({
  reducer: {
    companyProfile: companyProfileSlice,
  },
});
