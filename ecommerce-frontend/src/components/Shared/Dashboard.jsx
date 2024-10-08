import React, { useEffect, useState } from 'react';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import TopicMenu from './Sidebar/TopicMenu';
import NavBar from './Sidebar/NavBar';
import SideBar from './Sidebar/SideBar';
import './Dashboard.css'; // Add your custom CSS for styling
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminDashboard from '../Admin/AdminDashboard';
import VendorDashboard from '../Vendor/VendorDashboard';
import { logout } from '../../redux/Admin/actions/adminAction';


const Dashboard = () => {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const topics = ["Admin Dashboard", "Vendor Dashboard", "Logout"];
    
    const [contentIndex, setContentIndex] = useState(0);
    const [selectedKey, setSelectedKey] = useState("0");
    const [collapsed, setCollapsed] = useState(false); // State for sidebar collapse
    const changeSelectedKey = (event) => {
        const key = event.key;
        setSelectedKey(key);
        setContentIndex(+key);
    };
    // const role = useSelector((state) => state.authentication.role);
    const role = localStorage.getItem("role")
    
    // const redirectLogout = async() => {
    //     try {
    //         const { backend } = getState().ongoingCampaigns;
    //         const response = await axios.delete(`${backend}/${localStorage.getItem("token")}`);
      
    //       } catch (error) {
      
    //       }
    //       localStorage.setItem("token", null);
    //       dispatch(setIsLogged(false))
    //       navigate("/login");
    // }

    useEffect(()=>{
        console.log("role in dashbaord", role)
    },[])

    const handleLogout = ()=>{
        dispatch(logout());
        navigate("/login")
    }

    const renderContent = () => {
        switch (contentIndex) {
          case 0:
            return (role === "Admin" || role === "CSR") ? <AdminDashboard /> : <div>Access Denied</div>;
          case 1:
            return role === "Vendor" ? <VendorDashboard /> : <div>Access Denied</div>;
          default:
            handleLogout();
        }
      };

    const Menu = (
        <TopicMenu
            topics={topics}
            selectedKey={selectedKey}
            changeSelectedKey={changeSelectedKey}
        />
    );
    

    return (
        <div>
            <NavBar menu={Menu} />
            <Layout>
                <SideBar menu={Menu} collapsed={collapsed} style={{width:'400px'}} />
                <Layout className="site-layout">
                    <Layout.Header className="site-layout-background" style={{ padding: 0 }}>
                        <Button type="primary" onClick={() => setCollapsed(!collapsed)}>
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </Button>
                    </Layout.Header>
                    <Layout.Content className="content m-0 p-0">
                        {renderContent()}
                    </Layout.Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default Dashboard;
