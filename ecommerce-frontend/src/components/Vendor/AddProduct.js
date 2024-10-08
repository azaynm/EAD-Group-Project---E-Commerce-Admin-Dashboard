import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { createProduct, deleteProduct, fetchProductDetails, fetchProducts, updateProduct, updateStatus } from '../../redux/Vendor/actions/vendorAction';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../../redux/Vendor/slices/vendorSlice';
import { TabView, TabPanel } from 'primereact/tabview';

import { Paginator } from 'primereact/paginator';

const AddProduct = () => {

    const products = useSelector((state) => state.vendor.products) || [];
    const [addProductIsOpen, setAddProductIsOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [totalRecords, setTotalRecords] = useState(0);
    const [initialPage, setInitialPage] = useState(1)
    const [newProduct, setNewProduct] = useState({
        ImageUri: '',
        Name: '',
        Brand: '',
        Price: '',
        Discount: '',
        Description: '',
        Category: '',
        StockQuantity: '',
        Size: '',
        Color: '',
        IsVisible: true
    });

    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();

    // Paginator state
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(4); // Number of products per page
    const [currentPage, setCurrentPage] = useState(1);


    const onPageChange = (e) => {
        const page = e.page + 1; // Calculate the page (e.page is zero-based)
        setCurrentPage(page);
        setFirst(e.first);
        setRows(e.rows);
        dispatch(fetchProducts(page, e.rows)); // Fetch products with the new page and rows
    };



    useEffect(() => {
        // Fetch products based on current pagination
        const fetchData = async () => {
            const result = await dispatch(fetchProducts(currentPage, rows));
            // Assuming fetchProducts returns an object with totalRecords
            if (result && result.totalCount !== undefined) {
                setTotalRecords(result.totalCount); // Set totalRecords for paginator
            }
        };
        fetchData();
    }, [dispatch, currentPage, rows]);

    // Validate inputs
    const validateForm = () => {
        let errors = {};
        if (!newProduct.Brand) errors.Brand = "Product brand is required.";
        if (!newProduct.Name) errors.Name = "Product name is required.";
        if (!newProduct.Price || isNaN(newProduct.Price) || newProduct.Price <= 0) errors.Price = "Price should be a positive number.";
        if (newProduct.Discount && (isNaN(newProduct.Discount) || newProduct.Discount < 0 || newProduct.Discount > 100)) {
            errors.Discount = "Discount should be a number between 0 and 100.";
        }
        if (!newProduct.Category) errors.Category = "Category is required.";
        if (!newProduct.StockQuantity || isNaN(newProduct.StockQuantity) || newProduct.StockQuantity < 0) {
            errors.StockQuantity = "Stock Quantity should be a non-negative number.";
        }
        if (newProduct.Size && !/^[a-zA-Z0-9, ]*$/.test(newProduct.Size)) {
            errors.Size = "Size should be comma-separated alphanumeric values.";
        }
        if (newProduct.Color && !/^[a-zA-Z0-9, ]*$/.test(newProduct.Color)) {
            errors.Color = "Color should be comma-separated alphanumeric values.";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0; // Returns true if no errors
    };



    // Handle input change for product form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const prepareProductForSave = (product) => {
        return {
            ProductId: product.ProductId || '', // Include ProductId if it's part of the product object
            ImageUri: product.ImageUri.trim() || '',
            Name: product.Name.trim(),
            Brand: product.Brand.trim(),
            Price: parseFloat(product.Price),
            Discount: parseFloat(product.Discount),
            Description: product.Description.trim() || '',
            Category: product.Category.trim(),
            StockQuantity: parseInt(product.StockQuantity, 10),
            Size: Array.isArray(product.Size) ? product.Size : product.Size.split(',').map(size => size.trim()),
            Color: Array.isArray(product.Color) ? product.Color : product.Color.split(',').map(color => color.trim()),
            IsVisible: product.IsVisible
        };
    };

    // Save or update product
    const handleSaveProduct = async () => {
        if (!validateForm()) return;

        const productToSave = prepareProductForSave(newProduct);

        try {
            if (isEditing) {
                // Update existing product
                await dispatch(updateProduct(productToSave));
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Product Updated Successfully',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                // Create new product
                await dispatch(createProduct(productToSave));
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Product Added Successfully',
                    showConfirmButton: false,
                    timer: 1500
                });
            }

            // Fetch updated list of products after saving or updating
            await dispatch(fetchProducts(currentPage, rows));
        } catch (error) {
            console.error('Error saving product:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while saving the product!',
            });
        }

        // Reset the product form and errors
        resetForm();
    };

    // Reset form and errors state
    const resetForm = () => {
        setNewProduct({
            ImageUri: '',
            Name: '',
            Brand: '',
            Price: '',
            Discount: '',
            Description: '',
            Category: '',
            StockQuantity: '',
            Size: '',
            Color: '',
            IsVisible: true
        });
        setErrors({});
        setIsEditing(false);
        setAddProductIsOpen(false);
    };

    // Edit Product
    // Edit Product
    const handleEditProduct = async (product) => {
        try {
            // Await the dispatch call since fetchProductDetails returns a promise
            const { productDetails } = await dispatch(fetchProductDetails(product.productId));
            console.log(productDetails, "From component");

            setNewProduct({
                ProductId: productDetails.productId || product.productId || '',
                ImageUri: productDetails.imageUri || product.imageUri || '',
                Name: productDetails.name || product.name || '',
                Brand: productDetails.brand || product.brand || '',
                Price: productDetails.price || product.price || '',
                Discount: productDetails.discount || product.discount || '',
                Description: productDetails.description || product.description || '',
                Category: productDetails.category || product.category || '',
                StockQuantity: productDetails.stockQuantity || product.stockQuantity || '',
                Size: Array.isArray(productDetails.size) ? productDetails.size.join(',') : product.size || '',
                Color: Array.isArray(productDetails.color) ? productDetails.color.join(',') : product.color || '',
                IsVisible: productDetails.isVisible ?? product.isVisible // Properly handle boolean fields
            });
            setIsEditing(true);
            setAddProductIsOpen(true);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };


    // Add Product button click handler
    const handleAddProduct = () => {
        resetForm();
        setIsEditing(false); // Ensure you are not in edit mode when adding a new product
        setAddProductIsOpen(true);
    };

    // Delete Product
    const handleDeleteProduct = async (productId) => {
        try {
            await dispatch(deleteProduct(productId));
            await dispatch(fetchProducts(currentPage));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Toggle Product Status
    const handleToggleStatus = async (productId, currentStatus) => {
        const updatedStatus = !currentStatus;
        try {
            await dispatch(updateStatus(productId, updatedStatus));
            await dispatch(fetchProducts(currentPage));
        } catch (error) {
            console.error('Error updating product status:', error);
        }
    };

    return (
        <div>
            <h1>Vendor Dashboard</h1>

            {/* Add Product Button */}
            <button className="btn btn-primary mb-3" onClick={handleAddProduct}>
                Add Product
            </button>

            {/* Product Modal */}
            {addProductIsOpen && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="productModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="productModalLabel">{isEditing ? 'Edit Product' : 'Add Product'}</h5>
                                <button type="button" className="close" onClick={resetForm} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Product Form */}
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="ImageUri"
                                        placeholder="Image URI"
                                        value={newProduct.ImageUri}
                                        onChange={handleInputChange}
                                        className={`form-control ${errors.ImageUri ? 'is-invalid' : ''}`}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="Name"
                                        placeholder="Product Name"
                                        value={newProduct.Name}
                                        onChange={handleInputChange}
                                        className={`form-control ${errors.Name ? 'is-invalid' : ''}`}
                                    />
                                    {errors.Name && <div className="invalid-feedback">{errors.Name}</div>}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="Brand"
                                        placeholder="Brand"
                                        value={newProduct.Brand}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                    {errors.Brand && <div className="invalid-feedback">{errors.Brand}</div>}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="Price"
                                        placeholder="Price"
                                        value={newProduct.Price}
                                        onChange={handleInputChange}
                                        className={`form-control ${errors.Price ? 'is-invalid' : ''}`}
                                        required
                                    />
                                    {errors.Price && <div className="invalid-feedback">{errors.Price}</div>}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="Discount"
                                        placeholder="Discount"
                                        value={newProduct.Discount}
                                        onChange={handleInputChange}
                                        className={`form-control ${errors.Discount ? 'is-invalid' : ''}`}
                                    />
                                    {errors.Discount && <div className="invalid-feedback">{errors.Discount}</div>}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="Description"
                                        placeholder="Description"
                                        value={newProduct.Description}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="Category"
                                        placeholder="Category"
                                        value={newProduct.Category}
                                        onChange={handleInputChange}
                                        className={`form-control ${errors.Category ? 'is-invalid' : ''}`}
                                    />
                                    {errors.Category && <div className="invalid-feedback">{errors.Category}</div>}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="StockQuantity"
                                        placeholder="Stock Quantity"
                                        value={newProduct.StockQuantity}
                                        onChange={handleInputChange}
                                        className={`form-control ${errors.StockQuantity ? 'is-invalid' : ''}`}
                                    />
                                    {errors.StockQuantity && <div className="invalid-feedback">{errors.StockQuantity}</div>}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="Size"
                                        placeholder="Size (comma-separated)"
                                        value={newProduct.Size}
                                        onChange={handleInputChange}
                                        className={`form-control ${errors.Size ? 'is-invalid' : ''}`}
                                    />
                                    {errors.Size && <div className="invalid-feedback">{errors.Size}</div>}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="Color"
                                        placeholder="Color (comma-separated)"
                                        value={newProduct.Color}
                                        onChange={handleInputChange}
                                        className={`form-control ${errors.Color ? 'is-invalid' : ''}`}
                                    />
                                    {errors.Color && <div className="invalid-feedback">{errors.Color}</div>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={resetForm}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={() => handleSaveProduct(newProduct.ProductId)}>
                                    {isEditing ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product List */}
            <h2 className="mt-5">Product List</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Stock</th>
                        <th>Size</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.productId}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.discount}</td>
                            <td>{product.stockQuantity}</td>
                            <td>{product.size}</td>
                            <td>{product.IsVisible ? "Active" : "Not Active"}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditProduct(product)}>
                                    Edit
                                </button>
                                <button className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteProduct(product.productId)}>
                                    Delete
                                </button>
                               
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Paginator first={first} rows={rows} totalRecords={totalRecords} onPageChange={onPageChange} />
        </div>
    )
}

export default AddProduct