import { useEffect, useMemo, useState } from "react";
import "./Courses.css";
import cardImage from "../../assets/coursesCard.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import { SyncLoader } from "react-spinners";

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
  activeTab
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
    {
      activeTab === "declined" && 
      <div className="flex justify-content-between">
      <div className="border rounded p-1" onClick={(e)=>editClick(e,id)}>Edit Course</div>
      <div className="border rounded p-1" onClick={(e)=>reasonClick(e,reason,id)}>View Reason</div>
    </div>
    }
   
  </div>
);

const Courses = ({ search, setEditCourse , setCourseId}) => {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [reasonPopUp, setReasonPopUp] = useState(false);
  const [activeId , setActiveId] = useState(null)
  const [activeTab, setActiveTab] = useState("live");
  const url = `${BASE_URI}/api/v1/courses/expertCourses?tab=${activeTab}`;
  const token = localStorage.getItem("token");
  const { data, isLoading, error, refetch } = useFetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

 

  const coursesData = useMemo(() => data?.data || [], [data]);

  const handleCardClick = (id) => {
    navigate(`/courses/courseView/${id}`);
  };
  const handleEditCourse = (e,id) => {
  
    e.stopPropagation()
    navigate(`/courses/addLesson/${id}`);
    // setEditCourse(true);
    // setCourseId(id);
  };
  const handleCancelReason = ()=>{
    setReasonPopUp(false)
  }
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
    navigate(`/courses/courseCreation`);
    setEditCourse(false);
  };

  return (
    <>
      <div className="wrapper-courses">
      {reasonPopUp && (
        <div className="popup ">
          <div className="popup-content-review">
           
            <div className="popup-buttons-review">
            <h5 style={{maxHeight:"12rem",border:"1px solid grey", padding:"0.5rem",borderRadius:"0.5rem", whiteSpace: "normal", wordWrap: "break-word", overflowWrap: "break-word" ,overflowY:"auto",scrollbarWidth:"none"}}>
            {reason}
          </h5>
                        <button onClick={handleCancelReason} className="cancel-button-review" >
                Cancel
              </button>
              <button className="continue-button-review" onClick={(e)=>handleEditCourse(e,activeId)} >
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
          <div style={{overflowX:'scroll',scrollbarWidth:"none"}} className="mt-4 d-flex gap-5 px-4">
              {/* Tab headers */}
              <h5
              style={{whiteSpace:"nowrap"}}
                className={`text-white px-2 pb-2 fw-light cursor-pointer ${
                  activeTab === "live" ? "border-bottom border-4" : ""
                }`}
                onClick={() => setActiveTab("live")}
              >
                Live Courses
              </h5>
              <h5
              style={{whiteSpace:"nowrap"}}
                className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                  activeTab === "requested" ? "border-bottom border-4" : ""
                }`}
                onClick={() => setActiveTab("requested")}
              >
                Sent for Approval
              </h5>
              <h5
              style={{whiteSpace:"nowrap"}}
                className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                  activeTab === "declined" ? "border-bottom border-4" : ""
                }`}
                onClick={() => setActiveTab("declined")}
              >
                Declined Courses
              </h5>
              <h5
              style={{whiteSpace:"nowrap"}}
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
              <h1>{activeTab === "incomplete" ? "No Incomplete Courses Found": activeTab === "live" ? "No Live Courses Found" : activeTab === "requested" ? "No Requested Courses Found":"No Declined Courses Found" }</h1>
              <h5>

                Get started by uploading your courses and inspire
                athletes around the world!

              </h5>
              <Link
                to="/courses/courseCreation"
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
      </div>
    </>
  );
};

export default Courses;