import React from "react";
import "./Categories.css";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
const categories = [
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
const Categories = () => {
  const navigate = useNavigate();
  return (
    <div className="w-100 mb-5 pb-3">

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

          className={`p-1 px-2 rounded-2 fs-6 fw-regular border-2 app-black app-text-white border-black `}
          >
           Categories
          </h4>
        
        </div>


      <div className="container-fluid px-3 w-100 p-0">
        <div className=" row row-cols-2 ps-2 row-cols-lg-4 justify-content-justify-content-lg-evenly align-items-center pt-2 ">
          {categories.map((category, index) => (
            <div 
            onClick={()=> navigate('/userCourses')}
            key={index}
            className="col px-0 mb-2">
              <div style={{width:"95%"}} className="cursor-pointer cardClick card p-1 border-0 shadow-sm rounded-3 pt-2">
                {/* <div className="w-100">
                    <img
                      src={category.imageUrl ? category.imageUrl : "https://s3-alpha-sig.figma.com/img/124c/6c03/f47f6f3522d73f2cf1827ab363018fac?Expires=1740355200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=elRvbkHtMSBqSjsIcUYpVPYPvBcHoWNFwiI5pZK1ZVCT0DemvQR3HE6OXNBvjgfsXScq9R-uPud155l8jpLfAtsCnZmI7nIDS2PiVYwzBEQaYQ-clPME4IU0GxF5hztWaoY2OVgA3x1aKQdcNq8bVy7xUhl0AbMjJeaz9m16-ciNTvQ1fvUQtkFkUWTlJc7o99SeNAjzlqTt61aStU2Ou25pzavuq~TCjSYK0lKIjzKcFya~O2sHmImBeEydshJRAazuQzZ5yOzyUdgb5Y2T66VVodW-75Z5drFjC4b694p9ZJiGt7Hn0XWqm2EPVaudkPYRhe6E-r-Ir2Hhs5KNiQ__"}
                      className="w-100 thumbnail-category rounded-4 bg-black"
                      alt="..."
                    />
  
                </div> */}
                <div
                
                className="d-flex p-2 align-items-center justify-content-between">
                    <h5 className="fs-6 fw-normal">{category.name }</h5>
                    <IoArrowForwardCircleOutline className="fs-2"/>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
