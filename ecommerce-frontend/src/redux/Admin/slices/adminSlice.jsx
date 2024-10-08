import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    products: [],
    loading: false,
    error: null
  },
  reducers: {
    // Sets the products and totalRecords from the fetched data
    setProducts: (state, action) => {
      state.products = action.payload.products; // Assuming payload contains products array
      state.totalRecords = action.payload.totalCount; // Assuming payload contains totalCount
    },
  
    // Handle loading state if needed
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Handle errors if needed
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setProducts, setOrders, setLoading, setError } = adminSlice.actions;

export default adminSlice.reducer;
