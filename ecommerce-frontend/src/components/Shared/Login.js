import React, { useState } from 'react';

function Login({ users, onLogin }) {
    const [selectedUser, setSelectedUser] = useState('');

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const user = users.find((user) => user.name === selectedUser);
        if (user) {
            onLogin(user);
        } else {
            alert('Invalid login');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
                <div className="mb-3">
                    <label>Select User</label>
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="form-control"
                    >
                        <option value="">Select...</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.name}>
                                {user.name} ({user.role})
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
