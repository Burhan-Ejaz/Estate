import React from 'react'
import { Menu } from 'antd';
import {
  HomeOutlined,
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  FileSearchOutlined,
  BuildOutlined,
  LogoutOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';

const pathToKey = {
  '/admin': '1',
  '/admin/users': '2',
  '/admin/agents': '3',
  '/admin/agentapplications': '4',
  '/admin/properties': '5',
};

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const selectedKey = pathToKey[location.pathname] || '1';

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const items = [
    {
      key: 'manage',
      type: 'group',
      label: 'Manage',
      children: [
        {
          key: '1',
          icon: <DashboardOutlined />,
          label: 'Dashboard',
          onClick: () => navigate("/admin")
        },
        {
          key: '2',
          icon: <UserOutlined />,
          label: 'Users',
          onClick: () => navigate("/admin/users")
        },
        {
          key: '3',
          icon: <TeamOutlined />,
          label: 'Agents',
          onClick: () => navigate("/admin/agents")
        },
        {
          key: '4',
          icon: <FileSearchOutlined />,
          label: 'Applications',
          onClick: () => navigate("/admin/agentapplications")
        },
        {
          key: '5',
          icon: <BuildOutlined />,
          label: 'Properties',
          onClick: () => navigate("/admin/properties")
        },
      ],
    },
    { key: 'divider', type: 'divider' },
    {
      key: '6',
      icon: <HomeOutlined />,
      label: 'Back to User Side',
      onClick: () => navigate("/home")
    },
    {
      key: '7',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: () => handleLogout()
    },
  ];

  return (
    <>
      <div className="admin-brand">
        <span className="admin-brand-mark"><ApartmentOutlined /></span>
        <div className="admin-brand-text">
          <strong>Property Portal</strong>
          <span>Admin</span>
        </div>
      </div>
      <Menu
        className="admin-nav"
        selectedKeys={[selectedKey]}
        mode='inline'
        theme="dark"
        items={items}
      />
    </>
  )
}

export default SideBar
