import React, { ReactNode } from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

/**
 * Layout - Main layout wrapper for the Erotic brand
 * 
 * Provides consistent structure with navigation and footer
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="erotic-layout">
      <Navbar />
      <main className="erotic-main">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
