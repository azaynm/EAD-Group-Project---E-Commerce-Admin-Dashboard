// menuSlice.js

import { createSlice } from '@reduxjs/toolkit';
const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    backend: "https://ead-backend-application.azurewebsites.net/api/v1",
    loggedUser:{},
    isLogged: false,
    role: "",
  },
  reducers: {
    setIsLogged: (state, action) => {
      state.isLogged = action.payload;
    },
    setLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setIsLogged, setLoggedUser, setRole } = authenticationSlice.actions;


export default authenticationSlice.reducer;
