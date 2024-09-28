import axios from 'axios';
import React, { useEffect, useState } from 'react';

function VendorManagement() {
    const [vendors, setVendors] = useState([]);
    const [newVendor, setNewVendor] = useState({ name: '', ranking: 0 });
    const [newComments, setNewComments] = useState({});

    // Fetch vendors
    const fetchVendors = async () => {
        try {
            const response = await axios.get(`https://localhost:7173/api/vendor`);
            setVendors(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    

    // Add new vendor
    const handleAddVendor = async () => {
        try {
            const response = await axios.post(`https://localhost:7173/api/vendor`, newVendor);
            setVendors([...vendors, response.data]);
            setNewVendor({ name: '', ranking: 0 });
        } catch (error) {
            console.log("Error adding vendor:", error);
        }
    };

    // Add a comment for a vendor
    const handleAddComment = async (vendorId) => {
        const { commentText, ranking } = newComments[vendorId]; // Destructure the commentText and ranking

        try {
            await axios.put(`https://localhost:7173/api/vendor/${vendorId}/comment`, { commentText, ranking });
            const updatedVendors = vendors.map((vendor) =>
                vendor.id === vendorId
                    ? { ...vendor, comments: [...vendor.comments, { commentText, ranking }] }
                    : vendor
            );
            setVendors(updatedVendors);
            setNewComments({ ...newComments, [vendorId]: { commentText: '', ranking: 0 } }); // Clear the comment input
        } catch (error) {
            console.log("Error adding comment:", error);
        }
    };



    // Handle comment input change
    const handleCommentChange = (vendorId, key, value) => {
        setNewComments({
            ...newComments,
            [vendorId]: {
                ...newComments[vendorId],
                [key]: value
            }
        });
    };

    useEffect(() => {
        fetchVendors();
    }, [handleAddComment]);

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
                                        <li key={index}>
                                            {comment.commentText} (Rating: {comment.ranking})
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={newComments[vendor.id]?.commentText || ''}
                                    placeholder="Add Comment"
                                    onChange={(e) => handleCommentChange(vendor.id, 'commentText', e.target.value)}
                                    className="form-control mb-2"
                                />
                                <input
                                    type="number"
                                    value={newComments[vendor.id]?.ranking || 0}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    placeholder="Ranking (0-5)"
                                    onChange={(e) => handleCommentChange(vendor.id, 'ranking', parseFloat(e.target.value))}
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
