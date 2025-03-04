import React from "react";

const SkeletonLoader = ({ width = "100%", height = "20px", borderRadius = "4px" }) => {
  return (
    <div
      className="skeleton-loader"
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "loadingAnimation 1.5s infinite"
      }}
    ></div>
  );
};

const CategorySkeleton = () => {
  return (
    <div className="col px-0 mb-2">
      <div style={{ width: "95%" }} className="cursor-pointer cardClick card p-1 border-0 shadow-sm rounded-3 pt-2">
        {/* <div className="w-100">
          <SkeletonLoader width="100%" height="120px" borderRadius="12px" />
        </div> */}
        <div className="d-flex p-2 align-items-center justify-content-between">
          <SkeletonLoader width="60%" height="20px" borderRadius="4px" />
          <SkeletonLoader width="30px" height="30px" borderRadius="50%" />
        </div>
      </div>
    </div>
  );
};

export { SkeletonLoader, CategorySkeleton };

// CSS (You can add this to your CSS file or use styled-components)
const styles = `
  @keyframes loadingAnimation {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  .skeleton-loader {
    display: inline-block;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
