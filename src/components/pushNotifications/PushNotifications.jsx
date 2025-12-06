import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { Button, Input, message, Select } from "antd";
import { Row, Col } from "antd";

const { Option } = Select;

const PushNotifications = () => {
  const editor = useRef(null);

  // States
  const [segment, setSegment] = useState("");
  const [title, setTitle] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [sendTo, setSendTo] = useState(""); // New state for Send To
  const [location, setLocation] = useState(""); // New state for Location
  const [tier, setTier] = useState(""); // New state for Tier
  const [subscriptionType, setSubscriptionType] = useState(""); // New state for Subscription Type
  const [status, setStatus] = useState(""); // New state for Status

  const handleSend = () => {
    if (
      !segment.trim() ||
      !sendTo.trim() ||
      !location.trim() ||
      !tier.trim() ||
      !subscriptionType.trim() ||
      !status.trim()
    ) {
      message.error("Please fill in all fields before sending.");
      return;
    }
    if (!title.trim() || !bodyContent.trim()) {
      message.error("Please fill in both title and body before sending.");
      return;
    }
    message.success("Push Notification sent successfully!");
    console.log("Notification Data:", {
      sendTo,
      segment,
      title,
      bodyContent,
      location,
      tier,
      subscriptionType,
      status,
    });

    // Reset fields after sending
    setSegment("");
    setTitle("");
    setBodyContent("");
    setSendTo("");
    setLocation("");
    setTier("");
    setSubscriptionType("");
    setStatus("");
  };

  const handleCancel = () => {
    setSegment("");
    setTitle("");
    setBodyContent("");
    setSendTo("");
    setLocation("");
    setTier("");
    setSubscriptionType("");
    setStatus("");
    message.info("Notification draft cleared.");
  };

  return (
    <div className="border rounded-lg px-12 py-8 bg-white">
      <div className="flex justify-between items-center mb-[40px]">
        <h2 className="text-xl font-bold">Send Push Notifications</h2>
      </div>

      <div className="mb-4">
        {/* Use Row with flexbox to display the dropdowns inline */}
        <Row gutter={[16, 16]} justify="start" style={{ flexWrap: "wrap" }}>
          {/* Send To Dropdown */}
          <Col xs={24} sm={8} md={4}>
            <div className="flex flex-col">
              <label className="font-bold text-[18px] mb-1">Send To</label>
              <Select
                placeholder="Select Recipients"
                value={sendTo}
                onChange={(value) => setSendTo(value)}
                style={{ width: "100%" }}
                className="mli-tall-select"
              >
                <Option value="all">All</Option>
                <Option value="specific">Specific Users</Option>
              </Select>
            </div>
          </Col>

          {/* Location Dropdown */}
          <Col xs={24} sm={8} md={4}>
            <div className="flex flex-col">
              <label className="font-bold text-[18px] mb-1">Location</label>
              <Select
                placeholder="Select Location"
                value={location}
                onChange={(value) => setLocation(value)}
                style={{ width: "100%" }}
                className="mli-tall-select"
              >
                <Option value="ny">New York</Option>
                <Option value="ca">California</Option>
                <Option value="tx">Texas</Option>
              </Select>
            </div>
          </Col>

          {/* Tier Dropdown */}
          <Col xs={24} sm={8} md={4}>
            <div className="flex flex-col">
              <label className="font-bold text-[18px] mb-1">Tier</label>
              <Select
                placeholder="Select Tier"
                value={tier}
                onChange={(value) => setTier(value)}
                style={{ width: "100%" }}
                className="mli-tall-select"
              >
                <Option value="gold">Gold</Option>
                <Option value="silver">Silver</Option>
                <Option value="platinum">Platinum</Option>
              </Select>
            </div>
          </Col>

          {/* Subscription Type Dropdown */}
          <Col xs={24} sm={8} md={4}>
            <div className="flex flex-col">
              <label className="font-bold text-[18px] mb-1">
                Subscription Type
              </label>
              <Select
                placeholder="Select Subscription Type"
                value={subscriptionType}
                onChange={(value) => setSubscriptionType(value)}
                style={{ width: "100%" }}
                className="mli-tall-select"
              >
                <Option value="basic">Basic</Option>
                <Option value="premium">Premium</Option>
                <Option value="enterprise">Enterprise</Option>
              </Select>
            </div>
          </Col>

          {/* Status Dropdown */}
          <Col xs={24} sm={8} md={4}>
            <div className="flex flex-col">
              <label className="font-bold text-[18px] mb-1">Status</label>
              <Select
                placeholder="Select Status"
                value={status}
                onChange={(value) => setStatus(value)}
                style={{ width: "100%" }}
                className="mli-tall-select"
              >
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </div>

      {/* Title Field */}
      <div className="mb-6 flex flex-col">
        <label className="font-bold text-[18px] mb-1 mt-2">Title</label>
        <Input
          placeholder="Enter notification title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mli-tall-input"
        />
      </div>

      {/* Body Editor */}
      <div className="mb-6 flex flex-col gap-2">
        <label className="font-bold text-[18px] mb-1">Body</label>
        <JoditEditor
          ref={editor}
          value={bodyContent}
          onChange={(newContent) => setBodyContent(newContent)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button onClick={handleCancel} className="px-12 py-5">
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          className="bg-primary text-white px-12 py-5"
        >
          Send
        </Button>
      </div>

      {/* Preview */}
      {(segment ||
        title ||
        bodyContent ||
        sendTo ||
        location ||
        tier ||
        subscriptionType ||
        status) && (
        <div className="saved-content mt-6 border p-6 rounded-lg bg-white">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          {segment && (
            <p className="text-md font-medium mb-2">
              <strong>Segment:</strong>{" "}
              {segment
                .replace("_", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </p>
          )}
          {sendTo && (
            <p className="text-md font-medium mb-2">
              <strong>Send To:</strong>{" "}
              {sendTo
                .replace("_", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </p>
          )}
          {location && (
            <p className="text-md font-medium mb-2">
              <strong>Location:</strong> {location}
            </p>
          )}
          {tier && (
            <p className="text-md font-medium mb-2">
              <strong>Tier:</strong> {tier}
            </p>
          )}
          {subscriptionType && (
            <p className="text-md font-medium mb-2">
              <strong>Subscription Type:</strong> {subscriptionType}
            </p>
          )}
          {status && (
            <p className="text-md font-medium mb-2">
              <strong>Status:</strong> {status}
            </p>
          )}
          {title && <h4 className="text-md font-bold mb-2">{title}</h4>}
          {bodyContent && (
            <div
              dangerouslySetInnerHTML={{ __html: bodyContent }}
              className="prose max-w-none"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PushNotifications;
