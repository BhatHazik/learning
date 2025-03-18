import React from "react";
import "./CategoriesLoader.css";

const CategorySkeletonLoader = (view="mobile-view") => {
  return (
    <div className={`${view}`}>
    <div className="skeleton-category-container app-white p-1 px-2">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="skeleton-category"></div>
      ))}
    </div>
    </div>
  );
};

export default CategorySkeletonLoader;
