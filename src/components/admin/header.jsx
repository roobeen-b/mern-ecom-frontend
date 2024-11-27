/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { LogOut, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser, resetTokenAndCredentials } from "@/store/auth-slice";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleUserLogout() {
    // dispatch(logoutUser()).then((res) => {
    //   if (res?.payload?.success) {
    //     toast({
    //       title: res.payload.message,
    //     });
    //   }
    // });

    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
  }

  return (
    <header className="flex justify-between items-center py-4 px-4 bg-background border-b">
      <div>
        <Button className="lg:hidden" onClick={() => setOpen(true)}>
          <Menu />
        </Button>
      </div>
      <div>
        <Button
          className="flex flex-1 shadow rounded-sm"
          onClick={handleUserLogout}
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
