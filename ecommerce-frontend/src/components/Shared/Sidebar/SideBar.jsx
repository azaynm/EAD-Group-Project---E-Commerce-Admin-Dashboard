import React from "react";
import { Layout } from "antd";
import "./SideBar.css";

const SideBar = ({ menu, collapsed }) => {
  return (
    <Layout.Sider
      className="sidebar"
      breakpoint={"lg"}
      theme="light"
      collapsedWidth={0}
      trigger={null}
      collapsible
      collapsed={collapsed} // Use the collapsed prop
    >
      {menu}
    </Layout.Sider>
  );
};

export default SideBar;
