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
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from './components/Shared/Dashboard';

function App() {
    const dispatch = useDispatch();
    const isLogged = useSelector((state) => state.authentication.isLogged);
    const loggedUser = useSelector((state) => state.authentication.loggedUser);
    return (
        <Router>
            <Routes>

                <Route
                    path="/dashboard"
                    element={
                        <Dashboard />
                    }
                />

                {/* <Route
                        path="/login"
                        element={isLogged ==true ? <Navigate to="/dashboard" /> : <Login />}
                    /> */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Login Route */}
                <Route path="/" element={<Login />} />

                {/* Admin Dashboard */}
                {/* <Route
                        path="/admin"
                        element={
                            loggedUser && loggedUser.role === 'Admin' ? (
                                <AdminDashboard />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    /> */}


                <Route
                    path="/admin"
                    element={
                        <AdminDashboard />
                    }
                />

                {/* Vendor Dashboard */}
                {/* <Route
                        path="/vendor"
                        element={
                            loggedUser && loggedUser.role === 'Vendor' ? (
                                <VendorDashboard />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    /> */}

                <Route
                    path="/vendor"
                    element={
                        <VendorDashboard />
                    }
                />

                {/* CSR Dashboard */}
                <Route
                    path="/csr"
                    element={
                        loggedUser && loggedUser.role === 'Customer Service Representative' ? (
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
                        loggedUser &&
                            (loggedUser.role === 'Administrator' ||
                                loggedUser.role === 'Customer Service Representative') ? (
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
                        loggedUser &&
                            (loggedUser.role === 'Administrator' || loggedUser.role === 'Vendor') ? (
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
                        loggedUser && loggedUser.role === 'Administrator' ? (
                            <VendorManagement />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
