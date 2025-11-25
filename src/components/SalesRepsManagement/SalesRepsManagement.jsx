import {
  Button,
  Form,
  Input,
  Rate,
  Switch,
  Table,
  Tooltip,
  message,
} from "antd";
import dayjs from "dayjs"; // AntD v5 uses Dayjs
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import AddEditModal from "./custom/AddEditModal";
import ViewModal from "./custom/ViewModal";

const SalesRepsManagementTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      MarchantID: 55,
      totalPointsEarned: 1200,
      totalPointsRedeemed: 300,
      totalPointsPending: 150,
      totalVisits: 45,
      name: "Alice Johnson",
      image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
      email: "example@email.com",
      phone: "+1234567890",
      businessName: "Alice's Store",
      website: "https://www.alicesstore.com",
      address: "123 Main St, New York, NY",
      servicesOffered: "Retail, E-commerce",
      tier: "Gold",
      subscriptionType: "Premium",
      lastPaymentDate: "2025-09-01",
      expiryDate: "2026-09-01",
      totalRevenue: "$10,000",
      retailer: 5,
      sales: "$300",
      status: "Active",
      location: "New York",
      feedback: 4,
    },
    {
      id: 2,
      MarchantID: 59,
      totalPointsEarned: 800,
      totalPointsRedeemed: 200,
      totalPointsPending: 75,
      totalVisits: 30,
      name: "John Doe",
      image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
      email: "john@email.com",
      phone: "+9876543210",
      businessName: "John's Shop",
      website: "https://www.johnsshop.com",
      address: "456 Oak St, California, CA",
      servicesOffered: "Fashion, Retail",
      tier: "Silver",
      subscriptionType: "Basic",
      lastPaymentDate: "2025-07-15",
      expiryDate: "2026-07-15",
      totalRevenue: "$5,000",
      retailer: 3,
      sales: "$500",
      status: "Inactive",
      location: "California",
      feedback: 3,
    },
    {
      id: 3,
      MarchantID: 85,
      totalPointsEarned: 1500,
      totalPointsRedeemed: 500,
      totalPointsPending: 200,
      totalVisits: 60,
      name: "Jane Smith",
      image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
      email: "jane@email.com",
      phone: "+1112223333",
      businessName: "Jane's Boutique",
      website: "https://www.janesboutique.com",
      address: "789 Pine St, Texas, TX",
      servicesOffered: "Clothing, Accessories",
      tier: "Platinum",
      subscriptionType: "Premium",
      lastPaymentDate: "2025-08-10",
      expiryDate: "2026-08-10",
      totalRevenue: "$15,000",
      retailer: 4,
      sales: "$700",
      status: "Active",
      location: "Texas",
      feedback: 5,
    },
  ]);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false); // ✅ separate flag for View modal
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

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

  // View
  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true); // ✅ show view only when this is true
  };

  // Normalize date fields (Dayjs -> "YYYY-MM-DD")
  const toISODate = (d) => (d ? dayjs(d).format("YYYY-MM-DD") : null);

  // Add
  const handleAddMerchant = () => {
    form
      .validateFields()
      .then((values) => {
        const newMerchant = {
          id: data.length + 1,
          MarchantID: values.merchantName,
          email: values.email,
          subscriptionType: values.subscriptionType,
          lastPaymentDate: toISODate(values.lastPaymentDate),
          expiryDate: toISODate(values.expiryDate),
          tier: values.tier,
          sales: values.sales || "$0",
          // New merchants start as Pending and require Add/Reject
          status: values.status || "Pending",
          image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
          name: values.name || "—",
          businessName: values.businessName || "—",
          phone: values.phone || "—",
          location: values.location || "—",
          feedback: 0,
        };
        setData((prev) => [...prev, newMerchant]);
        setIsAddModalVisible(false);
        form.resetFields();
        message.success("New merchant added successfully!");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Update
  const handleUpdateMerchant = () => {
    form
      .validateFields()
      .then((values) => {
        const updated = {
          ...selectedRecord,
          MarchantID: values.merchantName,
          email: values.email,
          subscriptionType: values.subscriptionType,
          lastPaymentDate: toISODate(values.lastPaymentDate),
          expiryDate: toISODate(values.expiryDate),
          tier: values.tier,
        };
        setData((prev) =>
          prev.map((item) => (item.id === selectedRecord.id ? updated : item))
        );
        setIsEditModalVisible(false);
        form.resetFields();
        message.success("Merchant updated successfully!");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Add or Edit modal
  const showAddOrEditModal = (record = null) => {
    if (record) {
      setSelectedRecord(record);
      setIsViewModalVisible(false); // ✅ ensure the View modal is closed when editing
      form.setFieldsValue({
        merchantName: record.MarchantID,
        email: record.email,
        subscriptionType: record.subscriptionType,
        lastPaymentDate: record.lastPaymentDate
          ? dayjs(record.lastPaymentDate)
          : null,
        expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
        tier: record.tier,
        name: record.name,
        businessName: record.businessName,
        phone: record.phone,
        location: record.location,
      });
      setIsEditModalVisible(true);
    } else {
      setSelectedRecord(null);
      setIsViewModalVisible(false); // optional: keep view closed when adding
      form.resetFields();
      setIsAddModalVisible(true);
    }
  };

  const filteredData = data.filter((item) => {
    const idMatch = String(item.MarchantID || "").includes(searchText);
    const businessMatch = (item.businessName || "")
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const phoneMatch = (item.phone || "")
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const emailMatch = (item.email || "")
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const locationMatch = (item.location || "")
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return (
      idMatch || businessMatch || phoneMatch || emailMatch || locationMatch
    );
  });

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Merchant Card ID",
      dataIndex: "MarchantID",
      key: "MarchantID",
      align: "center",
    },
    {
      title: "Business Name",
      dataIndex: "businessName",
      key: "businessName",
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
    { title: "Sales Rep", dataIndex: "name", key: "salesRep", align: "center" },
    { title: "Total Sales", dataIndex: "sales", key: "sales", align: "center" },
    {
      title: "Total Points Earned",
      dataIndex: "totalPointsEarned",
      key: "totalPointsEarned",
      align: "center",
    },
    {
      title: "Total Points Redeemed",
      dataIndex: "totalPointsRedeemed",
      key: "totalPointsRedeemed",
      align: "center",
    },
    {
      title: "Total Points Pending",
      dataIndex: "totalPointsPending",
      key: "totalPointsPending",
      align: "center",
    },
    {
      title: "Total Visits",
      dataIndex: "totalVisits",
      key: "totalVisits",
      align: "center",
    },
    { title: "Status", dataIndex: "status", key: "status", align: "center" },
    {
      title: "Ratings",
      dataIndex: "feedback",
      key: "feedback",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Customer Ratings">
          <Rate disabled value={record.feedback} style={{ fontSize: 16 }} />
        </Tooltip>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => {
        // If merchant is pending show Add and Reject actions
        if (record.status === "Pending") {
          return (
            <div className="flex gap-2 justify-center items-center py-[7px] px-[15px]">
              <button
                onClick={() => {
                  // Approve (add) merchant: change status to Active so existing actions become available
                  setData((prev) =>
                    prev.map((item) =>
                      item.id === record.id
                        ? { ...item, status: "Active" }
                        : item
                    )
                  );
                  message.success("Merchant approved and added.");
                }}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:opacity-90"
              >
                Add
              </button>

              <button
                onClick={() => {
                  Swal.fire({
                    title: "Reject merchant?",
                    text: "This will remove the merchant from the list.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, reject",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      setData((prev) =>
                        prev.filter((item) => item.id !== record.id)
                      );
                      Swal.fire({
                        title: "Rejected",
                        text: "Merchant has been rejected and removed.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                      });
                    }
                  });
                }}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:opacity-90"
              >
                Reject
              </button>
            </div>
          );
        }

        // Otherwise show the regular action set
        return (
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
                onClick={() => showAddOrEditModal(record)}
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
                      setData((prev) =>
                        prev.filter((item) => item.id !== record.id)
                      );
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
                backgroundColor:
                  record.status === "Active" ? "#3fae6a" : "gray",
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
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between md:flex-row flex-col md:items-end items-start gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold">Merchant Management</h1>
          <p className="text-[16px] font-normal mt-2">
            Effortlessly manage your merchants and track performance.
          </p>
        </div>

        <div className="flex md:flex-row flex-col items-end gap-4">
          <Input
            placeholder="Search by Customer ID, Name, Phone or Email, Location"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-96 h-10"
          />
          {/* <Input.Search
            placeholder="Search by ID, Business, Phone, Email, Location"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
            className="h-10"
          /> */}
          <Button
            className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
            onClick={() => showAddOrEditModal()}
          >
            Add New Merchant
          </Button>
          <Button className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold">
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
          rowKey="id"
        />
      </div>

      {/* View Modal */}
      {isViewModalVisible && selectedRecord && (
        <ViewModal
          visible={isViewModalVisible}
          record={selectedRecord}
          onCancel={() => {
            setIsViewModalVisible(false);
            setSelectedRecord(null);
          }}
        />
      )}

      {/* Add or Edit Merchant Modal */}
      <AddEditModal
        visible={isAddModalVisible || isEditModalVisible}
        selectedRecord={isEditModalVisible ? selectedRecord : null}
        form={form}
        handleAddMerchant={handleAddMerchant}
        handleUpdateMerchant={handleUpdateMerchant}
        setIsAddModalVisible={setIsAddModalVisible}
        setIsEditModalVisible={setIsEditModalVisible}
      />
    </div>
  );
};

export default SalesRepsManagementTable;
