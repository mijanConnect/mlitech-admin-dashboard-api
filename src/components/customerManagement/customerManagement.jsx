"use client";
import { Button, Form, Input } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import EditModal from "./components/EditModal";
import ViewModal from "./components/ViewModal";
import CustomerTable from "./components/Table";
import { useGetCustomerProfileQuery } from "../../redux/apiSlices/customerSlice";

const CustomerManagement = () => {
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [form] = Form.useForm();

  const queryParams = [
    { name: "page", value: page },
    { name: "limit", value: limit },
  ];
  if (searchText.trim()) {
    queryParams.push({ name: "searchTerm", value: searchText.trim() });
  }

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useGetCustomerProfileQuery(queryParams);

  console.log(response);

  const tableData = useMemo(() => {
    const items = response?.data || [];
    return items.map((item, index) => ({
      key: item._id,
      id: index + 1 + (page - 1) * limit,
      customerId: item.customerId || "-",
      customerName: item.firstName || "-",
      subscription: item.subscription || "-",
      tier: item.tier || "-",
      phone: item.phone || "-",
      email: item.email || "-",
      location: item.location || "-",
      refdRep: item.refdRep || "-",
      totalSales: item.totalSales || 0,
      status: item.status === "active" ? "Active" : "Inactive",
      raw: item,
    }));
  }, [response, page, limit]);

  const paginationData = {
    pageSize: limit,
    total: response?.pagination?.total || 0,
    current: page,
  };

  const handlePaginationChange = (newPage, newPageSize) => {
    setPage(newPage);
    if (newPageSize !== limit) {
      setLimit(newPageSize);
    }
  };

  const editFields = [
    {
      name: "customerName",
      label: "Customer Name",
      rules: [{ required: true }],
    },
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
      customerName: record.customerName,
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
    setTableData((prev) =>
      prev.map((item) => (item.id === selectedRecord.id ? updatedRecord : item))
    );
    setIsEditModalVisible(false);
    form.resetFields();
    Swal.fire("Updated!", "The customer details were updated.", "success");
  };

  const handleDelete = (recordId) => {
    setTableData((prev) => prev.filter((item) => item.id !== recordId));
  };

  const handleStatusChange = (recordId, newStatus) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === recordId ? { ...item, status: newStatus } : item
      )
    );
  };

  const datailsColumns = [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Subscription Type",
      dataIndex: "subscription",
      key: "subscription",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
    },
    {
      title: "Reward",
      dataIndex: "reward",
      key: "reward",
      align: "center",
    },
    {
      title: "Points Used",
      dataIndex: "pointsUsed",
      key: "pointsUsed",
      align: "center",
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

      <CustomerTable
        data={tableData}
        isLoading={isLoading}
        isFetching={isFetching}
        onView={showViewModal}
        onEdit={showEditModal}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        pagination={paginationData}
        onPaginationChange={handlePaginationChange}
      />

      {/* View Details Modal */}
      <ViewModal
        visible={isViewModalVisible}
        onCancel={handleCloseViewModal}
        selectedRecord={selectedRecord}
        columns2={datailsColumns}
        data={tableData}
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
