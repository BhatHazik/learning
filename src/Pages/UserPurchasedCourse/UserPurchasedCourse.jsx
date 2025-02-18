import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../UserCourseOverview/UserCourseOverview.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faAngleDown,
  faArrowRight,
  faCoins,
  faHeart,
  faPencil,
  faPlus,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FaStar, FaYoutube } from "react-icons/fa";
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
import { RiProgress7Line } from "react-icons/ri";
import CourseDropdown from "../../Components/DropDown/ResponsiveDropdown";
import { BsTwitterX } from "react-icons/bs";
import { BiLink } from "react-icons/bi";
import Rating from "../../Components/Rating/Rating";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_KEY
);

const UserPurchasedCourse = () => {
  const [loadingItems, setLoadingItems] = useState(null);
  const [openChapters, setOpenChapters] = useState({ 0: true });
  const [verificationPopUp, setVerificationPopUp] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [video_url, setVideo_url] = useState("");
  const [video_thumb, setVideo_thumb] = useState("");
  const [viseo_type, setVideo_type] = useState("");
  const [is_rated, setIs_rated] = useState(false);
  const [editRatingPopUp, setEditRatingPopUp] = useState(false);
  const [addRatingPopUp, setAddRatingPopUp] = useState(false);
  const [review, setReview] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [optionsPopUp, setOptionsPopUp] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [hearted, setHearted] = useState(null);
  const [certificate, setcertificate] = useState(null);
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

  const url = `${BASE_URI}/api/v1/courses/usersCourseOverview/${id}`;
  const token = localStorage.getItem("token");
  const { data, error, refetch, isLoading } = useFetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const courseData = useMemo(() => data?.data || [], [data]);


  useEffect(() => {
    if (data?.data) {
        setIs_rated(data.data.course.is_rated);
        setHearted(courseData?.course?.is_favourite);
        if (courseData?.course?.is_rated) {
            setSelectedRating(courseData.course.rating); // This will be updated correctly
            setReview(courseData.course.comment);
        }
    }
}, [data]);

 
 

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
    checkedLesson({
      lesson_id: courseData?.courseChapters?.chapters[0]?.lessons[0]?.lesson_id
    })
  }, [courseData]);

  const chapters = useMemo(
    () => courseData?.courseChapters?.chapters || [],
    [courseData]
  );
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

  const handleVideoChange = useCallback(
    
    (video_url, video_thumb, lesson_id, noLesson) => {
      setVideo_url(video_url);
      setVideo_thumb(video_thumb);
      setSelectedLesson(lesson_id);
      checkedLesson({
        lesson_id: lesson_id,
      })
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

    const handleEditClick = async (e) => {
    e.stopPropagation();
    setOptionsPopUp(false);
    setEditRatingPopUp(true);
  };
  const handleAddRatingClick = (e) => {
    e.stopPropagation();
    setOptionsPopUp(false);
    setAddRatingPopUp(true);
  };
  const handleRating = (value) => {
    setSelectedRating(value);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
        const url = `${BASE_URI}/api/v1/reviews`;
        const response = await axios({
            method: "POST",
            url,
            headers: {
                Authorization: "Bearer " + token,
            },
            data: {
                comment: review,
                rating: selectedRating,
                courseId: id,
            },
        });
        toast.success("Rating Added successfully");

        // Update state immediately after adding the rating
        setReviewData(response.data); // Update the review data state
        setIs_rated(true); // Update the is_rated state
        setSelectedRating(selectedRating); // Update the selected rating state
        setAddRatingPopUp(false); // Close the add rating popup
        refetch(); // Refetch data to ensure you have the latest state

    } catch (error) {
        toast.error(error.response.data.message);
        console.error(error);
    }
};

  const checkedLesson = async ({ chapter_id, lesson_id }) => {
    const checkResponse = await axios({
      method: "PATCH",
      url: `${BASE_URI}/api/v1/lessons/markLessonAsRead`,
      headers: {
        Authorization: "Bearer " + token,
      },
      data: {
        course_id: id,
        lesson_id: lesson_id,
      },
    });

    // window.location.reload();
  };

  const updateRating = async () => {
    try {
      const url = `${BASE_URI}/api/v1/reviews/${courseData?.course?.review_id}`;
      const response = await axios({
        method: "PATCH",
        url,
        headers: {
          Authorization: "Bearer " + token,
        },
        data: {
          rating: selectedRating,
          comment: review,
        },
      });
      toast.success("Rating updated successfully");
      // setReviewData(response?.data);
      setEditRatingPopUp(false);
      refetch();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  const deleteRating = async () => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${BASE_URI}/api/v1/reviews/${courseData?.course?.review_id}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setEditRatingPopUp(false);
      setIs_rated(false);
      setReview(null);
      setSelectedRating(null);
      // setIs_rated(false)
      refetch();
      toast.success("Rating deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
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
          toast.error("Failed to add to favorites");
        }
      };

      const handleResponsiveLeftToggle = (chapterIndex) => {
        setResponsiveOpenChapters((prevOpenChapters) => ({
          ...prevOpenChapters,
          [chapterIndex]: !prevOpenChapters[chapterIndex],
        }));
      };

        const handlePrint = async (id) => {
    try {
      const url = `${BASE_URI}/api/v1/users/certificates/${id}`;
      const response = await axios({
        method: "GET",
        url,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setcertificate(response?.data?.data);
    } catch (error) {
      toast.error(
        "Certificate cant be generated as the course is not completed yet!."
      );
      // alert("No certificate found for the provided ID.");
    }
    
    const printContent = `
    <html>
    <head>
   <link rel="stylesheet" type="text/css" href="/src/Pages/UserPurchasedCourse/UserPurchasedCourse.css">
    </head>
    <body>
    <div class="certificate">
      <div class="certificate-container">
        <div>
          <div class="certificate-number">Certificate no: <strong> ${
            certificate.certificate_id
          }</strong></div>
          <div class="firstHeader" >jiujitsux</div>
        </div>
        <div class="header">Certificate of Completion</div>
        <div class="title">${certificate.title}</div>
        <div class="instructors">Instructors: <strong>${
          certificate.expert_name
        }</strong></div>
        <div class="description">
          This certificate above verifies that <strong>${
            certificate.user
          }</strong> successfully completed the course ${
      certificate.title
    } on 11/09/2024 as taught by <strong>${
      certificate.expert_name
    }</strong> on Juijitsux. The certificate indicates the entire course was completed as validated by the student. The course duration represents the total video hours of the course at time of most recent completion.
        </div>
        <div class="signature"><strong>${certificate.expert_name}</strong></div>
        <div class="date"> Date: <strong>${new Date(
          certificate.created_at
        ).toLocaleDateString("en-GB")}</strong></div>
        <div class="length">Length: <strong>
          ${Math.floor(certificate.total_duration / 3600)} hours 
          ${Math.floor((certificate.total_duration % 3600) / 60)} minutes
        </strong></div>
        <div class="watermark">Jiujitsux</div>
      </div>
    </div>
    </body>
    </html>
  `;

    const newWindow = window.open("", "_blank", "width=600,height=400");
    newWindow.document.open();
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.focus(); // Ensure the new window is focused before printing
    newWindow.print();
  };

  return (
    <>
      {/* {isLoading ? (
        <HashLoader size="60" color="#0c243c" id="spinner-usercourseview"/>
      ) : ( */}
      <>
        <div className="wrapper-userCourseview position-relative">
               {optionsPopUp && (
            <div
              onClick={() => setOptionsPopUp(false)}
              className="rating-popup d-flex justify-content-center align-items-center"
            >
              <div
                className="flex-column gap-2 shadow-lg bg-white rounded"
                onClick={(e) => e.stopPropagation()} // Prevents the outer div from being triggered
              >
                <span
                  onClick={() => handleAddToFavClick()}
                  className="cursor-pointer d-flex gap-4 align-items-center p-2 border-bottom"
                >
                  <FontAwesomeIcon
                    style={{ color: "yellow", cursor: "pointer" }}
                    icon={faStar}
                  />
                  <p>Add to favorites</p>
                </span>
                {is_rated ? (
                  <span
                    onClick={handleEditClick}
                    className="cursor-pointer d-flex gap-4 align-items-center p-2 border-bottom"
                  >
                    <FontAwesomeIcon icon={faPencil} />
                    <p>Edit Your Rating</p>
                  </span>
                ) : (
                  <span
                    onClick={handleAddRatingClick}
                    className="cursor-pointer d-flex gap-4 align-items-center p-2 border-bottom"
                  >
                    <FontAwesomeIcon icon={faPencil} />
                    <p>Add Rating</p>
                  </span>
                )}

                <span className="cursor-pointer d-flex w-100 gap-4 align-items-center p-2">
                  <FontAwesomeIcon icon={faCircleInfo} />
                  <p className="fs-6 fw-2">Not refundable!</p>
                </span>
              </div>
            </div>
          )}

          {addRatingPopUp && (
            <div className="rating-popup d-flex justify-content-center align-items-center">
              <div className="card p-4 shadow-lg bg-white rounded">
                <h5>Add Your Rating</h5>
                <div className="star-rating mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${
                        selectedRating >= star ? "text-warning" : ""
                      }`}
                      onClick={() => handleRating(star)}
                      style={{ cursor: "pointer", fontSize: "2rem" }}
                    />
                  ))}
                </div>
                <div className="mb-3">
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Add Your Review"
                    className="form-control"
                    rows={4}
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setAddRatingPopUp(false)}
                  >
                    Discard
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleReviewSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {editRatingPopUp && (
            <div className="rating-popup d-flex justify-content-center align-items-center">
              <div className="card p-4 shadow-lg bg-white rounded">
                <h5>Add Your Rating</h5>
                <div className="star-rating mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${
                        selectedRating >= star ? "text-warning" : ""
                      }`}
                      onClick={() => handleRating(star)}
                      style={{ cursor: "pointer", fontSize: "2rem" }}
                    />
                  ))}
                </div>
                <div className="mb-3">
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Add Your Review"
                    className="form-control"
                    rows={4}
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-danger" onClick={deleteRating}>
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditRatingPopUp(false)}
                  >
                    Discard
                  </button>
                  <button className="btn btn-primary" onClick={updateRating}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
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
                    <div className="rounded bg-white text-black p-2 flex justify-content-center cursor-pointer">
                      <p>Buy</p>
                    </div>
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
            <div style={{display:"flex", gap:"1rem", alignItems:"center"}}>
            {/* {hearted ? (
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
              )} */}
              <span
                          // className="signup-now  fw-lightBold fs-small mb-0 h-auto"
                          style={{display:"flex", gap:"0.5rem", alignItems:"center" , background:"white", color:"black", padding:"0.2rem 0.5rem", borderRadius:"0.5rem", cursor:"pointer"}}
                          onClick={() => handlePrint(courseData?.course?.id)}
                        >
                          Certificate
                        </span>
              {is_rated ? (

                <span onClick={handleEditClick} style={{display:"flex", gap:"0.5rem", alignItems:"center" , background:"white", color:"black", padding:"0.2rem 0.5rem", borderRadius:"0.5rem", cursor:"pointer"}}>
                 
                  <FontAwesomeIcon
                  className="cursor-pointer"
                  
                  icon={faPencil}
                />
                 Edit Rating
                </span>
                
              ) : (
               
                <span onClick={handleAddRatingClick} style={{display:"flex", gap:"0.5rem", alignItems:"center" , background:"white", color:"black", padding:"0.2rem 0.5rem", borderRadius:"0.5rem", cursor:"pointer"}}>
<FontAwesomeIcon
                  className="cursor-pointer"
                  
                  icon={faPlus}
                />
                Add Rating
                </span>
                
               
              )}
            </div>
            
            

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
                <h4 className="cursor-pointer hover-underline">
                  Watch 3 Free Lessons to get insights of what to Learn{" "}
                  <FontAwesomeIcon icon={faArrowRight} />
                </h4>
              </div>
            </div>

            <div className="left-mid-userCourseview">
              <div className="left-bottom-mid-userCourseview new-left">
                <h4>Course Lessons</h4>
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
            <h6 className="fs-6 fw-medium app-text-white d-flex gap-2">70% <RiProgress7Line className="fs-5 fw-medium app-text-white"/></h6>
          
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
      {/* )} */}
    </>
  );
};

export default UserPurchasedCourse;
