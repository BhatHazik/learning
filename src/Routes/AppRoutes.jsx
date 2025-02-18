import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "../Pages/Login/Login";
import { SignUp } from "../Pages/SignUppage/SignUp";
import { VerifyEmail } from "../Pages/veryEmail/VerifyEmail";
import ExpertRoutes from "./ExpertRoutes";
import UserRoutes from "./UserRoutes";
import UserCourses from "../Pages/UserCourses/UserCourses";
import UserCourseOverview from "../Pages/UserCourseOverview/UserCourseOverview";
import UserWallet from "../Pages/userWallet/UserWallet";
import AdminRoutes from "./AdminRoutes";
import UserProfile from "../Pages/UserProfile/UserProfile"
import Support from "../Pages/Support/Support";
import AddExpert from "../Pages/AddExpert/AddExpert";
import { SignUpExpert } from "../Pages/SignUpExpert/SignUpExpert";

const AppRoutes = ({ search }) => {
  const userRole = localStorage.getItem("userType");
  const [role, setRole] = useState(userRole);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const userRole = localStorage.getItem("userType");
  // console.log("Setting role:", userRole); // Log the role before setting
  setRole(userRole);
  // setLoading(false);
  // window.location.reload();
  }, [navigate]);

  // if (loading) {
  //   return <div style={{color:"black"}}>Loading...</div>; // Don't render routes until role is set
  // }
  

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/ExpertSignUp" element={<SignUpExpert/>} />
      <Route path="/verifyEmail" element={<VerifyEmail />} />
      <Route path="/userCourses" element={<UserCourses search={search} />} />
      <Route path="/userWallet" element={<UserWallet/>} />

      <Route path="/support" element={<Support/>} />
     
      <Route path="/AddExperts" element={<AddExpert />} />
      <Route
        path="/userCourses/userCourseView/:id"
        element={<UserCourseOverview />}
      />
       <Route path="/UserProfile/:id" element={<UserProfile/>}/>

      {role === "expert" && (
        <Route path="/*" element={<ExpertRoutes search={search} />} />
      )}
      {role === "user" && <Route path="/*" element={<UserRoutes />} />}
      {role === "admin" && <Route path="/*" element={<AdminRoutes />} />}
    </Routes>
  );
};

export default AppRoutes;
