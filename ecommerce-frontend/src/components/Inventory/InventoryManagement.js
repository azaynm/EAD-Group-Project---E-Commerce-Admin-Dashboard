import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function InventoryManagement() {
    const initialProducts = [
        { id: 1, name: 'Product 1', stock: 5 },
        { id: 2, name: 'Product 2', stock: 30 },
    ];

    const [products, setProducts] = useState(initialProducts);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);

    // Alert if stock is low
    useEffect(() => {
        const lowStockItems = products.filter((product) => product.stock < 10);
        setLowStockAlerts(lowStockItems);
    }, [products]);

    // Remove product stock
    const handleRemoveStock = (productId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            const product = products.find((p) => p.id === productId);
            if (product.stock === 0) {
                alert('Cannot remove stock for a product that is out of stock or in pending orders.');
                return;
            }
            setProducts(
                products.map((p) =>
                    p.id === productId ? { ...p, stock: p.stock - 1 } : p
                )
            );
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });


    };

    return (
        <div>
            <h2>Inventory Management</h2>

            {/* Low Stock Alerts */}
            <h4>Low Stock Alerts</h4>
            {lowStockAlerts.length > 0 ? (
                <ul>
                    {lowStockAlerts.map((product) => (
                        <li key={product.id}>
                            {product.name} has low stock: {product.stock} units remaining
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No low stock alerts.</p>
            )}

            {/* Product Stock Table */}
            <h4>Product Inventory</h4>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.stock}</td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRemoveStock(product.id)}
                                >
                                    Remove Stock
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InventoryManagement;
