import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import Home from './pages/UserSide/Home/home.jsx'
import Contact from './pages/UserSide/Contact/contact.jsx'
import Properties from './pages/UserSide/Properties/properties.jsx'
import PropertyDetail from './pages/UserSide/PropertyDetail/PropertyDetail.jsx'
import Agents from './pages/UserSide/Agents/agent.jsx'
import AgentDetail from './pages/UserSide/AgentDetail/AgentDetail.jsx'
import Profile from './pages/UserSide/Profile/Profile.jsx'
import Messages from './pages/UserSide/Messages/Messages.jsx'
import UserLayout from './Components/UserLayout/UserLayout.jsx'
import ScrollToTop from './Components/ScrollToTop/ScrollToTop.jsx'

import SignUp from './pages/Auth/SignUp/SignUp.jsx'
import Login from './pages/Auth/Login/Login.jsx'

import AdminLayout from "./Components/AdminLayout/AdminLayout.jsx";
import AdminAgent from "./pages/AdminSide/Agents/AdminAgent.jsx";
import AdminUser from "./pages/AdminSide/Users/AdminUser.jsx";
import AdminProperties from "./pages/AdminSide/Properties/AdminProperties.jsx";
import AdminDashboard from "./pages/AdminSide/Dashboard/AdminDashboard.jsx";
import AdminAgentApplication from "./pages/AdminSide/AgentApplications/AdminAgentApplication.jsx";

import AgentLayout from './Components/AgentLayout/AgentLayout.jsx'
import AgentDashboard from './pages/AgentSide/AgentDashboard/AgentDashboard.jsx'
import AgentProperties from './pages/AgentSide/AgentProperties/AgentProperties.jsx'

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      
     
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      
      <Route element={<UserLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/:id" element={<AgentDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
     
     
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="agentapplications" element={<AdminAgentApplication />} />
        <Route path="agents" element={<AdminAgent />} />
        <Route path="users" element={<AdminUser />} />
        <Route path="properties" element={<AdminProperties />} />
      </Route>

       <Route path="/agent" element={<AgentLayout />}>
        <Route index element={<AgentDashboard />} />
        <Route path="properties" element={<AgentProperties />} />
      </Route>


      
      <Route path="*" element={<Navigate to="/home" replace />} />
      
    </Routes>
    </>

  )
}

export default App