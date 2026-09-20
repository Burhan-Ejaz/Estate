import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Tag, Spin, Form, Input, Button, Popconfirm, message } from "antd";
import { UserOutlined, MailOutlined, CalendarOutlined } from "@ant-design/icons";
import { useAuth } from "../../../Context/AuthContext.jsx";
import api from "../../../api/axios.js";
import "./Profile.css";

const roleColors = {
  admin: "gold",
  agent: "blue",
  user: "default",
};

const agentStatusColors = {
  none: "default",
  pending: "orange",
  approved: "green",
  rejected: "red",
};

const Profile = () => {
  const { user, authLoading, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [application, setApplication] = useState(null);
  const [applicationLoading, setApplicationLoading] = useState(false);

  const getApplicationStatus = async () => {
    try {
      setApplicationLoading(true);
      const response = await api.get("/users/agent-application");
      setApplication(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setApplicationLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "user") {
      getApplicationStatus();
    }
  }, [user?.role]);

  if (authLoading) {
    return (
      <div className="profile-state">
        <Spin size="large" />
      </div>
    );
  }

  const handleEdit = () => {
    form.setFieldsValue({ name: user?.name, email: user?.email });
    setEditing(true);
  };

  const handleSave = async (values) => {
    try {
      setSaving(true);
      const response = await api.put("/users/profile", values);
      setUser(response.data.user);
      message.success(response.data.message || "Profile updated successfully");
      setEditing(false);
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleApplyForAgent = async () => {
    try {
      setApplying(true);
      const response = await api.post("/users/apply-agent");
      message.success(response.data.message || "Application submitted");
      await getApplicationStatus();
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Application failed");
    } finally {
      setApplying(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      setDeleting(true);
      const response = await api.delete("/users/profile");
      message.success(response.data.message || "Profile deleted successfully");
      logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to delete profile");
      setDeleting(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-banner">
        <div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
        <div className="profile-banner-info">
          <h1>{user?.name}</h1>
          <Tag color={roleColors[user?.role] || "default"}>{user?.role}</Tag>
        </div>
        {!editing && (
          <Button className="profile-edit-btn" onClick={handleEdit}>
            Edit Profile
          </Button>
        )}
      </div>

      <div className="profile-grid">
        <div className="profile-main">
          <Card title="Account Details" className="profile-card">
            {editing ? (
              <Form form={form} layout="vertical" onFinish={handleSave}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter your name" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Enter a valid email" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={saving}>
                    Save
                  </Button>
                  <Button style={{ marginLeft: 10 }} onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <div className="profile-detail-grid">
                <div className="profile-detail-item">
                  <span className="profile-detail-icon"><UserOutlined /></span>
                  <div>
                    <p className="profile-detail-label">Full Name</p>
                    <p className="profile-detail-value">{user?.name}</p>
                  </div>
                </div>

                <div className="profile-detail-item">
                  <span className="profile-detail-icon"><MailOutlined /></span>
                  <div>
                    <p className="profile-detail-label">Email Address</p>
                    <p className="profile-detail-value">{user?.email}</p>
                  </div>
                </div>

                <div className="profile-detail-item">
                  <span className="profile-detail-icon"><CalendarOutlined /></span>
                  <div>
                    <p className="profile-detail-label">Member Since</p>
                    <p className="profile-detail-value">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="profile-side">
          {user?.role === "user" && (
            <Card title="Become an Agent" className="profile-card">
              {applicationLoading ? (
                <Spin />
              ) : (
                <>
                  <p className="profile-agent-status">
                    Application Status:{" "}
                    <Tag color={agentStatusColors[application?.agentStatus] || "default"}>
                      {application?.agentStatus || "none"}
                    </Tag>
                  </p>

                  {(application?.agentStatus === "none" || application?.agentStatus === "rejected") && (
                    <Button type="primary" block loading={applying} onClick={handleApplyForAgent}>
                      Apply to become an Agent
                    </Button>
                  )}

                  {application?.agentStatus === "pending" && (
                    <p className="profile-agent-note">
                      Your application is under review. Please wait for admin response.
                    </p>
                  )}
                </>
              )}
            </Card>
          )}

          <Card title="Danger Zone" className="profile-card profile-danger">
            <p>Deleting your account is permanent and cannot be undone.</p>
            <Popconfirm
              title="Delete your account?"
              description="This action cannot be undone."
              okText="Delete"
              okButtonProps={{ danger: true, loading: deleting }}
              onConfirm={handleDeleteProfile}
            >
              <Button danger block>Delete Account</Button>
            </Popconfirm>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
