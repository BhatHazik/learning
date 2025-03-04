import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: null,
};

const userCartSlice = createSlice({
  name: "USER_CART",
  initialState,
  reducers: {
    setCart: (state, actions) => {
      state.cart = actions.payload;
    },
  },
});

export const userCartActions = userCartSlice.actions;
export default userCartSlice;
