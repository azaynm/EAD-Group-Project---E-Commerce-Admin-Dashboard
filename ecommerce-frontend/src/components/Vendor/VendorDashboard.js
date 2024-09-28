import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function VendorDashboard() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', category: '', status: 'Active', stock: 0 });
    const [isEditing, setIsEditing] = useState(false);

    // Fetch products from backend
    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://localhost:7173/api/inventory'); // Replace with your actual API endpoint
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts(); // Fetch products when component loads
    }, []);

    // Handle input change for product form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    // Add or Update Product
    const handleSaveProduct = async () => {
        if (isEditing) {
            try {
                await axios.put(`https://localhost:7173/api/inventory/${newProduct.id}`, newProduct); // Update product
                setProducts(products.map((product) => (product.id === newProduct.id ? newProduct : product)));
            } catch (error) {
                console.error('Error updating product:', error);
            }
        } else {
            try {
                const response = await axios.post('https://localhost:7173/api/inventory', newProduct); // Add new product
                setProducts([...products, response.data]);
            } catch (error) {
                console.error('Error adding product:', error);
            }
        }
        setNewProduct({ name: '', category: '', status: 'Active', stock: 0 });
        setIsEditing(false);
    };
    // Edit Product
    const handleEditProduct = (product) => {
        setNewProduct(product);
        setIsEditing(true);
    };

    // Delete Product
    const handleDeleteProduct = async (id) => {
        // Show SweetAlert confirmation dialog
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
                // Delete product
                await axios.delete(`https://localhost:7173/api/inventory/${id}`);
                setProducts(products.filter((product) => product.id !== id));
                
                // Show success alert
                Swal.fire(
                    'Deleted!',
                    'Your product has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting product:', error);
    
                // Show error alert
                Swal.fire(
                    'Error!',
                    'There was an issue deleting the product.',
                    'error'
                );
            }
        }
    };

    
    
    const handleToggleStatus = async (id, currentStatus) => {
        console.log(id, currentStatus);
        // Convert 'Active'/'Inactive' status to a boolean value
        const updatedStatus = currentStatus === true ? false : true;
        try {
            // Make sure to send a boolean, not an object
            await axios.put(`https://localhost:7173/api/inventory/activate/${id}`, updatedStatus, {
                headers: { 'Content-Type': 'application/json' },
            });
            setProducts(
                products.map((product) =>
                    product.id === id ? { ...product, isActivated: updatedStatus } : product
                )
            );
        } catch (error) {
            console.error('Error updating product status:', error);
        }
    };

  




    return (
        <div>
            <h1>Vendor Dashboard</h1>

            {/* Product Form */}
            <h2>{isEditing ? 'Edit Product' : 'Add Product'}</h2>
            <div className="mb-3">
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>
            <button className="btn btn-primary" onClick={handleSaveProduct}>
                {isEditing ? 'Update Product' : 'Add Product'}
            </button>

            {/* Product List */}
            <h2 className="mt-5">Product List</h2>
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
                            <td>{product.isActivated ? "Active" : "Not Active"}</td>
                            <td>{product.stock}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => handleEditProduct(product)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm me-2"
                                    onClick={() => handleDeleteProduct(product.id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className={`btn btn-${product.isActivated === true ? 'secondary' : 'success'} btn-sm`}
                                    onClick={() => handleToggleStatus(product.id, product.isActivated)}
                                    style={{width:'100px'}}
                                >
                                    {product.isActivated === true ? 'Deactivate' : 'Activate'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default VendorDashboard;
