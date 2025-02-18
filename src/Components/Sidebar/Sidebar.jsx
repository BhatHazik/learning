import { Link, useLocation } from "react-router-dom";
import { LiaBarsSolid } from "react-icons/lia";
import {
  RiHomeFill,
  RiBookFill,
  RiMessage2Fill,
  RiLifebuoyFill,
  RiLogoutBoxRFill,
  RiHistoryFill,
  RiGraduationCapFill,
  RiWallet2Fill,
  RiSettings4Fill,
  RiHome4Fill,
  RiGridFill,
  RiMessageLine,
} from "react-icons/ri";
import { motion, useAnimation } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";
import { MdAssignmentInd, MdDashboard } from "react-icons/md";
import { FaFileInvoice, FaUserAlt, FaUsers, FaUserTie ,FaBookReader} from "react-icons/fa";

// Animation variants
const sidebarAnimation = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const linkAnimation = {
  normal: { scale: 1, rotate: 0 },
  clicked: {
    scale: 1.1,
    rotate: [0, -5, 5, 0],
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const containerVariants = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const Sidebar = ({ collapsed, handleToggle }) => {
  const role = localStorage.getItem("userType");
  const token = localStorage.getItem("token");
  const location = useLocation();
  const controls = useAnimation();

  // Check if the current route is any of the course-related routes
  const isCourseRoute = location.pathname.startsWith("/courses");
  const isUserCourseRoute = location.pathname.startsWith("/userCourses");

  return (
    <div
      className={`sidebar d-flex flex-column justify-content-between py-2 ps-4 ${
        collapsed ? "collapsed" : ""
      }`}
    >
      <div className="d-flex align-items-center justify-content-between mb-4">
        <LiaBarsSolid
          onClick={handleToggle}
          className="fs-1 primary-color cursor-pointer"
        />
        {!collapsed && (
          <h3 style={{fontSize:"1.5rem", fontWeight:"bold"}}  className="text w-100 offset-1 gradient-text fw-bold">
            MY JIU JITSU
          </h3>
        )}
      </div>
      {!collapsed && <div className="mb-4 fs-small text">Menu</div>}
      <motion.div
        className="menu flex-grow-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {!token && (
          <>
            <motion.div variants={sidebarAnimation}>
              <Link
                to="/userCourses"
                className={`menu-item d-flex align-items-center p-3 ${
                  isUserCourseRoute
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    isUserCourseRoute ? "text-white" : "primary-color"
                  }`}
                >
                  <RiHome4Fill className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Home</span>}
              </Link>
            </motion.div>
            <motion.div variants={sidebarAnimation}>
              <Link
                to="/"
                className={`menu-item d-flex align-items-center p-3 ${
                  location.pathname === "/"
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    location.pathname === "/" ? "text-white" : "primary-color"
                  }`}
                >
                  <MdAssignmentInd className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Login/Signup</span>}
              </Link>
            </motion.div>
            {/* <motion.div variants={sidebarAnimation}>
              <Link
                to="/support"
                className={`menu-item d-flex align-items-center p-3 ${
                  location.pathname === "/support"
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    location.pathname === "/support"
                      ? "text-white"
                      : "primary-color"
                  }`}
                >
                  <RiLifebuoyFill className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Support</span>}
              </Link>
            </motion.div> */}
          </>
        )}
       

        {token && role === "expert" && (
          <>
            <motion.div variants={sidebarAnimation}>
              <Link
                to="/courses"
                className={`menu-item d-flex align-items-center p-3 ${
                  isCourseRoute
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    isCourseRoute ? "text-white" : "primary-color"
                  }`}
                >
                  <RiHome4Fill className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Courses</span>}
              </Link>
            </motion.div>
            <motion.div variants={sidebarAnimation}>
              <Link
                to="/dashboard"
                className={`menu-item d-flex align-items-center p-3 ${
                  location.pathname === "/dashboard"
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    location.pathname === "/dashboard"
                      ? "text-white"
                      : "primary-color"
                  }`}
                >
                  <MdDashboard className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Dashboard</span>}
              </Link>
            </motion.div>
            <motion.div variants={sidebarAnimation}>
              <Link
                to="/messages"
                className={`menu-item d-flex align-items-center p-3 ${
                  location.pathname === "/messages"
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    location.pathname === "/messages"
                      ? "text-white"
                      : "primary-color"
                  }`}
                >
                  <RiMessage2Fill className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Messages</span>}
              </Link>
            </motion.div>
            <motion.div variants={sidebarAnimation}>
              <Link
                to="/expertWallet"
                className={`menu-item d-flex align-items-center p-3 ${
                  location.pathname === "/expertWallet"
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    location.pathname === "/expertWallet"
                      ? "text-white"
                      : "primary-color"
                  }`}
                >
                  <RiWallet2Fill className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Wallet</span>}
              </Link>
            </motion.div>
            <motion.div variants={sidebarAnimation}>
              <Link
                to="/support"
                className={`menu-item d-flex align-items-center p-3 ${
                  location.pathname === "/support"
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    location.pathname === "/support"
                      ? "text-white"
                      : "primary-color"
                  }`}
                >
                  <RiLifebuoyFill className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Support</span>}
              </Link>
            </motion.div>
          </>
        )}

        {token && role === "admin" && (
          <>
            <motion.div variants={sidebarAnimation}>
              <Link
                to="/adminDashboard"
                className={`menu-item d-flex align-items-center p-3 ${
                  isUserCourseRoute
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    isUserCourseRoute ? "text-white" : "primary-color"
                  }`}
                >
                  <RiGridFill className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Dashboard</span>}
              </Link>
            </motion.div>
            <motion.div variants={sidebarAnimation}>
              <Link
                to="/experts"
                className={`menu-item d-flex align-items-center p-3 ${
                  location.pathname === "/myLearning"
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    location.pathname === "/myLearning"
                      ? "text-white"
                      : "primary-color"
                  }`}
                >
                  <FaUserTie className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Experts</span>}
              </Link>
            </motion.div>
            <motion.div variants={sidebarAnimation}>
              <Link
                to="/students"
                className={`menu-item d-flex align-items-center p-3 ${
                  location.pathname === "/myCertificates"
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    location.pathname === "/myCertificates"
                      ? "text-white"
                      : "primary-color"
                  }`}
                >
                  <FaUsers className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Students</span>}
              </Link>
            </motion.div>
            <motion.div variants={sidebarAnimation}>
              <Link
                to="/transactions"
                className={`menu-item d-flex align-items-center p-3 ${
                  location.pathname === "/purchaseHistory"
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    location.pathname === "/purchaseHistory"
                      ? "text-white"
                      : "primary-color"
                  }`}
                >
                  <FaFileInvoice className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Transactions</span>}
              </Link>
            </motion.div>
            {/*  */}

            <motion.div variants={sidebarAnimation}>
              <Link
                to="/adminReview"
                className={`menu-item d-flex align-items-center p-3 ${
                  location.pathname === "/purchaseHistory"
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    location.pathname === "/purchaseHistory"
                      ? "text-white"
                      : "primary-color"
                  }`}
                >
                  <FaBookReader className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Review Courses</span>}
              </Link>
            </motion.div>
            <motion.div variants={sidebarAnimation}>
              <Link
                to="/support"
                className={`menu-item d-flex align-items-center p-3 ${
                  location.pathname === "/support"
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    location.pathname === "/support"
                      ? "text-white"
                      : "primary-color"
                  }`}
                >
                  <RiLifebuoyFill className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Support</span>}
              </Link>
            </motion.div>
           
          </>
        )}
      

      {token && role === "user" && (
        <>
          <motion.div variants={sidebarAnimation}>
            <Link
              to="/userCourses"
              className={`menu-item d-flex align-items-center p-3 ${
                isUserCourseRoute
                  ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                  : ""
              }`}
            >
              <motion.div
                animate={controls}
                variants={linkAnimation}
                className={`me-4 ${
                  isUserCourseRoute ? "text-white" : "primary-color"
                }`}
              >
                <RiHome4Fill className="fs-5" />
              </motion.div>
              {!collapsed && <span className="text">Home</span>}
            </Link>
          </motion.div>
          <motion.div variants={sidebarAnimation}>
            <Link
              to="/myLearning"
              className={`menu-item d-flex align-items-center p-3 ${
                location.pathname === "/myLearning"
                  ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                  : ""
              }`}
            >
              <motion.div
                animate={controls}
                variants={linkAnimation}
                className={`me-4 ${
                  location.pathname === "/myLearning"
                    ? "text-white"
                    : "primary-color"
                }`}
              >
                <RiBookFill className="fs-5" />
              </motion.div>
              {!collapsed && <span className="text">Purchased Courses</span>}
            </Link>
          </motion.div>

          <motion.div variants={sidebarAnimation}>
            <Link
              to="/messages"
              className={`menu-item d-flex align-items-center p-3 ${
                location.pathname === "/messages"
                  ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                  : ""
              }`}
            >
              <motion.div
                animate={controls}
                variants={linkAnimation}
                className={`me-4 ${
                  location.pathname === "/messages"
                    ? "text-white"
                    : "primary-color"
                }`}
              >
                <RiMessage2Fill className="fs-5" />
              </motion.div>
              {!collapsed && <span className="text">Messages</span>}
            </Link>
          </motion.div>
          
          <motion.div variants={sidebarAnimation}>
            <Link
              to="/userWallet"
              className={`menu-item d-flex align-items-center p-3 ${
                location.pathname === "/userWallet"
                  ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                  : ""
              }`}
            >
              <motion.div
                animate={controls}
                variants={linkAnimation}
                className={`me-4 ${
                  location.pathname === "/userWallet"
                    ? "text-white"
                    : "primary-color"
                }`}
              >
                <RiWallet2Fill className="fs-5" />
              </motion.div>
              {!collapsed && <span className="text">Wallet</span>}
            </Link>
          </motion.div>
          <motion.div variants={sidebarAnimation}>
              <Link
                to="/support"
                className={`menu-item d-flex align-items-center p-3 ${
                  location.pathname === "/support"
                    ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                    : ""
                }`}
              >
                <motion.div
                  animate={controls}
                  variants={linkAnimation}
                  className={`me-4 ${
                    location.pathname === "/support"
                      ? "text-white"
                      : "primary-color"
                  }`}
                >
                  <RiLifebuoyFill className="fs-5" />
                </motion.div>
                {!collapsed && <span className="text">Support</span>}
              </Link>
            </motion.div>
        </>
      )}
