// import { BsFillCartFill } from "react-icons/bs";
// import { CiFilter, CiSearch } from "react-icons/ci";

// export default function SmallerScreenNavbar() {

//   const handleExpertToggle =()=>{
//     const userType = localStorage.getItem("userType");
//     const oldUserType = localStorage.getItem("oldUserType");
//     if(userType === "expert" ){
//       localStorage.setItem("userType", "user");
//       setUserType("Expert");
//       localStorage.setItem("oldUserType", userType);
//       window.location.reload();
//       toast.success("You have been toggled as user");
//     }
//     else if(oldUserType === "expert" && userType === "user"){
//       localStorage.setItem("userType", "expert");
//       localStorage.removeItem("oldUserType");
//       setUserType("Student");
//       window.location.reload();
//       toast.success(`You are now an expert`);
//     }
//     else{
//       toast.error("You are not eligible for this feature")
//     }
//   }

  
//   return (
//     <div className="d-flex align-items-center p-2">
//       <h4 className="text w-100 gradient-text fw-bold">Jiux</h4>
//       <div className="d-flex align-items-center gap-3">
//         <CiSearch className="primary-color fs-3  cursor-pointer" />
//         <CiFilter className="primary-color fs-3  cursor-pointer" />
//         <BsFillCartFill className="primary-color fs-3  cursor-pointer" />
//       </div>
//     </div>
//   );
// }
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "../Navbar/Navbar.css";
import "./SmallerScreenNavbar.css"
import { CiSearch } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";
import { BiSolidChevronRightSquare } from "react-icons/bi";
import { IoIosAddCircleOutline, IoMdBookmarks, IoMdNotifications } from "react-icons/io";
import { MdFilterCenterFocus, MdMessage, MdWallet } from "react-icons/md";
import { PiFolderUserFill } from "react-icons/pi";
import { BsBellFill, BsFillCartFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BASE_URI } from "../../Config/url";
import toast from "react-hot-toast";
import { FaUserCircle, FaUsers } from "react-icons/fa";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import Cart from "../Cart/Cart";
import { useSelector } from "react-redux";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faGear } from "@fortawesome/free-solid-svg-icons";
import profile from "../../assets/profile.png"
import { FaChalkboardUser, FaGear } from "react-icons/fa6";
import { LuBellDot, LuLogOut } from "react-icons/lu";
import { IoLogIn } from "react-icons/io5";
import { TbCoinFilled, TbLayoutDashboardFilled, TbMessages } from "react-icons/tb";
import defaultUser from "../../assets/defaultUser.svg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { GoBellFill } from "react-icons/go";
import { HiFolderOpen } from "react-icons/hi";






