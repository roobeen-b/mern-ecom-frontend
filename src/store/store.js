import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductReducer from "./admin/products-slice";
import adminOrderReducer from "./admin/order-slice";
import shopProductReducer from "./shop/products-slice";
import shopCartReducer from "./shop/cart-slice";
import shopAddressReducer from "./shop/address-slice";
import shopOrderReducer from "./shop/order-slice";
import searchProductsReducer from "./shop/search-slice";
import productReviewReducer from "./shop/review-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductReducer,
    adminOrders: adminOrderReducer,
    shopProducts: shopProductReducer,
    shopCart: shopCartReducer,
    shopAddress: shopAddressReducer,
    shopOrder: shopOrderReducer,
    searchProducts: searchProductsReducer,
    productReviews: productReviewReducer,
  },
});

export default store;
