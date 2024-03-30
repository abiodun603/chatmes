import { ReactNode } from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import getCurrentUser from "@/app/actions/getCurrentUser";

async function Sidebar({ children } : { children: ReactNode}) {
  const currentUser = await getCurrentUser(); 
  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <div className="lg:pl-20 h-full">
        {children}
      </div>
    </div>
  )
}

export default Sidebar;