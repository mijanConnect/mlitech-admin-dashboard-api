import { Button, DatePicker, Table } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { useState } from "react";

// Sample data for revenue per user with added date field
const data = [
  {
    sl: 1,
    customerId: "C-2001",
    customers: "Alice",
    transactions: 120,
    totalRevenue: 3000.5,
    date: "2025-01-01", // Added date for filtering
  },
  {
    sl: 2,
    customerId: "C-2002",
    customers: "Jhon",
    transactions: 95,
    totalRevenue: 2200.0,
    date: "2025-02-01", // Added date for filtering
  },
  {
    sl: 3,
    customerId: "C-2003",
    customers: "Doe",
    transactions: 150,
    totalRevenue: 5000.0,
    date: "2025-03-01", // Added date for filtering
  },
];

// Table columns
const columns = [
  // {
  //   title: "SL",
  //   dataIndex: "sl",
  //   key: "sl",
  //   align: "center",
  //   render: (_, __, index) => index + 1,
  // },
  {
    title: "Customer ID",
    dataIndex: "customerId",
    key: "customerId",
    align: "center",
  },
  {
    title: "Customers",
    dataIndex: "customers",
    key: "customers",
    align: "center",
  },
  {
    title: "Transactions",
    dataIndex: "transactions",
    key: "transactions",
    align: "center",
  },
  {
    title: "Total Revenue",
    dataIndex: "totalRevenue",
    key: "totalRevenue",
    align: "center",
    render: (value) => `$${value.toFixed(2)}`,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    align: "center",
  },
];

export default function RevenuePerUser() {
  const [filteredData, setFilteredData] = useState(data);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleDateChange = () => {
    let filtered = data;
    if (fromDate) {
      filtered = filtered.filter((item) =>
        dayjs(item.date).isSameOrAfter(fromDate, "day")
      );
    }
    if (toDate) {
      filtered = filtered.filter((item) =>
        dayjs(item.date).isSameOrBefore(toDate, "day")
      );
    }
    setFilteredData(filtered);
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
    handleDateChange(); // Trigger the date filter when "From" date changes
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    handleDateChange(); // Trigger the date filter when "To" date changes
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-[30px] font-bold mb-2">Revenue Per User</h1>
        <div className="flex justify-between">
          <div>
            <DatePicker
              value={fromDate ? dayjs(fromDate) : null}
              onChange={handleFromDateChange}
              style={{ marginLeft: "auto", marginRight: "20px" }}
              placeholder="From Date"
              format="YYYY-MM-DD"
            />
            <DatePicker
              value={toDate ? dayjs(toDate) : null}
              onChange={handleToDateChange}
              style={{ marginRight: "20px" }}
              placeholder="To Date"
              format="YYYY-MM-DD"
            />
          </div>
          <Button className="bg-primary text-white font-semibold px-[20px] hover:!text-black">
            Export Report
          </Button>
        </div>
      </div>
      <Table
        bordered={false}
        size="small"
        rowClassName="custom-row"
        className="custom-table"
        columns={columns}
        dataSource={filteredData.map((row, index) => ({
          ...row,
          key: index,
        }))}
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}
