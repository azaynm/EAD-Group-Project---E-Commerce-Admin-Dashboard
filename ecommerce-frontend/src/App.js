import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import AdminDashboard from './components/Admin/AdminDashboard';
import VendorDashboard from './components/Vendor/VendorDashboard';
import CsrDashboard from './components/CSR/CsrDashboard';
import OrderManagement from './components/Orders/OrderManagement';
import InventoryManagement from './components/Inventory/InventoryManagement';
import VendorManagement from './components/Admin/VendorManagement';
import Login from './components/Shared/Login';

function App() {
    const [loggedInUser, setLoggedInUser] = useState(null); // To track the logged-in user

    // Mock users for login
    const mockUsers = [
        { id: 1, name: 'Admin User', role: 'Administrator' },
        { id: 2, name: 'Vendor User', role: 'Vendor' },
        { id: 3, name: 'CSR User', role: 'Customer Service Representative' },
    ];

    // Function to handle login, simulate based on mock users
    const handleLogin = (user) => {
        setLoggedInUser(user);
    };

    // Function to handle logout
    const handleLogout = () => {
        setLoggedInUser(null);
    };

    return (
        <Router>
            <Navbar loggedInUser={loggedInUser} onLogout={handleLogout} />
            <div className="container mt-4">
                <Routes>
                    {/* Login Route */}
                    <Route path="/" element={<Login users={mockUsers} onLogin={handleLogin} />} />

                    {/* Admin Dashboard */}
                    <Route
                        path="/admin"
                        element={
                            loggedInUser && loggedInUser.role === 'Administrator' ? (
                                <AdminDashboard />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />

                    {/* Vendor Dashboard */}
                    <Route
                        path="/vendor"
                        element={
                            loggedInUser && loggedInUser.role === 'Vendor' ? (
                                <VendorDashboard />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />

                    {/* CSR Dashboard */}
                    <Route
                        path="/csr"
                        element={
                            loggedInUser && loggedInUser.role === 'Customer Service Representative' ? (
                                <CsrDashboard />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />

                    {/* Order Management (for CSR and Admin) */}
                    <Route
                        path="/orders"
                        element={
                            loggedInUser &&
                            (loggedInUser.role === 'Administrator' ||
                                loggedInUser.role === 'Customer Service Representative') ? (
                                <OrderManagement />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />

                    {/* Inventory Management (for Vendors and Admin) */}
                    <Route
                        path="/inventory"
                        element={
                            loggedInUser &&
                            (loggedInUser.role === 'Administrator' || loggedInUser.role === 'Vendor') ? (
                                <InventoryManagement />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />

                    {/* Vendor Management (for Admin) */}
                    <Route
                        path="/vendor-management"
                        element={
                            loggedInUser && loggedInUser.role === 'Administrator' ? (
                                <VendorManagement />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
