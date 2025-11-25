import { Button, DatePicker, Table } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { useState } from "react";

// Sample data for points redeemed
const data = [
  {
    sl: 1,
    customerName: "John Doe",
    period: "2025-01",
    customerId: "C001",
    redemptions: 15,
    totalPointsRedeemed: 3200,
    date: "2025-01-01", // Add date to the data
  },
  {
    sl: 2,
    customerName: "Jane Smith",
    period: "2025-02",
    customerId: "C002",
    redemptions: 10,
    totalPointsRedeemed: 2500,
    date: "2025-02-01", // Add date to the data
  },
  {
    sl: 3,
    customerName: "Mike Johnson",
    period: "2025-03",
    customerId: "C003",
    redemptions: 20,
    totalPointsRedeemed: 4500,
    date: "2025-03-01", // Add date to the data
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
    { title: "Period", dataIndex: "period", key: "period", align: "center" },
  {
    title: "Customer ID",
    dataIndex: "customerId",
    key: "customerId",
    align: "center",
  },

  {
    title: "Customer Name",
    dataIndex: "customerName",
    key: "customerName",
    align: "center",
  },
  {
    title: "Redemptions",
    dataIndex: "redemptions",
    key: "redemptions",
    align: "center",
  },
  {
    title: "Total Points Redeemed",
    dataIndex: "totalPointsRedeemed",
    key: "totalPointsRedeemed",
    align: "center",
    render: (value) => value.toLocaleString(), // Format as a number with commas
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    align: "center",
  },
];

export default function PointsRedeemed() {
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
        <h1 className="text-[30px] font-bold mb-2">Points Redeemed</h1>
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
