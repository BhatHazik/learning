import React from "react";

// CSS-in-JS for animation
const styles = `
  @keyframes loadingAnimation {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .custom-loader {
    display: inline-block;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loadingAnimation 1.5s infinite;
  }
`;

// Inject styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Reusable CustomLoader
const CustomLoader = ({ width = "100%", height = "20px", borderRadius = "4px", className = "" }) => {
  return (
    <div
      className={`custom-loader ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    ></div>
  );
};

// Example Usage: Category Skeleton
const CategorySkeleton = () => {
  return (
    <div className="col px-0 mb-2">
      <div className="cursor-pointer cardClick card p-1 border-0 shadow-sm rounded-3 pt-2" style={{ width: "95%" }}>
        <div className="d-flex p-2 align-items-center justify-content-between">
          <CustomLoader width="60%" height="20px" />
          <CustomLoader width="30px" height="30px" borderRadius="50%" />
        </div>
      </div>
    </div>
  );
};

export { CustomLoader, CategorySkeleton };
