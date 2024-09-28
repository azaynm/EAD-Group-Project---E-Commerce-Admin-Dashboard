import React, { useState } from 'react';

function UserManagement() {
    const initialUsers = [
        { id: 1, name: 'Admin User', role: 'Administrator' },
        { id: 2, name: 'Vendor One', role: 'Vendor' },
        { id: 3, name: 'CSR User', role: 'Customer Service Representative' },
    ];

    const [users, setUsers] = useState(initialUsers);
    const [newUser, setNewUser] = useState({ name: '', role: 'Vendor' });
    const [loggedInUser, setLoggedInUser] = useState(initialUsers[0]); // Simulate logged-in user

    // Handle input change for user form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    // Add new user
    const handleAddUser = () => {
        setNewUser((prevUser) => ({
            ...prevUser,
            id: users.length + 1, // Assign unique ID
        }));
        setUsers([...users, newUser]);
        setNewUser({ name: '', role: 'Vendor' });
    };

    // Change logged-in user for testing role-based access
    const handleLoginAs = (user) => {
        setLoggedInUser(user);
    };

    return (
        <div>
            <h1>User Management</h1>

            {/* Add New User Form */}
            <h2>Add New User</h2>
            <div className="mb-3">
                <input
                    type="text"
                    name="name"
                    placeholder="User Name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    className="form-control"
                >
                    <option value="Administrator">Administrator</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Customer Service Representative">Customer Service Representative</option>
                </select>
            </div>
            <button className="btn btn-primary" onClick={handleAddUser}>
                Add User
            </button>

            {/* List of Users */}
            <h2 className="mt-5">Current Users</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="btn btn-secondary" onClick={() => handleLoginAs(user)}>
                                    Login as {user.name}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Logged-in User Info */}
            <h3 className="mt-5">Logged in as: {loggedInUser.name} ({loggedInUser.role})</h3>

            {/* Conditionally Render Admin-Only Components */}
            {loggedInUser.role === 'Administrator' && (
                <div className="mt-4">
                    <h2>Admin-Only Functions</h2>
                    <p>Only the administrator can see this section.</p>
                </div>
            )}

            {/* Product Management */}
            <ProductManagement loggedInUser={loggedInUser} />
        </div>
    );
}

export default UserManagement;
