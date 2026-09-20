import React from "react";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "./contact.css";
import aboutImage from "../../../assets/about-contact.jpg";

const contactInfo = [
  { icon: <EnvironmentOutlined />, label: "Address", value: "123 Main Street, New York, USA" },
  { icon: <PhoneOutlined />, label: "Phone", value: "+1 234 567 890" },
  { icon: <MailOutlined />, label: "Email", value: "info@estate.com" },
  { icon: <ClockCircleOutlined />, label: "Office Hours", value: "Mon - Sat | 9:00 AM - 6:00 PM" },
];

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">

        {/* About Section */}

        <section className="about-section">

          <div className="about-text">
            <span className="contact-eyebrow">About Us</span>

            <h2>Helping You Find the Perfect Place to Call Home.</h2>

            <p>
              We connect buyers with quality properties through trusted guidance,
              transparent service, and years of real estate expertise. Whether
              you're purchasing your first home or investing, we're here to make
              the process simple and stress-free.
            </p>
          </div>

          <div className="about-image">
            <img src={aboutImage} alt="House" />
          </div>

        </section>

        {/* Contact Section */}

        <section className="contact-section">

          <div className="contact-form">

            <span className="contact-eyebrow">Contact Us</span>
            <h2>Send Us a Message</h2>

            <div className="form-row">
              <input type="text" placeholder="Full Name" />
              <input type="email" placeholder="Email Address" />
            </div>

            <input type="text" placeholder="Phone Number" />

            <textarea
              rows="4"
              placeholder="Write your message..."
            ></textarea>

            <button>Send Message</button>

          </div>

          <div className="contact-info">

            <span className="contact-eyebrow">Get In Touch</span>
            <h2>Contact Details</h2>

            {contactInfo.map((item) => (
              <div className="info-box" key={item.label}>
                <span className="info-icon">{item.icon}</span>
                <div>
                  <h4>{item.label}</h4>
                  <p>{item.value}</p>
                </div>
              </div>
            ))}

          </div>

        </section>

      </div>
    </div>
  );
};

export default Contact;
