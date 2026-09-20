import React from 'react'
import { Card, Table, Space, Tag, Popconfirm, message, Button } from 'antd';
import { DeleteOutlined, FileSearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios.js';

const AdminAgent = () => {
  const [AgentList, setAgentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getAgentList = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/agents");
      setAgentList(response.data);
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAgentList();
  }, []);

  const handleDeleteAgent = async (id) => {
    try {
      await api.delete(`/admin/agents/${id}`);
      message.success("Agent deleted");
      getAgentList();
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to delete agent");
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
      title: "Status",
      dataIndex: "agentStatus",
      key: "agentStatus",
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Joined",
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
            title="Delete this agent?"
            description="This action cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDeleteAgent(object?._id)}
          >
            <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
    }

  ];

  return (
    <div style={{ minHeight: "100%", width: "100%", padding: 24, boxSizing: "border-box" }}>
      <Card
        title="Agents"
        extra={
          <Button icon={<FileSearchOutlined />} onClick={() => navigate('/admin/agentapplications')}>
            Pending Applications
          </Button>
        }
      >
        <Table dataSource={AgentList} columns={columns} rowKey="_id" loading={loading} />
      </Card>
    </div>
  )
}

export default AdminAgent
