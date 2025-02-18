import { useState } from "react";

import learnImg from "../../assets/learnImg.avif";
import { MdPeopleAlt } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";
import { BASE_URI } from "../../Config/url";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";

export const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const signUpHandler = () => {
    setIsLoading(true);
    axios({
      method: "POST",
      url: `${BASE_URI}/api/v1/auth/signup`,
      data: {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        user_type: "user",
      },
    }).then(
      () => {
        navigate("/verifyEmail");
        setIsLoading(false);
      },

      (err) => {
        setIsLoading(false);
        toast.error(err?.message ? err.message : "Something went wrong");
      }
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="container-fluid signin-container ">
      <div className="row w-100 h-100">
        <div className="signup-image w-50">
          <img src={learnImg} alt="Image" className="img-fluid" />
          <div className="signUp-text ">
            <h3 className="expertise mb-0">Get ready to start your learning
            </h3>
            <h3 className="expertise mb-4">
            
            journey!
            </h3>
            <div className="join-team d-flex justify-content-center">
              <p className="w-75">
              Dive into your courses, expand your skills, and achieve your goals
              with us.
              </p>
            </div>
          </div>
        </div>
        <div className="signUp-form col-md-5 w-50 p-4">
          <div className="signup-start mb-4">
            <h2 className="">User Sign Up</h2>
            <p>Start your Inspiring journey now!</p>
          </div>
          {/* <div className="signup-auth">
            <button type="button" className="bttns google-signup">
              <FcGoogle className="googleIcon" />
              Sign Up with Google
            </button>
            
          </div>
          <div className="d-flex align-items-center py-4">
            <p
              className="mb-0"
              style={{
                height: "1px",
                backgroundColor: "#C9D1D5",
                width: "50%",
              }}
            ></p>{" "}
            <span className=" fs-small px-2">OR</span>
            <p
              style={{
                height: "1px",
                backgroundColor: "#C9D1D5",
                width: "50%",
              }}
              className="mb-0"
            ></p>
          </div> */}
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label fw-bold fs-small">
              Full Name
            </label>
            <div className="input-group">
              <label htmlFor="fullName" className="input-group-text">
                <MdPeopleAlt />
              </label>
              <input
                type="text"
                id="fullName"
                className="form-control py-2-half-5"
                placeholder="Enter Full Name"
                aria-label="FullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold fs-small">
              Email
            </label>
            <div className="input-group">
              <label htmlFor="email" className="input-group-text">
                <MdOutlineEmail />
              </label>
              <input
                type="email"
                id="email"
                className="form-control py-2-half-5"
                placeholder="Enter Email"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold fs-small">
              Password
            </label>
            <div className="input-group">
              <label htmlFor="password" className="input-group-text">
                <IoKeyOutline />
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control border-end-0 py-2-half-5"
                placeholder="Enter Password"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-group-text border-start-0 py-2-half-5"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEye className="neutral-color" />
                ) : (
                  <FaEyeSlash className="neutral-color" />
                )}
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="Confirmpass"
              className="form-label fw-bold fs-small"
            >
              Confirm Password
            </label>
            <div className="input-group">
              <label htmlFor="Confirmpass" className="input-group-text">
                <IoKeyOutline />
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="Confirmpass"
                className="form-control border-end-0 py-2-half-5"
                placeholder="Enter Confirm Password"
                aria-label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-group-text border-start-0"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <FaEye className="neutral-color" />
                ) : (
                  <FaEyeSlash className="neutral-color" />
                )}
              </button>
            </div>
          </div>
          <p className="fs-small mb-4">
            Already have an account?{" "}
            <Link to="/" className="login-link text-black fw-bold">
              LOGIN
            </Link>
          </p>
          <button className="signup-now" onClick={signUpHandler}>
            {isLoading ? <PulseLoader size={8} color="white" /> : "Signup Now!"}
          </button>
        </div>
      </div>
    </div>
  );
};
