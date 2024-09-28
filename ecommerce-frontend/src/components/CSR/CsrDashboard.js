import React from 'react';
import { dummyOrders } from '../../data/dummyData';

function CsrDashboard() {
    return (
        <div>
            <h1>CSR Dashboard</h1>
            <h2>Order Management</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {dummyOrders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.status}</td>
                            <td>{order.products.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CsrDashboard;
