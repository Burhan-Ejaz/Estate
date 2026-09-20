import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Empty } from "antd";
import "./home.css";

import api from "../../../api/axios.js";
import PropertyCard from "../../../Components/PropertyCard/PropertyCard.jsx";

import heroImage from "../../../assets/hero-home.jpg";
import servicesImage from "../../../assets/services-home.jpg";

const stats = [
  { value: "500+", label: "Premium Listings" },
  { value: "98%", label: "Happy Clients" },
  { value: "15+", label: "Years Experience" },
  { value: "24/7", label: "Customer Support" },
];

function Home() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");

  useEffect(() => {
    const getLatestProperties = async () => {
      try {
        setLoading(true);
        const response = await api.get("/properties/all", {
          params: { limit: 4 },
        });
        setProperties(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getLatestProperties();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set("city", location.trim());
    if (propertyType) params.set("type", propertyType);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="home">

      {/* Hero */}

      <section className="hero">
        <div className="home-container hero-inner">

          <div className="hero-text">

            <span className="eyebrow">Trusted Real Estate Platform</span>

            <h1>
              Find Your <span>Dream Home</span>
            </h1>

            <p>
              Discover modern apartments, luxury villas and affordable homes
              across the country.
            </p>

            <div className="search-box">

              <input
                type="text"
                placeholder="Enter city or location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />

              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>

              <button className="btn-primary" onClick={handleSearch}>
                Search
              </button>

            </div>

          </div>

          <div className="hero-image">
            <img src={heroImage} alt="" />
          </div>

        </div>
      </section>

      {/* Stats */}

      <section className="why">
        <div className="home-container">
          <div className="why-grid">
            {stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}

      <section className="featured">
        <div className="home-container">

          <div className="featured-top">
            <div className="section-head">
              <span className="eyebrow">Latest Listings</span>
              <h2>Featured Properties</h2>
            </div>

            <button
              className="btn-outline"
              onClick={() => navigate("/properties")}
            >
              View All Properties
            </button>
          </div>

          {loading ? (
            <div className="featured-state">
              <Spin size="large" />
            </div>
          ) : properties.length === 0 ? (
            <div className="featured-state">
              <Empty description="No properties found" />
            </div>
          ) : (
            <div className="featured-grid">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Services */}

      <section className="services">
        <div className="home-container services-inner">

          <img src={servicesImage} alt="" />

          <div>

            <div className="section-head">
              <span className="eyebrow">Our Services</span>
              <h2>We Help You Buy Better</h2>
            </div>

            <p className="lead">
              Whether you're buying your first home or investing in real estate,
              we provide trusted guidance and premium listings to help you make
              the right decision.
            </p>

            <button
              className="btn-primary"
              onClick={() => navigate("/properties")}
            >
              Explore Properties
            </button>

          </div>

        </div>
      </section>

      {/* CTA */}

      <section className="cta-section">
        <div className="home-container">
          <div className="cta">

            <div>
              <h2>Ready to Find Your Perfect Home?</h2>
              <p>Browse verified listings and connect with trusted agents.</p>
            </div>

            <button
              className="btn-light"
              onClick={() => navigate("/properties")}
            >
              Get Started
            </button>

          </div>
        </div>
      </section>

    </div>
  );
}

export default Home
