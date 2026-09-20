import React, { useState, useEffect } from 'react'
import { Card, Table, Space, Tag, Button, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../../api/axios.js';
import AddProperty from '../AddProperty/AddProperty.jsx';

const statusColors = {
  available: 'green',
  sold: 'red',
  rented: 'orange',
};

const purposeColors = {
  sale: 'geekblue',
  rent: 'purple',
};

const AgentProperties = () => {
  const [PropertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  const getPropertyList = async () => {
    setLoading(true);
    try {
      const response = await api.get("/properties/my-properties");
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
      await api.delete(`/properties/delete/${id}`);
      message.success("Property deleted");
      getPropertyList();
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to delete property");
    }
  };

  const handleAddClick = () => {
    setEditingProperty(null);
    setModalOpen(true);
  };

  const handleEditClick = (record) => {
    setEditingProperty(record);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProperty(null);
  };

  const handleSaved = () => {
    setModalOpen(false);
    setEditingProperty(null);
    getPropertyList();
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
      title: "Photos",
      dataIndex: "images",
      key: "images",
      render: (images) => images?.length || 0,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status] || 'default'}>{status}</Tag>,
    },
    {
      title: "Action",
      key: "Action",
      fixed: 'right',
      render: (_, object) =>
        <Space>
          <EditOutlined
            style={{ color: '#4a6cf7', cursor: 'pointer' }}
            onClick={() => handleEditClick(object)}
          />
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
     <div style={{ height: "100vh", width: "100%" }}>
      <Card
        title="My Properties"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
            Add Property
          </Button>
        }
      >
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

      <AddProperty
        open={modalOpen}
        property={editingProperty}
        onClose={handleModalClose}
        onSaved={handleSaved}
      />
    </div>
  )
}

export default AgentProperties
