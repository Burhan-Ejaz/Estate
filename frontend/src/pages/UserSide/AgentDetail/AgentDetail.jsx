import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Spin, Empty, Segmented } from "antd";
import { UserOutlined, MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import api from "../../../api/axios.js";
import PropertyCard from "../../../Components/PropertyCard/PropertyCard.jsx";
import "./AgentDetail.css";

const FILTERS = ["All", "Available", "Sold", "Rented"];

const AgentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const getAgentProperties = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const response = await api.get(`/properties/agent/${id}`);
        setAgent(response.data.agent);
        setProperties(response.data.properties);
      } catch (error) {
        console.log(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    getAgentProperties();
  }, [id]);

  const filteredProperties =
    filter === "All"
      ? properties
      : properties.filter((property) => property.status === filter.toLowerCase());

  const availableCount = properties.filter((p) => p.status === "available").length;

  if (loading) {
    return (
      <div className="agent-detail-state">
        <Spin size="large" />
      </div>
    );
  }

  if (notFound || !agent) {
    return (
      <div className="agent-detail-state">
        <Empty description="Agent not found" />
      </div>
    );
  }

  return (
    <div className="agent-detail-page">

      <button className="agent-detail-back" onClick={() => navigate("/agents")}>
        <ArrowLeftOutlined /> All Agents
      </button>

      <div className="agent-profile">
        <Avatar size={64} icon={<UserOutlined />} className="agent-profile-avatar" />

        <div className="agent-profile-info">
          <h1>{agent.name}</h1>
          <p>
            <MailOutlined /> <a href={`mailto:${agent.email}`}>{agent.email}</a>
          </p>
        </div>

        <div className="agent-profile-stats">
          <div>
            <strong>{properties.length}</strong>
            <span>Listings</span>
          </div>
          <div>
            <strong>{availableCount}</strong>
            <span>Available</span>
          </div>
        </div>
      </div>

      <div className="agent-listings-head">
        <h2>Properties by {agent.name}</h2>
        <Segmented options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {filteredProperties.length === 0 ? (
        <div className="agent-detail-state small">
          <Empty description="No properties found" />
        </div>
      ) : (
        <div className="agent-listings-grid">
          {filteredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}

    </div>
  );
};

export default AgentDetail;