const links = [
  { href: "/categories", label: "Home", Icon: <svg className={`text-black`} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.82369 19.4232V13.419H12.1715V19.4232C12.1715 20.0836 12.6606 20.624 13.2584 20.624H16.5193C17.1171 20.624 17.6062 20.0836 17.6062 19.4232V11.0173H19.454C19.954 11.0173 20.1932 10.3328 19.8127 9.97257L10.7258 0.930238C10.3128 0.521952 9.68237 0.521952 9.26933 0.930238L0.182446 9.97257C-0.187116 10.3328 0.0411431 11.0173 0.541139 11.0173H2.38895V19.4232C2.38895 20.0836 2.87808 20.624 3.4759 20.624H6.73674C7.33456 20.624 7.82369 20.0836 7.82369 19.4232Z" fill={"black"}/>
  </svg> },
  { href: "/myLearning", label: "Learning", Icon: <IoMdBookmarks className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { 
    href: "/support", 
    label: "Support", 
    Icon: <h3 className="fs-2 newLogo app-text-red" style={{ fontFamily:"newFont"}}>J</h3> 
  },
    { href: "/messages", label: "Messages", Icon: <TbMessages className={`text-black fs-2`} style={{color:"#959595"}}/>},

  { href: "/userWallet", label: "Wallet", Icon: <MdWallet className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/settings", label: "Settings", Icon: <FaGear className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/logout", label: "Logout", Icon: <LuLogOut className={`text-black fs-2`} style={{color:"#959595"}}/>},
];

const expertLinks = [
  { href: "/dashboard", label: "Dashboard", Icon: <TbLayoutDashboardFilled className={`text-black fs-2`} style={{color:"#959595"}}/> },
  { href: "/courses", label: "Courses", Icon: <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.46669 14.374C8.37706 14.374 8.28744 14.3877 8.20194 14.4166C7.71594 14.5811 7.20481 14.6865 6.66669 14.6865C6.12856 14.6865 5.61744 14.5811 5.13106 14.4166C5.04556 14.3877 4.95631 14.374 4.86669 14.374C2.53944 14.374 0.654312 16.3459 0.666687 18.7732C0.671937 19.799 1.48156 20.624 2.46669 20.624H10.8667C11.8518 20.624 12.6614 19.799 12.6667 18.7732C12.6791 16.3459 10.7939 14.374 8.46669 14.374ZM6.66669 13.124C8.65494 13.124 10.2667 11.4451 10.2667 9.37402C10.2667 7.30293 8.65494 5.62402 6.66669 5.62402C4.67844 5.62402 3.06669 7.30293 3.06669 9.37402C3.06669 11.4451 4.67844 13.124 6.66669 13.124ZM22.8667 0.624023H8.46669C7.47406 0.624023 6.66669 1.49316 6.66669 2.56113V4.37402C7.54494 4.37402 8.35794 4.63887 9.06669 5.06934V3.12402H22.2667V14.374H19.8667V11.874H15.0667V14.374H12.2077C12.9239 15.026 13.4497 15.8869 13.6961 16.874H22.8667C23.8593 16.874 24.6667 16.0049 24.6667 14.9369V2.56113C24.6667 1.49316 23.8593 0.624023 22.8667 0.624023Z" fill={"black"}/>
    </svg>},
    { 
      href: "/support", 
      label: "Support", 
      Icon: <h3 className="fs-2 newLogo app-text-red" style={{ fontFamily:"newFont"}}>J</h3> 
    },
    { href: "/messages", label: "Messages", Icon: <TbMessages className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/expertWallet", label: "Wallet", Icon: <MdWallet className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/settings", label: "Settings", Icon: <FaGear className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/logout", label: "Logout", Icon: <LuLogOut className={`text-black fs-2`} style={{color:"#959595"}}/>},
];

const adminLinks = [
  { href: "/adminDashboard", label: "Dashboard", Icon: <TbLayoutDashboardFilled className={`text-black fs-2`} style={{color:"#959595"}}/> },
  { href: "/experts", label: "Experts", Icon: <FaChalkboardUser className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/students", label: "Students", Icon: <FaUsers className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/support", label: "Messages", Icon: <TbMessages className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/adminReview", label: "Review", Icon: <MdFilterCenterFocus className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/transactions", label: "Transactions", Icon: <HiFolderOpen className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/settings", label: "Settings", Icon: <FaGear className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/logout", label: "Logout", Icon: <LuLogOut className={`text-black fs-2`} style={{color:"#959595"}}/>},
]

const notLoglinks = [
  { href: "/categories", label: "Home", Icon: <svg className={`text-black`} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.82369 19.4232V13.419H12.1715V19.4232C12.1715 20.0836 12.6606 20.624 13.2584 20.624H16.5193C17.1171 20.624 17.6062 20.0836 17.6062 19.4232V11.0173H19.454C19.954 11.0173 20.1932 10.3328 19.8127 9.97257L10.7258 0.930238C10.3128 0.521952 9.68237 0.521952 9.26933 0.930238L0.182446 9.97257C-0.187116 10.3328 0.0411431 11.0173 0.541139 11.0173H2.38895V19.4232C2.38895 20.0836 2.87808 20.624 3.4759 20.624H6.73674C7.33456 20.624 7.82369 20.0836 7.82369 19.4232Z" fill={"black"}/>
  </svg> },
  
  { href: "/", label: "Login", Icon: <IoLogIn className={`text-black fs-2 `} style={{color:"#959595" , marginLeft:"-0.5rem"}}/>},
];

// Animation variants
const navContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const navItem = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1 },
};


