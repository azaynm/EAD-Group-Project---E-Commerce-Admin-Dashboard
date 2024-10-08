import React, { useEffect } from "react";
import { Menu } from "antd";
import logo from '../../../assets/logo.jpg';
import { useSelector } from "react-redux";

const TopicMenu = ({ topics, selectedKey, changeSelectedKey }) => {
  // const role = useSelector((state) => state.authentication.role);
  const role = localStorage.getItem("role")
  console.log("role in topic menue", role)

  const styledTopics = topics.map((topic, index) => {
    switch (index) {
      case 0:
        return (role === "Admin" || role === "CSR") && (
          <Menu.Item key={index.toString()} onClick={changeSelectedKey} style={{ backgroundColor: '#0C8ABE', color: 'white', fontWeight: 'bold' }}>
            {topic}
          </Menu.Item>
        );
      case 1:
        return (role === "Vendor") && (
          <Menu.Item key={index.toString()} onClick={changeSelectedKey} style={{ backgroundColor: '#0C8ABE', color: 'white', fontWeight: 'bold' }}>
            {topic}
          </Menu.Item>
        );
      case 2: // Logout option for all users
        return (
          <Menu.Item key={index.toString()} onClick={changeSelectedKey} style={{ backgroundColor: '#0C8ABE', color: 'white', fontWeight: 'bold' }}>
            {topic}
          </Menu.Item>
        );
      default:
        return null;
    }
  });

  return (
    <>
      <img src={logo} height={160} style={{width:'100%'}} alt="Logo" />
      <Menu mode="inline" selectedKeys={[selectedKey]} className="bg-dark" style={{minHeight:'100vh'}} >
        {styledTopics}
        
      </Menu>
    </>
  );
};

export default TopicMenu;
