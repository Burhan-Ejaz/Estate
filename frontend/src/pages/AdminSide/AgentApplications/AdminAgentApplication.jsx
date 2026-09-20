import React from 'react'
import { Card, Table, Space, Popconfirm, message, Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import api from '../../../api/axios.js';

const AdminAgentApplication = () => {
  const [AgentApplicationList, setAgentApplicationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  const getApplicationList = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/agents/applications/pending");
      setAgentApplicationList(response.data);
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplicationList();
  }, []);

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await api.patch(`/admin/agents/approve/${id}`);
      message.success("Application approved");
      getApplicationList();
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to approve application");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id) => {
    setActioningId(id);
    try {
      await api.patch(`/admin/agents/reject/${id}`);
      message.success("Application rejected");
      getApplicationList();
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to reject application");
    } finally {
      setActioningId(null);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Applied On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: "Action",
      key: "Action",
      render: (_, object) =>
        <Space>
          <Popconfirm
            title="Approve this agent application?"
            okText="Approve"
            onConfirm={() => handleApprove(object?._id)}
          >
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              loading={actioningId === object?._id}
            >
              Approve
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Reject this agent application?"
            okText="Reject"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleReject(object?._id)}
          >
            <Button
              danger
              size="small"
              icon={<CloseOutlined />}
              loading={actioningId === object?._id}
            >
              Reject
            </Button>
          </Popconfirm>
        </Space>
    }

  ];
  return (
    <div style={{ minHeight: "100%", width: "100%", padding: 24, boxSizing: "border-box" }}>
      <Card title="Agent Applications">
        <Table dataSource={AgentApplicationList} columns={columns} rowKey="_id" loading={loading} />
      </Card>
    </div>
  )
}

export default AdminAgentApplication
