import axios from 'axios';
import Swal from 'sweetalert2';
import { setAdminOrders, setError, setLoading, setOrders, setProducts, setVendors } from '../slices/vendorSlice';


export const createVendor = (vendorData) => {
  return async (dispatch, getState) => {
    try {
      console.log("Vendor Data", vendorData);

      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      // Get the backend URL from the state
      const { backend } = getState().authentication;

      // Make the POST request to the sign-up endpoint
      const response = await axios.post(
        `${backend}/auth/sign-up`, // Your vendor creation endpoint
        vendorData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      // // Access the current state of vendors
      // const currentVendors = getState().vendor.vendors || [];

      // // Dispatch an action to update the vendors list in the Redux store
      // dispatch(setVendors([...currentVendors, response.data]));

      // Optionally handle other success actions
      dispatch({ type: 'CREATE_VENDOR_SUCCESS', payload: response.data });

      // Notify the user of success using Swal
      Swal.fire("Success", "Vendor created successfully!", "success");

    } catch (error) {
      // Handle failure and show an error notification
      dispatch({ type: 'CREATE_VENDOR_FAILURE', payload: error.message });

      let errorMessage = "An error occurred while creating the vendor.";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || `Server responded with status: ${error.response.status}`;
      }

      Swal.fire("Error", errorMessage, "error");

      throw error; // Optionally re-throw the error for further error handling
    }
  };
};


