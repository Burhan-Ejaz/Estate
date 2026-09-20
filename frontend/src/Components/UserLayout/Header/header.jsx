import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Avatar } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { useAuth } from "../../../Context/AuthContext.jsx";
import "./header.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const menuItems = [
    { key: "profile", label: "View Profile", onClick: () => navigate("/profile") },
    { key: "messages", label: "Messages", onClick: () => navigate("/messages") },
    ...(user?.role === "admin"
      ? [{ key: "admin", label: "Admin Dashboard", onClick: () => navigate("/admin") }]
      : []),
    ...(user?.role === "agent"
      ? [{ key: "agent", label: "Agent Dashboard", onClick: () => navigate("/agent") }]
      : []),
    { type: "divider" },
    { key: "logout", label: "Logout", danger: true, onClick: handleLogout },
  ];

  return (
    <nav className="navbar">
      <h2 className="logo">Estate.</h2>

      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><Link to="/home" onClick={() => setIsOpen(false)}>Home</Link></li>
        <li><Link to="/properties" onClick={() => setIsOpen(false)}>Properties</Link></li>
        <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
        <li><Link to="/agents" onClick={() => setIsOpen(false)}>Agents</Link></li>

        {user ? (
          <>
            <li className="login-btn-mobile"><Link to="/profile" onClick={() => setIsOpen(false)}>View Profile</Link></li>
            <li className="login-btn-mobile"><Link to="/messages" onClick={() => setIsOpen(false)}>Messages</Link></li>
            {user.role === "admin" && (
              <li className="login-btn-mobile"><Link to="/admin" onClick={() => setIsOpen(false)}>Admin Dashboard</Link></li>
            )}
            {user.role === "agent" && (
              <li className="login-btn-mobile"><Link to="/agent" onClick={() => setIsOpen(false)}>Agent Dashboard</Link></li>
            )}
            <li className="login-btn-mobile">
              <a onClick={handleLogout}>Logout</a>
            </li>
          </>
        ) : (
          <li className="login-btn-mobile">
            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
          </li>
        )}
      </ul>

      {user ? (
        <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
          <a className="account-btn" onClick={(e) => e.preventDefault()}>
            <Avatar size={32} icon={<UserOutlined />} />
            <span className="account-name">{user.name}</span>
            <DownOutlined className="account-caret" />
          </a>
        </Dropdown>
      ) : (
        <Link to="/login" className="login-btn">Login</Link>
      )}

      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
}

export default Header;