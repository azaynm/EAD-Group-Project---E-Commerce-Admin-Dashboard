import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ loggedInUser, onLogout }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Enterprise App
                </Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {/* Admin Navigation */}
                        {loggedInUser && loggedInUser.role === 'Administrator' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin">
                                        Admin Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/vendor-management">
                                        Vendor Management
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/orders">
                                        Order Management
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/inventory">
                                        Inventory Management
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* Vendor Navigation */}
                        {loggedInUser && loggedInUser.role === 'Vendor' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/vendor">
                                        Vendor Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/inventory">
                                        Inventory Management
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* CSR Navigation */}
                        {loggedInUser && loggedInUser.role === 'Customer Service Representative' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/csr">
                                        CSR Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/orders">
                                        Order Management
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {loggedInUser ? (
                            <>
                                <span className="navbar-text me-2">
                                    Logged in as: {loggedInUser.name} ({loggedInUser.role})
                                </span>
                                <button className="btn btn-outline-danger" onClick={onLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
