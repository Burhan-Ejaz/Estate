import React from 'react'
import { Row, Col, Card, Statistic, Button, message } from 'antd';
import { HomeOutlined, CheckCircleOutlined, DollarCircleOutlined, KeyOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios.js';
import AddProperty from '../AddProperty/AddProperty.jsx';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    rented: 0,
  });

  const getStats = async () => {
    setLoading(true);
    try {
      const response = await api.get("/properties/my-properties");
      const properties = response.data || [];

      setStats({
        total: properties.length,
        available: properties.filter((p) => p.status === "available").length,
        sold: properties.filter((p) => p.status === "sold").length,
        rented: properties.filter((p) => p.status === "rented").length,
      });
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  const handleSaved = () => {
    setAddOpen(false);
    getStats();
  };

  const cards = [
    {
      title: "My Properties",
      value: stats.total,
      icon: <HomeOutlined />,
      color: '#1677ff',
    },
    {
      title: "Available",
      value: stats.available,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
    },
    {
      title: "Sold",
      value: stats.sold,
      icon: <DollarCircleOutlined />,
      color: '#ff4d4f',
    },
    {
      title: "Rented",
      value: stats.rented,
      icon: <KeyOutlined />,
      color: '#faad14',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}>
          Add Property
        </Button>
      </div>
      <Row gutter={[16, 16]}>
        {cards.map((card) => (
          <Col xs={24} sm={12} lg={6} key={card.title}>
            <Card hoverable loading={loading} onClick={() => navigate('/agent/properties')}>
              <Statistic
                title={card.title}
                value={card.value}
                prefix={card.icon}
                valueStyle={{ color: card.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <AddProperty open={addOpen} property={null} onClose={() => setAddOpen(false)} onSaved={handleSaved} />
    </div>
  )
}

export default AgentDashboard
