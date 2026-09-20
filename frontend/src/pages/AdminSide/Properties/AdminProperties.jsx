import React from 'react'
import { Card, Table, Space, Tag, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import api from '../../../api/axios.js';

const statusColors = {
  available: 'green',
  sold: 'red',
  rented: 'orange',
};

const purposeColors = {
  sale: 'geekblue',
  rent: 'purple',
};

const AdminProperties = () => {
  const [PropertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPropertyList = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/properties");
      setPropertyList(response.data);
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPropertyList();
  }, []);

  const handleDeleteProperty = async (id) => {
    try {
      await api.delete(`/admin/properties/${id}`);
      message.success("Property deleted");
      getPropertyList();
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to delete property");
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag>{type}</Tag>,
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
      render: (purpose) => <Tag color={purposeColors[purpose] || 'default'}>{purpose}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => typeof price === 'number' ? price.toLocaleString() : '-',
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
    },
    {
      title: "City",
      dataIndex: ["location", "city"],
      key: "city",
    },
    {
      title: "Address",
      dataIndex: ["location", "address"],
      key: "address",
    },
    {
      title: "Beds",
      dataIndex: "bedrooms",
      key: "bedrooms",
    },
    {
      title: "Baths",
      dataIndex: "bathrooms",
      key: "bathrooms",
    },
    {
      title: "Area",
      dataIndex: "areaSize",
      key: "areaSize",
    },
    {
      title: "Photos",
      dataIndex: "images",
      key: "images",
      render: (images) => images?.length || 0,
    },
    {
      title: "Agent",
      dataIndex: "agent",
      key: "agent",
      render: (agent) => agent?.name || agent?.email || (typeof agent === 'string' ? agent : '-'),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status] || 'default'}>{status}</Tag>,
    },
    {
      title: "Listed",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: "Action",
      key: "Action",
      fixed: 'right',
      render: (_, object) =>
        <Space>
          <Popconfirm
            title="Delete this property?"
            description="This action cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDeleteProperty(object?._id)}
          >
            <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
    }

  ];

  return (
    <div style={{ minHeight: "100%", width: "100%", padding: 24, boxSizing: "border-box" }}>
      <Card title="Properties">
        <Table
          dataSource={PropertyList}
          columns={columns}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 1400 }}
          expandable={{
            rowExpandable: (record) => Boolean(record.description),
            expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
          }}
        />
      </Card>
    </div>
  )
}

export default AdminProperties
