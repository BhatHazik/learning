import { useEffect, useMemo, useState } from "react";
import "./UserCourses.css";
import cardImage from "../../assets/coursesCard.png";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import axios from "axios";
import toast from "react-hot-toast";
import { HashLoader, PulseLoader, SyncLoader } from "react-spinners";
import { Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSquarePlus, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import "ldrs/grid";
import "ldrs/bouncy";
import { useDispatch } from "react-redux";
import { userCartActions } from "../../Store/cartSlice";
import ReactPlayer from "react-player";
import SearchNotFound from "../../assets/searchNotFound.svg";
import LikeButton from "../../Components/Like/LikeButton";
const ShimmerCard = () => (
  <div className="card-bottom-userCourses shimmer-card-usercourses">
    <div className="shimmer-content-usercourses short"></div>
    <div className="shimmer-content-usercourses long"></div>

    <div className="shimmer-content-usercourses medium"></div>
    <div className="shimmer-content-usercourses long"></div>
  </div>
);

const Card = ({
  id,
  category,
  description,
  expert,
  price,
  discount,
  tags,
  thumbnail,
  onClick,
  carted,
  purchase,
  handleCarted,
  handlePurchase,
  video,
  title,
  heartedAPI,
  navigate,
  token,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hearted, setHearted] = useState(heartedAPI);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const location = useLocation();
 


  

  const handleFavrouite = async (e) => {
    e.stopPropagation();
    if (!token) {
      navigate("/");
    }
    try {
      setHearted(!hearted);
      await axios({
        method: "post",
        url: `${BASE_URI}/api/v1/courses/favouriteCourse/${id}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch (err) {
      toast.error("Failed to add to favorites");
    }
  };
  

  // const [isHovered, setIsHovered] = useState(false);
  // const [isMuted, setIsMuted] = useState(true); // Muted by default

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted((prevMuted) => !prevMuted);
  };

  return (
    
    <div
      className="card-bottom-userCourses"
      onMouseEnter={() => setIsHovered(true)}  // Start playing on hover
      onMouseLeave={() => setIsHovered(false)} // Stop playing when not hovered
      onClick={() => {
        if (purchase) {
          onClick(id, "Purchased");
        } else {
          onClick(id);
        }
      }}
    >

    <span style={{position:"relative"}}>
        {hearted ? (
          <FontAwesomeIcon
            onClick={handleFavrouite}
            id="heart-userCourses"
            icon={faHeart}
            style={{zIndex:"10"}}
          />
        ) : (
          <CiHeart style={{zIndex:"10"}} onClick={handleFavrouite} id="unHeart-userCourses" />
        )}

        {/* Video Thumbnail or Video Player */}
        <ReactPlayer
            url={video}
            className="tumbnail-userCourses"
            // style={{ width: "100%" }}
            playing={isHovered} // Play when hovered
            muted={isMuted} // Muted by default
            controls={false} // Hide controls
            volume={1} // Max volume when unmuted
            loop={true} // Loop the video
          />

        {/* Optional thumbnail (if you have one) */}
        {!isHovered && (
            <img
              loading="lazy"
              src={thumbnail}
              alt="Course image"
              style={{ objectFit: "cover",zIndex:"9", width: "100%", position: "absolute", top:"0"}}
            />
          )}
          {isHovered && (
            <button
              onClick={toggleMute}
              style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                background: "rgba(0, 0, 0, 0.5)",
                border: "none",
                padding: "7px",
                borderRadius: "50%",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
            </button> 
          )} 
      </span>

      <div className="middle-sec-card-userCourses">
        <div className="addCourse-card-userCourses">
          <h6>{category}</h6>
        </div>
        <div className="pricing-card-userCourses">
          <h5>{tags?.split(" ").slice(0, 2).join(" ") + "..."}</h5>
        </div>
      </div>
      <p>{expert}</p>
      <h5 style={{ fontWeight: "600" }}>{title}</h5>
      <div className="bottom-card-useruserCourses">
        <span>
          <h5>{`$${price}`}</h5>
          <h5>{`$${(price * (1 - discount / 100)).toFixed(2)}`}</h5>
        </span>
        <div
          onClick={() => {
            navigate("/userCourses/userCourseView");
            navigate(location.pathname);
          }}
        >
          {purchase ? (
            <h6>Purchased!</h6>
          ) : (
            <h6>
              {isLoading ? (
                <l-bouncy size="30" speed="1.5" color="white"></l-bouncy>
              ) : (
                "Go To Courses"
              )}
            </h6>
          )}
        </div>
      </div>
    </div>
  );
};

const UserCourses = ({ search }) => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const [initialCategory, setInitialCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  // Initialize mobile active tab (default to "Locks")
  const [mobileActiveTab, setMobileActiveTab] = useState("Locks");

  // List of category names (adjust as needed)
  const Dummycategories = [
    "Locks",
    "Guard",
    "Passing",
    "Back",
    "Half Guard",
    "Sweeps",
    "Submissions", // corrected spelling from "Submitions"
    "Paramount",
    "Closed Guard",
  ];


 const colors = ["#BF0ACF","#49AC1B"];
  const url2 = `${BASE_URI}/api/v1/category/`;
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
    refetch: refetch2,
  } = useFetch(url2, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const categories = useMemo(() => data2?.data || [], [data2]);
  console.log(categories);



  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory("All"); // Set to "All" by default
      refetch();
    }
  }, [categories]);

  const handleCategoryClick = (category) => {
    if (category === "All") {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  const url = `${BASE_URI}/api/v1/courses/userDashboard/courses?search=${search}${
    selectedCategory && selectedCategory !== "All"
      ? `&category=${selectedCategory}`
      : ""
  }`;


  const { data, error, refetch, isLoading } = useFetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const coursesData = useMemo(() => data?.data || [], [data]);
  console.log(coursesData);

  const handleNavigate = (id, status) => {
    if (!status) {
      navigate(`/userCourses/userCourseView/${id}`);
    } else if (status === "Purchased") {
      navigate(`/userPurchasedCourses/${id}`);
    }
  };

  const category = [
    {
      name: "Technology",
      imageUrl: "https://images.pexels.com/photos/943101/pexels-photo-943101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Health",
      imageUrl: "https://images.pexels.com/photos/129574/pexels-photo-129574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Education",
      imageUrl: "https://s3-alpha-sig.figma.com/img/124c/6c03/f47f6f3522d73f2cf1827ab363018fac?Expires=1740355200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=elRvbkHtMSBqSjsIcUYpVPYPvBcHoWNFwiI5pZK1ZVCT0DemvQR3HE6OXNBvjgfsXScq9R-uPud155l8jpLfAtsCnZmI7nIDS2PiVYwzBEQaYQ-clPME4IU0GxF5hztWaoY2OVgA3x1aKQdcNq8bVy7xUhl0AbMjJeaz9m16-ciNTvQ1fvUQtkFkUWTlJc7o99SeNAjzlqTt61aStU2Ou25pzavuq~TCjSYK0lKIjzKcFya~O2sHmImBeEydshJRAazuQzZ5yOzyUdgb5Y2T66VVodW-75Z5drFjC4b694p9ZJiGt7Hn0XWqm2EPVaudkPYRhe6E-r-Ir2Hhs5KNiQ__",
    },
    {
      name: "Sports",
      imageUrl: "https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Travel",
      imageUrl: "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Fashion",
      imageUrl: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Science",
      imageUrl: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Art",
      imageUrl: "https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Music",
      imageUrl: "https://images.pexels.com/photos/1762578/pexels-photo-1762578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Finance",
      imageUrl: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Nature",
      imageUrl: "https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ];

  const courses = [
    {
      id: 1,
      title: "Half Guard",
      tags: "Guard,Lock,Raid",
      category: "Guard",
      price: 199,
      originalPrice: 299,
      instructor: "John",
      is_purchased: true,
      image: "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      title: "Full Guard",
      tags: "Guard,Defence,Raid",
      category: "Defense",
      price: 149,
      originalPrice: 249,
      instructor: "Jane",
      is_purchased: false,
      image: "https://s3-alpha-sig.figma.com/img/be4d/975b/cd170440c248a676701498d87231f1d2?Expires=1740355200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Fs-bXmk3zMrGXR2N5lO5GZPHn2T3zL1TO2dOaQevZmcHRPYDAUtCna9jjzRk-3sA2E3bIjZaSgFjRT-NChoQ~fLVCohiUPOHrdcrjmAg64jeYsm5iK79V~84LzJHr1kHmhGkHy~cWur5PngHjIYTYf6agUeAfctLRjq8VNlvnRXvMh371-sdPWHbmWl70RS20LZcmtncUU0OKryofGl38YWd6IwhZFOQVUpMEKd~ANQn5sNXSWXTlJbulXWCVnBOMbcCqcv6K9t9XaKNmZrX2dfPZD~ks-7Yqo0qKsRBJHkwWPoaHttuPIsLeVZ1cFH3R37~-c5HwxSGQVo9o-~Tsw__",
      instructorImage: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      title: "Triangle Choke",
      tags: "Submission,Choke,Lock",
      category: "Submission",
      price: 179,
      originalPrice: 279,
      instructor: "Mike",
      is_purchased: true,
      image: "https://i0.wp.com/impulsemartialarts.com/wp-content/uploads/2021/06/off-balance-aikido-judo.jpg?resize=840%2C473&ssl=1",
      instructorImage: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 4,
      title: "Armbar",
      tags: "Submission,Lock,Arm",
      category: "Submission",
      price: 189,
      originalPrice: 289,
      instructor: "Emma",
      is_purchased: false,
      image: "https://images.pexels.com/photos/19406288/pexels-photo-19406288/free-photo-of-fighter-in-gym.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      instructorImage: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: 5,
      title: "Rear Naked Choke",
      tags: "Choke,Submission,Back",
      category: "Submission",
      price: 159,
      originalPrice: 259,
      instructor: "David",
      is_purchased: true,
      image: "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    {
      id: 6,
      title: "Leg Lock",
      tags: "Lock,Leg,Submission",
      category: "Submission",
      price: 199,
      originalPrice: 299,
      instructor: "Sophia",
      is_purchased: false,
      image: "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/women/6.jpg"
    },
    {
      id: 7,
      title: "Kimura Lock",
      tags: "Lock,Submission,Arm",
      category: "Submission",
      price: 169,
      originalPrice: 269,
      instructor: "Chris",
      is_purchased: true,
      image: "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/men/7.jpg"
    },
    {
      id: 8,
      title: "Guillotine Choke",
      tags: "Choke,Submission,Neck",
      category: "Submission",
      price: 179,
      originalPrice: 279,
      instructor: "Anna",
      is_purchased: false,
      image: "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/women/8.jpg"
    },
    {
      id: 9,
      title: "Omoplata",
      tags: "Lock,Submission,Shoulder",
      category: "Submission",
      price: 189,
      originalPrice: 289,
      instructor: "Tom",
      is_purchased: true,
      image: "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/men/9.jpg"
    },
    {
      id: 10,
      title: "Ezekiel Choke",
      tags: "Choke,Submission,Neck",
      category: "Submission",
      price: 199,
      originalPrice: 299,
      instructor: "Olivia",
      is_purchased: false,
      image: "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/women/10.jpg"
    }
];

  

  return (
    <>
      {/* {isLoading2 ? (
        <HashLoader size="60" color="#0c243c" id="spinner-usercourseview"/>
      ) : ( */}
        <div className="wrapper-userCourses w-100">
          
            <div className="top-userCourses ">
              <h4>Web Development</h4>
            </div>

          <div className="bottom-userCourses">
            {error?.response?.data?.message === "No courses found" ? (
              <div className="no-courses-userCourses">
                <div>
                  <h1>No Courses found with this category</h1>
                  <h5>
                    select the different category and join the world of
                    athletes!
                  </h5>
                </div>
              </div>
            ) : isLoading ? (
              Array.from({ length: 12 }).map((_, idx) => (
                <ShimmerCard key={idx} />
              ))
            ) : (
              coursesData.map((course) => (
                <Card
                  key={course.id}
                  id={course.id}
                  category={course.category}
                  title={course.title}
                  description={course.description}
                  expert={course.expert}
                  price={course.price}
                  video={course.first_lesson_video_url}
                  discount={course.discount}
                  tags={course.tags}
                  thumbnail={course.thumbnail}
                  onClick={handleNavigate}
                  purchase={course.is_purchased}
                  carted={course.in_cart}
                  heartedAPI={course.is_favourite}
                  navigate={navigate}
                  token={token}
                />
              ))
            )}
          </div>

          <div style={{zIndex:"100"}} className="top-mobileUserCourses justify-content-start mt-2 rounded-1 app-white d-flex gap-2">
          {Dummycategories.map((category, index) => (
        <h4
          key={index}
          style={{ cursor: "pointer" }}
          className={`p-1 px-2 rounded-2 fs-6 border-2 ${
            mobileActiveTab === category
              ? "app-black app-text-white border-black"
              : "border border-1 text-secondary"
          }`}
          onClick={() => setMobileActiveTab(category)}
        >
          {category}
        </h4>
      ))}
          
          </div>

          <div className="mobileUserCourses pb-5 mb-4 px-3 pt-3 gap-3">
          {/* {coursesData.length === 0 && 
              <div style={{height:"60vh"}} className="w-100 align-self-center d-flex flex-column justify-content-center align-items-center">
              <img src={SearchNotFound} alt="" className="w-75"/>
              <h5 style={{background:"#0C243C", color:"white"}} className="p-2 gap-2 d-flex fw-normal rounded-1 text-center ">Unable To Find<h5 className="text-decoration-underline"> { search}</h5></h5>
            </div>
             } */}
            {/* {coursesData.map((course, index) => { */}
            {courses.map((course, index) => {
              {/* const bgColor = colors[Math.floor(Math.random() * colors.length)];
              const image = category[index].imageUrl; */}
            return( 

              <>
             
              <div onClick={() => 
  navigate(course.is_purchased 
    ? `/userPurchasedCourses/${course.id}` 
    : `/userCourses/userCourseView/${course.id}`
  )
}
 key={index}
  style={{boxShadow: "1px 3px 7px rgba(0, 0, 0, 0.2)", width:"95%", alignSelf:"center"}} 
 className="rounded-3 border-1 h-25 justify-content-between bg-white d-block responsive-card">
              <div className="card-image position-relative" style={{ maxWidth: "100%", zIndex:"99"}}>
                <img
                  className=" w-100 object-fit-cover rounded-bottom-0 rounded-2"
                  src={course.image}
                  // src="https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg"
                  alt="Figma"
                />

                <LikeButton size="22px" className="position-absolute" top = "2%" right = "2%"/>
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
                  
                <img style={{width:"2rem", height:"2rem"}} className=" object-fit-cover rounded-pill" src={course.instructorImage} alt="" />
                  <div>
                    
                  <h5
                      style={{ fontSize: "0.8rem" }}
                      className="fw-normal app-text-black"
                    >
                      By {course.instructor}
                    </h5>
                    <div className="d-flex mt-1 gap-1 align-items-center">
                      <h4
                        style={{ fontSize: "1.1rem", color: "#000" }}
                        className="fw-medium"
                      >
                        ${course.price}
                      </h4>
                      <h4
                        style={{
                          fontSize: "1rem",
                          color: "#8B8B8B",
                        }}
                        className="fw-light text-decoration-line-through"
                      >
                        ${course.originalPrice}
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
            </>
             )}
            )}
          </div>
        </div>
      {/* )} */}
      <Outlet />
    </>
  );
};

export default UserCourses;
