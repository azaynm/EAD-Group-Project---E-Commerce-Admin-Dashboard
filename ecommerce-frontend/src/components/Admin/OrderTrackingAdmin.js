import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Swal from 'sweetalert2';
import { updateProductStock, deleteProduct, updateProductStatus, notifyVendor, cancelOrderAdmin } from '../../redux/Admin/actions/adminAction';
import { Paginator } from 'primereact/paginator';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import { fetchOrders, fetchOrdersAdmin, updateOrderStatus } from '../../redux/Vendor/actions/vendorAction';


function OrderTrackingAdmin() {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.vendor.orders) || [];
    const loggedUser = useSelector((state) => state.authentication.loggedUser) || [];
    console.log("logged user is ," ,loggedUser)
    const adminOrders = useSelector((state) => state.vendor.adminOrders) || [];
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [orderStatus, setOrderStatus] = useState('Pending'); // Default to 'Pending'
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Default page size
    const [totalRecords, setTotalRecords] = useState(0); // Store the total number of products
    const [chartOptions, setChartOptions] = useState({});
   
    const [selectedCancelOrderId, setSelectedCancelOrderId] = useState(null);
    const statuses = [
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Completed',
        'Refunded',
        'Returned'
    ];

    const [cancelReasons, setCancelReasons] = useState({});

    // State to store stock quantities
    const [stockQuantities, setStockQuantities] = useState({});

    // Paginator state
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(4); // Number of products per page
    const [currentPage, setCurrentPage] = useState(1);

    const getSearchEmail = () => {
        return searchValue && searchValue.includes('@') ? `${searchValue.split('@')[0]}%40gmail.com` : '';
    };
    
    // Handle stock quantity change
    const handleStockChange = (productId, value) => {
        setStockQuantities((prevState) => ({
            ...prevState,
            [productId]: value,
        }));
    };

    const handleUpdateStock = (orderId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to mark completed this order?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, mark it completed!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                // If confirmed, proceed with the cancellation
                console.log("Removing this order id:", orderId);
                dispatch(cancelOrderAdmin("Completed", orderId)); // Assuming this action handles cancellation
                dispatch(fetchOrdersAdmin(getSearchEmail(), pageNumber, pageSize))
                Swal.fire('Completed!', 'Order has been marked as completed.', 'success');
                setSelectedCancelOrderId(null); // Hide the input field after confirming cancellation
                
            }
        });
    };

    const handleCancel = (orderId) => {
        setSelectedCancelOrderId(orderId); // Set the current orderId to display the cancellation input for this order
    };

    const handleReasonChange = (orderId, value) => {
        setCancelReasons((prevState) => ({
            ...prevState,
            [orderId]: value, // Store the cancellation reason for the specific order
        }));
    };

    const onPageChange = (e) => {
        const page = e.page + 1; // Calculate the page (e.page is zero-based)
        setCurrentPage(page);
        setFirst(e.first);
        setRows(e.rows);
        dispatch(fetchOrdersAdmin(getSearchEmail(), page, e.rows)); // Fetch orders with the new page and rows
    };


    // Fetch orders when component mounts or when status, pageNumber, or pageSize changes
    useEffect(() => {
        const fetchOrderData = async () => {
            const response = await dispatch(fetchOrdersAdmin(getSearchEmail(), pageNumber, pageSize));
            console.log("B", orders)
            setTotalRecords(response || 0); // Update total records from API response
        };
        fetchOrderData();

    }, [dispatch, orderStatus, pageNumber, pageSize]); // Fetch only when these dependencies change


    const handleConfirmCancellation = (orderId) => {
        const reason = cancelReasons[orderId];

        if (!reason) {
            Swal.fire('Error!', 'Please provide a reason for cancellation.', 'error');
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to cancel this order?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                // Proceed with the cancellation
                console.log("Cancelling order id:", orderId, "Reason:", reason);
                dispatch(cancelOrderAdmin("Cancelled", orderId, reason)); // Assuming this action handles cancellation
                dispatch(fetchOrdersAdmin(getSearchEmail(), pageNumber, pageSize)); // Fetch updated orders
                Swal.fire('Cancelled!', 'Order has been cancelled.', 'success');
                setSelectedCancelOrderId(null); // Hide the input field after confirming cancellation
              
            }
        });
    };

    const handleSearch = (searchValue) => {
        dispatch(fetchOrdersAdmin(getSearchEmail(), pageNumber, pageSize)); // Pass both status and search value
    };

    // Placeholder for updating order status
    const handleUpdateOrder = async (orderId) => {
        try {
            console.log("Update order status for order:", orderId);
        } catch (error) {
            Swal.fire('Error!', 'An error occurred while updating the order status.', 'error');
        }
    };

    return (
        <div>
            <h2>Order Tracking</h2>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>


                <div className="w-100">
                    <div className="p-field">
                        <Button
                            label="Pending Orders"
                            className={`p-button ${orderStatus === 'Pending' ? 'p-button-primary' : 'p-button-secondary'}`}
                            onClick={() => setOrderStatus('Pending')}
                        />
                        <Button
                            label="Completed Orders"
                            className={`p-button ml-2 ${orderStatus === 'Completed' ? 'p-button-primary' : 'p-button-secondary'}`}
                            onClick={() => setOrderStatus('Completed')}
                        />
                    </div>

                    {/* Search Field */}
                    <div className="p-field mt-3">
                        <label htmlFor="search">Vendor Email</label>
                        <InputText
                            id="search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Enter Vendor Email..."
                        />
                        <Button label="Search" onClick={handleSearch} className="p-button-primary mt-2" />
                    </div>

                    <h2 className="mt-5">Order List</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order Id</th>
                                <th>Image URI</th>
                                <th>Order Date</th>
                                <th>Total</th>
                                <th>Status</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {adminOrders.map((order) => (
                                <tr key={order.orderId}>
                                    <td>{order.orderId}</td>
                                    <td>{order.imageUri}</td>
                                    <td>{order.orderDate}</td>
                                    <td>{order.totalOrderPrice}</td>
                                    <td>{order.status}</td>
                                  
                                    <td>


                                        <Button
                                            label="Update"
                                            className="p-button-success p-button-sm ml-2"
                                            onClick={() => handleUpdateStock(order.orderId)}
                                        />
                                        <Button
                                            label="Cancel"
                                            className="p-button-danger p-button-sm ml-2"
                                            onClick={() => handleCancel(order.orderId)}
                                        />
                                        {/* Conditionally render input field and confirm button */}
                                        {selectedCancelOrderId === order.orderId && (
                                            <>
                                                <InputText
                                                    className="mt-2"
                                                    value={cancelReasons[order.orderId] || ''}
                                                    onChange={(e) => handleReasonChange(order.orderId, e.target.value)}
                                                    placeholder="Enter cancellation reason"
                                                />
                                                <Button
                                                    label="Confirm Cancellation"
                                                    className="p-button-danger p-button-sm ml-2 mt-2"
                                                    onClick={() => handleConfirmCancellation(order.orderId)}
                                                />
                                            </>
                                        )}


                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Paginator first={first} rows={rows} totalRecords={totalRecords} onPageChange={onPageChange} />
                </div>
            </div>
        </div>
    );
}

export default OrderTrackingAdmin;
