import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './Cursor.css'

const Cursor = ({ variant }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isVisible])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
    },
    hover: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      scale: 2.5,
      backgroundColor: 'rgba(196, 120, 90, 0.1)',
      border: '1px solid rgba(196, 120, 90, 0.5)',
    },
    text: {
      x: mousePosition.x - 60,
      y: mousePosition.y - 60,
      scale: 3.5,
      backgroundColor: 'rgba(201, 169, 98, 0.1)',
      mixBlendMode: 'difference',
    }
  }

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      <motion.div
        className={`cursor ${isVisible ? 'visible' : ''}`}
        animate={variants[variant] || variants.default}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      <motion.div
        className={`cursor-dot ${isVisible ? 'visible' : ''}`}
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{ type: 'spring', stiffness: 1500, damping: 50 }}
      />
    </>
  )
}

export default Cursor

