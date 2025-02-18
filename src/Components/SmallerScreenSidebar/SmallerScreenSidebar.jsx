import { useState, useEffect } from "react";
import { RiBookFill, RiHome4Fill, RiMessage2Fill,  RiWallet2Fill, RiLifebuoyFill} from "react-icons/ri";
import { IoMdBookmarks } from "react-icons/io";
import { PiDotsThreeCircleFill } from "react-icons/pi";

import { useLocation, useNavigate } from "react-router-dom";
import more from "../../assets/more.svg";
import Learning from "../../assets/learning.svg";
import home from "../../assets/home.svg";
import courses from "../../assets/courses.svg";

import { FaFileInvoice, FaUsers, FaUserTie, FaHome,FaBookReader } from "react-icons/fa";
import { MdDashboard,MdMessage, MdWallet } from "react-icons/md";
import "./SmallScreen.css";

const role = localStorage.getItem("userType");
const token = localStorage.getItem("token");

export default function SmallerScreenSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const getActiveTab = () => {
    const path = location.pathname;
    if (!token) {
      return path === "/" ? "login" : null;
    }

    switch (role) {
      case "user":
        if (path === "/categories") return "home";
        if (path === "/userCourses") return "courses";
        if (path === "/myLearning") return "myLearning";
        if (path === "/messages") return "messages";
        if (path === "/userWallet") return "userWallet";
        if (path === "/support") return "support";
        return "home"; // Default for user

      case "admin":
        if (path === "/adminDashboard") return "dashboard";
        if (path === "/experts") return "experts";
        if (path === "/students") return "students";
        if (path === "/transactions") return "transactions";
        if (path === "/adminReview") return "review";
        if (path === "/support") return "support";
        return "dashboard"; // Default for admin

      case "expert":
        if (path === "/dashboard") return "dashboardd";
        if (path === "/courses") return "courses";
        if (path === "/messages") return "messages";
        if (path === "/expertWallet") return "wallet";
        if (path === "/support") return "support";
        return "courses"; // Default for expert

      default:
        return "login";
    }
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tab) => {
    // No need to set state - navigation will update the URL and re-render
    if (!token) {
      switch (tab) {
        case "home":
          navigate("/categories");
          break;
        case "login":
          navigate("/");
          break;
        default:
          break;
      }
    } else if (role === "user") {
      switch (tab) {
        case "home":
          navigate("/categories");
          break;
        case "courses":
          navigate("/userCourses");
          break;
        case "myLearning":
          navigate("/myLearning");
          break;
        case "messages":
          navigate("/messages");
          break;
        case "userWallet":
          navigate("/userWallet");
          break;
        case "support":
          navigate("/support");
          break;
        default:
          break;
      }
    } else if (role === "admin") {
      switch (tab) {
        case "dashboard":
          navigate("/adminDashboard");
          break;
        case "experts":
          navigate("/experts");
          break;
        case "students":
          navigate("/students");
          break;
        case "transactions":
          navigate("/transactions");
          break;
        case "review":
          navigate("/adminReview");
          break;
        case "support":
          navigate("/support");
          break;
        default:
          break;
      }
    } else if (role === "expert") {
      switch (tab) {
        case "dashboardd":
          navigate("/dashboard");
          break;
        case "courses":
          navigate("/courses");
          break;
        case "messages":
          navigate("/messages");
          break;
        case "wallet":
          navigate("/expertWallet");
          break;
        case "support":
          navigate("/support");
          break;
        default:
          break;
      }
    }
  };

  return (
    
    <div className="app-white py-1 px-1 d-flex align-items-center justify-content-around w-100 small-screen u-screen">
      {!token && (
        // Render for unauthenticated users
        <>
          <div
            onClick={() => handleTabClick("home")}
            style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
              activeTab === "home" && `bg-white text-black`
            }`}
          >
            <FaHome className="fs-5 d-block" />
            <span className="small-screen-text">Home</span>
          </div>
          <div
          style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
            onClick={() => handleTabClick("login")}
            className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
              activeTab === "login" && `bg-white text-black`
            }`}
          >
            <RiLifebuoyFill className="fs-5 d-block" />
            <span className="small-screen-text">Login</span>
          </div>
        </>)
}

    {role === "user" && (
  <>
    
    <div
    style={{cursor:"pointer",borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("home")}
      className={`d-flex navBarClick flex-column align-items-center py-1 px-1 fw-light p-right ${
        activeTab === "home" && `text-black`
      }`}
    >
     
     <svg className={`${activeTab === "home" && `text-black`}`} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.82369 19.4232V13.419H12.1715V19.4232C12.1715 20.0836 12.6606 20.624 13.2584 20.624H16.5193C17.1171 20.624 17.6062 20.0836 17.6062 19.4232V11.0173H19.454C19.954 11.0173 20.1932 10.3328 19.8127 9.97257L10.7258 0.930238C10.3128 0.521952 9.68237 0.521952 9.26933 0.930238L0.182446 9.97257C-0.187116 10.3328 0.0411431 11.0173 0.541139 11.0173H2.38895V19.4232C2.38895 20.0836 2.87808 20.624 3.4759 20.624H6.73674C7.33456 20.624 7.82369 20.0836 7.82369 19.4232Z" fill={`${activeTab === "home" ? "black" : "#959595"}`}/>
</svg>
      <span className={`${activeTab === "home" && `text-black`}`} style={{color:"#959595", fontSize:"0.8rem", fontWeight:"normal"}}>Home</span>
    </div>
    <div
    style={{cursor:"pointer",borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("courses")}
      className={`d-flex navBarClick flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "courses" && `text-black`
      }`}
    >
     
     <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.46669 14.374C8.37706 14.374 8.28744 14.3877 8.20194 14.4166C7.71594 14.5811 7.20481 14.6865 6.66669 14.6865C6.12856 14.6865 5.61744 14.5811 5.13106 14.4166C5.04556 14.3877 4.95631 14.374 4.86669 14.374C2.53944 14.374 0.654312 16.3459 0.666687 18.7732C0.671937 19.799 1.48156 20.624 2.46669 20.624H10.8667C11.8518 20.624 12.6614 19.799 12.6667 18.7732C12.6791 16.3459 10.7939 14.374 8.46669 14.374ZM6.66669 13.124C8.65494 13.124 10.2667 11.4451 10.2667 9.37402C10.2667 7.30293 8.65494 5.62402 6.66669 5.62402C4.67844 5.62402 3.06669 7.30293 3.06669 9.37402C3.06669 11.4451 4.67844 13.124 6.66669 13.124ZM22.8667 0.624023H8.46669C7.47406 0.624023 6.66669 1.49316 6.66669 2.56113V4.37402C7.54494 4.37402 8.35794 4.63887 9.06669 5.06934V3.12402H22.2667V14.374H19.8667V11.874H15.0667V14.374H12.2077C12.9239 15.026 13.4497 15.8869 13.6961 16.874H22.8667C23.8593 16.874 24.6667 16.0049 24.6667 14.9369V2.56113C24.6667 1.49316 23.8593 0.624023 22.8667 0.624023Z" fill={`${activeTab === "courses" ? "black" : "#959595"}`}/>
</svg>
      <span className={`${activeTab === "courses" && `text-black`}`} style={{color:"#959595", fontSize:"0.8rem", fontWeight:"normal"}}>Courses</span>
    </div>
    <div
    style={{cursor:"pointer",borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("myLearning")}
      className={`d-flex navBarClick flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "myLearning" && `text-black`
      }`}
    >
     
     <IoMdBookmarks className={`${activeTab === "myLearning" && `text-black`} fs-2`} style={{color:"#959595"}}/>
      <span className={`${activeTab === "myLearning" && `text-black`}`} style={{color:"#959595", fontSize:"0.8rem", fontWeight:"normal"}}>Learning</span>
    </div>
    <div
    style={{cursor:"pointer",borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("userWallet")}
      className={`d-flex navBarClick flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "home" && `text-black`
      }`}
    >
     <MdWallet className={`${activeTab === "userWallet" && `text-black`} fs-2`} style={{color:"#959595"}}/>

      <span className={`${activeTab === "userWallet" && `text-black`}`} style={{color:"#959595", fontSize:"0.8rem", fontWeight:"normal"}}>Wallet</span>
    </div>
    {/* <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("support")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "home" && `text-black`
      }`}
    >
     
      <img src={home} className="d-block w-75" />
      <span style={{color:"#959595", fontSize:"0.8rem", fontWeight:"normal"}}>Home</span>
    </div> */}
  </>
)}


{role === "admin" && (
  <>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("dashboard")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
        activeTab === "dashboard" && `bg-white text-black`
      }`}
    >
      <MdDashboard className="fs-8 d-block " />
      <span className="small-screen-text">Dashboard</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("experts")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
        activeTab === "experts" && `bg-white text-black `
      }`}
    >
      <FaUserTie className="fs-7 d-block" />
      <span className="small-screen-text">Experts</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("students")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
        activeTab === "students" && `bg-white text-black `
      }`}
    >
      <FaUsers className="fs-7 d-block" />
      <span className="small-screen-text">Students</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("transactions")}
      className={`d-flex flex-column align-items-center py-1 px-1 fw-light ${
        activeTab === "transactions" && `bg-white text-black `
      }`}
    >
      <FaFileInvoice className="fs-7 d-block" />
      <span className="small-screen-text">Transactions</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("review")}
      className={`d-flex flex-column align-items-center py-1 fw-light ${
        activeTab === "review" && `bg-white text-black `
      }`}
    >
      <FaBookReader className="fs-7" />
      <span className="small-screen-text">Review</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("support")}
      className={`d-flex flex-column align-items-center py-1 fw-light ${
        activeTab === "support" && `bg-white text-black`
      }`}
    >
      <RiLifebuoyFill className="fs-7" />
      <span className="small-screen-text">Support</span>
    </div>
  </>
)}

{role === "expert" && (
  <>
    
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("dashboardd")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "dashboardd" && `bg-white text-black `
      }`}
    >
      <MdDashboard className="fs-5 d-block" />
      <span className="small-screen-text">Dashboard</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("messages")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "messages" && `bg-white text-black `
      }`}
    >
      <MdMessage className="fs-5 d-block" />
      <span className="small-screen-text">Messages</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("courses")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "courses" && `bg-white text-black `
      }`}
    >
      <FaHome className="fs-5 d-block" />
      <span className="small-screen-text">Courses</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("wallet")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "wallet" && `bg-white text-black `
      }`}
    >
      <FaFileInvoice className="fs-5 d-block" />
      <span className="small-screen-text">Wallet</span>
    </div>
    <div
    style={{borderBottomLeftRadius:"0.5rem",borderBottomRightRadius:"0.5rem"}}
      onClick={() => handleTabClick("support")}
      className={`d-flex flex-column align-items-center py-1 px-2 fw-light ${
        activeTab === "support" && `bg-white text-black`
      }`}
    >
      <RiLifebuoyFill className="fs-7" />
      <span className="small-screen-text">Support</span>
    </div>
  </>
)}

    </div>
  );
}
