import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Layout } from "./Components/Layout/Layout";
import AppRoutes from "./Routes/AppRoutes";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import PasswordRecovery from "./Pages/PasswordRecovery/PasswordRecovery";
import { useEffect, useState } from "react";
import { BASE_URI } from "./Config/url";
import useFetch from "./hooks/useFetch";
import axios from "axios";
import { userCartActions } from "./Store/cartSlice";
import { useDispatch } from "react-redux";
import { payoutActions } from "./Store/payoutSlice";
import { socketConnect } from "./socket";

const App = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  // const [cartItemNumber, setCartItemNumber] = useState(0);

  localStorage.setItem("userType", "user");
  localStorage.setItem("token", "slkfjoiaejlakjsdf983uiwuh38iyfsuh3487ryisuy7iwy3");
  localStorage.setItem("user", JSON.stringify({ id: 1, name: "Jack" }));

  
  // const url = `${BASE_URI}/api/v1/cart`;
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType")
  // const { data } = useFetch(url, {
  //   headers: {
  //     Authorization: "Bearer " + token,
  //   },
  // });

  useEffect(() => {
    socketConnect(token)
  //   axios({
  //     method: "GET",
  //     url,
  //     headers: {
  //       Authorization: "Bearer " + token,
  //     },
  //   }).then(
  //     (res) => {
  //       dispatch(userCartActions.setCart(res.data.cart));
  //     },
  //     () => {}
  //   );

   if(userType === "admin"){
    axios
    .get(`${BASE_URI}/api/v1/admin/payoutRequest`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log(res)
      dispatch(payoutActions.setNotifications(res?.data?.data?.length));
    }).catch((err)=>{
      console.log(err.response.data.message)
      if(err.response.data.message){
        dispatch(payoutActions.setNotifications("0"));
      }
    })
   }
    // if (data) {
    //   setCartItemNumber(data?.cart?.length);
    // }
  }, [token,userType]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/passwordRecovery" element={<PasswordRecovery />} />
        <Route
          path="/*"
          element={
            <Layout
              search={search}
              setSearch={setSearch}
              // cartItemNumber={cartItemNumber}
            >
              <AppRoutes search={search} />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
