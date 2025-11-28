import { Rate, Switch, Table, Tooltip } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import { message } from "antd";

const MerchantTable = ({
  data,
  columns,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onApprove,
  onReject,
}) => {
  const tableComponents = {
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

  const columnsWithActions = [
    ...columns,
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
                onClick={() => onApprove(record.id)}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:opacity-90"
              >
                Add
              </button>

              <button
                onClick={() => onReject(record.id)}
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
                onClick={() => onView(record)}
                className="text-primary hover:text-green-700 text-xl"
              >
                <IoEyeSharp />
              </button>
            </Tooltip>

            <Tooltip title="Edit">
              <button
                onClick={() => onEdit(record)}
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
                      onDelete(record.id);
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
                    onStatusChange(record.id, checked ? "Active" : "Inactive");
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
    <div className="overflow-x-auto">
      <Table
        dataSource={data}
        columns={columnsWithActions}
        pagination={{ pageSize: 10 }}
        bordered={false}
        size="small"
        rowClassName="custom-row"
        components={tableComponents}
        className="custom-table [&_.ant-pagination]:flex [&_.ant-pagination]:justify-end [&_.ant-pagination]:mr-4"
        scroll={{ x: "max-content" }}
        rowKey="id"
      />
    </div>
  );
};

export default MerchantTable;
