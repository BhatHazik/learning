import axios from "axios";
import "./AdminReview.css";
import { GoArrowDown } from "react-icons/go";
import { BsCheckLg } from "react-icons/bs"; // Make sure this icon is imported for the success popup
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { BASE_URI } from "../../Config/url";
import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import defaultCourse from "../../assets/defaultCourse.svg";
import Popup from "../../Components/PopUp/PopUp";
import SearchNotFound from "../../assets/searchNotFound.svg";
import Error from "../../Components/Error/Error";
import { CustomLoader } from "../../Components/CustomLoader/CustomLoader";


export default function AdminReview() {
  const [Approvals, setApprovals] = useState([]);
  const navigate = useNavigate();
  const [isCoursesVisible, setIsCoursesVisible] = useState(false); // State to manage visibility
  const [showDeclinePopup, setShowDeclinePopup] = useState(false); // State to manage the decline popup visibility
  const [selectedCourse, setSelectedCourse] = useState(null); // To track the course to be declined
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setIsLoading] = useState(false)
  const [request_id, setRequest_id] = useState(null)
 const [review, setReview] = useState("");
 
  // Toggle function to expand/collapse courses
  const toggleCourses = () => {
    setIsCoursesVisible((prev) => !prev);
  };

  // Handle showing the decline confirmation popup
  const handleDeclineClick = (is_approved, request_id) => {
    setSelectedCourse(is_approved);
    setRequest_id(request_id);
    setShowDeclinePopup(true); // Show the popup when Decline button is clicked
  };

  // Handle confirmation of decline
  const handleDeclineConfirm = () => {
    setShowDeclinePopup(false); // Hide the popup
    setShowSuccessPopup(true); 
    
  };

  // Handle cancelling the decline action
  const handleDeclineCancel = () => {
    setShowDeclinePopup(false); // Simply hide the popup without any action
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false); // Hide the success popup
    setSelectedCourse(null); // Clear the selected course
  };


  const token = localStorage.getItem('token');
