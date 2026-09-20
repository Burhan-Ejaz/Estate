import React from 'react'
import AgentSideBar from './AgentSideBar/AgentSideBar.jsx'
import { Outlet } from 'react-router-dom'
import './AgentLayout.css'

const AgentLayout = () => {
  return (
    <div className='agent-maindiv'>
        <div className='agent-leftside'><AgentSideBar /></div>
        <div className='agent-rightside'><Outlet /></div>
    </div>
  )
}

export default AgentLayout