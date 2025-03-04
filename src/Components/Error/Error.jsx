import React from 'react';

const Error = ({ imageSrc, message }) => {
  return (
    <div style={{  minHeight: "50vh" }} className="d-flex flex-column align-items-center justify-content-center w-100">
      <div className="w-100 mt-2 app-white d-flex flex-column align-items-center justify-content-center p-3 rounded-2">
        <img src={imageSrc} alt="error" className="w-100" />
        <h4 className="text-center border border-1 fs-5 fw-light p-1 px-2 text-nowrap rounded-2">
          {message}
        </h4>
      </div>
    </div>
  );
};

export default Error;
