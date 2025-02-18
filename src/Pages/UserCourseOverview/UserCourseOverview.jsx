import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./UserCourseOverview.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faAngleDown,
  faArrowRight,
  faCoins,
  faHeart,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FaUnlock, FaYoutube } from "react-icons/fa";
import cardImage from "../../assets/coursesCard.png";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import toast from "react-hot-toast";
import "ldrs/grid";
import "ldrs/bouncy";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import VideoPlayer from "../../Components/VideoPlayer/VideoPlayer";
import ReactPlayer from "react-player";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { loadStripe } from "@stripe/stripe-js";
import { CiHeart } from "react-icons/ci";
import { HashLoader } from "react-spinners";
import MobileVideoPlayer from "../../Components/VideoPlayer/MobilePlayer";
import { BsTwitterX, BsUnlock, BsUnlockFill } from "react-icons/bs";
import { BiLink, BiSolidLock } from "react-icons/bi";
import { RiProgress7Line } from "react-icons/ri";
import CourseDropdown from "../../Components/DropDown/ResponsiveDropdown";
import Rating from "../../Components/Rating/Rating";
// import { LineWave } from "react-spinners";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_KEY
);



const UserCourseOverview = () => {
  const [loadingItems, setLoadingItems] = useState(null);
  const [openChapters, setOpenChapters] = useState({ 0: true });
  const [responsiveOpenChapters, setResponsiveOpenChapters] = useState({ 0: true });
  const [verificationPopUp, setVerificationPopUp] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [video_url, setVideo_url] = useState("");
  const [video_thumb, setVideo_thumb] = useState("");
  const [viseo_type, setVideo_type] = useState("");
  const [hearted , setHearted] = useState(null)
  const { id } = useParams();
  const navigate = useNavigate();
  const { contextSafe } = useGSAP();

  

  const dummyCourseData = {
    courses: [
      {
        title: "Introduction",
        options: [
          { name: "Introduction to Guard", duration: "5:30" },
          { name: "Guard Basics", duration: "8:45" },
          { name: "Understanding Guard Types", duration: "6:20" }
        ],
      },
      {
        title: "Guard Arm",
        options: [
          { name: "Arm Guarding", duration: "4:20" },
          { name: "Advantages", duration: "7:10" },
          { name: "Positioning Techniques", duration: "5:45" }
        ],
      },
      {
        title: "Aim Guard Front",
        options: [
          { name: "Opponent Aim", duration: "6:15" },
          { name: "Back To Front", duration: "3:50" },
          { name: "Perfect Front Defense", duration: "7:30" }
        ],
      },
      {
        title: "Advanced Guard Techniques",
        options: [
          { name: "Counter Moves", duration: "6:55" },
          { name: "Energy Efficiency", duration: "5:40" },
          { name: "Professional Guarding", duration: "8:20" }
        ],
      },
      {
        title: "Guard Movement",
        options: [
          { name: "Defensive Mobility", duration: "7:00" },
          { name: "Agile Transitions", duration: "6:30" },
          { name: "Evading Strategies", duration: "5:50" }
        ],
      }
    ]
    
  };

  const reviews = [
    {
      id: 1,
      title: "Worth of Money",
      rating: 4,
      date: "1 day ago",
      reviewer: "Alex",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    {
      id: 2,
      title: "Great Experience",
      rating: 5,
      date: "3 days ago",
      reviewer: "Sophia",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 3,
      title: "Could be better",
      rating: 3,
      date: "1 week ago",
      reviewer: "Michael",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  ];
  


  const handleLeftToggle = (chapterIndex) => {
    setOpenChapters((prevOpenChapters) => ({
      ...prevOpenChapters,
      [chapterIndex]: !prevOpenChapters[chapterIndex],
    }));
  };

  const handleResponsiveLeftToggle = (chapterIndex) => {
    setResponsiveOpenChapters((prevOpenChapters) => ({
      ...prevOpenChapters,
      [chapterIndex]: !prevOpenChapters[chapterIndex],
    }));
  };

  function formatTime(seconds) {
    if (seconds < 60) {
      return `${seconds} sec`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} min `;
    } else {
      const hours = Math.floor(seconds / 3600);
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${hours} hr ${remainingMinutes} min `;
    }
  }

  const url = `${BASE_URI}/api/v1/courses/courseOverviewWithoutPurchase/${id}`;
  const token = localStorage.getItem("token");
  const { data, error, refetch, isLoading } = useFetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const courseData = useMemo(() => data?.data || [], [data]);

  useEffect(() => {
    setVideo_url(
      courseData?.courseChapters?.chapters[0]?.lessons[0]?.video_url
    );
    setVideo_type(
      courseData?.courseChapters?.chapters[0]?.lessons[0]?.video_type
    );
    setVideo_thumb(courseData?.course?.thumbnail);

    setSelectedLesson(
      courseData?.courseChapters?.chapters[0]?.lessons[0]?.lesson_id
    );
    setHearted(courseData?.course?.is_favourite)
  }, [courseData]);

  const chapters = useMemo(
    () => courseData?.courseChapters?.chapters || [],
    [courseData]
  );
  const paymentPopUpClick = contextSafe(() => {
    gsap.to(".paymentPopUp", {
      scale: 1,
      duration: 0.3,
      // ease: "back.in",
    });
  });
  const removePayPopUp = contextSafe(() => {
    gsap.to(".paymentPopUp", {
      scale: 0,
      duration: 0.2,
      // ease: "back.inOut",
    });
  });

  const handleVideoChange = useCallback(
    (video_url, video_thumb, lesson_id, noLesson) => {
      setVideo_url(video_url);
      setVideo_thumb(video_thumb);
      setSelectedLesson(lesson_id);
    },
    []
  );

  const handleCoinCheckout = async () => {
    if(!token){return navigate("/")}
    try {
      const response = await axios.post(
        `${BASE_URI}/api/v1/payment/purchase/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setVerificationPopUp(false);
      removePayPopUp()
      toast.success(`${response?.data?.message}`);
      navigate(`/userPurchasedCourses/${id}`)
    } catch (err) {
      setVerificationPopUp(false);
      removePayPopUp()
      toast.error(`Error: ${err?.response?.data?.message}`);
    }
  };

  const checkoutHandler = async () => {
    if(!token){return navigate("/")}
    try {
      const stripe = await stripePromise;
      // Fetch the session from your backend
      // const session = await axios(`http://localhost:3000/api/v1/payment`);
      const session = await axios(`${BASE_URI}/api/v1/payment/purchase/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({
        sessionId: session.data.session.id,
      });
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

 

  const handlePopUpcoinPurchase = ()=>{
    removePayPopUp()
    setVerificationPopUp(true)
  };

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
          // toast.error("Failed to add to favorites");
        }
      };

  return (
    <>
      
        <div 
    //     style={{
    // ...(isLoading
    //   && { justifyContent: 'center', alignItems: 'center', display: 'flex', height:'90vh' }
    //   ) }}
      className={`wrapper-userCourseview position-relative`}>
        {/* {isLoading ? (
        <HashLoader size="60" color="#0c243c"/>
        
      ) : ( */}
        <>
          {verificationPopUp && (
            <div className="popup">
              <div className="popup-content-review">
                <div className="popup-buttons-review">
                  <h5
                    style={{
                      maxHeight: "12rem",
                      border: "1px solid grey",
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      overflowY: "auto",
                      scrollbarWidth: "none",
                    }}
                  >
                    Are You Sure to buy this course!
                  </h5>
                  <button
                    onClick={() => setVerificationPopUp(false)}
                    className="cancel-button-review"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCoinCheckout}
                    className="continue-button-review"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
          <div
            style={{
              top: 0,
              left: 0,
              scale: 0, // Scale to 1 to show it at full size
              height: "100vh", // Full viewport height
              width: "100vw", // Full viewport width
              position: "fixed", // Fixed to cover the entire viewport
              zIndex: 100,
              backgroundColor: "transparent", // Ensure background color covers the area
              display: "flex", // Center the content inside
              alignItems: "center",
              justifyContent: "center",
            }}
            className="paymentPopUp"
          >
            <div
            className="payment-verify-popup"
              style={{
                zIndex: 101,
                padding: "2%",
                backgroundColor: "white",
                borderRadius: "1rem",
                height: "60%",
                
              }}
            >
              <div className="flex justify-content-between pb-3 align-items-center">
                <span>
                  <h5>Unlock this course by</h5>
                </span>
                <FontAwesomeIcon
                  onClick={removePayPopUp}
                  className="fs-5 cursor-pointer"
                  icon={faXmarkCircle}
                />
              </div>
              <div 
                style={{ height: "87%" }}
                className="rounded border flex justify-content-evenly align-items-center"
              >
                <div className="rounded flex flex-column bg-gradient-custom-div justify-content-center gap-5 w-40 p-3">
                  <h6>
                    UnLock by Coins <FontAwesomeIcon icon={faCoins} />
                  </h6>
                  <div className="flex flex-column gap-2">
                    <h2>
                      <FontAwesomeIcon icon={faCoins} />{" "}
                      {courseData?.course?.coins}
                    </h2>
                    <div onClick={handlePopUpcoinPurchase} className="rounded bg-white text-black p-2 flex justify-content-center cursor-pointer">
                      <p>Buy</p>
                    </div>
                  </div>
                </div>
                <h5>OR</h5>
                <div className="rounded flex flex-column bg-gradient-custom-div justify-content-center gap-5 w-40 p-3">
                  <h6>UnLock by payment</h6>
                  <div className="flex flex-column gap-2">
                    <h2>${courseData?.course?.price}</h2>
                    <div onClick={checkoutHandler} className="rounded bg-white text-black p-2 flex justify-content-center cursor-pointer">
                      <p>Checkout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                opacity: 0.3,
                zIndex: 100,
                top: 0,
                left: 0,
                height: "100vh", // Full viewport height
                width: "100vw", // Full viewport width
                position: "fixed", // Fixed to cover the entire viewport
                zIndex: 100,
                backgroundColor: "grey", // Ensure background color covers the area
                display: "flex", // Center the content inside
                alignItems: "center",
                justifyContent: "center",
              }}
            ></div>
          </div>
          
          <div className="top-userCourseview d-flex">
            <h3 className="text-uppercase">
              {courseData?.course?.title || "No title available"}
            </h3>

            <span className="gap-3 flex align-items-center">
              <div>
                <span className="d-flex justify-content-between align-items-center p-1">
                  <h5 style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                    <FontAwesomeIcon icon={faCoins} />{" "}
                    {courseData?.course?.coins}
                  </h5>
                </span>
                <div
                  onClick={() => setVerificationPopUp(true)}
                  style={{ width: "max-content" }}
                  className="cursor-pointer rounded bg-white d-flex justify-content-between p-2"
                >
                  <p className="text-black">
                    Checkout <FontAwesomeIcon icon={faCoins} />{" "}
                    {courseData?.course?.coins}
                  </p>
                </div>
              </div>
              <p>OR</p>
              <div>
                <span className="d-flex justify-content-between align-items-center p-1">
                  <h5
                    style={{ textDecoration: "line-through", fontSize: "1rem" }}
                  >
                    ${courseData?.course?.price || "No price available"}
                  </h5>
                  <h5 style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                    $
                    {courseData?.course?.discounted_price ||
                      "No discount available"}
                  </h5>
                </span>
                <div
                  onClick={checkoutHandler}
                  style={{ width: "max-content" }}
                  className="cursor-pointer bg-white rounded  d-flex justify-content-between p-2"
                >
                  <p className="text-black">
                    Checkout ${courseData?.course?.discounted_price}
                  </p>
                </div>
              </div>

              
            </span>

          </div>
          <div className="mid-userCourseview">
            <div className="right-mid-userCourseview p-3">
              {/* <VideoPlayer
                videoUrl={video_url}
                videoType={viseo_type}
                className="tumbnail-userCourseview"
              /> */}
              <VideoPlayer
                videoUrl={video_url}
                videoType={viseo_type}
                className="tumbnail-userCourseview"
              />


              <div className="left-bottom-mid-userCourseview second-leftuserCourse">
                <span style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
 <h4>Course Lessons</h4> 
 {hearted ? (
                <FontAwesomeIcon
                  onClick={handleFavrouite}
                  id="heart-PurchasedCourses"
                  icon={faHeart}
                  style={{ zIndex: "10" }}
                />
              ) : (
                <CiHeart
                  style={{ zIndex: "10", color: "black" }}
                  onClick={handleFavrouite}
                  id="unHeart-PurchasedCourses"
                />
              )}
                </span>
               

                <div>
                  {courseData?.courseChapters?.chapters?.length > 0 ? (
                    chapters.map((chapter, chapterIndex) => (
                      <details
                        key={chapter?.chapter_id}
                        open={
                          (chapterIndex === 0 && true) ||
                          openChapters[chapterIndex]
                        }
                        onToggle={() => handleResponsiveLeftToggle(chapterIndex)}
                      >
                        <summary>
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className={
                              openChapters[chapterIndex]
                                ? "up-icon"
                                : "down-icon"
                            }
                          />
                          <h6>
                            {chapter.chapter_no || "No chapter number"}.{" "}
                            {chapter.chapterTitle || "No chapter title"}
                          </h6>
                        </summary>
                        {chapter?.lessons.map((lesson, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (chapterIndex >= 1) {
                                // Assuming 2nd course has index 1
                                paymentPopUpClick();
                              } else {
                                handleVideoChange(
                                  lesson?.video_url,
                                  lesson?.thumbnail,
                                  lesson?.lesson_id
                                );
                              }
                            }}

                            style={{
                              cursor: "pointer",
                              color:
                                selectedLesson === lesson?.lesson_id && "red",
                            }}
                          >
                            <h6>
                              <FaYoutube
                                color="black"
                                style={{
                                  cursor: "pointer",
                                  color:
                                    selectedLesson === lesson?.lesson_id &&
                                    "red",
                                  transition: "all ease-in-out 0.5s",
                                }}
                              />
                              Lesson {idx + 1}:{" "}
                              {lesson?.lessonTitle || "No lesson title"}
                            </h6>
                            <h6>
                              {formatTime(lesson?.duration) ||
                                "No duration available"}
                            </h6>
                          </div>
                        ))}
                      </details>
                    ))
                  ) : (
                    <div>No chapters found</div>
                  )}
                </div>
              </div>

              <div className="details-right-mid-userCourseview">
                <span>

                  <div  className="overView-profile cursor-pointer"
                    onClick={() => {
                      navigate(`/UserProfile/${courseData?.course?.expert_id}`);
                    }}
                  >
                    <img
                      src={courseData?.course?.profile_picture}
                      alt="Profile"
                      style={{ width: "8%", height: "8%", borderRadius: "50%" }}
                    />
                    <h6>{courseData?.course?.name}</h6>
                  </div>


                </span>

                <span>
                  <h5>Access:</h5>
                  <h6>
                    {courseData?.course?.access || "No access information"}
                  </h6>
                </span>
                <span>
                  <h5>Enrolled:</h5>
                  <h6>{courseData?.course?.total_enrollments || 0}</h6>
                </span>
                <span>
                  <h5>Certification:</h5>
                  <h6>
                    {courseData?.course?.certification
                      ? "Yes"
                      : "No certification available"}
                  </h6>
                </span>
              </div>
              <div className="left-top-mid-userCourseview">
                <h3>Description</h3>
                <div
                  className="description-data"
                  dangerouslySetInnerHTML={{
                    __html:
                      courseData?.course?.description ||
                      "No description available",
                  }}
                ></div>
                <h4 className="cursor-pointer hover-underline overview-description">
                  Watch 3 Free Lessons to get insights of what to Learn{" "}
                  <FontAwesomeIcon icon={faArrowRight} />
                </h4>
              </div>
            </div>

            <div className="left-mid-userCourseview">
              <div className="left-bottom-mid-userCourseview new-left">
              <span style={{display:"flex", justifyContent:"space-between", width:"90%"}}>
 <h4>Course Lessons</h4> 
 {hearted ? (
                <FontAwesomeIcon
                  onClick={handleFavrouite}
                  id="heart-PurchasedCourses"
                  icon={faHeart}
                  style={{ zIndex: "10" }}
                />
              ) : (
                <CiHeart
                  style={{ zIndex: "10", color: "black" }}
                  onClick={handleFavrouite}
                  id="unHeart-PurchasedCourses"
                />
              )}
                </span>
                <div>
                  {courseData?.courseChapters?.chapters?.length > 0 ? (
                    chapters.map((chapter, chapterIndex) => (
                      <details
                        key={chapter?.chapter_id}
                        open={
                          (chapterIndex === 0 && true) ||
                          openChapters[chapterIndex]
                        }
                        onToggle={() => handleLeftToggle(chapterIndex)}
                      >
                        <summary>
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className={
                              openChapters[chapterIndex]
                                ? "up-icon"
                                : "down-icon"
                            }
                          />
                          <h6>
                            {chapter.chapter_no || "No chapter number"}.{" "}
                            {chapter.chapterTitle || "No chapter title"}
                          </h6>
                        </summary>
                        {chapter?.lessons.map((lesson, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (chapterIndex >= 1) {
                                // Assuming 2nd course has index 1
                                paymentPopUpClick();
                              } else {
                                handleVideoChange(
                                  lesson?.video_url,
                                  lesson?.thumbnail,
                                  lesson?.lesson_id
                                );
                              }
                            }}

                            style={{
                              cursor: "pointer",
                              color:
                                selectedLesson === lesson?.lesson_id && "red",
                            }}
                          >
                            <h6>
                              <FaYoutube
                                color="black"
                                style={{
                                  cursor: "pointer",
                                  color:
                                    selectedLesson === lesson?.lesson_id &&
                                    "red",
                                  transition: "all ease-in-out 0.5s",
                                }}
                              />
                              Lesson {idx + 1}:{" "}
                              {lesson?.lessonTitle || "No lesson title"}
                            </h6>
                            <h6>
                              {formatTime(lesson?.duration) ||
                                "No duration available"}
                            </h6>
                          </div>
                        ))}
                      </details>
                    ))
                  ) : (
                    <div>No chapters found</div>
                  )}
                </div>
              </div>

              <div className="ratings-right-mid-userCourseview">
                <h5>Reviews & Ratings:</h5>
                <div className="map-ratings-right-mid-userCourseview">
                  {courseData?.review?.userReviews?.length > 0 ? (
                    courseData.review.userReviews.map((review, index) => (
                      <div key={index}>
                        <div>
                          {review?.profile_picture ? (
                            <img
                              loading="lazy"
                              src={review?.profile_picture}
                              alt="profile image"
                            />
                          ) : (
                            <FaUserCircle className="fs-1" />
                          )}
                          <h5>{review?.name || "No name available"}</h5>
                          <p>
                            {review?.review_date
                              ? review?.review_date.split("T")[0]
                              : "No review date"}
                          </p>
                        </div>
                        <div>
                          <span>
                            {[...Array(5)].map((_, i) =>
                              i < review.rating ? (
                                <AiFillStar key={i} className="staricon" />
                              ) : (
                                <AiOutlineStar key={i} className="staricon" />
                              )
                            )}
                          </span>
                          <p>{review.comment || "No comment available"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No reviews available!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-userCourseview">
            <h3>Other Courses You Might Like</h3>
            <div className="cards-userCourseview">
              {courseData?.other_courses?.length > 0 ? (
                courseData.other_courses.map((course, index) => (
                  <div
                    onClick={() =>
                      course?.is_purchased
                        ? navigate(`/userPurchasedCourses/${course?.id}`)
                        : course?.is_in_cart
                        ? navigate("/userCart")
                        : navigate(`/userCourses/userCourseView/${course?.id}`)
                    }
                    className="card-bottom-userCourseview"
                    key={index}
                  >
                    <span>
                      {" "}
                      <img
                        src={course?.thumbnail || cardImage}
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
                        {/* <h5>$10.99</h5> */}
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
                        {loadingItems === course?.id ? (
                          <l-bouncy
                            size="35"
                            speed="1.2"
                            color="white"
                          ></l-bouncy>
                        ) : course?.is_purchased ? (
                          <h6>Purchased!</h6>
                        ) : (
                          <h6>Go to courses</h6>
                        )}
                      </div>
                      {/* <div onClick={() => handleCart(course?.id)}>{loadingItems[course?.id] ? <PulseLoader size={8} color="white"/> :<h6> Add to Cart </h6>}</div> */}
                    </div>
                  </div>
                ))
              ) : (
                <p>No other courses available!</p>
              )}
            </div>
          </div>
          </>
          {/* )} */}
        </div>



        <div className="mobile-PurchasedCourse px-1 w-100 position-relative ">
         
          <MobileVideoPlayer
                videoUrl="https://videos.pexels.com/video-files/6266890/6266890-uhd_2560_1440_30fps.mp4"
                videoType={viseo_type}
                className="w-100 rounded-3"
              />
        
        <div style={{marginBottom:"65px"}} className="app-white mx-2 p-2 px-2 rounded-3 d-flex flex-column gap-2">
          <div className="d-flex justify-content-between">

          <h3 className="fs-3 fw-medium ">Half Guard</h3>
          <div className="p-1 px-2 app-black rounded-1 d-flex justify-content-between align-items-center">
            <h6 className="fs-6 fw-medium app-text-white d-flex gap-2">Unlock <BiSolidLock className="fs-5 fw-medium app-text-white"/></h6>
          
          </div>
          </div>
          {dummyCourseData.courses.map((course, index) => (
        <CourseDropdown
          key={index}
          course={course}
          placeholder="Select a course option"
          // onSelect={handleSelection}
        />
      ))}

      <div className="mt-1 p-2 rounded-1 border border-1">
        <h5 style={{width:"max-content"}} className="fs-6 fw-normal app-text-white rounded-1 app-black p-1 px-2">Description</h5>
        <p style={{lineHeight:"1.3rem"}}className="text-start fs-6 fw-light app-text-black mt-1">Half guard is a grappling position where the bottom fighter controls one of the opponent’s legs while keeping the other free. It provides both defensive and offensive opportunities, allowing sweeps, submissions, or transitions to a better position. Mastering half guard is essential for maintaining control and setting up strategic moves in Brazilian Jiu-Jitsu and MMA.</p>
        <span className="d-flex fw-medium gap-1 pt-1"><p>Ratings:</p> <p className="fw-normal">13,786</p></span>
        <span className="d-flex fw-medium gap-1 pt-1"><p>Students:</p> <p className="fw-normal">98,786</p></span>
        <span className="d-flex fw-medium gap-1 pt-1"><p>Duration:</p> <p className="fw-normal">8 hours Total</p></span>

 
      <div>
      <h5 style={{width:"max-content"}} className="fs-6 fw-normal app-text-white rounded-1 app-black p-1 px-2 mt-2">Expert</h5>
      <div className="d-flex mt-2 align-items-center gap-2">
        <img
        style={{borderRadius:"50%", width:"3.5rem", height:"3.5rem", objectFit:"cover"}}
        className=""
        src="https://randomuser.me/api/portraits/men/1.jpg" alt="" />
        <div>
          <h6 className="fs-5 fw-normal app-text-black d-flex gap-2">John</h6>
          <p className="fs-6 fw-light app-text-black">Coach JiuJitsu</p>
        </div>
      </div>
      <div style={{width:"max-content"}} className="d-flex gap-2 p-1 px-2 align-items-center mt-1">
        <BsTwitterX className="fs-3 app-text-white app-black p-1 rounded-1"/>
        <FaYoutube className="fs-3 app-text-white app-black p-1 rounded-1"/>
        <BiLink className="fs-3 app-text-white app-black p-1 rounded-1"/>
      </div>
      <p className="fs-6 fw-light app-text-black">
      I am a Jiu-Jitsu expert Jhon with years of experience mastering the art of grappling, control, and submissions. My game is built on precision, strategy, and adaptability, allowing me to dominate opponents using technique rather than brute strength. Whether it’s teaching, competing, or refining my craft, I constantly push my limits to evolve as a martial artist.
      </p>
      </div>
      <h5 style={{width:"max-content"}} className="fs-6 fw-normal app-text-white rounded-1 app-black p-1 px-2 mt-2">Reviews & Ratings</h5>

      {reviews.map((review) => (
  <div key={review.id} className="p-1 mt-2 border border-1 rounded-2 d-flex gap-2">
    <img
      style={{ width: "2.7rem", height: "2.7rem", objectFit: "cover" }}
      className="rounded-2"
      src={review.avatar}
      alt={review.reviewer}
    />
    <div className="w-100">
      <div className="d-flex justify-content-between w-100">
        <h6 style={{ fontSize: "1rem" }} className="fw-normal app-text-black d-flex gap-2">
          {review.title}
        </h6>
        <p style={{ fontSize: "0.8rem", color: "grey" }} className="fw-normal app-text-black align-self-start pe-1">
          {review.date}
        </p>
      </div>
      <div className="d-flex justify-content-between w-100">
        <Rating initialRating={review.rating} size="1em" disabled={true} name={`rating-${review.id}`}/>
        <p style={{ fontSize: "0.8rem", color: "grey" }} className="fw-normal app-text-black align-self-end pe-2">
          ~ {review.reviewer}
        </p>
      </div>
    </div>
  </div>
))}

      </div>
        </div>
          
          </div>
      
    </>
  );
};

export default UserCourseOverview;
