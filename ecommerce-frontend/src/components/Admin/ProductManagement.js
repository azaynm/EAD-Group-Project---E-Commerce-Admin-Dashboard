import React, { useState } from 'react';
import { dummyProducts } from '../../data/dummyData';

function ProductManagement({ loggedInUser }) {
    const [products, setProducts] = useState(dummyProducts);

    // Toggle product activation/deactivation (Admin only)
    const handleToggleStatus = (id) => {
        if (loggedInUser.role !== 'Administrator') {
            alert('You do not have permission to perform this action.');
            return;
        }

        setProducts(
            products.map((product) =>
                product.id === id ? { ...product, status: product.status === 'Active' ? 'Inactive' : 'Active' } : product
            )
        );
    };

    return (
        <div>
            <h2>Product Management</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.status}</td>
                            <td>{product.stock}</td>
                            <td>
                                <button
                                    className={`btn btn-${
                                        product.status === 'Active' ? 'secondary' : 'success'
                                    } btn-sm`}
                                    onClick={() => handleToggleStatus(product.id)}
                                >
                                    {product.status === 'Active' ? 'Deactivate' : 'Activate'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductManagement;
