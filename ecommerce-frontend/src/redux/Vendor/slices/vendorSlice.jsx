// menuSlice.js

import { createSlice } from '@reduxjs/toolkit';
const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    products: [],
    vendors: [],
    orders: [],
    adminOrders: [],
    totalRecords: 0,
    loading: false,
    error: null
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setVendors: (state, action) => {
      state.vendors = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload; // Assuming payload contains products array
    },
    setAdminOrders: (state, action) => {
      state.adminOrders = action.payload; // Assuming payload contains products array
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Handle errors if needed
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setProducts, setVendors, setOrders, setAdminOrders, setLoading, setError } = vendorSlice.actions;


export default vendorSlice.reducer;
