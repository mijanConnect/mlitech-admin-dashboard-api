"use client";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Switch,
  Table,
  Tooltip,
} from "antd";
import dayjs from "dayjs"; // ✅ AntD v5 uses Dayjs
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MarchantIcon from "../../assets/marchant.png";

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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Add Edit Modal state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState(""); // Search text state

  const [form] = Form.useForm(); // Declare the form here to use Ant Design's form functionality

  const navigate = useNavigate();

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
        ? dayjs(record.lastPaymentDate) // Use Dayjs for DatePicker value
        : null,
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
    });
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedRecord(null);
  };

  const handleEditSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedRecord = { ...selectedRecord, ...values };
        setData((prev) =>
          prev.map((item) =>
            item.id === selectedRecord.id ? updatedRecord : item
          )
        );
        setIsEditModalVisible(false);
        form.resetFields();
        Swal.fire("Updated!", "The customer details were updated.", "success");
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
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
              onClick={() => showEditModal(record)} // Edit modal
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
      <Modal
        visible={isViewModalVisible}
        onCancel={handleCloseViewModal}
        width={700}
        footer={false}
      >
        {selectedRecord && (
          <div>
            <div className="flex flex-row justify-between items-start gap-3 mt-8">
              <img
                src={MarchantIcon}
                alt={selectedRecord.name}
                className="w-214 h-214 rounded-full"
              />
              <div className="flex flex-col gap-2 border border-primary rounded-md p-4 w-full">
                <p className="text-[22px] font-bold text-primary">
                  Customer Profile
                </p>

                {/* Displaying the customer details */}
                <p>
                  <strong>Customer Name:</strong> {selectedRecord.name}
                </p>
                <p>
                  <strong>Phone Number:</strong> {selectedRecord.phone}
                </p>
                <p>
                  <strong>Email Address:</strong> {selectedRecord.email}
                </p>
                <p>
                  <strong>Address:</strong> {selectedRecord.location}
                </p>

                {/* Adding the new fields */}
                <p className="text-[22px] font-bold text-primary mt-4">
                  Loyalty Points
                </p>
                <p>
                  <strong>Points Balance:</strong> {selectedRecord.sales}{" "}
                  {/* Points Balance */}
                </p>
                <p>
                  <strong>Tier:</strong> {selectedRecord.tier} {/* Tier */}
                </p>
                <p>
                  <strong>Subscription Type:</strong>{" "}
                  {selectedRecord.subscription} {/* Subscription Type */}
                </p>
                <p>
                  <strong>Last Payment Date:</strong>{" "}
                  {selectedRecord.lastPaymentDate} {/* Last Payment Date */}
                </p>
                <p>
                  <strong>Expiry Date:</strong> {selectedRecord.expiryDate}{" "}
                  {/* Expiry Date */}
                </p>
              </div>
            </div>

            {/* Table (assuming this shows the customer's order history or other details) */}
            <Table
              columns={columns2}
              dataSource={data}
              rowKey="orderId"
              pagination={{ pageSize: 5 }}
              className="mt-6"
            />
          </div>
        )}
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        title="Edit Customer"
        visible={isEditModalVisible}
        onCancel={handleCloseEditModal}
        onOk={handleEditSubmit}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          className="flex flex-col gap-4 mb-6"
        >
          <Form.Item
            label="Customer Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input className="mli-tall-input" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true }]}
          >
            <Input className="mli-tall-input" />
          </Form.Item>

          <Form.Item
            label="Subscription Type"
            name="subscription"
            rules={[{ required: true }]}
          >
            <Input className="mli-tall-input" />
          </Form.Item>

          <Form.Item label="Tier" name="tier" rules={[{ required: true }]}>
            <Input className="mli-tall-input" />
          </Form.Item>

          <Form.Item label="Last Payment Date" name="lastPaymentDate">
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              className="mli-tall-picker"
            />
          </Form.Item>

          <Form.Item label="Expiry Date" name="expiryDate">
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              className="mli-tall-picker"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerManagement;