</motion.div>
      {token && (
        <>
          <motion.div variants={sidebarAnimation}>
            <Link
              to="/settings"
              className={`menu-item d-flex align-items-center p-3 ${
                location.pathname === "/settings"
                  ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                  : ""
              }`}
            >
              <motion.div
                animate={controls}
                variants={linkAnimation}
                className={`me-4 ${
                  location.pathname === "/settings"
                    ? "text-white"
                    : "primary-color"
                }`}
              >
                <RiSettings4Fill className="fs-5" />
              </motion.div>
              {!collapsed && <span className="text">Settings</span>}
            </Link>
          </motion.div>
          <Link
            to="/logout"
            className={`menu-item d-flex align-items-center p-3 ${
              location.pathname === "/logout"
                ? "bg-gradient-custom rounded-start-3 shadow-bottom-lg"
                : ""
            }`}
          >
            {/* <motion.div
              className="menu-item d-flex align-items-center p-3"
              variants={sidebarAnimation}
            > */}
            <motion.div
              animate={controls}
              variants={linkAnimation}
              className={`me-4 ${
                location.pathname === "/logout" ? "text-white" : "primary-color"
              }`}
            >
              <RiLogoutBoxRFill className="fs-5" />
              {/* </motion.div> */}
              {!collapsed && <span className="text ms-4">Logout</span>}
            </motion.div>
          </Link>
        </>
      )}
      
    </div>
  );
};
