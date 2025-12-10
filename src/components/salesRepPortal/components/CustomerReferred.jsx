import React, { useState } from "react";
import { Modal } from "antd";
import Swal from "sweetalert2";
import NewCampaign from "../../promotionManagement/components/NewCampaing.jsx";
import { CopyOutlined } from "@ant-design/icons";
import CustomerReferredTableColumn from "./CustomerReferredTableColumn.jsx";

const CustomerReferred = () => {
  const [data, setData] = useState([
    {
      id: 1,
      customerName: "John Doe",
      phoneNumber: "123-456-7890",
      email: "example@mail.com",
      salesRep: "Rep 1",
      paymentStatus: "Paid",
      actionStatus: "Inactive",
      status: "active",
      statusProgress: 0, // 0 = only Acknowledge, 1 = Activate, 2 = Generate Token
      acknowledgeDate: null, // Added to store acknowledge date
      generatedToken: "", // Added to store generated token
      activateDate: null, // Added to store activate date
      tokenGeneratedDate: null, // Added to store token generated date
    },
    {
      id: 2,
      customerName: "Jane Smith",
      phoneNumber: "234-567-8901",
      email: "jane.smith@mail.com",
      salesRep: "Rep 2",
      paymentStatus: "Unpaid",
      actionStatus: "Inactive",
      status: "inactive",
      statusProgress: 0,
      acknowledgeDate: null,
      generatedToken: "",
      activateDate: null,
      tokenGeneratedDate: null,
    },
    {
      id: 3,
      customerName: "Alice Johnson",
      phoneNumber: "345-678-9012",
      email: "alice.johnson@mail.com",
      salesRep: "Rep 3",
      paymentStatus: "Paid",
      actionStatus: "Active",
      status: "active",
      statusProgress: 2,
      acknowledgeDate: "2025-09-20", // Sample date
      generatedToken: "ABC12345",
      activateDate: "2025-09-18", // Sample date
      tokenGeneratedDate: "2025-09-20", // Sample date
    },
    {
      id: 4,
      customerName: "Bob Brown",
      phoneNumber: "456-789-0123",
      email: "bob.brown@mail.com",
      salesRep: "Rep 4",
      paymentStatus: "Paid",
      actionStatus: "Inactive",
      status: "inactive",
      statusProgress: 1,
      acknowledgeDate: "2025-09-15", // Sample date
      generatedToken: "",
      activateDate: null,
      tokenGeneratedDate: null,
    },
  ]);

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isNewCampaignModalVisible, setIsNewCampaignModalVisible] =
    useState(false);
  const [isCashTokenModalVisible, setIsCashTokenModalVisible] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [referralID, setReferralID] = useState("ANDREW856 D");

  // Handle Acknowledge Cash Payment
  const handleAcknowledge = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);

    // Update record with acknowledge date and progress status
    setData((prevData) =>
      prevData.map((item) =>
        item.id === record.id
          ? {
              ...item,
              statusProgress: 1,
              acknowledgeDate: new Date().toLocaleDateString(),
            }
          : item
      )
    );
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const handleAddCampaign = (newCampaign) => {
    setData((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        status: "Active",
        statusProgress: 0,
        ...newCampaign,
      },
    ]);
    setIsNewCampaignModalVisible(false);
    Swal.fire({
      icon: "success",
      title: "Campaign Added!",
      text: "Your new campaign has been added successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Generate Cash Token
  const handleGenerateToken = (record) => {
    setSelectedRecord(record);
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    setGeneratedToken(token);

    // Set generated token in the selected record
    setData((prevData) =>
      prevData.map((item) =>
        item.id === record.id
          ? {
              ...item,
              generatedToken: token,
              tokenGeneratedDate: new Date().toLocaleDateString(),
            }
          : item
      )
    );
    setIsCashTokenModalVisible(true);
  };

  // Then, update handleConfirmToken:
  const handleConfirmToken = () => {
    setReferralID(generatedToken); // set token as referral ID
    Swal.fire({
      icon: "success",
      title: "Token Generated!",
      text: `Your cash token: ${generatedToken}`,
    });
    setIsCashTokenModalVisible(false);
  };

  // Toggle user active/inactive
  const handleToggleUserStatus = (record) => {
    const isCurrentlyActive = record.status === "active";

    Swal.fire({
      title: isCurrentlyActive
        ? "Deactivate this user?"
        : "Activate this user?",
      text: `This will set the user status to ${
        isCurrentlyActive ? "inactive" : "active"
      }.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isCurrentlyActive
        ? "Yes, deactivate"
        : "Yes, activate",
    }).then((result) => {
      if (result.isConfirmed) {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === record.id
              ? {
                  ...item,
                  status: isCurrentlyActive ? "inactive" : "active",
                  actionStatus: isCurrentlyActive ? "Inactive" : "Active",
                  statusProgress: 2, // Generate Token enabled
                  activateDate: new Date().toLocaleDateString(),
                }
              : item
          )
        );

        Swal.fire({
          title: isCurrentlyActive ? "Deactivated!" : "Activated!",
          text: `User has been set to ${
            isCurrentlyActive ? "inactive" : "active"
          }.`,
          icon: "success",
        });
      }
    });
  };

  const handleCopyReferralID = () => {
    if (!referralID) return;
    navigator.clipboard
      .writeText(referralID)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Copied!",
          text: `Referral ID "${referralID}" has been copied.`,
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to copy referral ID.",
        });
      });
  };

  return (
    <div>
      <div className="flex justify-between flex-col md:flex-row gap-4 items-start md:items-end mb-4">
        <div>
          <h1 className="text-[24px] font-bold">Customers Referred</h1>
          <p className="text-[16px] font-normal mt-0">
            Track and manage customers you've referred effortlessly.
          </p>
        </div>
        <div className="flex flex-col items-center gap-1 border border-secondary rounded-md px-12 py-2">
          <p>Your Referral ID</p>
          <div className="flex items-center gap-2">
            <p className="font-bold text-[16px]">{referralID}</p>
            <button onClick={handleCopyReferralID}>
              <CopyOutlined />
            </button>
          </div>
        </div>
      </div>

      <CustomerReferredTableColumn
        data={data}
        isLoading={false}
        isFetching={false}
        pagination={{ current: 1, pageSize: 10, total: data.length }}
        onPaginationChange={(page, pageSize) => {
          console.log("Page changed:", page, pageSize);
        }}
        onAcknowledge={handleAcknowledge}
        onToggleStatus={handleToggleUserStatus}
        onGenerateToken={handleGenerateToken}
      />

      {/* New Campaign Modal */}
      <Modal
        open={isNewCampaignModalVisible}
        onCancel={() => setIsNewCampaignModalVisible(false)}
        footer={null}
        width={1000}
      >
        <NewCampaign
          onSave={handleAddCampaign}
          onCancel={() => setIsNewCampaignModalVisible(false)}
        />
      </Modal>

      {/* Cash Token Modal */}
      <Modal
        open={isCashTokenModalVisible}
        onOk={handleConfirmToken}
        onCancel={() => setIsCashTokenModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <div className="flex flex-col items-center my-16 border border-secondary rounded-md p-8">
          <p className="text-[16px] font-normal">
            Cash token generated for John Doe
          </p>
          <p className="text-[16px] font-bold mt-2">{generatedToken}</p>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerReferred;
