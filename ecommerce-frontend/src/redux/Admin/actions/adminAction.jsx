import axios from 'axios';
import Swal from 'sweetalert2';
import { setError, setLoading, setOrders, setProducts } from '../slices/adminSlice';


// Action Creator for Activating Account
export const activateAccount = (activationEmail) => {
  return async (dispatch, getState) => {
    try {
      // Retrieve token from local storage
      const token = localStorage.getItem('token');
      const { backend } = getState().authentication; // Get the backend URL from Redux state

      if (!token) {
        // If no token is found, alert the user and stop execution
        Swal.fire({
          title: "Error!",
          text: "Authentication token is missing.",
          icon: "error"
        });
        return;
      }

      // Send the activation request with Bearer token
      const response = await axios.get(`${backend}/user/activate/${activationEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Handle response status
      if (response && response.status === 200) {
        // Success - Account activated
        Swal.fire({
          title: "Activated!",
          text: "User account has been activated.",
          icon: "success"
        });

        // Dispatch a success action
        dispatch({ type: 'ACTIVATE_ACCOUNT_SUCCESS', payload: activationEmail });

      } else if (response && response.status === 409) {
        // Account is already activated
        Swal.fire({
          title: "Reminder!",
          text: "User account is already activated.",
          icon: "info"
        });

        // Optionally, you can dispatch a separate action for already activated
        dispatch({ type: 'ACTIVATE_ACCOUNT_ALREADY_ACTIVATED', payload: activationEmail });

      } else {
        // Unexpected error
        Swal.fire({
          title: "Error!",
          text: "An error occurred during activation.",
          icon: "error"
        });

        // Dispatch failure action
        dispatch({ type: 'ACTIVATE_ACCOUNT_FAILURE', payload: "An error occurred during activation." });
      }
    } catch (error) {
      // Handle any errors that occur during the request
      let errorMessage = "An error occurred while activating the account.";

      // Provide specific error details if available
      if (error.response) {
        // Server responded with a status code out of 2xx range
        errorMessage = error.response.data.message || `Server responded with status: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response received from server.";
      } else {
        // Other errors
        errorMessage = error.message || errorMessage;
      }

      // Alert the user about the error
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error"
      });

      // Dispatch failure action
      dispatch({ type: 'ACTIVATE_ACCOUNT_FAILURE', payload: errorMessage });

      throw error; // Re-throw the error for any additional handling
    }
  };
};


//admin
//..........
// ...........




// Update Product Stock
export const updateProductStatus = (productID, isVisible) => {
  return async (dispatch, getState) => {
    console.log("Updating", productID, isVisible)
    const newStatus = isVisible;
    const { backend } = getState().authentication;
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await axios.put(`${backend}/product/status?productID=${productID}&status=${newStatus}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    console.log("updated", response)
    dispatch({ type: 'UPDATE_PRODUCT_STOCK_SUCCESS', payload: response.data });
  };
};



export const cancelOrderAdmin = (status, orderId) => {
  return async (dispatch, getState) => {
    const { backend } = getState().authentication;
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.put(`${backend}/order/status?orderId=${orderId}&status=${status}`, 
        {
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
           
          }
        }
      );

    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };
};


export const cancelOrder = (orderId, cancellationReason) => {
  return async (dispatch, getState) => {
    const { backend } = getState().authentication;
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.put(`${backend}/order/cancellation`, 
        {
          orderId: orderId,
          cancellationReason: cancellationReason
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
           
          }
        }
      );

    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };
};

export const fetchProducts = (status = 'active', pageNumber = 1, pageSize = 10) => {
  return async (dispatch, getState) => {
    console.log("Fetching", status)
    const { backend } = getState().authentication;
    const token = localStorage.getItem('token');


    // Construct the base URL based on status
    let url = `${backend}/product/${status}?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    try {
      dispatch(setLoading(true)); // Set loading to true before fetching

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });


      // Process products to add isVisible field based on status
      const productsWithVisibility = response.data.body.products.map((product) => ({
        ...product,
        isVisible: status === 'active', // Set isVisible to true if status is 'active', false otherwise
      }));

      // Dispatch the processed products to the store
      dispatch(setProducts({
        products: productsWithVisibility
      }));

      console.log(response.data.body.products)

      dispatch(setLoading(false)); // Set loading to false after fetching
      return response.data.body.totalCount;
    } catch (error) {
      console.error('Error fetching products:', error);
      dispatch(setError(error.message)); // Handle the error
      dispatch(setLoading(false)); // Set loading to false after error
      return { products: [], totalCount: 0 };
    }
  };
};


export const fetchComments = (email) => {
  return async (dispatch, getState) => {
   
    const { backend } = getState().authentication;
    const token = localStorage.getItem('token');

    // Construct the base URL based on status
    let url = `${backend}/ranking/details/${email}`;

    try {
      dispatch(setLoading(true)); // Set loading to true before fetching

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });


      dispatch(setLoading(false)); // Set loading to false after fetching
      return response.data.body;
    } catch (error) {
      console.error('Error fetching comments:', error);
      dispatch(setError(error.message)); // Handle the error
      dispatch(setLoading(false)); 
      return { comments: []};
    }
  };
};



// Update Product Stock
export const updateProductStock = (productData) => {
  console.log("Updated", productData.productId, productData.stockQuantity)
  return async (dispatch, getState) => {
    const { backend } = getState().authentication;
    const token = localStorage.getItem('token');

    const response = await axios.put(`${backend}/product/stock`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    dispatch({ type: 'UPDATE_PRODUCT_STOCK_SUCCESS', payload: response.data });
  };
};

// Notify Vendor for Low Stock
export const notifyVendor = (vendorId, message) => {
  return async (dispatch, getState) => {
    // Assuming there's an endpoint to notify vendors
    const { backend } = getState().authentication;
    const token = localStorage.getItem('token');

    // Send notification logic here (could be an API call)
    // Example logic:
    console.log(`Notification to Vendor ${vendorId}: ${message}`);
    // Add your notification dispatch here
  };
};

// Delete Product
export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const { backend } = getState().authentication;
    const token = localStorage.getItem('token');

    const response = await axios.delete(`${backend}/product/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    dispatch({ type: 'DELETE_PRODUCT_SUCCESS', payload: productId });
  };
};


