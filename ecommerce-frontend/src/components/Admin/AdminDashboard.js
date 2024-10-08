import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TabView, TabPanel } from 'primereact/tabview';
import AddVendor from './AddVendor';
import ActivateAccount from './ActivateAccount';
import InventoryManagement from './InventoryManagement';
import VendorManagement from './VendorManagement';
import OrderTracking from './OrderTracking';
import OrderTrackingAdmin from './OrderTrackingAdmin';

function AdminDashboard() {


    return (
        <div>
           
            <TabView>
                <TabPanel header="Activate Accounts">
                    <ActivateAccount/>
                </TabPanel>
                
                <TabPanel header="Add Vendor">
                    <AddVendor/>
                </TabPanel>

                <TabPanel header="Inventory Management">
                    <InventoryManagement />
                </TabPanel>
                <TabPanel header="Vendor Management">
                    <VendorManagement />
                </TabPanel>
                <TabPanel header="Order Tracking">
                    <OrderTrackingAdmin />
                </TabPanel>
            </TabView>
        </div>
    );
}

export default AdminDashboard;
