// store.js
import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from './Authentication/slices/authenticationSlice';
import vendorReducer from './Vendor/slices/vendorSlice';
import adminReducer from './Admin/slices/adminSlice';

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    vendor: vendorReducer,
    admin: adminReducer
  },
});

export default store;
