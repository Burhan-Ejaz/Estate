import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Avatar, Spin, Empty } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import api from "../../../api/axios.js";
import "./agent.css";

const Agents = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAgents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/agents");
        setAgents(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getAgents();
  }, []);

  return (
    <div className="agents-page">
      <div className="agents-header">
        <h1>Our Agents</h1>
        <p>Meet the trusted professionals behind our listings.</p>
      </div>

      {loading ? (
        <div className="agents-state">
          <Spin size="large" />
        </div>
      ) : agents.length === 0 ? (
        <div className="agents-state">
          <Empty description="No agents found" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {agents.map((agent) => (
            <Col xs={24} sm={12} lg={8} key={agent._id}>
              <Card
                className="agent-card"
                hoverable
                onClick={() => navigate(`/agents/${agent._id}`)}
              >
                <Avatar size={72} icon={<UserOutlined />} className="agent-avatar" />
                <h3 className="agent-name">{agent.name}</h3>
                <p className="agent-email">
                  <MailOutlined /> {agent.email}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Agents;
