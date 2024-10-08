import React, { useState, useEffect } from 'react';
import { loginUser } from '../../redux/Authentication/actions/authenticationAction';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loggedUser = useSelector((state) => state.authentication.loggedUser);

    // Monitor changes in loggedUser and navigate when updated
    // useEffect(() => {
        
    //     if (loggedUser) {
    //         navigate("/dashboard");
    //     }
    // }, [loggedUser]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            // Dispatch the loginUser action
            await dispatch(loginUser(userName, password));
            navigate('/dashboard')
            console.log("Login action dispatched.");
        } catch (error) {
            console.error('Error during login:', error);
            alert('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="login-container container mt-3" style={{width:'800px'}}>
        <h2 className="login-header">Login</h2>
        <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="form-control login-input"
                    placeholder="Enter your username"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control login-input"
                    placeholder="Enter your password"
                />
            </div>
            <button type="submit" className="btn btn-primary login-button w-100">
                Login
            </button>
        </form>
    </div>
    );
}

export default Login;
