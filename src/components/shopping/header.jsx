/* eslint-disable no-unused-vars */
import {
  House,
  LogOut,
  Menu,
  SearchIcon,
  ShoppingCart,
  UserCog,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { shoppingViewHeaderMenuItems } from "@/config";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, resetTokenAndCredentials } from "@/store/auth-slice";
import { toast } from "@/hooks/use-toast";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useMemo, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  function handleNavigation(menuItem) {
    sessionStorage.removeItem("filters");
    const newFilters =
      menuItem.id !== "home" && menuItem.id !== "products"
        ? {
            category: [menuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(newFilters));

    location.pathname.includes("listings") && newFilters !== null
      ? setSearchParams(new URLSearchParams(`?category=${menuItem.id}`))
      : navigate(menuItem.path);
  }

  return (
    <nav className="flex flex-col lg:flex-row gap-4 font-semibold">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          className="cursor-pointer"
          onClick={() => handleNavigation(menuItem)}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const navigate = useNavigate();

  const [openCartSidebar, setOpenCartSidebar] = useState(false);

  function handleLogout() {
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

  const totalCartItemQuantity = useMemo(
    () =>
      cartItems &&
      cartItems.items &&
      cartItems.items.length > 0 &&
      cartItems.items.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate("/shopping/search")}
      >
        <SearchIcon className="h-6 w-6" />
        <span className="sr-only">Search for products</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setOpenCartSidebar(true)}
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute -top-2 -right-1 px-1 rounded-full bg-yellow-500 text-primary-foreground text-xs">
          {totalCartItemQuantity}
        </span>
        <span className="sr-only">User cart</span>
      </Button>
      <Sheet
        open={openCartSidebar}
        onOpenChange={() => setOpenCartSidebar(false)}
      >
        <UserCartWrapper
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
          setOpenCartSidebar={setOpenCartSidebar}
        />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.username?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shopping/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const ShoppingHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shopping" className="flex items-center gap-2">
          <House className="h-6 w-6" />
          <span className="font-bold">Ecommerce</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
