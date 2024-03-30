import { ReactNode } from "react";
import Sidebar from "../components/sidebar/Sidebar";

export default async function UserLayout({
  children
}: {children: ReactNode}) {
  return (
    <Sidebar>
      <div className="h-full">
        {children}
      </div>
    </Sidebar>
  )
}

/**
 * 
 * we are making this component an
 * async function because it will 
 * be used tp fetch user from the 
 * database.
 */