export default function SmallerScreenNavbar({ collapsed, search, setSearch, cartItemNumber }){
  const location = useLocation()
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const profileBarRef = useRef(null); // Reference for the profile-bar
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const role = localStorage.getItem("userType");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const userType = localStorage.getItem("userType");
  const [searchBox, setSearchBox]= useState(false)
  const [signUpAs , setSignUpAs] = useState('')
  const oldUserType = localStorage.getItem("oldUserType");
  const [experts, setExperts] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(null);
  const [UserType, setUserType] = useState("Expert")
  const profileUrl = `${BASE_URI}/api/v1/users/profile`;
  const [ballance , setBallance] = useState(0);
  const [name, setName] = useState("");
  const [profile_picture, setProfilePicture] = useState("");
  // console.log(token)

  
  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const notifications = useSelector((state) => state.payouts.notifications);
  useSelector((state) => state.cart);

  // const { data, refetch } = useFetch(profileUrl, fetchOptions);
  // const { name, profile_picture } = data?.data[0] || [];
  // console.log(data?.data[0])

  const fetchWalletBallance = async () => {
    try {
      const response = await axios.get(`${BASE_URI}/api/v1/users/userWallet`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      
        console.log(response.data.data[0].total_points)
        setBallance(response.data.data[0].total_points);
      
      
    } catch (error) {
      console.error("Error fetching wallet ballance:", error);
    }
  };

  const profileData = async () => {
    console.log("hii")
    try {
      const response = await axios.get(`${BASE_URI}/api/v1/users/profile`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(response)
      setName(response.data.data[0].name);
      setProfilePicture(response.data.data[0].profile_picture);
    }
    catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWalletBallance();
      profileData();
    }
  }, [token]);


  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     setUser(JSON.parse(localStorage.getItem("user")));
  //     setToken(localStorage.getItem("token"));
  //   };
  //   const intervalId = setInterval(handleStorageChange, 1000);
  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    if (location.pathname === "/signUp") {
      setSignUpAs("Expert");
    } 
    else if (location.pathname === "/ExpertSignUp") {
      setSignUpAs("User");
    } 
    else {
      setSignUpAs("");
    }
  
    if (location.pathname === "/categories" || location.pathname.startsWith("/userCourses")) {
      setSearchBox(true);
    } else {
      setSearchBox(false);
    }
  
    
  }, [location]);

  useEffect(() => {
    if (token) {
      const fetchUsers = async () => {
        try {
          const response = await fetch(
            `${BASE_URI}/api/v1/users/otherExperts`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const result = await response.json();
          if (result.status === "Success") {
            setExperts(result.data);
          }
        } catch (error) {
          // toast.error("Error fetching experts");
        }
      };

      fetchUsers();
    }
  }, [token]);

  // useEffect(() => {
  //   if (token) {

  //     axios
  //       .get(`${BASE_URI}/api/v1/users/profileCompletion`, {
  //         headers: {
  //           Authorization: "Bearer " + token,
  //         },
  //       })
  //       .then((resp) => {
        
          
  //         setProfileCompletion(parseInt(resp.data.data.profileCompletion, 10));
  //       });
  //   }
  // }, [token]);

  const handleIconClick = () => {
    searchInputRef.current.focus();
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };


  const handleClickOutside = (event) => {
    if (
      profileBarRef.current &&
      !profileBarRef.current.contains(event.target) &&
      !event.target.closest(".profile-picture-container")
    ) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleExpertToggle =()=>{
    const userType = localStorage.getItem("userType");
    const oldUserType = localStorage.getItem("oldUserType");
    if(userType === "expert" ){
      localStorage.setItem("userType", "user");
      setUserType("Expert");
      localStorage.setItem("oldUserType", userType);
      window.location.reload();
      toast.success("You have been toggled as user");
    }
    else if(oldUserType === "expert" && userType === "user"){
      localStorage.setItem("userType", "expert");
      localStorage.removeItem("oldUserType");
      setUserType("Student");
      window.location.reload();
      toast.success(`You are now an expert`);
    }
    else{
      toast.error("You are not eligible for this feature")
    }
  }

  return (
    <>
    
   
    <nav
    style={{borderBottom:"1px solid grey"}}
      className={`navbar app-white rounded-bottom-4 navbar-expand-lg mb-0 pt-0 pb-3 d-flex align-items-center h-100  ${(userType === "user" || !token) && "user-navbar"}  ${
        token ? "justify-content-between" : "justify-content-center"
      } ${collapsed ? "collapsed" : ""}`}
    >
      <div className="py-2 d-flex w-100 justify-content-between align-items-center h-100 px-3 ps-1">
  {/* Left Side: Hamburger + Logo */}
  <div className="d-flex gap-2 align-items-center flex-grow-1">
    <label style={{ cursor: "pointer" }} className="nav-hamburger-mobile fixed top-4 left-4 z-50">
      <input type="checkbox" checked={isOpen} onChange={toggleMenu} />
      <svg viewBox="0 0 32 32">
        <path
          className="nav-line nav-line-top-bottom"
          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
        />
        <path className="nav-line" d="M7 16 27 16" />
      </svg>
    </label>

    {/* Logo */}
    <h5 className="new-logo fs-5 app-text-black fw-regular d-flex flex-column align-items-start">
      MY <h4 className="fs-5 app-text-red mb-0">JIU JITSU</h4>
    </h5>
  </div>

  {/* Right Side: Token & Profile Image */}
  {token && (
    <div className="d-flex gap-2 justify-content-end align-items-center flex-shrink-0">
      {/* Coin Container */}
      <div className="border border-1 d-flex gap-1 align-items-center rounded-2 overflow-hidden px-2 ps-1 py-1" style={{ width: "max-content", color:"gray" }}>
        <div className="d-flex gap-1 align-items-center">
          {
            role === "admin" ? 
            <GoBellFill onClick={()=> navigate('/transactions')} className="fs-2 ps-1 cursor-pointer"/>:
            <>
            
            <TbCoinFilled className="fs-3" />
            <span className="fs-6 fw-semibold">{ballance}</span>
            </>
          }
        </div>
      </div>

      {/* Profile Image */}
      <img
        style={{ cursor: "pointer", width: "40px", height: "40px" }}
        onClick={() => navigate('/settings')}
        src={ profile_picture || defaultUser}
        alt="profile"
        className=" rounded-circle"
        onError={(e) => {
          e.target.src = defaultUser;
        }}
      />
    </div>
  )}
</div>

     {!token && 
     <div className="d-flex w-100 px-2">
        
        <div  className="d-flex justify-content-center w-100  align-items-center">
        {searchBox && 
          <div style={{width:"95%"}} className="search-input input-group">
            
          <div
          className="w-100"
      style={{
        // background:"blue",
        display: "flex",
        alignItems: "center",
        position: "relative",
        lineHeight: "28px",
        
      }}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "1rem",
          fill: "#9e9ea7",
          width: "1rem",
          height: "1rem",
        }}
      >
        <g>
          <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
        </g>
      </svg>
      
      <input
        type="search"
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          height: "45px",
          lineHeight: "28px",
          border: "1px solid #d1d1d1",
          padding: "0 1rem",
          paddingLeft: "2.5rem",
          border: "2px solid transparent",
          borderRadius: "8px",
          outline: "none",
          backgroundColor: "#f3f3f4",
          color: "#0d0c22",
          transition: "0.3s ease",
          boxShadow: "-1px 3px 8px rgba(0, 0, 0, 0.2)", // Right & bottom shadow
    // border: "1px solid #ccc" // Optional: Ensures a clean border
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(234, 226, 183, 0.4)";
          e.target.style.backgroundColor = "#fff";
          e.target.style.boxShadow = "0 0 0 4px rgb(234 226 183 / 10%)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "transparent";
          e.target.style.backgroundColor = "#f3f3f4";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
        
          </div>}
          {/* <CiFilter className="primary-color fs-2 ms-3 cursor-pointer" /> */}
          {/* {
            oldUserType === "expert" &&
          
  <span style={{color:"black", textDecoration:"underLine", fontSize:"0.8rem", textAlign:"center", whiteSpace:"nowrap"}} onClick={handleExpertToggle} classname="text-black">Go {UserType}</span>

          } */}
          {/* <FontAwesomeIcon className="cursor-pointer" icon={faGear} color="black" onClick={()=> navigate("/settings")}/>
          <FontAwesomeIcon className="cursor-pointer" icon={faArrowRightFromBracket} color="black" onClick={()=> navigate("/logout")}/> */}
        </div>
   </div>
     }
      {(userType === "user") && (
        <div  className="d-flex justify-content-center w-100 align-items-center">
        {searchBox && 
          <div style={{width:"95%"}} className="search-input input-group">
            
          <div
          className="w-100"
      style={{
        // background:"blue",
        display: "flex",
        alignItems: "center",
        position: "relative",
        lineHeight: "28px",
        
      }}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "1rem",
          fill: "#9e9ea7",
          width: "1rem",
          height: "1rem",
        }}
      >
        <g>
          <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
        </g>
      </svg>
      
      <input
        type="search"
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          height: "45px",
          lineHeight: "28px",
          border: "1px solid #d1d1d1",
          padding: "0 1rem",
          paddingLeft: "2.5rem",
          border: "2px solid transparent",
          borderRadius: "8px",
          outline: "none",
          backgroundColor: "#f3f3f4",
          color: "#0d0c22",
          transition: "0.3s ease",
          boxShadow: "-1px 3px 8px rgba(0, 0, 0, 0.2)", // Right & bottom shadow
    // border: "1px solid #ccc" // Optional: Ensures a clean border
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(234, 226, 183, 0.4)";
          e.target.style.backgroundColor = "#fff";
          e.target.style.boxShadow = "0 0 0 4px rgb(234 226 183 / 10%)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "transparent";
          e.target.style.backgroundColor = "#f3f3f4";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
        
          </div>}
          {/* <CiFilter className="primary-color fs-2 ms-3 cursor-pointer" /> */}
          {/* {
            oldUserType === "expert" &&
          
  <span style={{color:"black", textDecoration:"underLine", fontSize:"0.8rem", textAlign:"center", whiteSpace:"nowrap"}} onClick={handleExpertToggle} classname="text-black">Go {UserType}</span>

          } */}
          {/* <FontAwesomeIcon className="cursor-pointer" icon={faGear} color="black" onClick={()=> navigate("/settings")}/>
          <FontAwesomeIcon className="cursor-pointer" icon={faArrowRightFromBracket} color="black" onClick={()=> navigate("/logout")}/> */}
        </div>
      )}
      {/* {userType === "user" && ( */}
      {/* {userType === "user" && ( */}
{/* //         <div className="cart-container"> */}
           {/* //           <Link to="/userCart">
// //             <BsFillCartFill className="primary-color fs-2 ms-5 cursor-pointer" />
// //           </Link> */}
{/* //           <Cart /> */}

        {/* <div className="cart-badge">{cartItemNumber}</div>{" "} */}
{/* //         </div> */}
<></>
      {/* )} */}

      {/* {role === "admin" && (
        <div className="cart-container admin-cart-container flex gap-4 align-items-center" >
          <Link to="/transactions">
            <BsBellFill className="primary-color fs-4 ms-5 cursor-pointer" />
          </Link>
          <div className="cart-badge">{notifications}</div>{" "}
          <FontAwesomeIcon className="cursor-pointer" icon={faGear} color="black" onClick={()=> navigate("/settings")}/>
          <FontAwesomeIcon className="cursor-pointer" icon={faArrowRightFromBracket} color="black" onClick={()=> navigate("/logout")}/>
        </div>
      )} */}


      {/* {userType === "expert" && (
       <div className="flex gap-3 align-items-center justify-content-center"> */}

