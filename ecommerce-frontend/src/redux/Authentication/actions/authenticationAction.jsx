// menuActions.js

import axios from 'axios';
import Swal from 'sweetalert2';
import { setIsLogged, setLoggedUser, setRole } from '../slices/authenticationSlice';
import { jwtDecode } from 'jwt-decode';


export const loginUser = (userName, password) => {
  return async (dispatch, getState) => {

    try {
      const { backend, loggedUser } = getState().authentication;
      const response = await axios.post(`${backend}/auth/sign-in`, {
        userName: userName,
        password: password
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", userName);


      dispatch(setIsLogged(true));


      // Decode the token to extract role
      const decodedToken = await jwtDecode(response.data.token);
      const role = await decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      console.log("role is, ", role)
      setRole(role)
      localStorage.setItem("role", role)
      console.log("Role in Redux state after dispatch:", getState().authentication.role);

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Logged in Successfully',
        showConfirmButton: false,
        timer: 1500
      });
      return Promise.resolve();

    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error case
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid username or password',
      });
      return Promise.reject(error);
    }
  };
};


export const redirectLogout = () => {
  return async (dispatch, getState) => {
    try {
      const { backend } = getState().authentication;
      const response = await axios.delete(`${backend}/${localStorage.getItem("token")}`);

    } catch (error) {

    }
    localStorage.setItem("token", null);
    dispatch(setIsLogged(false))
  };
};