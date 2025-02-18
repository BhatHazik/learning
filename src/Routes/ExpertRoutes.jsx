import { Routes, Route } from "react-router-dom";
import Courses from "../Pages/Courses/Courses";
import CourseCreation from "../Pages/CourseCreation/CourseCreation";
import CourseView from "../Pages/Course overview/CourseView";
import AddLesson from "../Pages/AddLesson/AddLesson";
import ExpertWallet from "../Pages/ExpertWallet/ExpertWallet";
import ExpertAnalytics from "../Pages/ExpertAnalytics/ExpertAnalytics";
import { useState } from "react";
import Logout from "../Pages/Logout/Logout";
import Settings from "../Pages/Settings/Settings";
import NotFound from "../Pages/NotFound/NotFound";
import Messages from "../Pages/UserModule/Messages/Messages";
// import AddExpert from "../Pages/AddExpert/AddExpert";

const ExpertRoutes = ({ search }) => {
  const [editCourse, setEditCourse] = useState(false);
  const [courseId, setCourseId] = useState("");

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
        path="/courses/courseCreation"
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
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ExpertRoutes;
