import { configureStore } from "@reduxjs/toolkit";
import userCartSlice from "./cartSlice";
import payoutSlice from "./payoutSlice";

const store = configureStore({
  reducer: { cart: userCartSlice.reducer, payouts: payoutSlice.reducer },
});

export default store;
