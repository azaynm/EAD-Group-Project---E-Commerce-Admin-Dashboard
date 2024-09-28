import axios from 'axios';
import React, { useEffect, useState } from 'react';

function VendorManagement() {
    const [vendors, setVendors] = useState([]);

    const fetchVendors = async () => {
        try {
            const response = await axios.get(`http://localhost:5096/api/vendor`);
            setVendors(response.data); // Update the state with fetched vendors
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const [newVendor, setNewVendor] = useState({ name: '', ranking: 0 });
    const [newComments, setNewComments] = useState({});

    // Add new vendor
    const handleAddVendor = async () => {
        try {
            const response = await axios.post(`http://localhost:5096/api/vendor`, newVendor);
            setVendors([...vendors, response.data]); // Update the state with the new vendor from API
            setNewVendor({ name: '', ranking: 0 });
        } catch (error) {
            console.log("Error adding vendor:", error);
        }
    };

    // Add a comment for a vendor
    const handleAddComment = async (vendorId) => {
        const comment = newComments[vendorId]; // Get the new comment for the specific vendor

        try {
            await axios.put(`http://localhost:5096/api/vendor/${vendorId}/comment`, { comment });
            const updatedVendors = vendors.map((vendor) =>
                vendor.id === vendorId
                    ? { ...vendor, comments: [...vendor.comments, comment] }
                    : vendor
            );
            setVendors(updatedVendors);
            setNewComments({ ...newComments, [vendorId]: '' }); // Clear the comment input for that vendor
        } catch (error) {
            console.log("Error adding comment:", error);
        }
    };

    const handleCommentChange = (vendorId, comment) => {
        setNewComments({ ...newComments, [vendorId]: comment });
    };

    return (
        <div>
            <h2>Vendor Management</h2>

            {/* Add New Vendor */}
            <div className="mb-4">
                <h4>Add New Vendor</h4>
                <input
                    type="text"
                    value={newVendor.name}
                    placeholder="Vendor Name"
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                    className="form-control mb-2"
                />
                <input
                    type="number"
                    value={newVendor.ranking}
                    placeholder="Vendor Ranking"
                    onChange={(e) => setNewVendor({ ...newVendor, ranking: Number(e.target.value) })}
                    className="form-control mb-2"
                />
                <button className="btn btn-primary" onClick={handleAddVendor}>
                    Add Vendor
                </button>
            </div>

            {/* Vendor List */}
            <h4>Current Vendors</h4>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Ranking</th>
                        <th>Comments</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vendors.map((vendor) => (
                        <tr key={vendor.id}>
                            <td>{vendor.id}</td>
                            <td>{vendor.name}</td>
                            <td>{vendor.ranking}</td>
                            <td>
                                <ul>
                                    {vendor.comments.map((comment, index) => (
                                        <li key={index}>{comment}</li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={newComments[vendor.id] || ''}
                                    placeholder="Add Comment"
                                    onChange={(e) => handleCommentChange(vendor.id, e.target.value)}
                                    className="form-control mb-2"
                                />
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleAddComment(vendor.id)}
                                >
                                    Add Comment
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default VendorManagement;
