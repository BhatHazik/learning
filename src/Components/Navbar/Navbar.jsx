import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { CiSearch } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";
import { BiSolidChevronRightSquare } from "react-icons/bi";
import { IoIosAddCircleOutline, IoMdNotifications } from "react-icons/io";
import { MdMessage } from "react-icons/md";
import { PiFolderUserFill } from "react-icons/pi";
import { BsBellFill, BsFillCartFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BASE_URI } from "../../Config/url";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { useSelector } from "react-redux";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import defaultUser from "../../assets/defaultUser.svg";

export const Navbar = ({ collapsed, search, setSearch, cartItemNumber }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const searchInputRef = useRef(null);
  const profileBarRef = useRef(null); // Reference for the profile-bar
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const role = localStorage.getItem("userType");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const userType = localStorage.getItem("userType");
  const oldUserType = localStorage.getItem("oldUserType");
  const [experts, setExperts] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(null);
  const [searchBox, setSearchBox]= useState(false)
  const [signUpAs , setSignUpAs] = useState('')
  const [UserType, setUserType] = useState("Expert")
  const profileUrl = `${BASE_URI}/api/v1/users/profile`;
  const [ballance, setBallance] = useState(0);

  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  
  const notifications = useSelector((state) => state.payouts.notifications);
  useSelector((state) => state.cart);
  
  const { data, refetch } = useFetch(profileUrl, fetchOptions);
  const { name, profile_picture } = data?.data[0] || [];

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
  
    if (location.pathname.startsWith("/userCourses") || location.pathname === "/categories") {
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

  const fetchWalletBallance = async () => {
    try {
      const response = await axios.get(`${BASE_URI}/api/v1/users/userWallet`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      
      setBallance(response.data.data[0].total_points);
    } catch (error) {
      console.error("Error fetching wallet ballance:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWalletBallance();
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

  const handleExpertToggle = () => {
    const userType = localStorage.getItem("userType");
    const oldUserType = localStorage.getItem("oldUserType");
    if(userType === "expert") {
      localStorage.setItem("userType", "user");
      setUserType("Expert");
      localStorage.setItem("oldUserType", userType);
      navigate("/categories");
      window.location.reload();
      toast.success("You have been toggled as user");
    }
    else if(oldUserType === "expert" && userType === "user") {
      localStorage.setItem("userType", "expert");
      localStorage.removeItem("oldUserType");
      setUserType("Student");
      navigate("/courses");
      window.location.reload();
      
      toast.success(`You are now an expert`);
    }
    else {
      toast.error("You are not eligible for this feature");
    }
  };

  // Determine if the user can toggle (is a hybrid user)
  const canToggle = (userType === "expert") || (oldUserType === "expert" && userType === "user");

  return (
    <nav
      className={`navbar navbar-expand-lg d-flex align-items-center ps-6 pe-5  ${
        token ? "justify-content-between" : "justify-content-center"
      } ${collapsed ? "collapsed" : ""}`}
    >
      <div className="d-flex gap-3 align-items-center w-75">
        {/* Search box - shown for all user types when needed */}
        {searchBox && (
          <div className="search-input input-group" style={{ width: canToggle ? "70%" : "100%" }}>
            <div style={{width:"95%"}} className="search-input bg-transparent input-group">
              <div
                className="w-100"
                style={{
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
                    border: "1px solid grey",
                    borderRadius: "8px",
                    outline: "none",
                    backgroundColor: "#f3f3f4",
                    color: "#0d0c22",
                    transition: "0.3s ease",
                    boxShadow: "-1px 3px 8px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Sign up buttons */}
        {!token && (signUpAs === "User" || signUpAs === "Expert") && (
          <button 
            onClick={signUpAs === 'User' ? () => navigate("/signUp") : () => navigate("/ExpertSignUp")}
            style={{marginLeft: searchBox ? "2rem" : "auto"}} 
            className="mt-3 learn-more-user"
          >
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">SignUp As {signUpAs}</span>
          </button>
        )}

        {/* Toggle button - only shown for hybrid users */}
        {token && canToggle && (
          <button 
            className={userType === "expert" ? "learn-more" : "learn-more-user"} 
            onClick={handleExpertToggle}
            style={{ marginLeft: searchBox ? "2rem" : "auto" }}
          >
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">
              Toggle As {userType === "expert" ? "User" : "Expert"}
            </span>
          </button>
        )}
      </div>

      {/* Admin notifications */}
      {userType === "admin" && (
        <div className="position-relative d-flex">
          <Link to="/transactions">
            <BsBellFill className="primary-color fs-4 ms-5 cursor-pointer ms-5" />
          </Link>
          <div className="cart-badge">{notifications}</div>
        </div>
      )}
      
      {/* Profile picture - shown for all logged-in users */}
      {token && (
        <div 
          onClick={() => {
            if (role === "expert") {
              navigate(`/userProfile/${user.id}`);
            } else {
              navigate('/settings');
            }
          }}
          style={{ cursor: "pointer" }}
        >
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
                    value={100} text={`${profileCompletion}`} 
                  />
                </div>
                <img
                  src={profile_picture || defaultUser}
                  alt="Profile"
                  className="profile-picture"
                  style={{ objectFit: "cover", height: "3rem", width: "3rem" }} 
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
                    value={100} text={`${profileCompletion}`} 
                  />
                </div>
                <FaUserCircle
                  className="profile-picture text-secondary"
                  style={{ fontSize: "3rem" }}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Profile sidebar */}
      <div
        ref={profileBarRef}
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
                    value={100} text={`${profileCompletion}`} 
                  />
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
                    value={100} text={`${profileCompletion}`} 
                  />
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
          <div style={{ height: "8rem" }}></div>

          {/* Other experts section */}
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
                      </div>
                    </div>
                    <button
                      className="rounded-pill px-3 py-1 bg-custom-primary text-white fs-small"
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
  );
};