const getApproval = async()=>{
setIsLoading(true)
  try{
    const response = await axios({
      method: 'GET',
      url: `${BASE_URI}/api/v1/admin/approveCourse`,
      headers: {
        Authorization: "Bearer " + token,
      }
    })
        setApprovals(response?.data?.data)
        console.log(response?.data?.data)
  }
  catch(error){
  //  setApprovals([])
    // toast.error(error?.response?.data?.message)
  }
  finally{
    setIsLoading(false)
  }
}
 useEffect(()=>{
  getApproval()
 },[]);

 async function aproveRequest(){
  setIsLoading(true)
  try{
    const response = await axios({
      method: 'PATCH',
      url: `${BASE_URI}/api/v1/admin/approveCourse/${request_id}`,
      data:{
        "status":selectedCourse,
        "remarks":review
      },
      headers: {
        Authorization: "Bearer " + token,
      },
    })
        toast.success(response?.data?.message)
        setShowDeclinePopup(false);
        getApproval();
        
 }
 catch(err){
  toast.error(err?.response?.data?.message)
 }
 finally{
  setIsLoading(false)
 }
}


  return (
    <>
    <div className="w-100 wrapper-experts">

{
        loading ? 
        <div style={{height:"90vh"}} className="flex align-items-center justify-content-center w-100">
        <HashLoader size="60" color="#0c243c"/>
      </div>
      :
      <>
      <header
        className="bg-gradient-custom-div p-3 pb-0 rounded-bottom-0 custom-box"
        style={{ overflowX: "auto" }}
      >
        <div style={{ width: "37rem" }}>
          <h3 className="pb-5">Review Courses</h3>
        </div>
      </header>

      {/* Toggle button outside of the collapse section */}
      <div className="header-courseRequest" style={{ background: "white" }}>
        {/* Remove error check if not defined */}
        {Approvals.length === 0 ? (
          <div className="no-courses-transactions">
            <div>
              <h1>No Reviews Found</h1>
            </div>
          </div>
        ) : (
          <label
            htmlFor="courseRequest"
            className="courseRequest"
            style={{ fontWeight: "600", cursor: "pointer" }}
            onClick={toggleCourses}
          >
            To Approve <GoArrowDown />
          </label>
        )}
      </div>

      {/* Wrapping the tab-content part with conditional rendering */}
      {isCoursesVisible && (
        <div
          className="tab-content custom-box rounded-top-0"
          style={{ background: "white" }}
        >
          <div className="tab-pane active" style={{ minHeight: "25rem" }}>
            <div className="container-courseRequest">
              {/* Loop through and render courses */}
              {Approvals?.map((approval) => (
                <div className="course-req" key={approval?.course_id}>
                  <img src={approval?.thumbnail} alt={approval?.title} />
                  <div className="course-details">
                    <h3>{approval?.title}</h3>
                    <p>{approval?.expert}</p>
                    <span>{approval?.price}</span>
                  </div>
                  <div className="course-actions">

                    <button
                      onClick={() =>
                        navigate(`/courses/courseView/${approval?.course_id}`)
                      }
                      className="overview"
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => handleDeclineClick("approved", approval?.request_id)}
                      className="approve"
                    >
                      Approve
                    </button>
                    <button
                      className="decline"
                      onClick={() => handleDeclineClick("declined", approval?.request_id)}

                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Decline confirmation popup */}
      {showDeclinePopup && (
        <div className="popup">
          <div className="popup-content-review">
            <h5 style={{ fontWeight: "500" }}>
              Are you sure you want to{" "}
              {selectedCourse === "approved" ? "approve" : "decline"} the request?
            </h5>
            {selectedCourse === "approved" ? "" : <textarea onChange={(e)=> setReview(e.target.value)}></textarea>}
            <div className="popup-buttons-review">
              <button
                className="cancel-button-review"
                onClick={handleDeclineCancel}
              >
                Cancel
              </button>
              <button
                className="continue-button-review"
                onClick={aproveRequest}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="popup">
          <div className="popup-content-review">
            <BsCheckLg style={{ fontSize: "2rem" }} />
            <p>Request has been declined successfully.</p>
            <button
              className="continue-button-review"
              onClick={handleSuccessClose}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      </>
      }
    </div>

    <div className="mobile-experts w-100">
      {
        loading ? 
        <div className="d-flex w-100 p-1 app-white flex-column mt-1">
 <CustomLoader width="100%" height="3rem" className="rounded-3"/>
 <CustomLoader width="100%" height="10rem" className="rounded-3 mt-2"/>
 <CustomLoader width="100%" height="10rem" className="rounded-3 mt-2"/>

 <CustomLoader width="100%" height="10rem" className="rounded-3 mt-2"/>

 <CustomLoader width="100%" height="10rem" className="rounded-3 mt-2"/>

        </div>
        :
        <>
        <Popup 
  isOpen={showDeclinePopup}
  onClose={() => setShowDeclinePopup(false)}
  title={`Are you sure you want to ${selectedCourse === "approved" ? "approve" : "decline"} the request?`}
>
  {selectedCourse !== "approved" && (
    <textarea
  className="form-control w-100 mb-3"
  placeholder="Enter your reason..."
  onChange={(e) => setReview(e.target.value)}
  rows={4}
/>
  )}

  <div className="d-flex justify-content-end gap-2">
    <button className="app-black rounded-1 fs-5 border-0 py-1 px-2 app-text-white" onClick={handleDeclineCancel}>
      Cancel
    </button>
    <button className="app-red rounded-1 fs-5 border-0 py-1 px-2 app-text-white" onClick={aproveRequest}>
      Continue
    </button>
  </div>
</Popup>

    <div
          style={{
            zIndex: "100",
            width: "max-content",
            justifySelf: "start",
            position: "sticky",
            top: "-0.3%",
          }}
          className="mobile-top-myLearning w-100 gap-3 ps-3 p-2 px-2 justify-content-start mt-2 rounded-1 app-white d-flex gap-2"
        >
          <h4 
                    style={{cursor:"pointer"}}

          className={` rounded-2 fs-5 fw-regular border-2 app-text-black `}
          >
            Review Courses
          </h4>
          
        </div>

        <div
          className="tab-content custom-box rounded-3 mt-1 mx-1 rounded-3 py-2  px-2 mt-1"
          style={{ background: "white" }}
        >
          <div className="rounded-1">
            <div className="container-courseRequest">
              
              {/* Loop through and render courses */}
              {
              Approvals?.length === 0 || !Approvals ?
              <Error imageSrc={SearchNotFound} message="No Approvals Found" />
              :
              Approvals?.map((approval) => (
                <div className="course-req border rounded-2" key={approval?.course_id}>
                  <img src={approval?.thumbnail} alt={approval?.title} 
                  onError={(e) => {
                                      // console.log(e)
                                      e.target.onerror = null;
                                      e.target.src = defaultCourse; // Fallback image
                  }}
                  />
                  <div className="course-details">
                    <h3>{approval?.title}</h3>
                    <p>{approval?.expert}</p>
                    <span>{approval?.price}</span>
                  </div>
                  <div className="course-actions">

                    <button
                      onClick={() =>
                        navigate(`/courses/courseView/${approval?.course_id}`)
                      }
                      className="overview"
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => handleDeclineClick("approved", approval?.request_id)}
                      className="approve"
                    >
                      Approve
                    </button>
                    <button
                      className="decline"
                      onClick={() => handleDeclineClick("declined", approval?.request_id)}

                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </>
      }
    
    </div>
    </>
  );
}
