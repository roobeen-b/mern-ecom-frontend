import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductReducer from "./admin/products-slice";
import shopProductReducer from "./shop/products-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductReducer,
    shopProducts: shopProductReducer,
  },
});

export default store;
