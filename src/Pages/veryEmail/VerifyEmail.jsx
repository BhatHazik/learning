import "./VerifyEmail.css";
import learnImg from "../../assets/learnImg.avif";
import { Link } from "react-router-dom";



export const VerifyEmail = () => {
  return (
    <div className="container-fluid signin-container d-flex align-items-center justify-content-center px-0">
      <div className="row w-100 h-100">
        <div className="verify-image w-50">
          <img src={learnImg} alt="Image" className="img-fluid" />
          <div className="verify-text">
            <h3 className="expertise mb-0">Share Your Expertise.</h3>
            <h3 className="expertise mb-4">
              Inspire Athletes. Transform Lives.
            </h3>
            <div className="join-team d-flex justify-content-center pb-5">
              <p className="w-75">
                Join our team of elite instructors and make a difference in the
                world of sports and athletics.
              </p>
            </div>
          </div>
        </div>
        <div className="verify-form col-md-5 w-50">
          <div className="verify-email-box">
            <h1 className="mb-3">Verify Email</h1>
            <p className="mb-3">
              We have sent a verification email to the provided email please
              verify the email to get started.
            </p>
            <button className="verify-now mt-3">
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
