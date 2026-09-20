import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar/SideBar'
import "./AdminLayout.css"

const AdminLayout = () => {
  return (
    <div className = "main-div">
        <div className = "left-side"><SideBar /></div>
        <div className="right-side"><Outlet /></div>

    </div>


  )
}

export default AdminLayout