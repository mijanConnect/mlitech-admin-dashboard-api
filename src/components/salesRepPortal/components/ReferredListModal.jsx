import { Modal, Table } from "antd";

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

const ReferredListModal = ({
  visible,
  onCancel,
  salesRepData,
  referredData,
}) => {
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      key: "joiningDate",
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (amount) => `$${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <span
          className={`px-3 py-1 rounded ${
            status === "Active"
              ? "bg-green-100 text-green-700"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      ),
    },
  ];

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      title={
        <div className="text-xl font-bold">
          Referred Customers - {salesRepData?.name}
        </div>
      }
    >
      <div className="py-4">
        {/* Sales Rep Details Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Sales Representative Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold text-gray-800">
                {salesRepData?.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sales Rep ID</p>
              <p className="font-semibold text-gray-800">
                {salesRepData?.repId}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Referrals</p>
              <p className="font-semibold text-gray-800">
                {salesRepData?.totalReferrals}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Join</p>
              <p className="font-semibold text-gray-800">
                {salesRepData?.totalJoin}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Discount</p>
              <p className="font-semibold text-gray-800">
                {salesRepData?.currentDiscount}
              </p>
            </div>
          </div>
        </div>

        {/* Referred Customers Table */}
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Referred Customers List
        </h3>
        <Table
          dataSource={referredData}
          columns={columns}
          pagination={{ pageSize: 5 }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
          components={components}
          className="custom-table"
          scroll={{ x: "max-content" }}
          rowKey="id"
        />
      </div>
    </Modal>
  );
};

export default ReferredListModal;
