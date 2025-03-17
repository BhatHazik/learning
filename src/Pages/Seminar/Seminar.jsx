import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URI } from "../../Config/url";
import { HashLoader } from "react-spinners";
import defaultUser from "../../assets/defaultUser.svg";
import toast from "react-hot-toast";
import "./Seminar.css";

const Seminar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    inqueryAbout: "",
    preferredDate: "",
    location: "",
    topicToCover: ""
  });

  // Fetch expert profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URI}/api/v1/expert/profile/${id}`
        );
        setProfile(response?.data?.data.expert);
        // console.log(response?.data?.data);
      } catch (err) {
        // console.error("Error fetching profile data:", err);
        toast.error("Failed to load expert profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    try {
      // Validate form data
      if (!formData.fullName || !formData.email || !formData.phoneNumber || 
          !formData.inqueryAbout || !formData.preferredDate || !formData.location) {
        toast.error("Please fill all required fields");
        setFormSubmitting(false);
        return;
      }
      
      // Prepare data for API
      const seminarData = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        inquery_about: formData.inqueryAbout,
        date: formData.preferredDate,
        location: formData.location,
        topics: formData.topicToCover,
        expert_id: id
      };
      
      // Send data to API
      const response = await axios.post(
        `${BASE_URI}/api/v1/users/bookSeminar`, 
        seminarData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.status === "success") {
        toast.success("Seminar request submitted successfully!");
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          inqueryAbout: "",
          preferredDate: "",
          location: "",
          topicToCover: ""
        });
      } else {
        throw new Error(response.data.message || "Failed to submit request");
      }
    } catch (error) {
    //   console.error("Error submitting seminar request:", error);
      toast.error(error.response?.data?.message || "Failed to submit seminar request");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Helper function for random color (for avatar)
  const getRandomColor = () => {
    const colors = [
      "#2C3E50", "#8E44AD", "#2980B9", "#16A085", "#27AE60",
      "#F39C12", "#D35400", "#C0392B", "#BDC3C7", "#7F8C8D"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading) {
    return (
      <div style={{ height: "90vh" }} className="d-flex align-items-center justify-content-center w-100">
        <HashLoader size="60" color="#0c243c" />
      </div>
    );
  }

  return (
    <div className="seminar-container">
      {/* Hero Section */}
      <div className="hero-section position-relative">
        <div className="hero-background">
          {profile?.profile_picture ? (
            <img 
              src={profile.profile_picture} 
              alt={profile.name} 
              className="hero-image"
            />
          ) : (
            <div className="hero-placeholder"></div>
          )}
          <div className="overlay"></div>
        </div>
        
        <div className="container position-relative z-index-1">
          <div className="row">
            {/* Mobile Expert Profile - Visible only on small screens */}
            <div className="col-12 d-md-none text-center mb-4">
              <div className="expert-profile-container-mobile mx-auto">
                {profile?.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt={profile.name}
                    className="expert-profile-image"
                  />
                ) : (
                  <div
                    className="expert-profile-placeholder d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    <span className="expert-initial">
                      {profile?.name ? profile.name.charAt(0).toUpperCase() : "?"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-md-8 col-lg-6">
              <div className="hero-content text-white">
                <h1 className="display-5 fw-bold mb-0">Book</h1>
                <h2 className="display-6 text-danger mb-2">{profile?.name || "Expert"}</h2>
                <h3 className="h4 mb-3">For Seminar</h3>
                <p className="lead">
                  Looking for an elite athlete or expert to lead a seminar at your gym? 
                  Elevate your training with top-tier professionals who bring real-world 
                  experience and expert techniques.
                </p>
              </div>
            </div>
            <div className="col-md-4 col-lg-6 d-none d-md-flex justify-content-end align-items-center">
              <div className="expert-profile-container">
                {profile?.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt={profile.name}
                    className="expert-profile-image"
                  />
                ) : (
                  <div
                    className="expert-profile-placeholder d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    <span className="expert-initial">
                      {profile?.name ? profile.name.charAt(0).toUpperCase() : "?"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-section py-0 mb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="">
                <div className="card-body p-4 p-md-5">
                  <h3 className="card-title text-center mb-4">Request a Seminar with {profile?.name || "Expert"}</h3>
                  
                  <form onSubmit={handleSubmit} className="seminar-form">
                    <div className="row g-3">
                      {/* Full Name */}
                      <div className="col-12 col-lg-12">
                        <label htmlFor="fullName" className="form-label">Full Name *</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                          autoComplete="name"
                        />
                      </div>
                      
                      {/* Email */}
                      <div className="col-12 col-md-6">
                        <label htmlFor="email" className="form-label">Email Address *</label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                          autoComplete="email"
                        />
                      </div>
                      
                      {/* Phone */}
                      <div className="col-12 col-md-6">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number *</label>
                        <input
                          type="tel"
                          className="form-control form-control-lg"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Your contact number"
                          required
                          autoComplete="tel"
                        />
                      </div>
                      
                      {/* Inquiry Type */}
                      <div className="col-12">
                        <label htmlFor="inqueryAbout" className="form-label">What are you inquiring about? *</label>
                        <select
                          className="form-select form-select-lg"
                          id="inqueryAbout"
                          name="inqueryAbout"
                          value={formData.inqueryAbout}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="" disabled>Select an option</option>
                          <option value="Private Seminar">Private Seminar</option>
                          <option value="Group Seminar">Group Seminar</option>
                          <option value="Workshop">Workshop</option>
                          <option value="Training Camp">Training Camp</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      {/* Preferred Date */}
                      <div className="col-12 col-md-6">
                        <label htmlFor="preferredDate" className="form-label">Preferred Date *</label>
                        <input
                          type="date"
                          className="form-control form-control-lg"
                          id="preferredDate"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      
                      {/* Location */}
                      <div className="col-12 col-md-6">
                        <label htmlFor="location" className="form-label">Location *</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="City, State, Country"
                          required
                        />
                      </div>
                      
                      {/* Topics */}
                      <div className="col-12">
                        <label htmlFor="topicToCover" className="form-label">Topics to Cover</label>
                        <textarea
                          className="form-control form-control-lg"
                          id="topicToCover"
                          name="topicToCover"
                          value={formData.topicToCover}
                          onChange={handleInputChange}
                          rows="4"
                          placeholder="Please describe what topics you'd like covered in the seminar"
                        ></textarea>
                      </div>
                      
                      {/* Submit Button */}
                      <div className="col-12 mt-4">
                        <button 
                          type="submit" 
                          className="btn btn-danger btn-lg w-100 py-3"
                          disabled={formSubmitting}
                        >
                          {formSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Submitting...
                            </>
                          ) : (
                            "Submit Request"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seminar; 