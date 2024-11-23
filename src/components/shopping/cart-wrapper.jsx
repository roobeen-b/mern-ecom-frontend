/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import CartItemContent from "./cart-item-content";

const UserCartWrapper = ({ cartItems, setOpenCartSidebar }) => {
  const navigate = useNavigate();

  const totalCartAmount = cartItems?.reduce((acc, currentItem) => {
    return (
      acc +
      (currentItem.salePrice > 0 ? currentItem.salePrice : currentItem.price) *
        currentItem.quantity
    );
  }, 0);

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((cartItem) => (
            <div key={cartItem.productId}>
              <CartItemContent cartItem={cartItem} />
            </div>
          ))
        ) : (
          <span>No Items added</span>
        )}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>
      </div>
      <Button
        className="w-full mt-6"
        onClick={() => {
          setOpenCartSidebar(false);
          navigate("/shopping/checkout");
        }}
      >
        Checkout
      </Button>
    </SheetContent>
  );
};

export default UserCartWrapper;
