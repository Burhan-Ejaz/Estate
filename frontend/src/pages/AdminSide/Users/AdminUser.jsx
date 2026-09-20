import React from 'react'
import { Card, Table, Space, Tag, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import api from '../../../api/axios.js';

const roleColors = {
  user: 'blue',
  agent: 'green',
  admin: 'gold',
};

const AdminUser = () => {

  const [UserList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserList = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users");
      setUserList(response.data);
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      message.success("User deleted");
      getUserList();
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to delete user");
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
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color={roleColors[role] || 'default'}>{role}</Tag>,
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
            title="Delete this user?"
            description="This action cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDeleteUser(object?._id)}
          >
            <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
    }

  ];

  return (
    <div style={{ minHeight: "100%", width: "100%", padding: 24, boxSizing: "border-box" }}>
      <Card title="Users">
        <Table dataSource={UserList} columns={columns} rowKey="_id" loading={loading} />
      </Card>
    </div>
  )
}

export default AdminUser
