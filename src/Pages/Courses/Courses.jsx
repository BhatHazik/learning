import { useEffect, useMemo, useState } from "react";
import "./Courses.css";
import cardImage from "../../assets/coursesCard.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import { SyncLoader } from "react-spinners";
import CategorySkeletonLoader from "../../Components/CategoriesLoader/CategoriesLoader";
import SkeletonLoader from "../../Components/CardLoader/CardLoader";

const ShimmerCard = () => (
  <div className="card-bottom-courses shimmer-card-courses shimmer-card-usercourses shimmer-learning">
    <div className="shimmer-content-courses short"></div>
    {/* <div className="shimmer-content-courses long"></div> */}

    <div className="shimmer-content-courses medium"></div>
    <div className="shimmer-content-courses long"></div>
  </div>
);

const Card = ({
  id,
  onClick,
  title,
  description,
  price,
  discount,
  thumbnail,
  name,
  category,
  reason,
  editClick,
  reasonClick,
  activeTab,
}) => (
  <div className="card-bottom-courses" onClick={() => onClick(id)}>
    <img loading="lazy" src={thumbnail || cardImage} alt="Course image" />

    <div className="middle-sec-card-courses">
      <div className="addCourse-card-courses">
        <h6>{category}</h6>
      </div>
      <div className="pricing-card-courses">
        <h5>${price}</h5>
        <h5>${discount}</h5>
      </div>
    </div>

    <h5>{title}</h5>
    <h4
      dangerouslySetInnerHTML={{
        __html: description?.split(" ").slice(0, 6).join(" ") + "...",
      }}
    ></h4>
    {activeTab === "declined" && (
      <div className="flex justify-content-between">
        <div className="border rounded p-1" onClick={(e) => editClick(e, id)}>
          Edit Course
        </div>
        <div
          className="border rounded p-1"
          onClick={(e) => reasonClick(e, reason, id)}
        >
          View Reason
        </div>
      </div>
    )}
  </div>
);

