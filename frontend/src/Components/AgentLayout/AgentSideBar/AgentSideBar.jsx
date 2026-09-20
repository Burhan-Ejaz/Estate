import React from 'react'
import { Menu } from 'antd';
import { HomeOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext.jsx';

const pathToKey = {
  '/agent': '1',
  '/agent/properties': '2',
};

const AgentSideBar = () => {
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
            key: '1',
            label: 'Dashboard',
            onClick: () => navigate("/agent")

        },
        {
            key: '2',
            label: 'Agent Properties',
            onClick: () => navigate("/agent/properties")

        },
        {
            key: '3',
            icon: <MessageOutlined />,
            label: 'Messages',
            onClick: () => navigate("/messages")

        },
      {
            key: '4',
            icon: <HomeOutlined />,
            label: 'Back to User Side',
            onClick: () => navigate("/home")

        },
      {
            key: '5',
            label: 'Logout',
            onClick: () => handleLogout()

        },
    ];


  return (
     <Menu
    style={{height:"100%"}}
    selectedKeys={[selectedKey]}
    mode='inline'
    theme="dark"
    items={items}
    />
  )
}

export default AgentSideBar