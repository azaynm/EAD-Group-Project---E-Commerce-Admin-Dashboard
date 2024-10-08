import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paginator } from 'primereact/paginator';
import { Dialog } from 'primereact/dialog';
import { fetchVendors } from '../../redux/Vendor/actions/vendorAction';
import { Button } from 'primereact/button';
import { fetchComments } from '../../redux/Admin/actions/adminAction';

function VendorManagement() {

    const [commentsData, setCommentsData] = useState([]);

    const dispatch = useDispatch();
    const vendors = useSelector((state) => state.vendor.vendors) || [];
    console.log("Vendors on load", vendors.vendors);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    // Paginator state
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    // Modal state
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedVendorEmail, setSelectedVendorEmail] = useState('');
    const [vendorComments, setVendorComments] = useState([]); // State to store vendor comments

    const onPageChange = (e) => {
        const page = e.page + 1;
        setPageNumber(page);
        setFirst(e.first);
        setRows(e.rows);
    };

    // Method to be called when the modal opens
    const fetchVendorComments = async (email) => {
        // Filter comments for the selected vendor email (in real app, you would fetch from API)
        const filteredComments = commentsData
        setVendorComments(filteredComments);
        console.log("Fetched comments:", filteredComments);
    };

    // Trigger fetching comments when modal is opened
    useEffect(() => {
        if (isModalVisible) {
            fetchVendorComments(selectedVendorEmail);
        }
    }, [isModalVisible, selectedVendorEmail]);

    useEffect(() => {
        const fetchVendorData = async () => {
            const totalCount = await dispatch(fetchVendors("Vendor", pageNumber, pageSize));
            setTotalRecords(totalCount || 0);
        };
        fetchVendorData();
    }, [dispatch, pageNumber, pageSize]);

    const handleViewComments = async (email) => {
        setSelectedVendorEmail(email);
        
        try {
            // Await the dispatch of fetchComments to get the actual response
            const response = await dispatch(fetchComments(email));
            console.log("Data", response);
            setCommentsData(response);
            
            // Now that the data has been fetched, you can open the modal
            setModalVisible(true);
            console.log("Viewing comments for vendor:", email);
        } catch (error) {
            console.error('Error viewing comments for vendor:', error);
        }
    };

    const hideModal = () => {
        setModalVisible(false);
    };

    return (
        <div>
            <div className='p-3 text-light' style={{ backgroundColor: '#1C4E80' }}>
                <h5>Vendor Management</h5>
            </div>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="card flex justify-content-center p-1 w-100">
                    <h2 className="mt-5">Vendor List</h2>

                    {Array.isArray(vendors.vendors) && vendors.vendors.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Profile Image URL</th>
                                    <th>Date of Birth</th>
                                    <th>Gender</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.vendors.map((vendor) => (
                                    <tr key={vendor.userName}>
                                        <td>{vendor.userName}</td>
                                        <td>{vendor.email}</td>
                                        <td>{vendor.phoneNumber}</td>
                                        <td>{vendor.profileImageUrl}</td>
                                        <td>{vendor.dateOfBirth}</td>
                                        <td>{vendor.gender}</td>
                                        <td>
                                            <Button
                                                label="Comments/Rankings"
                                                className="p-button-primary p-button-sm"
                                                onClick={() => handleViewComments(vendor.email)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No vendors found.</p>
                    )}

                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={totalRecords}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>

            {/* Modal to display comments/rankings */}
            <Dialog
                header="Vendor Comments/Rankings"
                visible={isModalVisible}
                style={{ width: '50vw' }}
                modal
                onHide={hideModal}
            >
                <p>Comments for vendor with email: {selectedVendorEmail}</p>

                {/* Display comments in a table */}
                {vendorComments.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Comment</th>
                                <th>Rating</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendorComments.map((comment, index) => (
                                <tr key={index}>
                                    <td>{comment.comment}</td>
                                    <td>{comment.rating}</td>
                                    <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No comments found for this vendor.</p>
                )}

                <Button label="Close" onClick={hideModal} />
            </Dialog>

        </div>
    );
}

export default VendorManagement;
