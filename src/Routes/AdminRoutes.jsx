import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../Pages/AdminModule/AdminDashboard";
import Logout from "../Pages/Logout/Logout";
import Experts from "../Pages/Experts/Experts";
import Students from "../Pages/Students/Students";
import Transactions from "../Pages/Transactions/Transactions";
import Settings from "../Pages/Settings/Settings"; 
import AdminReview from "../Pages/AdminReview/AdminReview";
import CourseView from "../Pages/Course overview/CourseView";
import Support from "../Pages/Support/Support";



export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/adminDashboard" element={<AdminDashboard />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/experts" element={<Experts />} />
      <Route path="/students" element={<Students />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/adminPayouts" element={<Transactions />} />
      <Route path="/adminReview" element={<AdminReview/>} />
      <Route path="/courses/courseView/:id" element={ <CourseView/>}/>
      <Route path="/support" element={<Support/>} />
    </Routes>
  );
}
