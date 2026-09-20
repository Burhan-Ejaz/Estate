import React from "react";
import { useNavigate } from "react-router-dom";
import {
  EnvironmentOutlined,
  ExpandOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import "./PropertyCard.css";

const formatPrice = (price) => {
  if (typeof price !== "number") return "-";
  return `Rs. ${price.toLocaleString()}`;
};

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const {
    _id,
    title,
    price,
    type,
    purpose,
    location,
    bedrooms,
    bathrooms,
    areaSize,
    images,
    status,
  } = property;

  const openDetails = () => navigate(`/properties/${_id}`);

  return (
    <div
      className="pc-card"
      role="link"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={(e) => e.key === "Enter" && openDetails()}
    >
      <div className="pc-image">
        {images?.length > 0 ? (
          <img src={images[0]} alt={title} />
        ) : (
          <span className="pc-no-image">No Image</span>
        )}

        <span className={`pc-badge ${purpose === "rent" ? "pc-rent" : "pc-sale"}`}>
          {purpose === "rent" ? "For Rent" : "For Sale"}
        </span>

        {status && status !== "available" && (
          <span className="pc-badge pc-status">{status}</span>
        )}
      </div>

      <div className="pc-body">
        <div className="pc-meta">
          {type && <span className="pc-type">{type}</span>}
          <p className="pc-price">
            {formatPrice(price)}
            {purpose === "rent" && <small>/month</small>}
          </p>
        </div>

        <h3 className="pc-title" title={title}>{title}</h3>

        <p className="pc-location">
          <EnvironmentOutlined />
          <span>
            {[location?.address, location?.city].filter(Boolean).join(", ") || "-"}
          </span>
        </p>

        <div className="pc-footer">
          <div className="pc-details">
            {typeof bedrooms === "number" && (
              <span>{bedrooms} Beds</span>
            )}
            {typeof bathrooms === "number" && (
              <span>{bathrooms} Baths</span>
            )}
            {typeof areaSize === "number" && (
              <span><ExpandOutlined /> {areaSize} sq ft</span>
            )}
          </div>

          <span className="pc-arrow" aria-hidden="true">
            <ArrowRightOutlined />
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
