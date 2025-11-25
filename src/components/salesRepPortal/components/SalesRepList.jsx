// src/pages/salesRepPortal/SalesRepList.jsx
import { Table } from "antd";
import { useState } from "react";
import Swal from "sweetalert2";
import ReferredListModal from "./ReferredListModal";

const components = {
  header: {
    row: (props) => (
      <tr
        {...props}
        style={{
          backgroundColor: "#f0f5f9",
          height: "50px",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
    cell: (props) => (
      <th
        {...props}
        style={{
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
  },
};

const SalesRepList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRep, setSelectedRep] = useState(null);

  // Sample referred customers data for each sales rep
  const referredCustomersData = {
    1: [
      {
        id: "C001",
        name: "John Smith",
        joiningDate: "2025-01-15",
        amount: 250,
        status: "Active",
      },
      {
        id: "C002",
        name: "Sarah Johnson",
        joiningDate: "2025-02-20",
        amount: 180,
        status: "Active",
      },
      {
        id: "C003",
        name: "Mike Wilson",
        joiningDate: "2025-03-10",
        amount: 320,
        status: "Inactive",
      },
    ],
    2: [
      {
        id: "C004",
        name: "Emily Davis",
        joiningDate: "2025-01-25",
        amount: 150,
        status: "Active",
      },
      {
        id: "C005",
        name: "David Brown",
        joiningDate: "2025-02-15",
        amount: 200,
        status: "Inactive",
      },
    ],
    3: [
      {
        id: "C006",
        name: "Lisa Anderson",
        joiningDate: "2025-01-05",
        amount: 400,
        status: "Active",
      },
      {
        id: "C007",
        name: "Robert Taylor",
        joiningDate: "2025-01-18",
        amount: 275,
        status: "Active",
      },
      {
        id: "C008",
        name: "Jennifer White",
        joiningDate: "2025-02-22",
        amount: 350,
        status: "Inactive",
      },
      {
        id: "C009",
        name: "Michael Harris",
        joiningDate: "2025-03-05",
        amount: 220,
        status: "Active",
      },
    ],
  };

  const data = [
    {
      id: 1,
      name: "Rep 1",
      repId: "SR1001",
      totalReferrals: 20,
      totalJoin: 15,
      currentDiscount: "10%",
    },
    {
      id: 2,
      name: "Rep 2",
      repId: "SR1002",
      totalReferrals: 12,
      totalJoin: 8,
      currentDiscount: "8%",
    },
    {
      id: 3,
      name: "Rep 3",
      repId: "SR1003",
      totalReferrals: 30,
      totalJoin: 25,
      currentDiscount: "15%",
    },
  ];

  const handleViewReferredList = (record) => {
    setSelectedRep(record);
    setIsModalVisible(true);
  };

  const handlePayNow = (record) => {
    Swal.fire({
      title: "Process Payment",
      text: `Process payment for ${record.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Withdraw",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Payment Processed!",
          text: `Payment for ${record.name} has been processed successfully.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const columns = [
    {
      title: "Sales Rep Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Sales Rep ID",
      dataIndex: "repId",
      key: "repId",
      align: "center",
    },
    {
      title: "Total Referrals",
      dataIndex: "totalReferrals",
      key: "totalReferrals",
      align: "center",
    },
    {
      title: "Total Join",
      dataIndex: "totalJoin",
      key: "totalJoin",
      align: "center",
    },
    {
      title: "Current Discount",
      dataIndex: "currentDiscount",
      key: "currentDiscount",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center items-center">
          <button
            onClick={() => handleViewReferredList(record)}
            className="bg-[#2196F3] text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Referred Lists
          </button>
          <button
            onClick={() => handlePayNow(record)}
            className="bg-[#3FAE6A] text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Withdraw
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-[24px] font-bold">Sales Rep Lists</h1>
        <p className="text-[16px] font-normal mt-0">
          Track and manage your sales representatives effortlessly.
        </p>
      </div>
      <Table
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 10 }}
        bordered={false}
        size="small"
        rowClassName="custom-row"
        components={components}
        className="custom-table"
        rowKey="id"
        scroll={{ x: "max-content" }}
      />

      {/* Referred List Modal */}
      {selectedRep && (
        <ReferredListModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          salesRepData={selectedRep}
          referredData={referredCustomersData[selectedRep.id] || []}
        />
      )}
    </div>
  );
};

export default SalesRepList;
