import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductReducer from "./admin/products-slice";
import shopProductReducer from "./shop/products-slice";
import shopCartReducer from "./shop/cart-slice";
import shopAddressReducer from "./shop/address-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductReducer,
    shopProducts: shopProductReducer,
    shopCart: shopCartReducer,
    shopAddress: shopAddressReducer,
  },
});

export default store;
