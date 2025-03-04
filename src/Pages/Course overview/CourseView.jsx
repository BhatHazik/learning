import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../UserCourseOverview/UserCourseOverview.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faAngleDown,
  faArrowRight,
  faCoins,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FaYoutube } from "react-icons/fa";
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
import { HashLoader } from "react-spinners";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_KEY
);

const CourseView = ({ setEditCourse, setCourseId }) => {
  const [loadingItems, setLoadingItems] = useState(null);
  const [openChapters, setOpenChapters] = useState({ 0: true });
  const [verificationPopUp, setVerificationPopUp] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [video_url, setVideo_url] = useState("");
  const [video_thumb, setVideo_thumb] = useState("");
  const [viseo_type, setVideo_type] = useState("");
  const [responsiveOpenChapters, setResponsiveOpenChapters] = useState({ 0: true });
  const { id } = useParams();
  const navigate = useNavigate();
  const { contextSafe } = useGSAP();
  const token = localStorage.getItem("token");
const userType = localStorage.getItem("userType");
  const handleLeftToggle = (chapterIndex) => {
    setOpenChapters((prevOpenChapters) => ({
      ...prevOpenChapters,
      [chapterIndex]: !prevOpenChapters[chapterIndex],
    }));
  };

  function formatTime(seconds) {
    if (seconds < 60) {
      return `${seconds} s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      // const remainingSeconds = seconds % 60;
      return `${minutes} m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      
      const remainingMinutes = Math.floor((seconds % 3600) / 60);

      // const remainingSeconds = seconds % 60;
      return `${hours} h ${remainingMinutes === 0 ? "" : remainingMinutes} ${remainingMinutes === 0 ? "" : "m"}`;
    }
  }

  const ratingsurl = `${BASE_URI}/api/v1/reviews/totalReview/${id}`;
  // const token = localStorage.getItem("token");
  const {
    data: ratingsdata,
    ratingerror,
    ratingrefetch,
    ratingisLoading,
  } = useFetch(ratingsurl, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const ratings = useMemo(() => ratingsdata?.data || [], [ratingsdata]);
  

  const url = `${BASE_URI}/api/v1/courses/courseOverview/${id}`;

  const { data, isLoading, error, refetch } = useFetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  //  setData(data.data[0]);
 
  const Chapters = useMemo(() => data?.data?.chapters || [], [data]);
 
  const url2 = `${BASE_URI}/api/v1/courses/${id}`;
  // const token2 = localStorage.getItem("token");
  const {
    data: data2,
    isLoading2,
    error: error2,
    refetch2,
  } = useFetch(url2, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
 

  const courseData = useMemo(() => data2?.data || [], [data2]);

  useEffect(() => {
    setVideo_url(Chapters[0]?.lessons[0]?.video_url);
    setVideo_type(Chapters[0]?.lessons[0]?.video_type);
    setVideo_thumb(Chapters[0]?.course?.thumbnail);

    setSelectedLesson(Chapters[0]?.lessons[0]?.lesson_id);
  }, [Chapters]);

  const paymentPopUpClick = contextSafe(() => {
  
    gsap.to(".paymentPopUp", {
      scale: 1,
      duration: 0.3,
      ease: "back.in",
    });
  });
  const removePayPopUp = contextSafe(() => {
    
    gsap.to(".paymentPopUp", {
      scale: 0,
      duration: 0.4,
      ease: "back.inOut",
    });
  });

  // const handleResponsiveLeftToggle = (chapterIndex) => {
  //   setResponsiveOpenChapters((prevOpenChapters) => ({
  //     ...prevOpenChapters,
  //     [chapterIndex]: !prevOpenChapters[chapterIndex],
  //   }));
  // };

  const handleVideoChange = useCallback(
    (video_url, video_thumb, lesson_id, noLesson) => {
      setVideo_url(video_url);
      setVideo_thumb(video_thumb);
      setSelectedLesson(lesson_id);
    },
    []
  );

  const handleCoinCheckout = async () => {
    try {
      const response = await axios.post(
        `${BASE_URI}/api/v1/payment/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setVerificationPopUp(false);
      toast.success(`${response?.data?.message}`);
    } catch (err) {
      setVerificationPopUp(false);
      toast.error(`Error: ${err?.response?.data?.message}`);
    }
  };

  const handleEditCourse = () => {
    setEditCourse(true);
    setCourseId(id);
    navigate(`/courses/addLesson/${id}`);
  };

  async function handleSendApproval() {
   
    try {
      await axios.post(
        `${BASE_URI}/api/v1/expert/reviewRequest`,
        { course_id: id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success("Course sent for approval successfully!");
    } catch (err) {
    
      toast.error(err?.response?.data?.message);
    }
  }

  const checkoutHandler = async () => {
    try {
      const stripe = await stripePromise;
      // Fetch the session from your backend
      // const session = await axios(`http://localhost:3000/api/v1/payment`);
      const session = await axios(`${BASE_URI}/api/v1/payment/${id}`, {
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

  const handleResponsiveLeftToggle = (chapterIndex) => {
    setResponsiveOpenChapters((prevOpenChapters) => ({
      ...prevOpenChapters,
      [chapterIndex]: !prevOpenChapters[chapterIndex],
    }));
  };

  return (
    <>
      {isLoading ? (
        <HashLoader size="60" color="#0c243c" id="spinner-usercourseview"/>
      ) : (
        <div className="wrapper-userCourseview position-relative">
          {verificationPopUp && (
            <div className="popup ">
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
              style={{
                zIndex: 101,
                padding: "2%",
                backgroundColor: "white",
                borderRadius: "1rem",
                height: "60%",
                width: "50%",
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
                  </div>
                </div>
                <h5>OR</h5>
                <div className="rounded flex flex-column bg-gradient-custom-div justify-content-center gap-5 w-40 p-3">
                  <h6>UnLock by payment</h6>
                  <div className="flex flex-column gap-2">
                    <h2>${courseData?.course?.price}</h2>
                    <div className="rounded bg-white text-black p-2 flex justify-content-center cursor-pointer">
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
              {courseData[0]?.title || "No title available"}
            </h3>

            <span className="gap-3 flex align-items-center">
              <div>
                <span className="d-flex justify-content-between align-items-center p-1">
                  <h5 style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                    <FontAwesomeIcon icon={faCoins} />{" "}
                    {courseData[0]?.coins}
                  </h5>
                </span>
              </div>
              <p>OR</p>
              <div>
                <span className="d-flex justify-content-center gap-2 align-items-center p-1">
                  <h5
                    style={{ textDecoration: "line-through", fontSize: "1rem" }}
                  >
                    $
                    {courseData[0]?.price || "No price available"}
                  </h5>
                  <h5 style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                    $
                    {courseData[0]?.discounted_price ||
                      "No discount available"}
                  </h5>
                </span>
                
              </div>
            </span>
            {
            
            courseData[0]?.status === "approved" ? (
                  <div className="edit-course-expert" onClick={handleEditCourse} style={{background:"white", borderRadius:"0.4rem", display:"flex", justifyContent:"center", alignItems:"center", paddingLeft:"1rem",paddingRight:"1rem" , cursor:"pointer"}}>
                    <h6 style={{ color:"black"}}>Edit Course</h6>
                  </div>
                ) : (
                  userType !== "admin" &&
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      position: "relative",
                      transition: "all 0.5s ease-in-out",
                      width: "30%",
                      height: "100%",
                      // backgroundColor:"blue"
                    }}
                  >
                    <div  style={{background:"white", borderRadius:"0.4rem", display:"flex", justifyContent:"center", alignItems:"center", padding:"0.3rem 1rem" , cursor:"pointer"}} onClick={handleSendApproval}>
                      <h6 style={{ color: "black" }}>Send Approval Request</h6>
                    </div>

                    <div onClick={handleEditCourse} style={{background:"white", borderRadius:"0.4rem", display:"flex", justifyContent:"center", alignItems:"center", padding:"0.3rem 1rem" , cursor:"pointer"}}>
                      <h6 style={{ color: "black" }}>Edit Course</h6>
                    </div>
                  </span>
                )}
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
 
                </span>
               
                <div>
                {Chapters?.length > 0 ? (
                    Chapters?.map((chapter, chapterIndex) => (
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
                            onClick={() =>
                              handleVideoChange(
                                lesson?.video_url,
                                lesson?.thumbnail,
                                lesson?.lesson_id
                              )
                            }
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
                            <h6 >
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

              {/* second */}
              <div className="left-bottom-mid-userCourseview  second-leftuserCourse">
                <h4>Course Lessons</h4>
                <div>
                  {Chapters?.length > 0 ? (
                    Chapters?.map((chapter, chapterIndex) => (
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
                            onClick={() =>
                              handleVideoChange(
                                lesson?.video_url,
                                lesson?.thumbnail,
                                lesson?.lesson_id
                              )
                            }
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
              <div  className="overView-profile cursor-pointer"
                    onClick={() => {
                      navigate(`/UserProfile/${courseData[0]?.expert_id}`);
                    }}
                  >
                    <img
                      src={courseData[0]?.profile_picture}
                      alt="Profile"
                      style={{ width: "8%", height: "8%", borderRadius: "50%" }}
                    />
                    <h6>{courseData[0]?.name}</h6>
                  </div>

                <span>
                  <h5>Access:</h5>
                  <h6>{courseData[0]?.access || "No access information"}</h6>
                </span>
                <span>
                  <h5>Enrolled:</h5>
                  <h6>{courseData[0]?.total_enrollments || 0}</h6>
                </span>
                <span>
                  <h5>Certification:</h5>
                  <h6>
                    {courseData[0]?.certification
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
                      courseData[0]?.description || "No description available",
                  }}
                ></div>
              </div>
            </div>

            <div className="left-mid-userCourseview">
              <div className="left-bottom-mid-userCourseview new-left">
                <h4>Course Lessons</h4>
                <div>
                  {Chapters?.length > 0 ? (
                    Chapters?.map((chapter, chapterIndex) => (
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
                            onClick={() =>
                              handleVideoChange(
                                lesson?.video_url,
                                lesson?.thumbnail,
                                lesson?.lesson_id
                              )
                            }
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
                            <h6 style={{ width:"6rem", display:"flex", justifyContent:"end"}}>
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
                  {ratings?.result?.length > 0 ? (
                    ratings?.result?.map((review, index) => (
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
        </div>
      )}
    </>
  );
};

export default CourseView;

// import { useMemo, useState, useEffect } from "react";
// import "./CourseView.css";
// import videoPlayer from "../../assets/videoPlayer.png";
// import profile from "../../assets/profile.png";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faAngleDown,
//   faChevronLeft,
//   faChevronRight,
//   faStar,
// } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate, useParams } from "react-router-dom";
// import useFetch from "../../hooks/useFetch";
// import { BASE_URI } from "../../Config/url";
// import { SyncLoader } from "react-spinners";
// import "ldrs/grid";
// import axios from "axios";
// import VideoPlayer from "../../Components/VideoPlayer/VideoPlayer";
// import { FaChevronRight } from "react-icons/fa";
// import ReactPlayer from "react-player";
// import toast from "react-hot-toast";

// const CourseView = ({ setEditCourse, setCourseId }) => {
//   const { id } = useParams();
//   console.log(id);
//   const [buttonPick, setButtonPick] = useState("Overview");
//   const [openDetails, setOpenDetails] = useState({});
//   const [openChapters, setOpenChapters] = useState({ 0: true });
//   const [video_url, setVideo_url] = useState("");
//   const [video_type, setVideo_type] = useState("");
//   const [video_thumb, setVideo_thumb] = useState("");
//   const [selectedLesson, setSelectedLesson] = useState("");
//   const [reviewData, setReviewData] = useState(null);
//   const [reviewsLoading, setReviewsLoading] = useState(false);
//   const [videosResponsive, setVideosResponsive] = useState(true);
//   const navigate = useNavigate();

//   const profile_picture = localStorage.getItem("profile_picture");

//   const handleButtonToggle = async (event) => {
//     const text = event.currentTarget.querySelector("h5").textContent;
//     setButtonPick(text);

//     if (text === "Reviews") {
//       setReviewsLoading(true);
//       try {
//         const url = `${BASE_URI}/api/v1/reviews/totalReview/${id}`;
//         const response = await axios({
//           method: "GET",
//           url,
//           headers: {
//             Authorization: "Bearer " + token,
//           },
//         });
//         // const reviews = useMemo(() => response?.data?.data || [], [response?.data?.data]);
//         setReviewData(response.data);
//         console.log(reviewData.data);
//         setReviewsLoading(false);
//       } catch (error) {
//         console.error(error);
//         setReviewsLoading(false);
//       }
//     }
//   };

//   const handleToggle = (index) => {
//     setOpenDetails((prevState) => ({
//       ...prevState,
//       [index]: !prevState[index],
//     }));
//     // console.log()
//   };
//   const handleLeftToggle = (chapterIndex) => {
//     console.log(chapterIndex);
//     setOpenChapters((prevOpenChapters) => ({
//       ...prevOpenChapters,
//       [chapterIndex]: !prevOpenChapters[chapterIndex],
//     }));
//   };

//   function formatTime(seconds) {
//     if (seconds < 60) {
//       return `${seconds} sec`;
//     } else if (seconds < 3600) {
//       const minutes = Math.floor(seconds / 60);
//       const remainingSeconds = seconds % 60;
//       return `${minutes} min ${remainingSeconds} sec`;
//     } else {
//       const hours = Math.floor(seconds / 3600);
//       const remainingMinutes = Math.floor((seconds % 3600) / 60);
//       const remainingSeconds = seconds % 60;
//       return `${hours} hr ${remainingMinutes} min ${remainingSeconds} sec`;
//     }
//   }

//   const url = `${BASE_URI}/api/v1/courses/courseOverview/${id}`;
//   const token = localStorage.getItem("token");
//   const { data, isLoading, error, refetch } = useFetch(url, {
//     headers: {
//       Authorization: "Bearer " + token,
//     },
//   });
//   //  setData(data.data[0]);
//   //  console.log(data);
//   const courseData = useMemo(() => data?.data?.chapters || [], [data]);
// console.log(courseData);
//   const url2 = `${BASE_URI}/api/v1/courses/${id}`;
//   // const token2 = localStorage.getItem("token");
//   const {
//     data: data2,
//     isLoading2,
//     error: error2,
//     refetch2,
//   } = useFetch(url2, {
//     headers: {
//       Authorization: "Bearer " + token,
//     },
//   });
//   console.log(data2)

//   const courseData2 = useMemo(() => data2?.data || [], [data2]);
//   // console.log(courseData2[0]?.status)
//     // console.log(courseData[0]?.lessons[0]?.video_url);

//   useEffect(() => {
//     setVideo_url(courseData[0]?.lessons[0]?.video_url);
//     setVideo_type(courseData[0]?.lessons[0]?.video_type);
//     setVideo_thumb(courseData[0]?.lessons[0]?.thumbnail);
//     setSelectedLesson(courseData[0]?.lessons[0]?.lesson_id);
//     // console.log(video_url);
//   }, [courseData]);

//   const handleVideoChange = (video_url, video_thumb, lesson_id) => {
//     setVideo_url(video_url);
//     setVideo_thumb(video_thumb);
//     setSelectedLesson(lesson_id);
//     // refetch();
//   };

//   const handleEditCourse = () => {
//     setEditCourse(true);
//     setCourseId(id);
//     navigate(`/courses/addLesson/${id}`);
//   };

//   async function handleSendApproval(){
//     console.log(id)
//     try {
//       await axios.post(`${BASE_URI}/api/v1/expert/reviewRequest`,
//         {course_id: id},
//         {
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       });
//       toast.success("Course sent for approval successfully!");
//     } catch (err) {
//       console.log(err)
//       toast.error(err?.response?.data?.message);
//     }
//   }

//   return (
//     <>
//       {error2?.response?.data?.message === "No courses found" ? (
//         <h1>No courses found</h1>
//       ) : isLoading2 || isLoading ? (
//         <l-grid
//           id="spinner-usercourseview"
//           size="60"
//           speed="1.5"
//           color="black"
//         ></l-grid>
//       ) : (
//         <div className="wrapper-courseview">
//           <div className="top-courseview">
//             <h4>Course Overview</h4>

//               {
//                 courseData2[0]?.status === "approved" ?
//                 <div >
//               <h6 onClick={handleEditCourse}>Edit Course</h6>

//             </div>
//             :
//             <span
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 position: "relative",
//                 transition: "all 0.5s ease-in-out",
//                 width:"30%",
//                 height:"100%",
//                 // backgroundColor:"blue"
//               }}
//             >
//               <div onClick={handleSendApproval}>
//                 <h6 style={{ color:"black"}}>Send Approval Request</h6>
//               </div>

//               <div >
//               <h6 onClick={handleEditCourse}>Edit Course</h6>

//             </div>
//             </span>

//               }

//           </div>
//           <div className="bottom-courseview">
//             <div className="left-bottom-courseview">
//               <div className="video-container-purchasedCourse">
//                 {video_type === "youtube" ? (
//                   <ReactPlayer
//                     url={video_url}
//                     className="tumbnail-purchasedCourse"
//                     style={{ width: '100%', height: '0' }}
//                     controls={true}
//                   />
//                 ) : (
//                   <video
//                     src={video_url}
//                     className="tumbnail-Courseview"
//                     style={{ width: '100%', height: 'auto' }}
//                     controls
//                   >
//                     Your browser does not support the video tag.
//                   </video>
//                 )}
//                 {/* <video
//                   src={video_url}
//                   controls
//                   muted
//                   loop
//                   poster={video_thumb}
//                   preload="auto"
//                 >
//                   Your browser does not support the video tag.
//                 </video> */}
//               </div>
//               <span>
//                 <h5 className="text-uppercase">{courseData2[0]?.title} :</h5>
//                 <h6
//                   dangerouslySetInnerHTML={{
//                     __html:
//                       courseData2[0]?.description
//                         ?.split(" ")
//                         .slice(0, 11)
//                         .join(" ") + "...",
//                   }}
//                 ></h6>
//               </span>
//               <div className="videoCreator-courseview"   onClick={() => {

//                       navigate(`/UserProfile/${courseData2[0]?.expert_id}`);

//                     }}>
//                 <img src={profile_picture || profile} alt="profile" />
//                 <h6 className="text-uppercase">{courseData2[0]?.name}</h6>
//               </div>
//               <div className="buttons-courseview">
//                 <div className="buttons-holder">
//                   {
//                     <div
//                       className={
//                         buttonPick === "Overview"
//                           ? "button-triangle"
//                           : "no-button-triangle"
//                       }
//                     ></div>
//                   }
//                   <div
//                     onClick={handleButtonToggle}
//                     className={
//                       buttonPick === "Overview"
//                         ? "button-courseview"
//                         : "not-button-courseview"
//                     }
//                   >
//                     <h5>Overview</h5>
//                   </div>
//                 </div>
//                 <div className="buttons-holder">
//                   {
//                     <div
//                       className={
//                         buttonPick === "FAQ"
//                           ? "button-triangle"
//                           : "no-button-triangle"
//                       }
//                     ></div>
//                   }
//                   <div
//                     onClick={handleButtonToggle}
//                     className={
//                       buttonPick === "FAQ"
//                         ? "button-courseview"
//                         : "not-button-courseview"
//                     }
//                   >
//                     <h5>FAQ</h5>
//                   </div>
//                 </div>
//                 <div className="buttons-holder">
//                   {
//                     <div
//                       className={
//                         buttonPick === "Reviews"
//                           ? "button-triangle"
//                           : "no-button-triangle"
//                       }
//                     ></div>
//                   }
//                   <div
//                     onClick={handleButtonToggle}
//                     className={
//                       buttonPick === "Reviews"
//                         ? "button-courseview"
//                         : "not-button-courseview"
//                     }
//                   >
//                     <h5>Reviews</h5>
//                   </div>
//                 </div>
//                 <div className="line-courseview"></div>
//               </div>
//               <div className="course-details-courseview">
//                 {buttonPick === "Overview" && (
//                   <>
//                     <h5>Course Title:</h5>
//                     <h6>{courseData2[0]?.title}</h6>
//                     <h5>Course Duration:</h5>
//                     <h6>{formatTime(courseData2[0]?.total_duration)}</h6>
//                     <h5>Course Description:</h5>
//                     <h6
//                       dangerouslySetInnerHTML={{
//                         __html: courseData2[0]?.description,
//                       }}
//                     ></h6>
//                   </>
//                 )}
//                 {buttonPick === "FAQ" && (
//                   <>
//                     {[0, 1, 2].map((index) => (
//                       <details
//                         key={index}
//                         open={!!openDetails[index]}
//                         onToggle={() => handleToggle(index)}
//                       >
//                         <summary>
//                           <FontAwesomeIcon
//                             icon={faAngleDown}
//                             className={
//                               openDetails[index] ? "up-icon" : "down-icon"
//                             }
//                           />
//                           How does the free trail work?
//                         </summary>
//                         <p>
//                           In order to get the course certificate please make
//                           sure you complete all the assignments
//                         </p>
//                       </details>
//                     ))}
//                   </>
//                 )}

//                 {buttonPick === "Reviews" && (
//                   <div className="ratings-courseview">
//                     {reviewsLoading ? (
//                       <l-grid
//                         id="reviews-loading"
//                         size="60"
//                         speed="1.5"
//                         color="black"
//                       ></l-grid>
//                     ) : (
//                       <>
//                         <div className="left-ratings-courseview">
//                           <h6>Average Reviews</h6>
//                           <h5>{reviewData?.data?.averageRating}</h5>
//                           <span>
//                             {[
//                               ...Array(
//                                 Math.floor(reviewData?.data?.averageRating)
//                               ),
//                             ].map((_, index) => (
//                               <FontAwesomeIcon
//                                 key={index}
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                             ))}
//                           </span>
//                           <h6>Ratings</h6>
//                         </div>
//                         <div className="right-ratings-courseview">
//                           <h6>Detailed Ratings</h6>
//                           <div>
//                             <h6>{Math.floor(reviewData?.data?.ratingPercentages[5])}%</h6>
//                             <span>
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                             </span>
//                             <div>
//                               <div
//                                 style={{
//                                   width: `${reviewData?.data?.ratingPercentages[5]}%`,
//                                 }}
//                                 className="fifty-rating-courseview"
//                               ></div>
//                             </div>
//                           </div>
//                           <div>
//                             <h6>{Math.floor(reviewData?.data?.ratingPercentages[4])}%</h6>
//                             <span>
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                             </span>
//                             <div>
//                               <div
//                                 style={{
//                                   width: `${reviewData?.data?.ratingPercentages[4]}%`,
//                                 }}
//                                 className="fourty-rating-courseview"
//                               ></div>
//                             </div>
//                           </div>
//                           <div>
//                             <h6>{Math.floor(reviewData?.data?.ratingPercentages[3])}%</h6>
//                             <span>
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                             </span>
//                             <div>
//                               <div
//                                 style={{
//                                   width: `${reviewData?.data?.ratingPercentages[3]}%`,
//                                 }}
//                                 className="thirty-rating-courseview"
//                               ></div>
//                             </div>
//                           </div>
//                           <div>
//                             <h6>{Math.floor(reviewData?.data?.ratingPercentages[2])}%</h6>
//                             <span>
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                             </span>
//                             <div>
//                               <div
//                                 style={{
//                                   width: `${reviewData?.data?.ratingPercentages[2]}%`,
//                                 }}
//                                 className="twenty-rating-courseview"
//                               ></div>
//                             </div>
//                           </div>
//                           <div>
//                             <h6>{Math.floor(reviewData?.data?.ratingPercentages[1])}%</h6>
//                             <span>
//                               <FontAwesomeIcon
//                                 icon={faStar}
//                                 className="staricon"
//                               />
//                             </span>
//                             <div>
//                               <div
//                                 style={{
//                                   width: `${reviewData?.data?.ratingPercentages[1]}%`,
//                                 }}
//                                 className="ten-rating-courseview"
//                               ></div>
//                             </div>
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div
//               className={
//                 !videosResponsive
//                   ? "right-bottom-courseviewClosed"
//                   : "right-bottom-courseview"
//               }
//             >
//               <span
//                 onClick={() => setVideosResponsive(!videosResponsive)}
//                 id="videoResponsiveContainer"
//               >
//                 {videosResponsive ? (
//                   <FontAwesomeIcon
//                     id="videosResponsiveIcon"
//                     icon={faChevronRight}
//                   />
//                 ) : (
//                   <FontAwesomeIcon
//                     id="videosResponsiveIcon"
//                     icon={faChevronLeft}
//                   />
//                 )}
//               </span>

//               <div className="heading-bottom-courseview">
//                 <h5>Course Content</h5>
//                 <h6>
//                   Lecture ({courseData2[0]?.total_lesson}) Total (
//                   {formatTime(courseData2[0]?.total_duration)})
//                 </h6>
//               </div>

//               <div className="right-bottom-options-courseView">
//                 {courseData.length === 0 ? (
//                   <h5>No chapters found!</h5>
//                 ) : isLoading ? (
//                   <SyncLoader />
//                 ) : (
//                   courseData.map((chapter, chapterIndex) => (
//                     <details
//                       key={chapter?.chapter_id}
//                       open={
//                         (chapterIndex === 0 && true) ||
//                         openChapters[chapterIndex]
//                       }
//                       onToggle={() => handleLeftToggle(chapterIndex)}
//                     >
//                       <summary>
//                         <FontAwesomeIcon
//                           icon={faAngleDown}
//                           className={
//                             openChapters[chapterIndex] ? "up-icon" : "down-icon"
//                           }
//                         />
//                         <h5>
//                           Section {chapter?.chapter_no} |{" "}
//                           {chapter?.chapterTitle
//                             ?.split(" ")
//                             .slice(0, 3)
//                             .join(" ")}
//                         </h5>
//                         <h6>
//                           {chapter?.totalLessons} Videos |{" "}
//                           {formatTime(chapter?.totalDuration)}
//                         </h6>
//                       </summary>
//                       {chapter?.lessons.map((lesson) => (
//                         <div key={lesson?.lesson_id}>
//                           <input type="checkbox" />

//                           <span
//                             onClick={() =>
//                               handleVideoChange(
//                                 lesson?.video_url,
//                                 lesson?.thumbnail,
//                                 lesson?.lesson_id
//                               )
//                             }
//                             style={{
//                               cursor: "pointer",
//                               color:
//                                 selectedLesson === lesson?.lesson_id && "red",
//                             }}
//                           >
//                             <h6
//                               style={{
//                                 cursor: "pointer",
//                                 color:
//                                   selectedLesson === lesson?.lesson_id
//                                     ? "red"
//                                     : "black",
//                               }}
//                             >
//                               {lesson?.lessonTitle}
//                             </h6>
//                             <h6>1 Video | {formatTime(lesson?.duration)}</h6>
//                           </span>
//                         </div>
//                       ))}
//                     </details>
//                   ))
//                 )}
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     width: "100%",
//                     padding: "2vh 0 1vh 0",
//                   }}
//                 >
//                   <span
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       background:
//                         "linear-gradient(92.27deg, #0C243C -1.15%, #7E8C9C 98.27%)",
//                       color: "white",
//                       width: "max-content",
//                       padding: "1vh 1vw 1vh 1vw",
//                       cursor: "pointer",
//                       borderRadius: "0.5vw",
//                     }}
//                   >
//                     <p>Load more content</p>
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
// export default CourseView;
