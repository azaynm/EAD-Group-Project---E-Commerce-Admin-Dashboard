import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Swal from 'sweetalert2';
import { updateProductStock, deleteProduct, fetchProducts, updateProductStatus, notifyVendor } from '../../redux/Admin/actions/adminAction';
import { Paginator } from 'primereact/paginator';
import { Chart } from 'primereact/chart';

function InventoryManagement() {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.admin.products) || [];
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [productStatus, setProductStatus] = useState('active'); // Default to 'active'
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Default page size
    const [totalRecords, setTotalRecords] = useState(0); // Store the total number of products
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    // State to store stock quantities
    const [stockQuantities, setStockQuantities] = useState({});

    // Low stock threshold
    const LOW_STOCK_THRESHOLD = 5;

    // Paginator state
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(4); // Number of products per page
    const [currentPage, setCurrentPage] = useState(1);

    // Filter products with low stock
    const lowStockProducts = products.filter(product => product.stockQuantity < LOW_STOCK_THRESHOLD);

    // Update the chart based on products data
    const updateChartData = () => {
        const documentStyle = getComputedStyle(document.documentElement);

        // Map product names and stock quantities to labels and data
        const labels = products.map(product => product.name);
        const dataValues = products.map(product => product.stockQuantity);

        const data = {
            labels: labels,
            datasets: [
                {
                    data: dataValues,
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--purple-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--red-400'),
                        documentStyle.getPropertyValue('--purple-400')
                    ]
                }
            ]
        };
        const options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    };

    useEffect(() => {
        updateChartData();
    }, [products]); // Update chart data whenever products change

    const onPageChange = (e) => {
        const page = e.page + 1; // Calculate the page (e.page is zero-based)
        setCurrentPage(page);
        setFirst(e.first);
        setRows(e.rows);
        dispatch(fetchProducts(productStatus, page, e.rows)); // Fetch products with the new page and rows
    };

    // Fetch products when component mounts or when status, pageNumber, or pageSize changes
    useEffect(() => {
        const fetchProductData = async () => {
            const response = await dispatch(fetchProducts(productStatus, pageNumber, pageSize));
            setTotalRecords(response || 0); // Update total records from API response
        };
        fetchProductData();
    }, [dispatch, productStatus, pageNumber, pageSize]);

    const handleUpdateStock = (productId, newStockQuantity) => {
        dispatch(updateProductStock({ productId, stockQuantity: newStockQuantity }));
        Swal.fire('Success!', 'Stock updated successfully.', 'success');
    };

    const handleDeleteProduct = (product) => {
        // Check for pending orders
        if (product.pendingOrders && product.pendingOrders > 0) {
            Swal.fire('Error!', 'Cannot delete product with pending orders.', 'error');
            return;
        }
        dispatch(deleteProduct(product.productId));
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
    };

    const handleSearch = () => {
        dispatch(fetchProducts(productStatus, pageNumber, pageSize)); // Pass both status and search value
    };

    const handleDelete = async (productId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            // Check if the confirmation is received before deleting
            if (result.isConfirmed) {
                try {
                    // Dispatch the delete action
                    await dispatch(deleteProduct(productId));

                    // Show a success notification for deletion
                    Swal.fire('Deleted!', 'Product has been deleted successfully.', 'success');

                    // Fetch the updated list of products
                    dispatch(fetchProducts(productStatus, pageNumber, pageSize));
                } catch (error) {
                    // Handle any errors that occur during deletion
                    Swal.fire('Error!', 'An error occurred while deleting the product.', 'error');
                    console.error("Error deleting product:", error);
                }
            }
        });
    };

    // Toggle Product Status
    const handleToggleStatus = async (productId, isVisible) => {
        try {
            await dispatch(updateProductStatus(productId, !isVisible));
            Swal.fire('Success!', `Product has been ${isVisible ? 'deactivated' : 'activated'} successfully.`, 'success');
            // Refetch products to update the UI
            dispatch(fetchProducts(productStatus, pageNumber, pageSize));
        } catch (error) {
            Swal.fire('Error!', 'An error occurred while updating the product status.', 'error');
        }
    };

    // Handle stock quantity change
    const handleStockChange = (productId, value) => {
        setStockQuantities((prevState) => ({
            ...prevState,
            [productId]: value,
        }));
    };

    // Alert vendor about low stock
    const handleAlertLowStock = (product) => {
        dispatch(notifyVendor(product.vendorId, `Low stock alert for ${product.name}!`));
        Swal.fire('Alert Sent!', `Vendor has been notified about low stock for ${product.name}.`, 'info');
    };

    // Ensure each product has a default isVisible value
    const productsWithVisibility = products.map((product) => ({
        ...product,
        isVisible: product.isVisible !== undefined ? product.isVisible : false,
    }));

    return (
        <div><div className='p-3 text-light' style={{ backgroundColor: '#1C4E80' }}>
            <h5>Inventory Management</h5>
        </div>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="card flex justify-content-center p-1">
                    <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-20rem" />

                    {/* Low Stock Products Section */}
                    {lowStockProducts.length > 0 && (
                        <div className="mt-5">
                            <h3>Low Stock Alert</h3>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Stock Quantity</th>
                                        <th>Alert</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockProducts.map((product) => (
                                        <tr key={product.productId}>
                                            <td>{product.name}</td>
                                            <td>{product.stockQuantity}</td>
                                            <td>
                                                <Button
                                                    label="Send Alert"
                                                    className="p-button-warning p-button-sm"
                                                    onClick={() => handleAlertLowStock(product)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div>


                    <div className="p-field">
                        <Button
                            label="Active Products"
                            className={`p-button ${productStatus === 'active' ? 'p-button-primary' : 'p-button-secondary'}`}
                            onClick={() => setProductStatus('active')}
                        />
                        <Button
                            label="Inactive Products"
                            className={`p-button ml-2 ${productStatus === 'inactive' ? 'p-button-primary' : 'p-button-secondary'}`}
                            onClick={() => setProductStatus('inactive')}
                        />
                    </div>

                    {/* Search Field */}
                    {/* <div className="p-field mt-3">
                    <label htmlFor="search">Search Products</label>
                    <InputText
                        id="search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search products..."
                    />
                    <Button label="Search" onClick={handleSearch} className="p-button-primary mt-2" />
                </div> */}

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
                            {productsWithVisibility.map((product) => (
                                <tr key={product.productId}>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.discount}</td>
                                    <td>
                                        <InputText
                                            value={stockQuantities[product.productId] || product.stockQuantity}
                                            onChange={(e) => handleStockChange(product.productId, e.target.value)}
                                            style={{ width: '80px' }}
                                        />
                                        <Button
                                            label="Update"
                                            className="p-button-success p-button-sm ml-2"
                                            onClick={() => handleUpdateStock(product.productId, stockQuantities[product.productId] || product.stockQuantity)}
                                        />
                                    </td>
                                    <td>{product.size}</td>
                                    <td>{product.isVisible ? "Active" : "Not Active"}</td>
                                    <td>
                                        <button
                                            className={`btn btn-sm me-2 ${product.isVisible ? 'btn-danger' : 'btn-success'}`}
                                            onClick={() => handleToggleStatus(product.productId, product.isVisible)}
                                        >
                                            {product.isVisible ? "Deactivate" : "Activate"}
                                        </button>
                                    </td>

                                    <td>
                                        <button
                                            className={`btn btn-sm me-2 btn-danger'}`}
                                            onClick={() => handleDelete(product.productId)}
                                        >
                                            Remove
                                        </button>
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

export default InventoryManagement;
