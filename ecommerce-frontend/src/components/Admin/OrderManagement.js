import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Swal from 'sweetalert2';
import { updateProductStock, deleteProduct, updateProductStatus, notifyVendor } from '../../redux/Admin/actions/adminAction';
import { Paginator } from 'primereact/paginator';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import { fetchOrders, updateOrderStatus } from '../../redux/Vendor/actions/vendorAction';


function OrderManagement() {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.vendor.orders) || [];
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [orderStatus, setOrderStatus] = useState('Pending'); // Default to 'Pending'
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Default page size
    const [totalRecords, setTotalRecords] = useState(0); // Store the total number of products
    const [chartOptions, setChartOptions] = useState({});

    const statuses = [
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Completed',
        'Cancelled',
        'Refunded',
        'Returned'
    ];

    // State to store stock quantities
    const [stockQuantities, setStockQuantities] = useState({});

    // Paginator state
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(4); // Number of products per page
    const [currentPage, setCurrentPage] = useState(1);


    // Handle stock quantity change
    const handleStockChange = (productId, value) => {
        setStockQuantities((prevState) => ({
            ...prevState,
            [productId]: value,
        }));
    };

    const handleUpdateStock = (orderId, status) => {
        console.log("Order id", orderId, status)
        dispatch(updateOrderStatus(orderId, status));
        // dispatch(updateProductStock({ productId, stockQuantity: newStockQuantity }));
        Swal.fire('Success!', 'Order status updated successfully.', 'success');
    };


    const onPageChange = (e) => {
        const page = e.page + 1; // Calculate the page (e.page is zero-based)
        setCurrentPage(page);
        setFirst(e.first);
        setRows(e.rows);
        dispatch(fetchOrders(orderStatus, page, e.rows)); // Fetch orders with the new page and rows
    };


    // Fetch orders when component mounts or when status, pageNumber, or pageSize changes
    useEffect(() => {
        const fetchOrderData = async () => {
            const response = await dispatch(fetchOrders(orderStatus, pageNumber, pageSize));
            console.log("B", orders)
            setTotalRecords(response || 0); // Update total records from API response
        };
        fetchOrderData();

    }, [dispatch, orderStatus, pageNumber, pageSize]); // Fetch only when these dependencies change


    const handleSearch = () => {
        dispatch(fetchOrders(orderStatus, pageNumber, pageSize)); // Pass both status and search value
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
            <h2>Order Management</h2>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>


                <div>
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
                        <label htmlFor="search">Search Orders</label>
                        <InputText
                            id="search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search orders..."
                        />
                        <Button label="Search" onClick={handleSearch} className="p-button-primary mt-2" />
                    </div>

                    <h2 className="mt-5">Order List</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order Id</th>
                                <th>Product Id</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                {/* <th>Size</th> */}
                                <th>Color</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.orderItemId}>
                                    <td>{order.orderItemId}</td>
                                    <td>{order.productId}</td>
                                    <td>{order.productName}</td>
                                    <td>{order.price}</td>
                                    <td>{order.quantity}</td>
                                    {/* <td>{order.size}</td> */}
                                    <td>{order.color}</td>
                                    <td>


                                        <div className="card flex justify-content-center">
                                            <Dropdown
                                                value={stockQuantities[order.orderItemId] || order.status}
                                                onChange={(e) => handleStockChange(order.orderItemId, e.target.value)}
                                                options={statuses} optionLabel="name"
                                                placeholder="Current Status" className="w-full md:w-14rem" checkmark={true} highlightOnSelect={false} />
                                        </div>
                                        <Button
                                            label="Update"
                                            className="p-button-success p-button-sm ml-2"
                                            onClick={() => handleUpdateStock(order.orderItemId, stockQuantities[order.orderItemId])}
                                        />
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

export default OrderManagement;
