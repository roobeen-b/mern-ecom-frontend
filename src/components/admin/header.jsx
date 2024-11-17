/* eslint-disable react/prop-types */
import { LogOut, Menu } from "lucide-react";
import { Button } from "../ui/button";

const AdminHeader = ({ setOpen }) => {
  return (
    <header className="flex justify-between items-center py-4 px-4 bg-background border-b">
      <div>
        <Button className="lg:hidden" onClick={() => setOpen(true)}>
          <Menu />
        </Button>
      </div>
      <div>
        <Button className="flex flex-1 shadow rounded-sm">
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