const Courses = ({ search, setEditCourse, setCourseId }) => {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [reasonPopUp, setReasonPopUp] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeTab, setActiveTab] = useState("live");
  const [loading, setLoading] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState("live");

  const url = `${BASE_URI}/api/v1/courses/expertCourses?tab=${activeTab}`;
  const token = localStorage.getItem("token");
  const { data, isLoading, error, refetch } = useFetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  // const Dummycategories = [
  //   "Locks",
  //   "Guard",
  //   "Passing",
  //   "Back",
  //   "Half Guard",
  //   "Sweeps",
  //   "Submissions", // corrected spelling from "Submitions"
  //   "Paramount",
  //   "Closed Guard",
  // ];

  const courses = [
    {
      id: 1,
      title: "Half Guard",
      tags: "Guard,Lock,Raid",
      category: "Guard",
      price: 199,
      originalPrice: 299,
      instructor: "John",
      status: "Live",
      image:
        "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      title: "Full Guard",
      tags: "Guard,Defence,Raid",
      category: "Defense",
      price: 149,
      originalPrice: 249,
      instructor: "Jane",
      status: "Declined",
      image:
      "https://images.pexels.com/photos/19406288/pexels-photo-19406288/free-photo-of-fighter-in-gym.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      instructorImage: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 3,
      title: "Triangle Choke",
      tags: "Submission,Choke,Lock",
      category: "Submission",
      price: 179,
      originalPrice: 279,
      instructor: "Mike",
      status: "Live",
      image:
        "https://i0.wp.com/impulsemartialarts.com/wp-content/uploads/2021/06/off-balance-aikido-judo.jpg?resize=840%2C473&ssl=1",
      instructorImage: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: 4,
      title: "Armbar",
      tags: "Submission,Lock,Arm",
      category: "Submission",
      price: 189,
      originalPrice: 289,
      instructor: "Emma",
      status: "Incomplete",
      image:
        "https://images.pexels.com/photos/19406288/pexels-photo-19406288/free-photo-of-fighter-in-gym.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      instructorImage: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      id: 5,
      title: "Rear Naked Choke",
      tags: "Choke,Submission,Back",
      category: "Submission",
      price: 159,
      originalPrice: 259,
      instructor: "David",
      status: "Approval",
      image:
        "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      id: 6,
      title: "Leg Lock",
      tags: "Lock,Leg,Submission",
      category: "Submission",
      price: 199,
      originalPrice: 299,
      instructor: "Sophia",
      status: "Live",
      image:
        "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/women/6.jpg",
    },
    {
      id: 7,
      title: "Kimura Lock",
      tags: "Lock,Submission,Arm",
      category: "Submission",
      price: 169,
      originalPrice: 269,
      instructor: "Chris",
      status: "Live",
      image:
        "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    {
      id: 8,
      title: "Guillotine Choke",
      tags: "Choke,Submission,Neck",
      category: "Submission",
      price: 179,
      originalPrice: 279,
      instructor: "Anna",
      status: "Live",
      image:
        "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/women/8.jpg",
    },
    {
      id: 9,
      title: "Omoplata",
      tags: "Lock,Submission,Shoulder",
      category: "Submission",
      price: 189,
      originalPrice: 289,
      instructor: "Tom",
      status: "Live",
      image:
        "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/men/9.jpg",
    },
    {
      id: 10,
      title: "Ezekiel Choke",
      tags: "Choke,Submission,Neck",
      category: "Submission",
      price: 199,
      originalPrice: 299,
      instructor: "Olivia",
      status: "Live",
      image:
        "https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg",
      instructorImage: "https://randomuser.me/api/portraits/women/10.jpg",
    },
  ];

  const coursesData = useMemo(() => data?.data || [], [data]);

  const handleCardClick = (id) => {
    navigate(`/courses/courseView/${id}`);
  };
  const handleEditCourse = (e, id) => {
    e.stopPropagation();
    navigate(`/courses/addLesson/${id}`);
    // setEditCourse(true);
    // setCourseId(id);
  };
  const handleCancelReason = () => {
    setReasonPopUp(false);
  };
  const handleReasonPopUp = (e, reason, id) => {
    e.stopPropagation();

    setReason(reason); // Set reason correctly
    setActiveId(id); // Set id correctly

    setReasonPopUp(true); // Open the popup
  };

  const cards = coursesData.map((course, index) => (
    <Card
      key={index}
      onClick={handleCardClick}
      id={course.id}
      title={course.title}
      description={course.description}
      price={course.price}
      discount={course.discounted_price}
      thumbnail={course.thumbnail}
      category={course.category}
      reason={course.remarks} // Correct field
      name={course.name}
      activeTab={activeTab}
      editClick={(e) => handleEditCourse(e, course.id)}
      reasonClick={(e) => handleReasonPopUp(e, course.remarks, course.id)} // Pass remarks here
    />
  ));

  const handleAddCourse = () => {
    navigate(`/courseCreation`);
    setEditCourse(false);
  };

  return (
    <>
      <div className="wrapper-courses">
        {reasonPopUp && (
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
                  {reason}
                </h5>
                <button
                  onClick={handleCancelReason}
                  className="cancel-button-review"
                >
                  Cancel
                </button>
                <button
                  className="continue-button-review"
                  onClick={(e) => handleEditCourse(e, activeId)}
                >
                  Edit Course
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-gradient-custom-div rounded">
          <div className="top-courses">
            <h4>My Courses</h4>
            <div className="top-button">
              <h6 onClick={handleAddCourse}>Add Course</h6>
            </div>
          </div>
          <div
            style={{ overflowX: "scroll", scrollbarWidth: "none" }}
            className="top-bottom-courses mt-4 gap-5 px-4"
          >
            {/* Tab headers */}
            <h5
              style={{ whiteSpace: "nowrap" }}
              className={`text-white px-2 pb-2 fw-light cursor-pointer ${
                activeTab === "live" ? "border-bottom border-4" : ""
              }`}
              onClick={() => setActiveTab("live")}
            >
              Live Courses
            </h5>
            <h5
              style={{ whiteSpace: "nowrap" }}
              className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                activeTab === "requested" ? "border-bottom border-4" : ""
              }`}
              onClick={() => setActiveTab("requested")}
            >
              Sent for Approval
            </h5>
            <h5
              style={{ whiteSpace: "nowrap" }}
              className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                activeTab === "declined" ? "border-bottom border-4" : ""
              }`}
              onClick={() => setActiveTab("declined")}
            >
              Declined Courses
            </h5>
            <h5
              style={{ whiteSpace: "nowrap" }}
              className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                activeTab === "incomplete" ? "border-bottom border-4" : ""
              }`}
              onClick={() => setActiveTab("incomplete")}
            >
              InComplete Courses
            </h5>
          </div>
        </div>

        {error?.response?.data?.message !== "no courses found" ? (
          <div className="bottom-courses">
            {isLoading
              ? Array.from({ length: 12 }).map((_, idx) => (
                  <ShimmerCard key={idx} />
                ))
              : cards}
          </div>
        ) : (
          <div className="no-courses-courses">
            <div>
              <h1>
                {activeTab === "incomplete"
                  ? "No Incomplete Courses Found"
                  : activeTab === "live"
                  ? "No Live Courses Found"
                  : activeTab === "requested"
                  ? "No Requested Courses Found"
                  : "No Declined Courses Found"}
              </h1>
              <h5>
                Get started by uploading your courses and inspire athletes
                around the world!
              </h5>
              <Link
                to="/courseCreation"
                className="text-decoration-none text-white"
              >
                <FontAwesomeIcon
                  icon={faSquarePlus}
                  className="add-icon-courses"
                />
              </Link>
            </div>
          </div>
        )}

        {loading ? (
          <CategorySkeletonLoader />
        ) : (
          <div
            style={{
              zIndex: "100",
              width: "max-content",
              justifySelf: "start",
              position: "sticky",
              top: "-0.3%",
              overflowX:"auto"
            }}
            className="mobile-top-myLearning w-100 gap-2 ps-3 p-2 px-2 justify-content-start mt-2 rounded-1 app-white d-flex gap-2"
          >
            <h4
              style={{ cursor: "pointer" }}
              className={`p-1 px-2 rounded-2 fs-6 fw-regular border-2 ${
                mobileActiveTab === "live"
                  ? "app-black app-text-white border-black"
                  : "border border-1 text-secondary"
              }`}
              onClick={() => setMobileActiveTab("live")}
            >
              Live
            </h4>
            <h4
              style={{ cursor: "pointer" }}
              className={`p-1 px-2 rounded-2 fs-6 border-2 ${
                mobileActiveTab === "approval"
                  ? "app-black border-black app-text-white"
                  : "border border-1 text-secondary"
              }`}
              onClick={() => setMobileActiveTab("approval")}
            >
              {/* {category.category_name} */}
              Approval
            </h4>
            <h4
              style={{ cursor: "pointer" }}
              className={`p-1 px-2 rounded-2 fs-6 border-2 ${
                mobileActiveTab === "declined"
                  ? "app-black border-black app-text-white"
                  : "border border-1 text-secondary"
              }`}
              onClick={() => setMobileActiveTab("declined")}
            >
              {/* {category.category_name} */}
              Declined
            </h4>
            <h4
              style={{ cursor: "pointer" }}
              className={`p-1 px-2 rounded-2 fs-6 border-2 ${
                mobileActiveTab === "incomplete"
                  ? "app-black border-black app-text-white"
                  : "border border-1 text-secondary"
              }`}
              onClick={() => setMobileActiveTab("incomplete")}
            >
              {/* {category.category_name} */}
              Incomplete
            </h4>
          </div>
        )}

        <div className="mobileUserCourses pb-5 mb-4 px-3 pt-3 gap-3">
          {loading ? (
            <>
              {[...Array(3)].map((_, index) => (
                <SkeletonLoader key={index} />
              ))}
            </>
          ) : (
            <>
              {/* {coursesData.length === 0 && 
              <div style={{height:"60vh"}} className="w-100 align-self-center d-flex flex-column justify-content-center align-items-center">
              <img src={SearchNotFound} alt="" className="w-75"/>
              <h5 style={{background:"#0C243C", color:"white"}} className="p-2 gap-2 d-flex fw-normal rounded-1 text-center ">Unable To Find<h5 className="text-decoration-underline"> { search}</h5></h5>
            </div>
             } */}
              {/* {coursesData.map((course, index) => { */}
              {courses.map((course, index) => {
                {
                  /* const bgColor = colors[Math.floor(Math.random() * colors.length)];
              const image = category[index].imageUrl; */
                }
                return (
                  <>
                    <div
                      onClick={() =>
                        navigate(
                          course.is_purchased
                            ? `/userPurchasedCourses/${course.id}`
                            : `/userCourses/userCourseView/${course.id}`
                        )
                      }
                      key={index}
                      style={{
                        boxShadow: "1px 3px 7px rgba(0, 0, 0, 0.2)",
                        width: "95%",
                        alignSelf: "center",
                      }}
                      className="rounded-3 border-1 h-25 justify-content-between bg-white d-block responsive-card"
                    >
                      <div
                        className="card-image position-relative"
                        style={{ maxWidth: "100%", zIndex: "99" }}
                      >
                        <img
                          className=" w-100 object-fit-cover rounded-bottom-0 rounded-2"
                          src={course.image}
                          // src="https://muaythaiwhitby.ca/wp-content/uploads/2018/10/JiuJitsu-scaled.jpeg"
                          alt="Figma"
                        />

                        {/* <LikeButton size="22px" className="position-absolute" top = "2%" right = "2%"/> */}
                      </div>

                      <div
                        className="card-details p-2"
                        style={{ width: "100%" }}
                      >
                        <div
                          style={{ width: "100%" }}
                          className="d-flex justify-content-between"
                        >
                          <div style={{ width: "100%" }}>
                            {/* <h4
                    style={{ fontSize: "1.1rem", color: "#8B8B8B" }}
                    className="text-black">{course.title}</h4> */}
                            <h4
                              style={{ fontSize: "1.6rem" }}
                              className="app-text-black fw-normal"
                            >
                              {course.title}
                            </h4>
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
                                style={{
                                  fontSize: "0.8rem",
                                  color: "grey",
                                  textAlign: "center",
                                }}
                              >
                                {course.category}
                              </h6>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{ width: "100%" }}
                          className="d-flex justify-content-between mt-3 h-50"
                        >
                          <div className="d-flex gap-2 align-items-center">
                            <img
                              style={{ width: "2rem", height: "2rem" }}
                              className=" object-fit-cover rounded-pill"
                              src={course.instructorImage}
                              alt=""
                            />
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
                              style={{ minWidth:"6rem"}}
                              className="d-flex app-red justify-content-center align-items-center p-2 px-3 rounded-1"
                            >
                              <h5
                                style={{ fontSize: "0.8rem", color: "#fff" }}
                                className="fw-normal"
                              >
                                {course.status}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Courses;
