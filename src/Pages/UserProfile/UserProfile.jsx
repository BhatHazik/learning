import "./UserProfile.css";
import { useState, useEffect } from "react";
import { BASE_URI } from "../../Config/url";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HashLoader } from "react-spinners";
import defaultUser from "../../assets/defaultUser.svg";
import formatDate1 from "../../utils/formatDate";
import LikeButton from "../../Components/Like/LikeButton";
import defaultCourse from "../../assets/defaultCourse.svg";
import Popup from "../../Components/PopUp/PopUp";
import seminar from "../../assets/seminar.svg";

const getSocialLinks = (profile) => [
  {
    name: "Twitter",
    icon: "fab fa-twitter",
    url: `https://${profile?.twitter}`,
  },
  {
    name: "Youtube",
    icon: "fab fa-youtube",
    url: `https://${profile?.youtube}`,
  },
  { name: "Website", icon: "fas fa-globe", url: `https://${profile?.website}` },
];

export default function UserProfile() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  // const location = useLocation();
  const {id} = useParams()
  const expertId = id;
  // const course_id = location.state?.course_id;
  const [profile, setProfile] = useState(null);
  const [courseData, setCourse] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [loading , setLoading] = useState(false);
  const [pastMatches, setPastMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [seminarClicked, setSeminarClicked] = useState(false);
  const [seminarData, setSeminarData] = useState(null);
  // const token = localStorage.getItem("token");


  useEffect(() => {
    
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `${BASE_URI}/api/v1/expert/profile/${expertId}`
        );
        setProfile(response?.data?.data.expert); // Set profile data
        setCourse(response?.data?.data?.courses || []);
        console.log(response?.data?.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
      finally{
        setLoading(false)
      }
    };

    fetchProfile();
  }, [expertId]);


  const fetchPastMatches = async () => {

    try {
      const response = await axios.get(
        `${BASE_URI}/api/v1/users/getPastMatch/?id=${expertId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPastMatches(response?.data?.data); // Set past matches data
      console.log(response?.data?.data)
    } catch (err) {
      console.error("Error fetching past matches data:", err);
    }
  };

  const fetchUpcomingMatches = async () => {

    try {
      const response = await axios.get(
        `${BASE_URI}/api/v1/users/getUpcomingMatch/?id=${expertId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpcomingMatches(response?.data?.data); // Set past matches data
      console.log(response?.data?.data);
    } catch (err) {
      console.error("Error fetching past matches data:", err);
    }
  };

  const handleSeminarClick = (data) => {
    setSeminarClicked(true);
    setSeminarData(data);
  };



  useEffect(() => {
    fetchUpcomingMatches();
    fetchPastMatches();
  }, []);



  const getRandomColor = () => {
    const colors = [
      "#2C3E50", // Dark Blue-Gray
      "#8E44AD", // Deep Purple
      "#2980B9", // Soft Blue
      "#16A085", // Teal
      "#27AE60", // Green
      "#F39C12", // Muted Orange
      "#D35400", // Burnt Orange
      "#C0392B", // Deep Red
      "#BDC3C7", // Light Gray
      "#7F8C8D", // Slate Gray
      "#34495E", // Steel Blue
      "#E67E22", // Warm Orange
      "#9B59B6", // Purple
      "#1ABC9C", // Aquamarine
      "#3498DB", // Light Blue
      "#95A5A6", // Cool Gray
      "#E74C3C", // Muted Red
      "#F1C40F", // Soft Yellow
      "#AAB7B8", // Soft Silver
      "#5D6D7E", // Dark Slate Blue
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
    <Popup isOpen={seminarClicked} onClose={() => setSeminarClicked(false)}>
    <div className="" style={{
    // position: 'relative',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    overflow: 'hidden',
    // maxWidth: '350px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  }}>
    {/* Image and content layout */}
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image section */}
      <div style={{ height: '210px', overflow: 'hidden' }}>
        <img 
          src={seminar}
          alt="Karate practice" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      
      {/* Text content */}
      <div 
      style={{ 
        padding: '15px', 
        // backgroundColor: '#000', 
        color: 'white',
        textAlign: 'center'
      }}
      className="app-black"
      >
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          Your next battle is near! 🏆
        </h3>
        <p style={{ fontSize: '14px', marginBottom: '15px' }}>
          World Karate Championship in 3 Days
        </p>
        
        {/* Support and contact button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '14px' }}>Need support?</span>
          <button 
            style={{ 
              backgroundColor: '#fff', 
              color: 'black', 
              border: 'none', 
              borderRadius: '4px', 
              padding: '6px 12px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
            onClick={() => {
              // Handle opening the nested popup here
              // You might want to set another state like setNestedPopupOpen(true)
            }}
          >
            Contact
          </button>
        </div>
      </div>
    </div>
    
    {/* Close button */}
    <button 
      style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        zIndex: 10
      }}
      onClick={() => setSeminarClicked(false)}
    >
      ×
    </button>
  </div>
    </Popup>
    <div
      className="wrapper-userCourseview position-relative"
      style={{ backgroundColor: "white" }}
    >

{
        loading ? 
        <div style={{height:"90vh"}} className="flex align-items-center justify-content-center w-100">
        <HashLoader size="60" color="#0c243c"/>
      </div>
      :
      <>
      <div className="px-4">
        <div className="container c-profile">
          <div className="profile-container">
          <div className="profile-image">
  {profile?.profile_picture ? (
    <img
      alt="Profile picture of a person smiling"
      src={profile.profile_picture}
      className="rounded-circle" // Optional: To keep a circular style if needed
    />
  ) : (
    <div
      style={{
        width: "50px",  // Adjust size based on your layout
        height: "50px",
        borderRadius: "50%",
        backgroundColor: getRandomColor(), // Function to get a random color
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ color: "#fff", fontWeight: "bold", fontSize: "24px" }}>
        {profile && profile.name ? profile.name.charAt(0).toUpperCase() : '?'} 
        {/* Display first letter or '?' if name is not available */}
      </span>
    </div>
  )}
  <h6 className="expert-name">Juijitsu Expert</h6>
  
</div>


            <div className="profile-info">
              <div className="profile-one" style={{ display: "flex" }}>
                <div className="name-info">
                  <h6>{profile?.name}</h6>
                  <p>{profile?.title}</p>
                  <div className="stats">
                    <p>Students: {profile?.total_students}</p>
                    <p>Reviews: {profile?.total_reviews}</p>
                  </div>
                </div>
                <div className="social">
                  <h6 className="social-heading">My Socials</h6>
                  <div className="socials">
                    {getSocialLinks(profile).map((social, index) => (
                      <a href={social.url} key={index}>
                        <i className={social.icon} /> {social.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              
            </div>
            
          </div>
          <div
          onClick={() => navigate(`/fighterDetails/${expertId}`)}
          style={{cursor:"pointer", width:"max-content"}} className="bg-gradient-custom-div d-flex justify-content-between py-1 px-2 mt-2 rounded-1">
            <p>See Fighter Details</p>
           
          </div>
          <div className="mt-3">
                <h6>About me</h6>
                <p className="para-profile">{profile?.bio}</p>
              </div>

              <div className="mt-3">
          <h6 style={{width:"max-content"}} className="mb-2 fs-5 fw-bold">Past Competitions</h6>
          {pastMatches.length && pastMatches.length > 0 ? (
            <ul className="list-group mt-1">
              {pastMatches?.map((comp, index) => (
                <li 
                
                key={index} 
                className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{comp.competition_name}</strong> <br />
                    <small className="text-muted">
                       {formatDate1(comp.competition_date)} | {comp.location}
                    </small>
                  </div>
                  <span className="badge bg-success text-white">Attended</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No past competitions available.</p>
          )}
        </div>

        {/* Upcoming Competitions */}
        <div className="mt-3">
          <h6 style={{width:"max-content"}} className="mb-2 fs-5 fw-bold">Upcoming Competitions</h6>
          {upcomingMatches.length && pastMatches.length > 0 ? (
            <ul className="list-group mt-1">
              {upcomingMatches?.map((comp, index) => (
                <li 
                onClick={() => handleSeminarClick(comp)}
                key={index} 
                className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{comp.competition_name}</strong> <br />
                    <small className="text-muted">
                       {formatDate1(comp.competition_date)} | {comp.location}
                    </small>
                  </div>
                  <span className="badge bg-warning text-dark">Upcoming</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No upcoming competitions available.</p>
          )}
        </div>
          
        </div>
        <div className="bottom-userCourseview ">
          <h3>My courses</h3>
          <div className="cards-userProfileCourseview">
            {courseData?.length > 0 ? (
              courseData.map((course, index) => (
                <div
                  onClick={() =>
                    course?.is_purchased
                      ? navigate(`/userPurchasedCourses/${course?.id}`)
                      : course?.is_in_cart
                      ? navigate("/userCart")
                      : navigate(`/userCourses/userCourseView/${course?.id}`)
                  }
                  className="card-bottom-userCourseview c-btm"
                  key={index}
                >
                  <span>
                    <img
                      src={course?.thumbnail || "default-image-url"}
                      alt="Course image"
                    />
                  </span>

                  <div className="middle-sec-card-userCourseview">
                    <div className="addCourse-card-userCourseview">
                      <h6>{course?.category || "No title available"}</h6>
                    </div>
                    <div className="pricing-card-userCourseview">
                      <h5>
                        {course?.tags?.split(" ").slice(0, 2).join(" ") +
                          "..." || "No tags available"}
                      </h5>
                    </div>
                  </div>
                  <p>{course?.name}</p>
                  <h5>{course?.title}</h5>

                  <div className="bottom-card-useruserCourseview">
                    <span>
                      <h5>${course?.price}</h5>
                      <h5>${course?.discounted_price}</h5>
                    </span>
                    <div
                      onClick={(e) =>
                        course?.is_purchased
                          ? navigate(`/userPurchasedCourses/${course?.id}`)
                          : navigate(
                              `/userCourses/userPurchasedCourse/${course?.id}`
                            )
                      }
                    >
                      {loadingItems[course?.id] ? (
                        <PulseLoader size={8} color="white" />
                      ) : course?.is_purchased ? (
                        <h6>Purchased!</h6>
                      ) : (
                        <h6>Go to courses</h6>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No other courses available!</p>
            )}
          </div>
        </div>
      </div>

      
      </>
}


    </div>
    <div style={{marginBottom:"4.5rem"}} className="mobile-experts w-100 ms-1 px-2">
      <div className="container c-profile app-white rounded p-3 shadow-sm">
        <div className="d-flex align-items-center gap-3">
          {/* Profile Image or Initials */}
          <div className="profile-image">
            {profile?.profile_picture ? (
              <img
                alt="Profile"
                src={profile.profile_picture}
                className="rounded-circle"
                style={{ width: 60, height: 60, objectFit: "cover" }}
                onError={(e) => {
                  // console.log(e)
                  e.target.onerror = null;
                  e.target.src = defaultUser; // Fallback image
                }}
              />
            ) : (
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: getRandomColor(),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
              >
                {profile?.name ? profile.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-grow-1">
            <h5 className="mb-1">{profile?.name || "Unknown Expert"}</h5>
            <p className="text-muted mb-1">{profile?.title || "JiuJitsu Expert"}</p>
            <div className="d-flex gap-3 text-muted small">
              <span>👨‍🎓 Students: {profile?.total_students || 0}</span>
              <span>⭐ Reviews: {profile?.total_reviews || 0}</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {profile?.socials && profile.socials.length > 0 && (
          <div className="mt-3">
            <h6 className="mb-2">My Socials</h6>
            <div className="d-flex gap-2">
              {getSocialLinks(profile).map((social, index) => (
                <a
                  href={social.url}
                  key={index}
                  className="text-decoration-none text-dark"
                >
                  <i className={social.icon} /> {social.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* About Section */}
        {profile?.bio && (
          <div className="mt-3">
            <h6>About Me</h6>
            <p className="text-muted">{profile.bio}</p>
          </div>
        )}

        {/* Past Competitions */}
        <div className="mt-3">
          <h6 style={{width:"max-content"}} className="app-black p-1 app-text-white border-0 rounded-1 px-2 mb-2">Past Competitions</h6>
          {pastMatches.length && pastMatches.length > 0 ? (
            <ul className="list-group mt-1">
              {pastMatches?.map((comp, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{comp.competition_name}</strong> <br />
                    <small className="text-muted">
                       {formatDate1(comp.competition_date)} | {comp.location}
                    </small>
                  </div>
                  <span className="badge bg-success text-white">Attended</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No past competitions available.</p>
          )}
        </div>

        {/* Upcoming Competitions */}
        <div className="mt-3">
          <h6 style={{width:"max-content"}} className="app-black p-1 app-text-white border-0 rounded-1 px-2 mb-2">Upcoming Competitions</h6>
          {upcomingMatches.length && pastMatches.length > 0 ? (
            <ul className="list-group mt-1">
              {upcomingMatches?.map((comp, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{comp.competition_name}</strong> <br />
                    <small className="text-muted">
                       {formatDate1(comp.competition_date)} | {comp.location}
                    </small>
                  </div>
                  <span className="badge bg-warning text-dark">Upcoming</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No upcoming competitions available.</p>
          )}
        </div>
        <h6 style={{width:"max-content"}} className="app-black p-1 app-text-white border-0 rounded-1 px-2 mt-3 mb-0">More Courses by {profile?.name}</h6>
        {
          courseData?.map((course, index) =>
            <div
         
          onClick={() => 
              navigate(course.is_purchased 
                ? `/userPurchasedCourses/${course.id}` 
                : `/userCourses/userCourseView/${course.id}`
              )
            }
             key={index}
              style={{boxShadow: "1px 3px 7px rgba(0, 0, 0, 0.2)", width:"95%", alignSelf:"center"}} 
             className="rounded-3 border-1 h-25 justify-content-between bg-white d-block responsive-card mt-3">
                          <div className="card-image position-relative" style={{ maxWidth: "100%", zIndex:"99"}}>
                            <img
                              className=" w-100 object-fit-cover rounded-bottom-0 rounded-2"
                              src={course.thumbnail || defaultCourse}
                              alt=""
                              onError={(e) => {
                                // console.log(e)
                                e.target.onerror = null;
                                e.target.src = defaultCourse; // Fallback image
                              }}
                            />
            
            
                            <LikeButton size="22px" className="position-absolute" top = "2%" right = "2%" token={token} heart={course.is_favourite} id={course.id}/>
            
                          </div>
                        
                          <div className="card-details p-2" style={{ width: "100%" }}>
                            <div style={{ width: "100%" }} className="d-flex justify-content-between">
                              <div style={{width:"100%"}}>
                                {/* <h4
                                style={{ fontSize: "1.1rem", color: "#8B8B8B" }}
                                className="text-black">{course.title}</h4> */}
                                <h4
                                style={{ fontSize: "1.6rem", }}
                                className="app-text-black fw-normal">{course.title}</h4>
                                {/* <h5
                                  style={{ fontSize: "0.8rem", color: "#8B8B8B" }}
                                  className="fw-medium"
                                >
                                  {course.expert}, Desginer
                                </h5> */}
                                <h5
                                  style={{ fontSize: "0.8rem", color: "#8B8B8B" }}
                                  className="fw-normal mt-1"
                                >
                                  {course.tags}
                                </h5>
                              </div>
                        
                              <div>
                                <div
                                  // style={{ border: `2px solid ${bgColor}` }}
                                  style={{ border: `2px solid grey` }}
                                  className="rounded-2 d-flex justify-content-center align-items-center p-1"
                                >
                                  <h6 
                                  // style={{ fontSize: "0.8rem", color: bgColor, textAlign:"center" }}
                                  style={{ fontSize: "0.8rem", color: "grey", textAlign:"center" }}
                                  >
                                    {course.category}</h6>
                                </div>
                              </div>
                            </div>
                        
                            <div style={{ width: "100%" }} className="d-flex justify-content-between mt-3 h-50">
                              
                              
                              
                              <div className="d-flex gap-2 align-items-center">
                              
                              <img 
              style={{ width: "2rem", height: "2rem" }} 
              className="object-fit-cover rounded-pill" 
              src={course.expert_profile || defaultUser} 
              alt="" 
              onError={(e) => {
                // console.log(e)
                e.target.onerror = null;
                e.target.src = defaultUser; // Fallback image
              }}
            />
            
                              <div>
                                
                              <h5
                                  style={{ fontSize: "0.8rem" }}
                                  className="fw-normal app-text-black"
                                >
                                  By {profile.name}
                                </h5>
                                <div className="d-flex mt-1 gap-1 align-items-center">
                                  <h4
                                    style={{ fontSize: "1.1rem", color: "#000" }}
                                    className="fw-medium"
                                  >
                                    ${course.discounted_price}
                                  </h4>
                                  <h4
                                    style={{
                                      fontSize: "1rem",
                                      color: "#8B8B8B",
                                    }}
                                    className="fw-light text-decoration-line-through"
                                  >
                                    ${course.price}
                                  </h4>
                                </div>
                              </div>
                              </div>
            
                              
                              <div className="d-flex align-items-end">
                                <div
                                  // style={{ background: "#0C243C" }}
                                  className="d-flex app-red justify-content-center align-items-center p-2 px-3 rounded-1"
                                >
                                  <h5 style={{ fontSize: "0.8rem", color: "#fff" }} className="fw-normal">
                                    {course.is_purchased ? "Purchased" : "See Details" }
                                  
                                  </h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
          )
        }
        
      </div>
    </div>
    </>
  );
}
