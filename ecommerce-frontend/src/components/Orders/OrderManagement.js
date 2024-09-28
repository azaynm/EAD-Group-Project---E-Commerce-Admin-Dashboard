import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './OrderManagement.css';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({ customer: '', items: [] });
    const [editingOrder, setEditingOrder] = useState(null);
    const [newItem, setNewItem] = useState({ productId: '', quantity: 1 }); // For adding new items to an order
    const [products, setProducts] = useState([]);

    // Fetch orders from the API
    const fetchOrders = async () => {
        try {
            const response = await axios.get('https://localhost:7173/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Fetch products from the API
    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://localhost:7173/api/inventory'); // Replace with your actual API endpoint
            console.log(response.data);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Fetch orders and products when the component mounts
    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    // Create a new order
    const handleCreateOrder = async () => {
        try {
            const response = await axios.post('https://localhost:7173/api/orders', newOrder);
            setOrders([...orders, response.data]);
            setNewOrder({ customer: '', items: [] });
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    // Update order status (before dispatch)
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.put(`https://localhost:7173/api/orders/${orderId}/status`, {
                status: newStatus
            });
            setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: response.data.status } : order)));
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    // Cancel an order (before dispatch)
    const handleCancelOrder = async (orderId) => {
        try {
            await axios.delete(`https://localhost:7173/api/orders/${orderId}`);
            setOrders(orders.filter((order) => order.id !== orderId));
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    // Edit an order (only if it is in Processing)
    const handleEditOrder = (order) => {
        if (order.status === 'Processing') {
            setEditingOrder(order);
        }
    };

    // Save updated order details
    const handleSaveOrder = async () => {
        try {
            const response = await axios.put(`https://localhost:7173/api/orders/${editingOrder.id}`, editingOrder);
            setOrders(orders.map((order) => (order.id === editingOrder.id ? response.data : order)));
            setEditingOrder(null);
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    // Add a product to the order
    const handleAddItem = () => {
        const product = products.find((prod) => prod.id === newItem.productId);
        if (!product) return;

        const item = {
            productId: newItem.productId,
            name: product.name,
            price: product.price,
            quantity: newItem.quantity
        };
        if (editingOrder) {
            setEditingOrder({ ...editingOrder, items: [...editingOrder.items, item] });
        } else {
            setNewOrder({ ...newOrder, items: [...newOrder.items, item] });
        }
        setNewItem({ productId: '', quantity: 1 }); // Reset new item fields
    };

    // Remove an item from the order
    const handleRemoveItem = (productId) => {
        if (editingOrder) {
            setEditingOrder({
                ...editingOrder,
                items: editingOrder.items.filter((item) => item.productId !== productId)
            });
        } else {
            setNewOrder({
                ...newOrder,
                items: newOrder.items.filter((item) => item.productId !== productId)
            });
        }
    };

    // Calculate total cost of items in an order
    const calculateOrderTotal = (items) => {
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    // Options for react-select
    const productOptions = products.map((product) => ({
        value: product.id,
        label: `${product.name} (Price: $${product.price})`
    }));

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Order Management</h2>

            {/* Create or Edit Order */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h4 className="card-title">{editingOrder ? 'Edit Order' : 'Create New Order'}</h4>
                    <input
                        type="text"
                        value={editingOrder ? editingOrder.customer : newOrder.customer}
                        placeholder="Customer Name"
                        onChange={(e) =>
                            editingOrder
                                ? setEditingOrder({ ...editingOrder, customer: e.target.value })
                                : setNewOrder({ ...newOrder, customer: e.target.value })
                        }
                        className="form-control mb-3"
                    />
                    <div className="mb-3">
                        <h5>Add Item</h5>
                        {/* Searchable select input for products */}
                        <Select
                            className="mb-2"
                            options={productOptions}
                            onChange={(option) => setNewItem({ ...newItem, productId: option.value })}
                            placeholder="Select Product"
                        />
                        <input
                            type="number"
                            min="1"
                            className="form-control mb-2"
                            placeholder="Quantity"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                        />
                        <button className="btn btn-success w-100 mb-3" onClick={handleAddItem}>
                            Add Item
                        </button>
                    </div>
                    {/* Display items in the order */}
                    <div className="mb-3">
                        <h5>Order Items</h5>
                        {(editingOrder ? editingOrder.items : newOrder.items).map((item, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center">
                                <span>
                                    {item.name} (Qty: {item.quantity}, Price: ${item.price})
                                </span>
                                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(item.productId)}>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        className="btn btn-primary w-100"
                        onClick={editingOrder ? handleSaveOrder : handleCreateOrder}
                    >
                        {editingOrder ? 'Save Order' : 'Create Order'}
                    </button>
                    {editingOrder && (
                        <button
                            className="btn btn-secondary w-100 mt-2"
                            onClick={() => setEditingOrder(null)}
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Order List */}
            <h4 className="text-center mb-3">Current Orders</h4>
            <table className="table table-striped table-hover shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Total ($)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.status}</td>
                            <td>
                                {/* Display each item's product name, quantity, and price */}
                                {order.items.map((item, index) => (
                                    <div key={index}>
                                        {item.name} (Qty: {item.quantity}, Price: ${item.price})
                                    </div>
                                ))}
                            </td>
                            <td>${calculateOrderTotal(order.items).toFixed(2)}</td>
                            <td>
                                {order.status === 'Processing' && (
                                    <>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEditOrder(order)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-success btn-sm me-2"
                                            onClick={() => handleUpdateOrderStatus(order.id, 'Dispatched')}
                                        >
                                            Dispatch Order
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleCancelOrder(order.id)}
                                        >
                                            Cancel Order
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderManagement;
