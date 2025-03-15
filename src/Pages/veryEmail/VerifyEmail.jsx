import "./VerifyEmail.css";
import learnImg from "../../assets/learnImg.avif";
import { Link } from "react-router-dom";



export const VerifyEmail = () => {
  return (
    <div className="container-fluid signin-container d-flex align-items-center justify-content-center px-3 px-md-0">
      <div className="row w-100 h-100 d-flex align-items-center">
        
        {/* Left Side - Image & Text (Hidden on ≤ 768px) */}
        <div className="col-lg-6 d-none d-md-block text-center p-4">
          <img src={learnImg} alt="Image" className="img-fluid w-100 rounded" />
          <div className="verify-text mt-4">
            <h3 className="expertise mb-0">Share Your Expertise.</h3>
            <h3 className="expertise mb-3">Inspire Athletes. Transform Lives.</h3>
            <p className="w-75 mx-auto">
              Join our team of elite instructors and make a difference in the world of sports and athletics.
            </p>
          </div>
        </div>

        {/* Right Side - Verify Email Box (Full Width on ≤ 768px) */}
        <div className="col-lg-6 col-md-12 d-flex flex-column align-items-center justify-content-center">
          <div className="verify-email-box text-center p-4 shadow rounded bg-white">
            <h1 className="mb-3">Verify Email</h1>
            <p className="mb-3">
              We have sent a verification email to the provided email. Please verify the email to get started.
            </p>
            <button className="app-red border-0 app-text-white rounded-1 fs-4 py-1 px-2 mt-3">
              <Link to="/" className="text-decoration-none text-white">
                Go to Sign In
              </Link>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
