import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Empty, message } from "antd";
import api from "../../../api/axios.js";
import { useAuth } from "../../../Context/AuthContext.jsx";
import "./PropertyDetail.css";

const formatPrice = (price) => {
  if (typeof price !== "number") return "-";
  return `Rs. ${price.toLocaleString()}`;
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const getProperty = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.log(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    getProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="pd-state">
        <Spin size="large" />
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="pd-state">
        <Empty description="Property not found" />
      </div>
    );
  }

  const {
    title,
    description,
    price,
    type,
    purpose,
    location,
    bedrooms,
    bathrooms,
    areaSize,
    images,
    status,
    agent,
  } = property;

  const currentUserId = user?._id || user?.id;
  const isOwnProperty = agent?._id && currentUserId && agent._id === currentUserId;

  const handleChatWithAgent = () => {
    if (!user) {
      message.info("Please login to chat with the agent");
      navigate("/login");
      return;
    }

    navigate(`/messages?propertyId=${id}`);
  };

  return (
    <div className="pd-page">
      <button className="pd-back" onClick={() => navigate(-1)}>
        &larr; Back to Properties
      </button>

      <div className="pd-image">
        {images?.length > 0 ? (
          <img src={images[0]} alt={title} />
        ) : (
          <span className="pd-no-image">No Image</span>
        )}

        <span className="pd-badge pd-purpose">
          {purpose === "rent" ? "For Rent" : "For Sale"}
        </span>

        {status && status !== "available" && (
          <span className="pd-badge pd-status">{status}</span>
        )}
      </div>

      <div className="pd-content">
        <div className="pd-main">
          <h1 className="pd-title">{title}</h1>

          <p className="pd-location">
            {[location?.address, location?.city].filter(Boolean).join(", ") || "-"}
          </p>

          <p className="pd-price">{formatPrice(price)}</p>

          <div className="pd-details">
            <span>{type}</span>
            {typeof bedrooms === "number" && <span>{bedrooms} Beds</span>}
            {typeof bathrooms === "number" && <span>{bathrooms} Baths</span>}
            {typeof areaSize === "number" && <span>{areaSize} sq ft</span>}
          </div>

          <h2 className="pd-subheading">Description</h2>
          <p className="pd-description">
            {description || "No description provided."}
          </p>
        </div>

        <aside className="pd-sidebar">
          <h2 className="pd-subheading">Listed By</h2>

          <div className="pd-agent">
            <div className="pd-agent-avatar">
              {agent?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <p className="pd-agent-name">{agent?.name || "Unknown Agent"}</p>
              <p className="pd-agent-email">{agent?.email || "-"}</p>
            </div>
          </div>

          {!isOwnProperty && (
            <button className="pd-contact-button" onClick={handleChatWithAgent}>
              Chat with Agent
            </button>
          )}

          <a className="pd-email-link" href={`mailto:${agent?.email || ""}`}>
            Email Agent
          </a>
        </aside>
      </div>
    </div>
  );
};

export default PropertyDetail;
