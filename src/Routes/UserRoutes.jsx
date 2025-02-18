import { Routes, Route } from "react-router-dom";
// import UserCourseOverview from "../Pages/UserCourseOverview/UserCourseOverview";
// import UserCart from "../Pages/UserCart/UserCart";
import Messages from "../Pages/UserModule/Messages/Messages";
import Settings from "../Pages/Settings/Settings";
import MyLearning from "../Pages/MyLearning/MyLearning";
// import UserWallet from "../Pages/userWallet/UserWallet";
import UserPurchasedCourse from "../Pages/UserPurchasedCourse/UserPurchasedCourse";
import Checkout from "../Pages/Checkout/Checkout";
import Logout from "../Pages/Logout/Logout";
import NotFound from "../Pages/NotFound/NotFound";
import UserWallet from "../Pages/userWallet/UserWallet";
import Categories from "../Pages/CategoriesPH/Categories";
// import UserCourses from "../Pages/UserCourses/UserCourses";

const UserRoutes = () => {
  return (
    <Routes>
      
      <Route path="/checkout" element={<Checkout />} />
      {/* <Route path="/userCart" element={<UserCart />} /> */}
      <Route path="/userWallet" element={<UserWallet/>} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/settings" element={<Settings />} />
      {/* <Route path="/userWallet" element={<UserWallet/>} /> */}
      <Route path="/myLearning" element={<MyLearning />} />
      <Route path="/categories" element={<Categories />} />
      <Route
        path="/userPurchasedCourses/:id"
        element={<UserPurchasedCourse />}
      />
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;
