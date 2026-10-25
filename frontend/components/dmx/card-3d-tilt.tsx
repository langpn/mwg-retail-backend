'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

interface Card3DTiltProps {
  children: React.ReactNode
  className?: string
}

export function Card3DTilt({ children, className = '' }: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values tracking mouse coordinate
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for butter-smooth damping (60-120fps)
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig)
  const scale = useSpring(isHovered ? 1.02 : 1, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
      }}
      className={`relative h-full transition-shadow duration-200 ${className} ${
        isHovered ? 'shadow-xl' : 'shadow-sm'
      }`}
    >
      <div style={{ transform: 'translateZ(15px)' }} className="h-full">
        {children}
      </div>
    </motion.div>
  )
}
