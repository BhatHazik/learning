import { Routes, Route, useLocation } from "react-router-dom";
import Courses from "../Pages/Courses/Courses";
import CourseCreation from "../Pages/CourseCreation/CourseCreation";
import CourseView from "../Pages/Course overview/CourseView";
import AddLesson from "../Pages/AddLesson/AddLesson";
import ExpertWallet from "../Pages/ExpertWallet/ExpertWallet";
import ExpertAnalytics from "../Pages/ExpertAnalytics/ExpertAnalytics";
import { useEffect, useState } from "react";
import Logout from "../Pages/Logout/Logout";
import Settings from "../Pages/Settings/Settings";
import NotFound from "../Pages/NotFound/NotFound";
import Messages from "../Pages/UserModule/Messages/Messages";
import CourseEdit from "../Pages/CourseEdit/CourseEdit";
// import AddExpert from "../Pages/AddExpert/AddExpert";
import Bookings from "../Pages/Bookings/Bookings";

const ExpertRoutes = ({ search }) => {
  const [editCourse, setEditCourse] = useState(false);
  const [courseId, setCourseId] = useState("");
  const location = useLocation();

  useEffect(() => {
    if(editCourse && location.pathname === "/courseCreation"){
      setEditCourse(false);
      setCourseId("");
    }
    else if(location.pathname === "/courseCreation" && courseId){
      setEditCourse(true);
      setCourseId(courseId);
    }
  }, [editCourse, courseId, location.pathname]);

  return (
    <Routes>
      <Route
        path="/courses"
        element={<Courses search={search} setEditCourse={setEditCourse} />}
      />
      <Route
        path="/courses/courseView/:id"
        element={
          <CourseView setEditCourse={setEditCourse} setCourseId={setCourseId} />
        }
      />
      <Route
        path="/courseEdit/:courseId"
        element={
          <CourseEdit editCourse={editCourse}/>
        }
      />
      <Route
        path="/courseCreation"
        element={
          <CourseCreation editCourse={editCourse} courseeId={courseId} />
        }
      />
      <Route
        path="/courses/addLesson/:id"
        element={
          <AddLesson setEditCourse={setEditCourse} setCourseId={setCourseId} />
        }
      />
      <Route path="/messages" element={<Messages />} />
      <Route path="/expertWallet" element={<ExpertWallet />} />
      {/* <Route path="/AddExperts" element={<AddExpert />} /> */}
      <Route path="/dashboard" element={<ExpertAnalytics />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ExpertRoutes;
