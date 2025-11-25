import React from "react";
import { Tabs } from "antd";
import CustomerReferred from "./components/CustomerReferred.jsx";
import SalesRepList from "./components/SalesRepList.jsx";

const { TabPane } = Tabs;

const SalesRepPortal = () => {
  return (
    <div className="">
      <Tabs defaultActiveKey="1" tabBarGutter={20}>
        <TabPane
          tab={
            <span
              style={{
                padding: "10px 20px", // Button-like padding
                borderRadius: "4px", // Rounded corners
                backgroundColor: "#3FAE6A", // Button background color
                color: "#fff", // White text
                fontSize: "16px", // Font size
                fontWeight: "bold", // Bold text
                cursor: "pointer", // Pointer cursor
                transition: "background-color 0.3s", // Smooth transition for hover effect
              }}
            >
              Customer Referred
            </span>
          }
          key="1"
        >
          <CustomerReferred />
        </TabPane>
        {/* <TabPane
          tab={
            <span
              style={{
                padding: "10px 20px",
                borderRadius: "4px",
                backgroundColor: "#2196F3",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Sales Rep List
            </span>
          }
          key="2"
        >
          <SalesRepList />
        </TabPane> */}
      </Tabs>
    </div>
  );
};

export default SalesRepPortal;
