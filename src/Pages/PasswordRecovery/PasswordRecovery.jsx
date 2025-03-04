import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import learnImg from "../../assets/learnImg.avif"; // Assuming this is the image on the left
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URI } from "../../Config/url";

function PasswordRecovery() {
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false); // Track if link is sent successfully
  const token = localStorage.getItem("token");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${BASE_URI}/api/v1/auth/forgot-password`, {
        email,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setLinkSent(true);
        toast.success("Password reset link sent successfully!");
      })
      .catch((err) => {
        toast.error(
          err.response
            ? err?.response?.data?.message
            : "Failed to send password reset email. Please try again later."
        );
      });
  };

  return (
    <div className="p-md-5 min-vh-100">
      <div className="container-fluid signin-container h-100">
        <div className="row w-100 h-100">
          <div className="signup-image w-50">
            <img src={learnImg} alt="Image" className="img-fluid" />
            <div className="signUp-text">
              <h3 className="expertise mb-0">
                Get ready to start your learning journey!
              </h3>
              <p className="w-75 mt-4 mx-auto text-white">
                Dive into your courses, expand your skills, and achieve your
                goals with us.
              </p>
            </div>
          </div>
          <div className="signUp-form col-md-5 w-50 py-4 px-md-5 px-3 d-flex flex-column justify-content-center gap-5">
            <div className="signup-start mt-0">
              <h1 className="mt-3 mb-3">Password Recovery</h1>
              <p>Provide your email address, and we'll help you</p>
              <p> get back on track right away.</p>
            </div>

            {!linkSent ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label fw-bold fs-small"
                  >
                    Email
                  </label>
                  <div className="input-group">
                    <label htmlFor="email" className="input-group-text">
                      <FaEnvelope />
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control py-2-half-5"
                      placeholder="Enter Email"
                      aria-label="Email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                </div>
                <div className="text-center d-md-flex align-items-center justify-content-center w-100">
                  <button
                    className="signup-now w-md-50 w-100 text-center mt-4"
                    type="submit"
                  >
                    Send Password Reset Link
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <h4 className="mt-4 text-success">
                  Link sent successfully! Please check your email.
                </h4>
              </div>
            )}

            <div className="text-center">
              <button className="btn btn-outline-secondary text-center mt-3 w-md-25 w-50">
                <Link to="/" className="text-decoration-none text-black">
                  Back To Login
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordRecovery;
