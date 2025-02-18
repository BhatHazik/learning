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
import { MdMessage, MdWallet } from "react-icons/md";
import { PiFolderUserFill } from "react-icons/pi";
import { BsBellFill, BsFillCartFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BASE_URI } from "../../Config/url";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import Cart from "../Cart/Cart";
import { useSelector } from "react-redux";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faGear } from "@fortawesome/free-solid-svg-icons";
import profile from "../../assets/profile.png"
import { FaGear } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";








const links = [
  { href: "/categories", label: "Home", Icon: <svg className={`text-black`} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.82369 19.4232V13.419H12.1715V19.4232C12.1715 20.0836 12.6606 20.624 13.2584 20.624H16.5193C17.1171 20.624 17.6062 20.0836 17.6062 19.4232V11.0173H19.454C19.954 11.0173 20.1932 10.3328 19.8127 9.97257L10.7258 0.930238C10.3128 0.521952 9.68237 0.521952 9.26933 0.930238L0.182446 9.97257C-0.187116 10.3328 0.0411431 11.0173 0.541139 11.0173H2.38895V19.4232C2.38895 20.0836 2.87808 20.624 3.4759 20.624H6.73674C7.33456 20.624 7.82369 20.0836 7.82369 19.4232Z" fill={"black"}/>
  </svg> },
  { href: "/myLearning", label: "Learning", Icon: <IoMdBookmarks className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/userWallet", label: "Wallet", Icon: <MdWallet className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/settings", label: "Settings", Icon: <FaGear className={`text-black fs-2`} style={{color:"#959595"}}/>},
  { href: "/logout", label: "Logout", Icon: <LuLogOut className={`text-black fs-2`} style={{color:"#959595"}}/>},
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
  
  // console.log(token)

  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const notifications = useSelector((state) => state.payouts.notifications);
  useSelector((state) => state.cart);

  const { data, refetch } = useFetch(profileUrl, fetchOptions);
  const { name, profile_picture } = data?.data[0] || [];

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
  
    if (location.pathname === "/categories" || location.pathname === "/userCourses") {
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

  useEffect(() => {
    if (token) {

      axios
        .get(`${BASE_URI}/api/v1/users/profileCompletion`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((resp) => {
        
          
          setProfileCompletion(parseInt(resp.data.data.profileCompletion, 10));
        });
    }
  }, [token]);

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
        <div className="d-flex gap-2 align-items-center">
        <label style={{cursor:"pointer"}} className="nav-hamburger-mobile fixed top-4 left-4 z-50">
        <input
          type="checkbox"
          checked={isOpen}
          onChange={toggleMenu}
        />
        <svg viewBox="0 0 32 32">
          <path
            className="nav-line nav-line-top-bottom"
            d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
          />
          <path className="nav-line" d="M7 16 27 16" />
        </svg>
      </label>
        <h4 className="new-logo text app-text-black fw-bold">MY <h4 className="app-text-red">JIU JITSU</h4></h4>

        </div>
          <img           style={{cursor: "pointer" }}
 onClick={()=> navigate('/settings')} src={profile} alt="profile" className="w-10 object-fit-cover rounded-circle" />
      </div>
     {!token && 
     <div className="d-flex gap-3 align-items-center">
        
     <div style={{marginLeft:`${!token ? "0.7rem" : 0}`}} className="search-input input-group">
       {searchBox &&<>
       <label
         className="input-group-text search-icon border-end-0"
         htmlFor="search"
         onClick={handleIconClick}
       >
         <CiSearch />
       </label>
       <input
         type="text"
         id="search"
         placeholder="Search here..."
         aria-label="search"
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         ref={searchInputRef}
         className="navbar-input form-control border-start-0 ps-0"
       /></>}
        {
              (signUpAs === "User" || signUpAs === "Expert") && 
              <span onClick={signUpAs === 'User' ? () => navigate("/signUp") : () => navigate("/ExpertSignUp")} style={{color:"black", textDecoration:"underLine", fontSize:"0.8rem", textAlign:"center", whiteSpace:"nowrap"}} classname="text-black">SignUp As {signUpAs}</span>
//               <button onClick={signUpAs === 'User' ? () => navigate("/signUp") : () => navigate("/ExpertSignUp")}
//               style={{marginLeft:"50%"}} class="mt-3 learn-more-user">
//   <span class="circle" aria-hidden="true">
//   <span class="icon arrow"></span>
//   </span>
//   <span class="button-text">SignUp As {signUpAs}</span>
// </button>
            }
     </div>
   </div>
     }
      {(userType === "user") && (
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

      {userType === "admin" && (
        <div className="cart-container admin-cart-container flex gap-4 align-items-center" >
          <Link to="/transactions">
            <BsBellFill className="primary-color fs-4 ms-5 cursor-pointer" />
          </Link>
          <div className="cart-badge">{notifications}</div>{" "}
          <FontAwesomeIcon className="cursor-pointer" icon={faGear} color="black" onClick={()=> navigate("/settings")}/>
          <FontAwesomeIcon className="cursor-pointer" icon={faArrowRightFromBracket} color="black" onClick={()=> navigate("/logout")}/>
        </div>
      )}


      {userType === "expert" && (
       <div className="flex gap-3 align-items-center justify-content-center">

{/* <button class="learn-more" >
  <span class="circle" aria-hidden="true">
  <span class="icon arrow"></span>
  </span> */}
  <span style={{color:"black", textDecoration:"underLine", fontSize:"0.8rem"}} onClick={handleExpertToggle} classname="text-black">Go Student</span>
  <FontAwesomeIcon className="cursor-pointer" icon={faGear} color="black" onClick={()=> navigate("/settings")}/>
  <FontAwesomeIcon className="cursor-pointer" icon={faArrowRightFromBracket} color="black" onClick={()=> navigate("/logout")}/>
{/* </button> */}
       
       
       
       </div>

        
      )}
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
                src={profile_picture}
                alt="Profile"
                className="profile-picture"
                style={{ objectFit: "cover", height: "5rem", width: "5rem" }} 
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
                </motion.nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
     </>
  );
};
