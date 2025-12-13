import React, { useState } from "react";
import { Button, Modal, Form, Input, Select } from "antd";
import Swal from "sweetalert2";
import AddNewUserModal from "./components/AddNewUserModal";
import UserTableColumn from "./components/UserTableColumn";

const { Option } = Select;

const UserManagement = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@email.com",
      password: "123456",
      phone: "+1234567890",
      role: "Admin",
      createdAt: "2025-08-01",
      status: "Active",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@email.com",
      password: "123456",
      phone: "+9876543210",
      role: "User",
      createdAt: "2025-08-05",
      status: "Inactive",
    },
  ]);

  const [roles, setRoles] = useState(["Admin", "User"]); // Default roles

  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [roleForm] = Form.useForm();

  // Open modal for editing
  const handleEditUser = (record) => {
    setEditingUser(record);
    setIsUserModalVisible(true);
  };

  // Close modal and reset
  const handleCloseUserModal = () => {
    setIsUserModalVisible(false);
    setEditingUser(null);
  };

  // Add Role
  const handleAddRole = () => {
    roleForm.validateFields().then((values) => {
      setRoles((prev) => [...prev, values.roleName]);
      Swal.fire({
        title: "Role Added!",
        text: `Role "${values.roleName}" has been successfully added.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      roleForm.resetFields();
      setIsRoleModalVisible(false);
    });
  };

  // Handle Add/Edit User submission
  const handleSubmitUser = (values) => {
    if (editingUser) {
      // Update existing user
      setData((prev) =>
        prev.map((item) =>
          item.id === editingUser.id ? { ...item, ...values } : item
        )
      );
      Swal.fire({
        title: "Updated!",
        text: "User details have been updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      // Add new user
      const newUser = {
        id: data.length + 1,
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0],
        ...values,
      };
      setData((prev) => [...prev, newUser]);
      Swal.fire({
        title: "User Added!",
        text: `${values.name} has been added successfully.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
    handleCloseUserModal();
  };

  // Handle delete user
  const handleDeleteUser = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  // Handle status change
  const handleStatusChange = (id, status) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const paginationData = {
    pageSize: pageSize,
    total: data.length,
    current: page,
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-0 mb-4">
        <div>
          <h1 className="text-[24px] font-bold">User Management</h1>
          <p className="text-[16px] font-normal mt-2">
            Access your account securely with your login credentials.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => setIsUserModalVisible(true)}
            className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
          >
            Add New User
          </Button>
        </div>
      </div>

      <UserTableColumn
        data={data}
        isLoading={false}
        isFetching={false}
        pagination={paginationData}
        onPaginationChange={(nextPage, nextPageSize) => {
          setPage(nextPage);
          setPageSize(nextPageSize);
        }}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onStatusChange={handleStatusChange}
      />

      {/* Add New Role Modal */}
      <Modal
        title="Add New Role"
        open={isRoleModalVisible}
        onCancel={() => setIsRoleModalVisible(false)}
        onOk={handleAddRole}
        okText="Add Role"
      >
        <Form
          form={roleForm}
          layout="vertical"
          className="flex flex-col gap-4 mb-6"
        >
          <Form.Item
            name="roleName"
            label="Role Name"
            rules={[{ required: true, message: "Please enter role name" }]}
          >
            <Input placeholder="Enter role name" className="mli-tall-input" />
          </Form.Item>
          <Form.Item name="status" label="Select Page Access Control">
            <Select className="mli-tall-select">
              <Option value="Active">Full</Option>
              <Option value="Inactive">Dashboard</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add/Edit User Modal */}
      <AddNewUserModal
        visible={isUserModalVisible}
        onCancel={handleCloseUserModal}
        onSubmit={handleSubmitUser}
        editingUser={editingUser}
        roles={roles}
      />
    </div>
  );
};

export default UserManagement;
