import { ReactNode } from "react";
import DesktopSidebar from "./DesktopSidebar";

async function Sidebar({ children } : { children: ReactNode}) {
  return (
    <div className="h-full">
      <DesktopSidebar />
      <div className="lg:pl-20 h-full">
        {children}
      </div>
    </div>
  )
}

export default Sidebar;