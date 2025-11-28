"use client";
import { Button, Form, Input, Modal, Switch, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EditModal from "./components/EditModal";
import ViewModal from "./components/ViewModal";

const components = {
  header: {
    row: (props) => (
      <tr
        {...props}
        style={{
          backgroundColor: "#f0f5f9",
          height: "50px",
          color: "secondary",
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
          color: "secondary",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
  },
};

const CustomerManagement = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
      email: "example@email.com",
      retailer: 5,
      sales: "300",
      status: "Active",
      phone: "+1234567890",
      location: "New York",
      businessName: "Alice's Store",
      subscription: "Premium", // Subscription Type
      tier: "Gold",
      date: "2025-01-15", // Date
      reward: "500", // Reward points or amount
      pointsUsed: "200", // Points used
      lastPaymentDate: "2025-01-01", // Added Last Payment Date
      expiryDate: "2026-01-01", // Added Expiry Date
    },
    {
      id: 2,
      name: "John Doe",
      image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
      email: "john@email.com",
      retailer: 3,
      sales: "500",
      status: "Inactive",
      phone: "+9876543210",
      location: "California",
      businessName: "John's Shop",
      subscription: "Basic", // Subscription Type
      tier: "Silver",
      date: "2025-05-10", // Date
      reward: "400", // Reward points or amount
      pointsUsed: "100", // Points used
      lastPaymentDate: "2025-05-01", // Added Last Payment Date
      expiryDate: "2026-05-01", // Added Expiry Date
    },
    {
      id: 3,
      name: "John",
      image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
      email: "john@email.com",
      retailer: 3,
      sales: "500",
      status: "Active",
      phone: "+9876543210",
      location: "California",
      businessName: "John's Shop",
      subscription: "Premium", // Subscription Type
      tier: "Platinum",
      date: "2025-03-20", // Date
      reward: "600", // Reward points or amount
      pointsUsed: "250", // Points used
      lastPaymentDate: "2025-03-15", // Added Last Payment Date
      expiryDate: "2026-03-15", // Added Expiry Date
    },
  ]);

  const columns2 = [
    {
      title: "SL", // Serial number
      dataIndex: "id", // Assuming the ID is used as the serial number
      key: "id",
      align: "center",
    },
    {
      title: "Subscription Type", // Subscription Type
      dataIndex: "subscription", // Assuming each record has a 'subscription' field
      key: "subscription",
      align: "center",
    },
    {
      title: "Date", // Date
      dataIndex: "date", // Assuming a 'date' field exists in your data
      key: "date",
      align: "center",
    },
    {
      title: "Reward", // Reward (Could be points, discounts, etc.)
      dataIndex: "reward", // Assuming a 'reward' field exists
      key: "reward",
      align: "center",
    },
    {
      title: "Points Used", // Points Used
      dataIndex: "pointsUsed", // Assuming a 'pointsUsed' field exists
      key: "pointsUsed",
      align: "center",
    },
  ];

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const editFields = [
    { name: "name", label: "Customer Name", rules: [{ required: true }] },
    { name: "email", label: "Email Address", rules: [{ required: true }] },
    {
      name: "subscription",
      label: "Subscription Type",
      rules: [{ required: true }],
    },
    { name: "tier", label: "Tier", rules: [{ required: true }] },
    { name: "lastPaymentDate", label: "Last Payment Date", type: "date" },
    { name: "expiryDate", label: "Expiry Date", type: "date" },
  ];

  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const showEditModal = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      subscription: record.subscription,
      tier: record.tier,
      lastPaymentDate: record.lastPaymentDate
        ? dayjs(record.lastPaymentDate)
        : null,
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
    });
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedRecord(null);
  };

  const handleEditSubmit = (values) => {
    const updatedRecord = { ...selectedRecord, ...values };
    setData((prev) =>
      prev.map((item) => (item.id === selectedRecord.id ? updatedRecord : item))
    );
    setIsEditModalVisible(false);
    form.resetFields();
    Swal.fire("Updated!", "The customer details were updated.", "success");
  };

  const filteredData = data.filter(
    (item) =>
      item.id.toString().includes(searchText) ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.phone.includes(searchText) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    { title: "Customer ID", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Customer Name",
      dataIndex: "businessName",
      key: "businessName",
      align: "center",
    },
    {
      title: "Subscription",
      dataIndex: "subscription",
      key: "subscription",
      align: "center",
    },
    {
      title: "Tier",
      dataIndex: "tier",
      key: "tier",
      align: "center",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
    },
    { title: "Refer Rep", dataIndex: "name", key: "salesRep", align: "center" },
    { title: "Total Sales", dataIndex: "sales", key: "sales", align: "center" },
    { title: "Status", dataIndex: "status", key: "status", align: "center" },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 170,
      render: (_, record) => (
        <div
          className="flex gap-2 justify-between align-middle py-[7px] px-[15px] border border-primary rounded-md"
          style={{ alignItems: "center" }}
        >
          <Tooltip title="View Details">
            <button
              onClick={() => showViewModal(record)}
              className="text-primary hover:text-green-700 text-xl"
            >
              <IoEyeSharp />
            </button>
          </Tooltip>

          <Tooltip title="Edit">
            <button
              onClick={() => showEditModal(record)}
              className="text-primary hover:text-green-700 text-xl"
            >
              <FaEdit />
            </button>
          </Tooltip>

          <Tooltip title="Delete">
            <button
              onClick={() => {
                Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, delete it!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    setData(data.filter((item) => item.id !== record.id));
                    Swal.fire({
                      title: "Deleted!",
                      text: "Your record has been deleted.",
                      icon: "success",
                    });
                  }
                });
              }}
              className="text-red-500 hover:text-red-700 text-md"
            >
              <FaTrash />
            </button>
          </Tooltip>

          <Switch
            size="small"
            checked={record.status === "Active"}
            style={{
              backgroundColor: record.status === "Active" ? "#3fae6a" : "gray",
            }}
            onChange={(checked) => {
              Swal.fire({
                title: "Are you sure?",
                text: `You are about to change status to ${
                  checked ? "Active" : "Inactive"
                }.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, change it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  setData((prev) =>
                    prev.map((item) =>
                      item.id === record.id
                        ? { ...item, status: checked ? "Active" : "Inactive" }
                        : item
                    )
                  );
                  Swal.fire({
                    title: "Updated!",
                    text: `Status has been changed to ${
                      checked ? "Active" : "Inactive"
                    }.`,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                  });
                }
              });
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between flex-col md:flex-row gap-0 items-start md:items-end">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 ">
          <div>
            <h1 className="text-[24px] font-bold">Customer Profile</h1>
            <p className="text-[16px] font-normal mt-2">
              Seamlessly manage customer profiles and interactions.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Search by Customer ID, Name, Phone or Email, Location"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-96"
          />
          <Button
            className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
            // onClick={exportToCSV}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
          components={components}
          className="custom-table"
          scroll={{ x: "max-content" }}
        />
      </div>

      {/* View Details Modal */}
      <ViewModal
        visible={isViewModalVisible}
        onCancel={handleCloseViewModal}
        selectedRecord={selectedRecord}
        columns2={columns2}
        data={data}
      />

      {/* Edit Customer Modal */}
      <EditModal
        visible={isEditModalVisible}
        title="Edit Customer"
        onCancel={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        form={form}
        selectedRecord={selectedRecord}
        fields={editFields}
      />
    </div>
  );
};

export default CustomerManagement;
