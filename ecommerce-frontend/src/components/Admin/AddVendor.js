import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useDispatch } from 'react-redux';
import { createVendor } from '../../redux/Vendor/actions/vendorAction';

const AddVendor = () => {
    const dispatch = useDispatch();
    const [vendorData, setVendorData] = useState({
        userName: '',
        email: '',
        password: '',
        phoneNumber: '',
        profileImageUrl: '',
        dateOfBirth: null,
        gender: '',
        role: 'Vendor' // Default role is 'Vendor'
    });

    // Gender options for dropdown
    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ];

    const createVendorHandler = () => {
        // Ensure the data is formatted as expected
        const formattedVendorData = {
            ...vendorData,
            phoneNumber: vendorData.phoneNumber.startsWith('+') ? vendorData.phoneNumber : `+${vendorData.phoneNumber}`, // Ensure phone number includes '+' sign
            dateOfBirth: vendorData.dateOfBirth ? vendorData.dateOfBirth.toISOString().split('T')[0] : '', // Format dateOfBirth if selected
        };

        console.log("Vendor Data", formattedVendorData)

        dispatch(createVendor(formattedVendorData));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVendorData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleDateChange = (e) => {
        setVendorData((prevState) => ({ ...prevState, dateOfBirth: e.value }));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Add a Vendor</h2>
            <form className="p-fluid" onSubmit={(e) => e.preventDefault()}>
                {/* User Name */}
                <div className="p-field">
                    <label htmlFor="userName">User Name</label>
                    <InputText
                        id="userName"
                        name="userName"
                        value={vendorData.userName}
                        onChange={handleInputChange}
                        placeholder="Enter user name"
                    />
                </div>

                {/* Email */}
                <div className="p-field">
                    <label htmlFor="email">Email</label>
                    <InputText
                        id="email"
                        name="email"
                        type="email"
                        value={vendorData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email"
                    />
                </div>

                {/* Password */}
                <div className="p-field">
                    <label htmlFor="password">Password</label>
                    <Password
                        id="password"
                        name="password"
                        value={vendorData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        toggleMask
                    />
                </div>

                {/* Phone Number */}
                <div className="p-field">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <InputText
                        id="phoneNumber"
                        name="phoneNumber"
                        value={vendorData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="2025550789"
                    />
                </div>

                {/* Profile Image URL */}
                <div className="p-field">
                    <label htmlFor="profileImageUrl">Profile Image URL</label>
                    <InputText
                        id="profileImageUrl"
                        name="profileImageUrl"
                        value={vendorData.profileImageUrl}
                        onChange={handleInputChange}
                        placeholder="Enter profile image URL"
                    />
                </div>

                {/* Date of Birth */}
                <div className="p-field">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <Calendar
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={vendorData.dateOfBirth}
                        onChange={handleDateChange}
                        dateFormat="yy-mm-dd"
                        placeholder="Select date of birth"
                        showIcon
                    />
                </div>

                {/* Gender */}
                <div className="p-field">
                    <label htmlFor="gender">Gender</label>
                    <Dropdown
                        id="gender"
                        name="gender"
                        value={vendorData.gender}
                        onChange={handleInputChange}
                        options={genderOptions}
                        placeholder="Select gender"
                    />
                </div>

                {/* Role (Hidden Field or Default Value) */}
                <input type="hidden" name="role" value={vendorData.role} />

                <Button label="Add Vendor" className="p-button-primary" onClick={createVendorHandler} />
            </form>
        </div>
    );
};

export default AddVendor;
