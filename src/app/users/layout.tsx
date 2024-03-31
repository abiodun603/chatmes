import { ReactNode } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import getUsers from "../actions/getUsers";
import UserList from "./components/UserList";

export default async function UserLayout({
  children
}: {children: ReactNode}) {
  const users = await getUsers();
  console.log(users)

  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users} />
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