'use client'

import useRoutes from "@/app/hooks/useRoutes"
import { useState } from "react"

const DesktopSidebar = () => {
  const routes = useRoutes()
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>DesktopSidebar</div>
  )
}

export default DesktopSidebar