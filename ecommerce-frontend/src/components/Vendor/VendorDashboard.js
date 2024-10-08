import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { createProduct, deleteProduct, fetchProducts, updateProduct, updateStatus } from '../../redux/Vendor/actions/vendorAction';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../../redux/Vendor/slices/vendorSlice';
import { TabView, TabPanel } from 'primereact/tabview';

import { Paginator } from 'primereact/paginator';
import AddProduct from './AddProduct';
import OrderManagement from '../Admin/OrderManagement';


function VendorDashboard() {
    

    return (
<div>
            <h1>Vendor Dashboard</h1>
            <TabView>
                <TabPanel header="Add Product">
                    <AddProduct/>
                </TabPanel>
                
                <TabPanel header="Order Management">
                    <OrderManagement/>
                </TabPanel>

            </TabView>
        </div>
    );
}

export default VendorDashboard;