{/* <button class="learn-more" >
  <span class="circle" aria-hidden="true">
  <span class="icon arrow"></span>
  </span> */}
  {/* <span style={{color:"black", textDecoration:"underLine", fontSize:"0.8rem"}} onClick={handleExpertToggle} classname="text-black">Go Student</span>
  <FontAwesomeIcon className="cursor-pointer" icon={faGear} color="black" onClick={()=> navigate("/settings")}/>
  <FontAwesomeIcon className="cursor-pointer" icon={faArrowRightFromBracket} color="black" onClick={()=> navigate("/logout")}/> */}
{/* </button> */}
       
       
       
       {/* </div>

        
      )} */}
      {/* {token && (
        <div onClick={handleProfileClick} style={{ cursor: "pointer" }}>
          <div className="profile-picture-container">
            {profile_picture ? (
              <>
             
              <div className="completion-bar">
                 <CircularProgressbar
                  styles={buildStyles({   
                    textSize: '1rem',
                    pathTransitionDuration: 0.5,
                    pathColor: `#00000)`,
                    textColor: '#fff',
                    trailColor: '#fff',
                  })}
                  value={100} text={`${profileCompletion}`} />

              </div>
             
              <img
                src={profile_picture}
                alt="Profile"
                className="profile-picture"
                style={{ objectFit: "cover", height: "3rem", width: "3rem" }} 
              />
       
              

              </>
              
            ) : (
              <>
             
              <div className="completion-bar">
                 <CircularProgressbar
                  styles={buildStyles({   
                    textSize: '1rem',
                    pathTransitionDuration: 0.5,
                    pathColor: `#00000)`,
                    textColor: '#fff',
                    trailColor: '#fff',
                  })}
                  value={100} text={`${profileCompletion}`} />

              </div>
              <FaUserCircle
                className="profile-picture text-secondary"
                style={{ fontSize: "3rem" }}
              />
              </>
            )}
          </div>
        </div>
      )} */}

      <div
        ref={profileBarRef} // Add the ref to the profile-bar
        className={`profile-bar rounded-4 text-black px-4 py-4 ${
          isProfileOpen ? "open" : ""
        }`}
      >
        <div className="d-flex align-items-center justify-content-between mb-4">
          <p className="mb-0 fs-small w-60 text-end text-secondary">
            Your Profile
          </p>
          <BiSolidChevronRightSquare
            className="primary-color fs-3 cursor-pointer"
            onClick={handleProfileClick}
          />
        </div>
        <main className="text-center">
          <div className="profile-picture-container">
            {profile_picture ? (
              <>
             
              <div className="completion-bar">
                 <CircularProgressbar
                  styles={buildStyles({   
                    textSize: '1rem',
                    pathTransitionDuration: 0.5,
                    pathColor: `#00000)`,
                    textColor: '#fff',
                    trailColor: '#fff',
                  })}
                  value={100} text={`${profileCompletion}`} />

              </div>
             
              <img
                src={profile_picture || defaultUser}
                alt="Profile"
                className="profile-picture"
                style={{ objectFit: "cover", height: "5rem", width: "5rem" }} 
                onError={(e) => {
                  e.target.src = defaultUser;
                }}
              />
       
              

              </>
              
            ) : (
              <>
             
              <div className="completion-bar">
                 <CircularProgressbar
                  styles={buildStyles({   
                    textSize: '1rem',
                    pathTransitionDuration: 0.5,
                    pathColor: `#00000)`,
                    textColor: '#fff',
                    trailColor: '#fff',
                  })}
                  value={100} text={`${profileCompletion}`} />

              </div>
              <FaUserCircle
                className="profile-picture text-secondary"
                style={{ fontSize: "3rem" }}
              />
              </>
            )}
          </div>

          <h4 className="fw-lightBold mb-1 text-capitalize">
            Good Morning {name?.split(" ")[0]}
          </h4>
          <p
            className="text-center lightgray-color fs-small mb-3"
            style={{ lineHeight: "14.52px" }}
          >
            Continue your journey and Inspire many
          </p>
          {/* <div className="d-flex align-items-center justify-content-between px-4">
            <p
              className="d-flex align-items-center justify-content-center rounded-circle border border-secondary mb-0"
              style={{ height: "3rem", width: "3rem" }}
            >
              <IoMdNotifications className="fs-4 primary-color" />
            </p>
            <p
              className="d-flex align-items-center justify-content-center rounded-circle border border-secondary mb-0"
              style={{ height: "3rem", width: "3rem" }}
            >
              <MdMessage className="fs-4 primary-color" />
            </p>
            <p
              className="d-flex align-items-center justify-content-center rounded-circle border border-secondary mb-0"
              style={{ height: "3rem", width: "3rem" }}
            >
              <PiFolderUserFill className="fs-4 primary-color" />
            </p>
          </div> */}
          <div style={{ height: "8rem" }}></div>

          {/* other experts */}
          {token && role === "expert" && (
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 className="fw-lightBold mb-0">Other Experts</h4>
                <IoIosAddCircleOutline className="fs-2 text-secondary" />
              </div>
              <div className="mb-4">
                {experts.map((expert) => (
                  <div
                    className="d-flex align-items-center justify-content-between py-2 border-bottom"
                    key={expert.id}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {expert.profile_picture ? (
                        <img
                          src={expert.profile_picture}
                          alt=""
                          className="rounded-circle"
                          style={{
                            height: "2rem",
                            width: "2rem",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <FaUserCircle
                          className="fs-2"
                          style={{
                            height: "2rem",
                            width: "2rem",
                          }}
                        />
                      )}
                      <div>
                        <p className="mb-0 fw-lightBold text-start text-capitalize">
                          {expert.name}
                        </p>
                        {/* Optional: Display designation if you have it */}
                        {/* <p className="mb-0 fs-small text-start">{user.designation}</p> */}
                      </div>
                    </div>
                    <button
                      className="rounded-pill px-3 py-1 bg-custom-primary text-white fs-small"
                      // onClick={() => onFollow(user.id)}
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
              {experts.length > 3 && (
                <button className="signup-now w-100 rounded-pill">
                  See all
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </nav>
    <AnimatePresence>
        {isOpen && (
          <>
          
            {/* Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="position-fixed top-0 start-0 bottom-0 end-0 bg-dark bg-opacity-25"
              style={{ backdropFilter: "blur(4px)", zIndex: 1030 }}
              onClick={toggleMenu}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="position-fixed top-0 start-0 bottom-0 bg-white shadow-lg overflow-auto"
              style={{ width: "90%", zIndex: 1040 }}
            >
              {/* Navigation Links */}
              <div className="p-4 pt-5 mt-4">
                <motion.nav
                  variants={navContainer}
                  initial="hidden"
                  animate="show"
                  className="d-flex flex-column gap-3"
                >
                  
                  {(token && role === "user") &&
                  <>
                  {localStorage.getItem("hybridUser") === "hybrid" &&
                  <motion.div variants={navItem}>
                  <ToggleSwitch />
                </motion.div>
                  }
                  
                  {links.map(({ href, label, Icon}) => {
                    console.log(Icon);
                    return(
                    <motion.div key={href} variants={navItem}>
                      <div style={{cursor:"pointer"}} onClick={()=> navigate(href)}>
                   
                        <a
                          onClick={toggleMenu}
                          className="d-flex align-items-center gap-3 text-decoration-none p-3 rounded text-dark"
                          style={{ transition: "all 0.2s" }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                           {Icon && <>{Icon}</> }
                          <span className="fs-5">{label}</span>
                        </a>
                      </div>
                    </motion.div>
                  )})}
                  </>
                  }
                  {token && role === "expert" && (
  <>
    <motion.div variants={navItem}>
      <ToggleSwitch />
    </motion.div>
    {expertLinks.map(({ href, label, Icon }) => (
      <motion.div key={href} variants={navItem}>
        <div style={{ cursor: "pointer" }} onClick={() => navigate(href)}>
          <a
            onClick={toggleMenu}
            className="d-flex align-items-center gap-3 text-decoration-none p-3 rounded text-dark"
            style={{ transition: "all 0.2s" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {Icon && <>{Icon}</>}
            <span className="fs-5">{label}</span>
          </a>
        </div>
      </motion.div>
    ))}
    
  </>
)}
{(token && role === "admin") &&
                  <>
                  
                  
                  {adminLinks.map(({ href, label, Icon}) => {
                    
                    return(
                    <motion.div key={href} variants={navItem}>
                      <div style={{cursor:"pointer"}} onClick={()=> navigate(href)}>
                   
                        <a
                          onClick={toggleMenu}
                          className="d-flex align-items-center gap-3 text-decoration-none p-3 rounded text-dark"
                          style={{ transition: "all 0.2s" }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                           {Icon && <>{Icon}</> }
                          <span className="fs-5">{label}</span>
                        </a>
                      </div>
                    </motion.div>
                  )})}
                  </>
                  }

                  {!token && notLoglinks.map(({ href, label, Icon}) => {
                    console.log(Icon);
                    return(
                    <motion.div key={href} variants={navItem}>
                      <div style={{cursor:"pointer"}} onClick={()=> navigate(href)}>
                   
                        <a
                          onClick={toggleMenu}
                          className="d-flex align-items-center gap-3 text-decoration-none p-3 rounded text-dark"
                          style={{ transition: "all 0.2s" }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                           {Icon && <>{Icon}</> }
                          <span className="fs-5">{label}</span>
                        </a>
                      </div>
                    </motion.div>
                  )})}

                </motion.nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
     </>
  );
};