// Create a new product
export const createProduct = (productData) => {
  return async (dispatch, getState) => {
    try {
      console.log("Product", productData)
      const token = localStorage.getItem("token");
      const { backend } = getState().authentication;
      console.log("Add ", productData)
      const response = await axios.post(
        `${backend}/product/create`,
        productData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      // Access the current state of products without useSelector
      const currentProducts = getState().vendor.products;

      // Dispatch an action to update the products in the store
      dispatch(setProducts([...currentProducts, response.data]));

      // Optionally handle other success actions
      dispatch({ type: 'CREATE_PRODUCT_SUCCESS', payload: response.data });

    } catch (error) {
      dispatch({ type: 'CREATE_PRODUCT_FAILURE', payload: error.message });
      throw error;
    }
  };
};

// Update a product
export const updateProduct = (productData) => {
  
  return async (dispatch, getState) => {
    try {
      console.log("update", productData)
      const token = localStorage.getItem("token");
      const { backend } = getState().authentication;

      const response = await axios.put(
        `${backend}/product/update`,
        productData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );



      // Optionally handle other success actions
      dispatch({ type: 'CREATE_PRODUCT_SUCCESS', payload: response.data });

    } catch (error) {
      dispatch({ type: 'CREATE_PRODUCT_FAILURE', payload: error.message });
      throw error;
    }
  };
};

export const updateStatus = (productId, status) => {
  return async (dispatch, getState) => {
    try {
      const token = localStorage.getItem("token");
      const { backend } = getState().authentication;
      const response = await axios.put(
        `${backend}/product/status?productID=${productId}&status=${status}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

     
      dispatch({ type: 'CREATE_PRODUCT_SUCCESS', payload: response.data });

    } catch (error) {
      dispatch({ type: 'CREATE_PRODUCT_FAILURE', payload: error.message });
      throw error;
    }
  };
};


export const fetchVendors = (role, pageNumber = 1, pageSize = 10) => {
  return async (dispatch, getState) => {
    const { backend } = getState().authentication;
    const token = localStorage.getItem('token');

    // Construct the base URL based on status
    let url = `${backend}/user/details/admin?userRole=${role}&pageNumber=${pageNumber}&pageSize=${pageSize}`;

    try {
      dispatch(setLoading(true)); // Set loading to true before fetching

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

     


      
      // Dispatch the processed products to the store
      dispatch(setVendors({
        vendors: response.data.body.userList
      }));

      console.log("From action ", response.data.body.userList)

      dispatch(setLoading(false)); // Set loading to false after fetching
      return response.data.body.totalCount;
    } catch (error) {
      console.error('Error fetching products:', error);
      dispatch(setError(error.message)); // Handle the error
      dispatch(setLoading(false)); // Set loading to false after error
      return { vendors: [], totalCount: 0 };
    }
  };
};

export const fetchVendorRating = (vendorId) => {
  return async (dispatch, getState) => {
    const { backend } = getState().authentication;
    const token = localStorage.getItem('token');

    // Construct the base URL based on status
    let url = `${backend}/user/details/`;

    try {
      dispatch(setLoading(true)); // Set loading to true before fetching

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

     


      
      // Dispatch the processed products to the store
      dispatch(setVendors({
        vendors: response.data.body.userList
      }));

      console.log("From action ", response.data.body.userList)

      dispatch(setLoading(false)); // Set loading to false after fetching
      return response.data.body.totalCount;
    } catch (error) {
      console.error('Error fetching products:', error);
      dispatch(setError(error.message)); // Handle the error
      dispatch(setLoading(false)); // Set loading to false after error
      return { vendors: [], totalCount: 0 };
    }
  };
};



export const fetchProductDetails = (productID) => {
  return async (dispatch, getState) => {
    try {
      const token = localStorage.getItem("token");
      const { backend } = getState().authentication;

      const response = await axios.get(
        `${backend}/product/${productID}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("Fetch", response.data.body);

      // Optionally dispatch a success action here if needed
      return { 
        productDetails: response.data.body
      };
      
    } catch (error) {
      dispatch({ type: 'CREATE_PRODUCT_FAILURE', payload: error.message });
      throw error;
    }
  };
};



export const fetchProducts = (page = 1, rows = 10) => {
  return async (dispatch, getState) => {
    try {
      const token = localStorage.getItem("token");
      const { backend } = getState().authentication;

      const response = await axios.get(
        `${backend}/product/vendor?pageNumber=${page}&pageSize=${rows}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("Fetch", response.data.body.products);
      
      // Dispatch the products to the store
      dispatch(setProducts(response.data.body.products));

      // Return the totalCount for further usage
      return { 
        totalCount: response.data.body.totalCount 
      };
      
    } catch (error) {
      dispatch({ type: 'CREATE_PRODUCT_FAILURE', payload: error.message });
      throw error;
    }
  };
};



export const deleteProduct = (productId) => {
  console.log(productId, "Deleted")
  return async (dispatch, getState) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const { backend, products } = getState().authentication;
        await axios.delete(`${backend}/product/${productId}`,

          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );
        
        Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire('Error!', 'There was an issue deleting the product.', 'error');
      }
    }
  };
};

export const fetchOrders = (status = 'Pending', pageNumber = 1, pageSize = 10) => {
  return async (dispatch, getState) => {
    const { backend } = getState().authentication;
    const token = localStorage.getItem('token');

    // Construct the base URL based on status
    let url = `${backend}/order/vendor/get?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    try {
      dispatch(setLoading(true)); // Set loading to true before fetching

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      // Log full response to understand its structure
      console.log("Full response:", response);

      // Dispatch the processed orders to the store
      if (response.data && response.data.body && response.data.body.orders) {
        dispatch(setOrders(response.data.body.orders));
        console.log("Orders data:", response.data.body.orders);
        return response.data.body.totalCount;
      } else {
        // If orders data is not as expected, handle the error
        console.error('Unexpected response format:', response);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      dispatch(setError(error.message)); // Handle the error
      dispatch(setLoading(false)); // Set loading to false after error
      return 0; // Return zero total count in case of error
    }
  };
};

export const fetchOrdersAdmin = (email, pageNumber = 1, pageSize = 10) => {
  return async (dispatch, getState) => {
    const { backend } = getState().authentication;
    const token = localStorage.getItem('token');
    
    // Construct the base URL based on status
    let url = `${backend}/order/admin/get?userEmail=${email}&pageNumber=${pageNumber}&pageSize=${pageSize}`;

    try {
      dispatch(setLoading(true)); // Set loading to true before fetching

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      // Log full response to understand its structure
      console.log("Full response:", response);

      // Dispatch the processed orders to the store
      if (response.data && response.data.body && response.data.body.orders) {
        
        console.log(response.data.body.orders);
        dispatch(setAdminOrders(response.data.body.orders))
        return response.data.body.orders;
      } else {
        // If orders data is not as expected, handle the error
        console.error('Unexpected response format:', response);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      dispatch(setError(error.message)); // Handle the error
      dispatch(setLoading(false)); // Set loading to false after error
      return 0; // Return zero total count in case of error
    }
  };
};

export const updateOrderStatus = (orderId, status) => {
  return async (dispatch, getState) => {
    const { backend } = getState().authentication;
    const token = localStorage.getItem('token');
    const response = await axios.put(`${backend}/order/item/status?orderItemId=${orderId}&status=${status}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    dispatch({ type: 'UPDATE_PRODUCT_STOCK_SUCCESS', payload: response.data });
  };
};




