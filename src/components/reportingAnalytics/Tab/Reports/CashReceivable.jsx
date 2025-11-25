import { Button, DatePicker, Table } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { useState } from "react";

// Sample data for cash receivable
const data = [
  {
    sl: 1,
    date: "2025-01-01",
    merchantId: "M-1001",
    transactions: 5,
    totalCollected: 1200.5,
    salesRep: "John Doe",
    location: "Chicago",
  },
  {
    sl: 2,
    date: "2025-02-01",
    merchantId: "M-1002",
    transactions: 3,
    totalCollected: 850.0,
    salesRep: "Jane Smith",
    location: "Los Angeles",
  },
  {
    sl: 3,
    date: "2025-03-01",
    merchantId: "M-1003",
    transactions: 7,
    totalCollected: 1500.0,
    salesRep: "Alice Johnson",
    location: "New York",
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
    dataIndex: "merchantId",
    key: "merchantId",
    align: "center",
  },
  {
    title: "Sales Rep",
    dataIndex: "salesRep",
    key: "salesRep",
    align: "center",
  },
  { title: "Date", dataIndex: "date", key: "date", align: "center" },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    align: "center",
  },
  {
    title: "Transactions",
    dataIndex: "transactions",
    key: "transactions",
    align: "center",
  },
  {
    title: "Total Outstanding",
    dataIndex: "totalCollected",
    key: "totalCollected",
    align: "center",
    render: (value) => `$${value.toFixed(2)}`,
  },
];

export default function CashReceivable() {
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

  // Debug log to inspect filtered data at runtime
  console.log("CashReceivable filteredData:", filteredData);

  return (
    <div style={{ width: "100%" }}>
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-[30px] font-bold mb-2">Cash Receivable</h1>
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
