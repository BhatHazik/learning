import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: null,
};

const payoutSlice = createSlice({
  name: "PAYOUTS",
  initialState,
  reducers: {
    setNotifications: (state, actions) => {
      // console.log("hi");
      state.notifications = actions.payload;
      // console.log(state.notifications);
    },
  },
});

export const payoutActions = payoutSlice.actions;
export default payoutSlice;
