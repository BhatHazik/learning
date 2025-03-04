import { useEffect, useMemo, useState } from "react";
import "./MyLearning.css";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FaStar } from "react-icons/fa"; // For star icons
import axios from "axios";
import toast from "react-hot-toast";
import LikeButton from "../../Components/Like/LikeButton";
import defaultCourse from "../../assets/defaultCourse.svg";
import defaultUser from "../../assets/defaultUser.svg";
import Popup from "../../Components/PopUp/PopUp";


const ShimmerCard = () => (
  <div className="card-bottom-userCourses shimmer-card-usercourses shimmer-learning">
    <div className="shimmer-content-usercourses short"></div>
    <div className="shimmer-content-usercourses long"></div>
    <div className="shimmer-content-usercourses medium"></div>
    <div className="shimmer-content-usercourses long"></div>
  </div>
);

const Card = ({
  id,
  category,
  expert,
  title,
  tags,
  thumbnail,
  onClick,
  completed,
  ispurchased,
  rating,
  setRating,
  iscarted,
  addtocart,
  price,
  discountedPrice
}) => {
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevents the click event from bubbling up
    addtocart(id); // Calls the addtocart function with the course ID
  };
  
 
  
  return (
    <div
  className="card-bottom-myLearning"
  onClick={() =>
    onClick(
      iscarted ? "carted" : (ispurchased ? "purchased" : "normal"),
      id
    )
  }
>

      <span>
        <img src={thumbnail} alt="Course" />
      </span>
      <div className="middle-sec-card-myLearning">
        <div className="addCourse-card-myLearning">
          <h6>{category}</h6>
        </div>
        <div className="pricing-card-myLearning">
          <h5>{tags}</h5>
        </div>
      </div>
      <p>{expert}</p>
      <h4 style={{ fontSize: 15 }}>{title}</h4>

      <div className="bottom-card-usermyLearning">
        {ispurchased ? (
          <>
            <span>
              <span style={{ width: `${completed}%` }}></span>
            </span>
            <div>
              <p>{Math.floor(completed)}% complete</p>
              {rating ? (
                <div style={{ display: "flex" }}>
                  <h6>{rating} ⭐,</h6>
                  <h6>Your Rating</h6>
                </div>
              ) : (
                <p onClick={(e) => setRating(e, id)}>Add rating</p>
              )}
            </div>
          </>
        ) : (
          <div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <h6 style={{ fontSize: "0.8rem", textDecoration: "line-through" }}>${price}</h6>
              <h6 style={{ fontSize: '1rem', fontWeight: "500" }}>${discountedPrice}</h6>
            </div>
            <div
              style={{
                background: 'linear-gradient(94.41deg, #0C243C 0%, #7E8C9C 100%)',
                borderRadius: "0.2rem",
                padding: '0.3rem 0.5rem',
                color: "white",
                cursor: "pointer"
              }}
              onClick={handleAddToCart}
            >
              {ispurchased ? <h6>Purchased</h6> : <h6>Go to course</h6>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// const RatingPopup = ({ ratingID, onSubmit, onClose }) => {
//   const [selectedRating, setSelectedRating] = useState(0);
//   const [review, setReview] = useState("");

//   const handleRating = (value) => {
//     setSelectedRating(value);
//   };

//   const handleReview = (e) => {
//     setReview(e.target.value);
//   };

//   const handleSubmit = () => {
//     onSubmit(selectedRating, review);
//   };

//   return (
//     <div className="rating-popup d-flex justify-content-center align-items-center">
//       <div className="card p-4 shadow-lg bg-white rounded">
//         <h5>Add Your Rating</h5>
//         <div className="star-rating mb-3">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <FaStar
//               key={star}
//               className={`star ${selectedRating >= star ? "text-warning" : ""}`}
//               onClick={() => handleRating(star)}
//               style={{ cursor: "pointer", fontSize: "2rem" }}
//             />
//           ))}
//         </div>
//         <div className="mb-3">
//           <textarea
//             value={review}
//             onChange={handleReview}
//             placeholder="Add Your Review"
//             className="form-control"
//             rows={4}
//           />
//         </div>
//         <div className="d-flex justify-content-between">
//           <button className="btn btn-secondary" onClick={onClose}>
//             Discard
//           </button>
//           <button className="btn btn-primary" onClick={handleSubmit}>
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

const MyLearning = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("");
  const [ratingPopUp, setRatingPopUp] = useState(false);
  const [ratingID, setRatingID] = useState(null);
  const [progress, setProgress] = useState(70);
  const [mobileActiveTab, setMobileActiveTab] = useState("purchased");
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState("");

  const handleRating = (value) => {
    setSelectedRating(value);
  };

  // const handleReview = (e) => {
  //   setReview(e.target.value);
  // };

  const handleSubmit = () => {
    onSubmit(selectedRating, review);
  };

  const url = `${BASE_URI}/api/v1/users/myLearning?status=${activeTab}`;
  const { data, error, refetch, isLoading } = useFetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const coursesData = useMemo(() => data?.data || [], [data]);
  console.log(coursesData);


  useEffect(() => {
    refetch();
  }, [activeTab]);


  const handleNavigate = (status,id) => {
if(status === 'normal'){
  navigate(`/userCourses/userCourseView/${id}`);
}
if(status === 'carted'){
  navigate(`/userCart`)
}
if(status === 'purchased'){
    navigate(`/userPurchasedCourses/${id}`)

  };

};

  const setRating = (e, id) => {
    e.stopPropagation();
    setRatingPopUp(true);
    setRatingID(id);
  };

  const addtocart = async(id) =>{
    // cartLoading(true);
    try{
      const response = await axios.post(
        `${BASE_URI}/api/v1/cart`,
        { course_id: id },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      refetch()
      toast.success("Course added to cart successfully")
    }catch(err){
      toast.error(err)
    }
  }

  const handleSubmitRating = async() => {
    // Here, you'd send the rating to the server via an API call
    try{
      await axios({
        method: 'POST',
        url: `${BASE_URI}/api/v1/reviews`,
        headers: {
          Authorization: "Bearer " + token,
        },
        data: {
          courseId: ratingID,
          rating: selectedRating,
          comment: review
        }
      })
      refetch();
      toast.success("Rating submitted successfully");
    }catch(err){
      toast.error(err.response.data.message);
    }
    setRatingPopUp(false);
    setRatingID(null);
  };

  const handleClosePopup = () => {
    setRatingPopUp(false);
    setRatingID(null);
  };


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
      image: "https://images.pexels.com/photos/19406288/pexels-photo-19406288/free-photo-of-fighter-in-gym.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
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
      
        <div className="wrapper-myLearning">
          <header className="top-myLearning bg-gradient-custom-div p-3 pb-0 rounded-bottom-3.5 custom-box">
            <h3 className="pb-5">My Learning</h3>
            <div style={{overflowX:'scroll',scrollbarWidth:"none"}} className="d-flex gap-5 px-4">
              {/* Tab headers */}
              <h5
              style={{whiteSpace:"nowrap"}}
                className={`text-white px-2 pb-2 fw-light cursor-pointer ${
                  activeTab === "" ? "border-bottom border-4" : ""
                }`}
                onClick={() => setActiveTab("")}
              >
                Purchased Courses
              </h5>
              {/* <h5
              style={{whiteSpace:"nowrap"}}
                className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                  activeTab === "ongoing" ? "border-bottom border-4" : ""
                }`}
                onClick={() => setActiveTab("ongoing")}
              >
                In - Progress
              </h5> */}
              <h5
              style={{whiteSpace:"nowrap"}}
                className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                  activeTab === "favourite" ? "border-bottom border-4" : ""
                }`}
                onClick={() => setActiveTab("favourite")}
              >
                Wish List
              </h5>
              {/* <h5
              style={{whiteSpace:"nowrap"}}
                className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                  activeTab === "completed" ? "border-bottom border-4" : ""
                }`}
                onClick={() => setActiveTab("completed")}
              >
                Completed
              </h5> */}
            </div>
          </header>


          <div className="bottom-myLearning">
          {isLoading ? (
        Array.from({ length: 12 }).map((_, idx) => (
          <ShimmerCard key={idx} />
        ))
      ) : (
            error?.response?.data?.message === "No courses found" ? (
              <div className="no-courses-myLearning">
                <div>
                <h1 className="fs-2">No Courses Purchased Yet!</h1>
                <h5>Purchase a course and join the world of athletes!</h5>
                <Link to="/userCourses" className="text-decoration-none text-white">
                  <FontAwesomeIcon icon={faSquarePlus} className="add-icon-courses" />
                </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Rating Pop-up
                {ratingPopUp && (
                  <RatingPopup
                    ratingID={ratingID}
                    onSubmit={handleSubmitRating}
                    onClose={handleClosePopup}
                  />
                )} */}

                {/* Map courses */}
                {coursesData?.course?.map((course) => (
                  <Card
                    key={course.id}
                    id={course.id}
                    category={course.category}
                    expert={course.name}
                    completed={course.completion_percentage}
                    title={course.title}
                    tags={course.tags}
                    thumbnail={course.thumbnail}
                    onClick={handleNavigate}
                    ispurchased={course.is_purchased}
                    rating={course.user_rating}
                    setRating={setRating}
                    iscarted={course.in_cart}
                    addtocart={addtocart}
                    price={course.price}
                    discountedPrice={course.discounted_price}
                  />
                ))}
              </>
            )
            )}
          </div>
        </div>
      

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

          className={`p-1 px-2 rounded-2 fs-6 fw-regular border-2 ${mobileActiveTab === "purchased" ? "app-black app-text-white border-black" : "border border-1 text-secondary"}`}
          onClick={() => setMobileActiveTab("purchased")}>
            Purchased Courses
          </h4>
          <h4
                    style={{cursor:"pointer"}}

            className={`p-1 px-2 rounded-2 fs-6 border-2 ${
              mobileActiveTab === "wishlisted"
                ? "app-black border-black app-text-white"
                : "border border-1 text-secondary"
            }`}
            onClick={() => setMobileActiveTab("wishlisted")}
          >
            {/* {category.category_name} */}
            Wishlisted
          </h4>
        </div>

      <div className="mobileUserCourses pb-5 mb-4 px-3 pt-3 gap-3">
          {/* {coursesData.length === 0 && 
              <div style={{height:"60vh"}} className="w-100 align-self-center d-flex flex-column justify-content-center align-items-center">
              <img src={SearchNotFound} alt="" className="w-75"/>
              <h5 style={{background:"#0C243C", color:"white"}} className="p-2 gap-2 d-flex fw-normal rounded-1 text-center ">Unable To Find<h5 className="text-decoration-underline"> { search}</h5></h5>
            </div>
             } */}
            {/* {coursesData.map((course, index) => { */}
            {coursesData?.course?.map((course, index) => {
              {/* const bgColor = colors[Math.floor(Math.random() * colors.length)];
              const image = category[index].imageUrl; */}
            return( 

              <>
             {mobileActiveTab === "purchased" &&
              <div onClick={() => 
  navigate(course.is_purchased 
    ? `/userPurchasedCourses/${course.id}` 
    : `/userCourses/userCourseView/${course.id}`
  )
}
 key={index}
  style={{boxShadow: "1px 3px 7px rgba(0, 0, 0, 0.2)", width:"95%", alignSelf:"center"}} 
 className="rounded-3 border-1 h-25 justify-content-between bg-white d-block responsive-card">
              <div className="card-image position-relative" style={{ maxWidth: "100%"}}>
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
                <div
                style={{right:"0.5rem", bottom:"0.5rem"}}
                className="position-absolute app-white d-flex justify-content-between p-1 px-2 rounded-1"> 
                  <h5 className="fs-6 fw-medium ">{course.completion_percentage}% Completed</h5>
                </div>
                <LikeButton size="22px" className="position-absolute" top = "2%" right = "2%"/>
              </div>

              <div className="w-100 p-0 px-2">
              <input
        id="myRange"
        className="slider-myLearning"
        type="range"
        value={course.completion_percentage}
        max="100"
        min="0"
        disabled="true"
        onChange={(e) => setProgress(e.target.value)}
        style={{
          border: "1px solid grey",
          background: `linear-gradient(to right, black ${course.completion_percentage}%, transparent ${course.completion_percentage}%)`,
        }}
      />              </div>
            
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
                {/* <img style={{width:"2rem", height:"2rem"}} className=" object-fit-cover rounded-pill" src={course.profile_picture} alt="" /> */}
                  <div>
                    
                  <h5
                      style={{ fontSize: "0.8rem" }}
                      className="fw-normal app-text-black"
                    >
                      By {course.name}
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
                      className="d-flex app-red justify-content-center cursor-pointer align-items-center p-2 px-3 rounded-1"
                      onClick={(e) => {!course?.user_rating && setRating(e, course.id)}}
                    >
                      {/* <h5 style={{ fontSize: "0.8rem", color: "#fff" }} className="fw-normal">
                        Add Raing
                      </h5> */}
                      {course?.user_rating ? (
                <div style={{ display: "flex" }}>
                  <h6>{"⭐".repeat(course.user_rating)}</h6>
                  
                </div>
              ) : (
                <h5 style={{ fontSize: "0.8rem", color: "#fff" }} className="fw-normal">Add rating</h5>
              )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            }
            {
              mobileActiveTab === "wishlisted" &&
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
                                src={course.thumbnail || defaultCourse}
                                alt=""
                                onError={(e) => {
                                  // console.log(e)
                                  e.target.onerror = null;
                                  e.target.src = defaultCourse; // Fallback image
                                }}
                              />
              
              
                              <LikeButton size="22px" className="position-absolute" top = "2%" right = "2%" token={token}/>
              
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
                                    By {course.expert}
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
            }
            </>
             )}
            )}
          </div>
          <Popup
          isOpen={ratingPopUp}
          onClose={() => setRatingPopUp(false)}
          title="Add Your Rating"
          >
          
        <div className="star-rating mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`star ${selectedRating >= star ? "text-warning" : ""}`}
              onClick={() => handleRating(star)}
              style={{ cursor: "pointer", fontSize: "2rem" }}
            />
          ))}
        </div>
        <div className="mb-3">
          <textarea
            value={review}
            onChange={(e)=> setReview(e.target.value)}
            placeholder="Add Your Review"
            className="form-control"
            rows={4}
          />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn app-black app-text-white border" onClick={() => setRatingPopUp(false)}>
            Cancel
          </button>
          <button className="btn app-red app-text-white border" onClick={handleSubmitRating}>
            Submit
          </button>
        </div>
          </Popup>
    </>
  );
};

export default MyLearning;
