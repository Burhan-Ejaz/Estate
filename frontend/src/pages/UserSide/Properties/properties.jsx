import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input, Select, InputNumber, Button, Divider, Spin, Empty } from "antd";
import api from "../../../api/axios.js";
import PropertyCard from "../../../Components/PropertyCard/PropertyCard.jsx";
import "./properties.css";

const emptyFilters = {
  search: "",
  type: undefined,
  purpose: undefined,
  city: "",
  minPrice: undefined,
  maxPrice: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  minArea: undefined,
  maxArea: undefined,
};

const filtersFromParams = (searchParams) => ({
  ...emptyFilters,
  search: searchParams.get("search") || "",
  type: searchParams.get("type") || undefined,
  purpose: searchParams.get("purpose") || undefined,
  city: searchParams.get("city") || "",
});

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [appliedSearch, setAppliedSearch] = useState(searchParams.toString());
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams));
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  if (searchParams.toString() !== appliedSearch) {
    setAppliedSearch(searchParams.toString());
    setFilters(filtersFromParams(searchParams));
  }

  const getProperties = async (filterValues = {}) => {
    try {
      setLoading(true);

      const response = await api.get("/properties/all", {
        params: filterValues,
      });

      setProperties(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProperties(filtersFromParams(searchParams));
  }, [searchParams]);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    getProperties(filters);
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    getProperties(emptyFilters);
  };

  return (
    <div className="properties-page">
      <aside className="filter-sidebar">
        <h2>Filter Properties</h2>
        <p className="filter-description">
          Find a property that matches your requirements.
        </p>

        <Divider />

        <div className="filter-group">
          <label>Search</label>
          <Input
            placeholder="Search by title"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Property Type</label>
          <Select
            allowClear
            placeholder="Select type"
            value={filters.type}
            onChange={(value) => handleChange("type", value)}
            options={[
              { value: "house", label: "House" },
              { value: "apartment", label: "Apartment" },
              { value: "plot", label: "Plot" },
              { value: "commercial", label: "Commercial" },
            ]}
          />
        </div>

        <div className="filter-group">
          <label>Purpose</label>
          <Select
            allowClear
            placeholder="Sale or Rent"
            value={filters.purpose}
            onChange={(value) => handleChange("purpose", value)}
            options={[
              { value: "sale", label: "Sale" },
              { value: "rent", label: "Rent" },
            ]}
          />
        </div>

        <div className="filter-group">
          <label>City</label>
          <Input
            placeholder="Enter city"
            value={filters.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Price Range</label>
          <div className="filter-range">
            <InputNumber
              min={0}
              placeholder="Min"
              value={filters.minPrice}
              onChange={(value) => handleChange("minPrice", value)}
            />
            <span>-</span>
            <InputNumber
              min={0}
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(value) => handleChange("maxPrice", value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Bedrooms</label>
          <Select
            allowClear
            placeholder="Bedrooms"
            value={filters.bedrooms}
            onChange={(value) => handleChange("bedrooms", value)}
            options={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: `${n}+` }))}
          />
        </div>

        <div className="filter-group">
          <label>Bathrooms</label>
          <Select
            allowClear
            placeholder="Bathrooms"
            value={filters.bathrooms}
            onChange={(value) => handleChange("bathrooms", value)}
            options={[1, 2, 3, 4].map((n) => ({ value: n, label: `${n}+` }))}
          />
        </div>

        <div className="filter-group">
          <label>Area (sq ft)</label>
          <div className="filter-range">
            <InputNumber
              min={0}
              placeholder="Min"
              value={filters.minArea}
              onChange={(value) => handleChange("minArea", value)}
            />
            <span>-</span>
            <InputNumber
              min={0}
              placeholder="Max"
              value={filters.maxArea}
              onChange={(value) => handleChange("maxArea", value)}
            />
          </div>
        </div>

        <Divider />

        <div className="filter-buttons">
          <Button type="primary" block onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button block onClick={handleReset}>
            Reset
          </Button>
        </div>
      </aside>

      <main className="property-section">
        <div className="property-header">
          <div>
            <h1>Properties</h1>
            <p>Find your perfect property</p>
          </div>
          <p>{properties.length} Properties</p>
        </div>

        {loading ? (
          <div className="property-state">
            <Spin size="large" />
          </div>
        ) : properties.length === 0 ? (
          <div className="property-state">
            <Empty description="No properties found" />
          </div>
        ) : (
          <div className="property-grid">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Properties;
