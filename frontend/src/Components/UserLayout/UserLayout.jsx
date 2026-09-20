import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header/header'
import Footer from './Footer/footer'

const UserLayout = () => {
  return (
    <div>
        <Header />
        <Outlet />
        <Footer />

    </div>
  )
}
   

export default UserLayout