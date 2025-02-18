//settings

import { useRef, useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import Modal from "../../Components/Modal/Modal";
import { BASE_URI } from "../../Config/url";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import "./Settings.css";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { GoArrowDown } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { CgDanger } from "react-icons/cg";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("accountSecurity");
  const [image, setImage] = useState(null);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [finalDelete, setFinalDelete] = useState(false);
  const [isModalPasswordChange, setIsModalPasswordChange] = useState(false);
  const [isModalEmailChange, setIsModalEmailChange] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState("editProfile");


  const [course, setCourse] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [newpassword, setPassword] = useState("");
  const navigate = useNavigate();

  const [updatePasswordData, setUpdatePasswordData] = useState({
    password: "",
    newPassword: "",
    passwordConfirm: "",
  });
  const [profilePicture, setProfilePicture] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [oldpassword, setOldPassword] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [previousCategoryName, setPreviousCategoryName] = useState("");
  const [updateCategoryData, setUpdateCategoryData] = useState({
    id: "",
    newName: "",
  });

  const [userData, setUserData] = useState({
    users: {
      name: "",
      company_name: "",
      youtube: "",
      twitter: "",
      website: "",
      bio: "",
    },
  });

  const inputRef = useRef(null);

  const companyRef = useRef(null);
  const youtubeRef = useRef(null);
  const twitterRef = useRef(null);
  const websiteRef = useRef(null);
  const bioRef = useRef(null);

  const token = localStorage.getItem("token");

  const role = localStorage.getItem("userType");
  const profileUrl = `${BASE_URI}/api/v1/users/profile`;

  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const { data, refetch } = useFetch(profileUrl, fetchOptions);
  const {
    email,
    password,
    name,
    profile_picture,
    company_name,
    youtube,
    twitter,
    website,
    bio,
  } = data?.data[0] || [];

  useEffect(() => {
    if (data) {
      setUserData({
        users: {
          name: data?.data[0]?.name,
          company_name: data?.data[0]?.company_name,
          youtube: data?.data[0]?.youtube,
          twitter: data?.data[0]?.twitter,
          website: data?.data[0]?.website,
          bio: data?.data[0]?.bio,
        },
      });
    }
  }, [data]);

  const handlePasswordUpdateAction = () => {
    axios
      .patch(
        `${BASE_URI}/api/v1/auth/updatePassword`,
        updatePasswordData,
        fetchOptions
      )
      .then((resp) => {
        toast.success(resp.data.message);
        setUpdatePasswordData({
          password: "",
          newPassword: "",
          passwordConfirm: "",
        });
        setIsModalPasswordChange(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

  const handleSaveCat = async () => {
    if (!categoryName) {
      toast.error("Category name cannot be empty!");
      return;
    }

    const categoryData = {
      name: categoryName, // Payload for the API
    };

    try {
      const response = await axios.post(
        `${BASE_URI}/api/v1/category`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      setCategoryName(""); // Clear input after saving
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create category");
    }
  };

  const handleUpdateProfilePicture = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    const formData = new FormData();

    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    } else {
      formData.append("profile_picture", profile_picture);
    }

    // Append other user data
    formData.append("name", userData?.users?.name || name);
    formData.append(
      "company_name",
      userData?.users?.company_name || company_name
    );
    formData.append("youtube", userData?.users?.youtube || youtube);
    formData.append("twitter", userData?.users?.twitter || twitter);
    formData.append("website", userData?.users?.website || website);
    formData.append("bio", userData?.users?.bio || bio);

    try {
      const response = await axios.patch(
        `${BASE_URI}/api/v1/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message || "Profile updated successfully");

      // Clear form and states
      setProfilePicture("");
      setImage(null);
      setIsReadOnly(true);

      refetch(); // Refetch data if needed
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "An error occurred while updating the profile"
      );
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const closeModalDelete = () => {
    setIsModalDelete(false);
  };

  const closeModalPasswordChange = () => {
    setIsModalPasswordChange(false);
  };

  const closeModalEmailChange = () => {
    setIsModalEmailChange(false);
  };

  const handleNextAction = () => {
    axios
      .delete(`${BASE_URI}/api/v1/auth/deleteAccount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { password: oldpassword },
      })
      .then((resp) => {
        setIsModalDelete(false);
        setFinalDelete(true);
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        localStorage.removeItem("token");
        localStorage.removeItem("rememberMe");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

  // const handleEditNameClick = () => {
  //   setIsReadOnly(false);
  //   inputRef.current.focus();
  // };
  const handleEditNameClick = () => {
    setIsReadOnly(!isReadOnly);
  };
  const handleEditcompanyClick = () => {
    setIsReadOnly(false);
    companyRef.current.focus();
  };
  const handleEditYoutubeClick = () => {
    setIsReadOnly(false);
    youtubeRef.current.focus();
  };
  const handleEditTwitterClick = () => {
    setIsReadOnly(false);
    twitterRef.current.focus();
  };
  const handleEditWebsiteClick = () => {
    setIsReadOnly(false);
    websiteRef.current.focus();
  };

  const handleEditBioClick = () => {
    setIsReadOnly(false);
    bioRef.current.focus();
  };
  const handleUpdatePasswordChange = (e) => {
    const { name, value } = e.target;
    setUpdatePasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleInputChange = (event) => {
    setUpdateCategoryData({
      ...updateCategoryData,
      newName: event.target.value,
    });
  };

  const handleVerifyClick = async () => {
    try {
      const payload = { email: newEmail, password: newpassword };
      const response = await axios.patch(
        `${BASE_URI}/api/v1/auth/email/updateEmail`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      closeModalEmailChange();
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      localStorage.removeItem("token");
      localStorage.removeItem("rememberMe");
      navigate("/");
      // Close the modal
    } catch (error) {
      console.error("Error changing email:", error);
      console.error("Error config:", error.config);
      console.error("Error request:", error.request);
    }
  };

  const addedcategories = async () => {
    try {
      const response = await axios.get(`${BASE_URI}/api/v1/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // setError("Failed to load categories"); // Set error state
    } finally {
      // setLoading(false); // Stop loading once the API call is done
    }
  };

  useEffect(() => {
    addedcategories(); // Fetch categories when the component mounts
  }, []);

  const categoryEdit = (category) => {
    setPopupVisible(true);
    setPreviousCategoryName(category.name);
    setUpdateCategoryData({ id: category.id, newName: category.name });
  };

  const closePopup = () => {
    setPopupVisible(false); // Hide the popup
    setSelectedCategory(null); // Reset selected category
    setUpdateCategoryData({ newName: "" }); // Reset new name input
    setPreviousCategoryName(""); // Reset previous name
  };

  const handleUpdateCategory = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URI}/api/v1/category/${updateCategoryData.id}`,
        { name: updateCategoryData.newName }, // The data to be sent
        {
          headers: {
            Authorization: `Bearer ${token}`, // The headers should be passed as a separate parameter
          },
        }
      );
      addedcategories();
      setPopupVisible(false);
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  return (
    <>
    <div className="w-100 wrapper-settings">
      <header
        className="bg-gradient-custom-div p-3 pb-0 rounded-bottom-0 custom-box"
        style={{ overflowX: "auto" }}
      >
        <div style={{ width: "37rem" }}>
          <h3 className="pb-5">Settings</h3>
          <div className="d-flex gap-5 px-3">
            <h5
              className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                activeTab === "accountSecurity" ? "border-bottom border-4" : ""
              }`}
              onClick={() => setActiveTab("accountSecurity")}
            >
              Account Security
            </h5>
            <h5
              className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                activeTab === "editProfile" ? "border-bottom border-4" : ""
              }`}
              onClick={() => setActiveTab("editProfile")}
            >
              Edit Profile
            </h5>
            {role !== "admin" && (
              <h5
                className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                  activeTab === "closeAccount" ? "border-bottom border-4" : ""
                }`}
                onClick={() => setActiveTab("closeAccount")}
              >
                Close Account
              </h5>
            )}

            {role === "admin" && (
              <>
                <h5
                  className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                    activeTab === "addCategories"
                      ? "border-bottom border-4"
                      : ""
                  }`}
                  onClick={() => setActiveTab("addCategories")}
                >
                  Add categories
                </h5>
              </>
            )}
          </div>
        </div>
      </header>
      <div
        className="tab-content px-3 py-4 custom-box rounded-top-0"
        style={{ background: "white" }}
      >
        <div className="px-4">
          {activeTab === "accountSecurity" && (
            <div className="tab-pane active" style={{ minHeight: "25rem" }}>
              <form>
                <div className="form-group w-md-50 mb-4">
                  <label
                    htmlFor="email"
                    className="mb-1"
                    style={{ fontSize: "20px" }}
                  >
                    Emaill
                  </label>
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control py-3"
                      id="email"
                      placeholder="Enter email"
                      value={email ? email : ""}
                      readOnly
                    />
                    {/* <div className="input-group-append">
                      <span
                        className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={() => setIsModalEmailChange(true)}
                      >
                        <FaPen />
                      </span>
                    </div> */}
                    <div className="input-group-append">
                      <span
                        className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={() => {
                          if (password === null) {
                            setIsModalEmailChange(false);
                          } else {
                            setIsModalEmailChange(true);
                          }
                        }}
                      >
                        <FaPen />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form-group w-md-50">
                  <label
                    htmlFor="password"
                    className="mb-1"
                    style={{ fontSize: "20px" }}
                  >
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type="password"
                      className="form-control py-3"
                      id="password"
                      value={password ? password : ""}
                      placeholder="Enter password"
                      //  autoComplete="current-password"
                      readOnly
                    />
                    <div className="input-group-append ">
                      <span
                        className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={() => setIsModalPasswordChange(true)}
                      >
                        <FaPen />
                      </span>
                    </div>
                  </div>
                </div>
              </form>
              <Modal
                show={isModalEmailChange}
                onClose={closeModalEmailChange}
                heading="Change Email"
              >
                {/* Dummy input to prevent autofill */}
                <input
                  type="text"
                  style={{ display: "none" }}
                  autoComplete="off"
                />

                <input
                  type="email"
                  className="py-2 px-3 mb-3 w-100 border border-2 rounded-3"
                  placeholder="Enter email"
                  name="new-email" // Use a unique name to avoid triggering autofill
                  // value={newEmail}
                  autoComplete="off" // Prevent browser from autofilling the email
                  onChange={(e) => setNewEmail(e.target.value)}
                />

                <input
                  type="password"
                  className="py-2 px-3 mb-3 w-100 border border-2 rounded-3"
                  placeholder="Enter password"
                  name="newpassword" // Avoid using the word "password" to trick the browser
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <p
                  className="mb-4"
                  style={{ fontSize: "13px", fontWeight: "300" }}
                >
                  For security reason any saved card information will be deleted
                  if you change email.
                </p>

                <div className="d-flex align-items-center justify-content-end">
                  <button
                    className="signup-now py-1 px-3 fw-lightBold mb-0 h-auto"
                    onClick={handleVerifyClick}
                  >
                    Verify
                  </button>
                </div>
              </Modal>

              <Modal
                show={isModalPasswordChange}
                onClose={closeModalPasswordChange}
                heading="Change Password"
                // handleClickAction={handleNextAction}
              >
                <input
                  type="password"
                  className=" py-2 px-3 mb-3 w-100 border border-2 rounded-3"
                  name="password"
                  value={updatePasswordData.password}
                  placeholder="Enter current password"
                  autoComplete="new-password"
                  onChange={handleUpdatePasswordChange}
                />
                <input
                  type="password"
                  className=" py-2 px-3 mb-3 w-100 border border-2 rounded-3"
                  name="newPassword"
                  value={updatePasswordData.newPassword}
                  placeholder="Enter  New password"
                  onChange={handleUpdatePasswordChange}
                />
                <input
                  type="password"
                  className=" py-2 px-3 mb-4 w-100 border border-2 rounded-3"
                  name="passwordConfirm"
                  value={updatePasswordData.passwordConfirm}
                  placeholder="Confirm  password"
                  onChange={handleUpdatePasswordChange}
                />
                <div className="d-flex align-items-center justify-content-end">
                  <button
                    className="signup-now py-1 px-3 fw-lightBold mb-0 h-auto"
                    onClick={handlePasswordUpdateAction}
                  >
                    Save
                  </button>
                </div>
              </Modal>
            </div>
          )}
          {activeTab === "editProfile" && (
            <div className="tab-pane active" style={{ minHeight: "25rem" }}>
              {role === "admin" || role === "user" ? (
                <form>
                  <div className="form-group w-md-50 mb-4">
                    <label
                      htmlFor="name"
                      className="mb-1"
                      style={{ fontSize: "20px" }}
                    >
                      Full Name
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control py-3"
                        id="name"
                        // value={isReadOnly ? name : userData.users.name}
                        value={
                          isReadOnly ? userData.users.name : userData.users.name
                        }
                        placeholder="Enter name"
                        readOnly={isReadOnly}
                        ref={inputRef}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            users: { ...userData.users, name: e.target.value },
                          })
                        }
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                          onClick={handleEditNameClick}
                        >
                          <FaPen />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group w-md-50 mb-5">
                    <label
                      htmlFor="image"
                      className="mb-1"
                      style={{ fontSize: "20px" }}
                    >
                      Profile Photo
                    </label>
                    <div className="text-center mb-3">
                      {image ? (
                        <div className="w-75 border rounded-3">
                          <img
                            src={image}
                            alt="Preview"
                            className="img-thumbnail object-fit-contain"
                            style={{ maxWidth: "200px" }}
                          />
                        </div>
                      ) : (
                        <div className="w-75 border rounded-3">
                          <img
                            src={profile_picture}
                            alt="img"
                            className="img-thumbnail object-fit-contain"
                            style={{ maxWidth: "200px" }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control py-3"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer fw-light">
                          Upload Image
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="signup-now py-2 px-4 fw-lightBold mb-0 h-auto"
                    onClick={handleUpdateProfilePicture}
                  >
                    {isLoading ? (
                      <PulseLoader size={8} color="white" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </form>
              ) : null}

              {role === "expert" ? (
                <form>
                  <div className="form-group w-md-50 mb-4">
                    <label
                      htmlFor="name"
                      className="mb-1"
                      style={{ fontSize: "20px" }}
                    >
                      Full Name
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control py-3"
                        id="name"
                        value={isReadOnly ? name : userData.users.name}
                        // value={name}
                        placeholder="Enter name"
                        readOnly={isReadOnly}
                        ref={inputRef}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            users: { ...userData.users, name: e.target.value },
                          })
                        }
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                          onClick={handleEditNameClick}
                        >
                          <FaPen />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group w-md-50 mb-5">
                    <label
                      htmlFor="image"
                      className="mb-1"
                      style={{ fontSize: "20px" }}
                    >
                      Profile Photo
                    </label>
                    <div className="text-center mb-3">
                      {image ? (
                        <div className="w-75 border rounded-3">
                          <img
                            src={image}
                            alt="Preview"
                            className="img-thumbnail object-fit-contain"
                            style={{ maxWidth: "200px" }}
                          />
                        </div>
                      ) : (
                        <div className="w-75 border rounded-3">
                          <img
                            src={profile_picture}
                            alt="img"
                            className="img-thumbnail object-fit-contain"
                            style={{ maxWidth: "200px" }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control py-3"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer fw-light">
                          Upload Image
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group w-md-50 mb-4">
                    <label
                      htmlFor="company_name"
                      className="mb-1"
                      style={{ fontSize: "20px" }}
                    >
                      Company Name
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control py-3"
                        id="company_name"
                        // value={
                        //   isReadOnly
                        //     ? company_name
                        //     : userData.users.company_name
                        // }
                        value={
                          isReadOnly
                            ? userData.users.company_name
                            : userData.users.company_name
                        }
                        placeholder="Enter company name "
                        readOnly={isReadOnly}
                        ref={companyRef}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            users: {
                              ...userData.users,
                              company_name: e.target.value,
                            },
                          })
                        }
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                          onClick={handleEditcompanyClick}
                        >
                          <FaPen />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Youtube */}

                  <div className="form-group w-md-50 mb-4">
                    <label
                      htmlFor="youtube"
                      className="mb-1"
                      style={{ fontSize: "20px" }}
                    >
                      Youtube
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control py-3"
                        id="youtube"
                        // value={isReadOnly ? youtube : userData.users.youtube}
                        value={
                          isReadOnly
                            ? userData.users.youtube
                            : userData.users.youtube
                        }
                        placeholder="Enter Youtube Url"
                        readOnly={isReadOnly}
                        ref={youtubeRef}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            users: {
                              ...userData.users,
                              youtube: e.target.value,
                            },
                          })
                        }
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                          onClick={handleEditYoutubeClick}
                        >
                          <FaPen />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* twitter */}
                  <div className="form-group w-md-50 mb-4">
                    <label
                      htmlFor="twitter"
                      className="mb-1"
                      style={{ fontSize: "20px" }}
                    >
                      Twitter
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control py-3"
                        id="twitter"
                        // value={isReadOnly ? twitter : userData.users.twitter}
                        value={
                          isReadOnly
                            ? userData.users.twitter
                            : userData.users.twitter
                        }
                        placeholder="Enter twitter Url"
                        readOnly={isReadOnly}
                        ref={twitterRef}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            users: {
                              ...userData.users,
                              twitter: e.target.value,
                            },
                          })
                        }
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                          onClick={handleEditTwitterClick}
                        >
                          <FaPen />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/*  personal website*/}
                  <div className="form-group w-md-50 mb-4">
                    <label
                      htmlFor="website"
                      className="mb-1"
                      style={{ fontSize: "20px" }}
                    >
                      Personal Website
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control py-3"
                        id="website"
                        // value={isReadOnly ? website : userData.users.website}
                        value={
                          isReadOnly
                            ? userData.users.website
                            : userData.users.website
                        }
                        placeholder="Enter website Url"
                        readOnly={isReadOnly}
                        ref={websiteRef}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            users: {
                              ...userData.users,
                              website: e.target.value,
                            },
                          })
                        }
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                          onClick={handleEditWebsiteClick}
                        >
                          <FaPen />
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* bio */}
                  <div className="form-group w-md-50 mb-4">
                    <label
                      htmlFor="bio"
                      className="mb-1"
                      style={{ fontSize: "20px" }}
                    >
                      Add your bio
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control py-3"
                        id="bio"
                        // value={isReadOnly ? bio : userData.users.bio} // Corrected value attribute
                        value={isReadOnly ? userData.users.bio : userData.bio}
                        placeholder="Add your bio"
                        ref={bioRef}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            users: { ...userData.users, bio: e.target.value }, // Fixed key from bio to website
                          })
                        }
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                          onClick={handleEditBioClick}
                        >
                          <FaPen />
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="signup-now py-2 px-4 fw-lightBold mb-0 h-auto"
                    onClick={handleUpdateProfilePicture}
                  >
                    {isLoading ? (
                      <PulseLoader size={8} color="white" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </form>
              ) : null}
            </div>
          )}

          {activeTab === "addCategories" && (
            <div className="tab-pane active" style={{ minHeight: "25rem" }}>
              <div className="addCategory">
                <div className="input-category">
                  <label htmlFor="category-name">Category Name</label>
                  <input
                    type="text"
                    id="category-name"
                    placeholder="Enter Category Name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>
                <div className="button-category">
                  <button
                    className="cancel-cat"
                    onClick={() => setCategoryName("")}
                  >
                    Cancel
                  </button>
                  <button className="save-cat" onClick={handleSaveCat}>
                    Save
                  </button>
                </div>
              </div>
              <div className="categories">
                <label
                  style={{
                    fontWeight: "600",
                    marginTop: "5vh",
                    marginBottom: "5vh",
                  }}
                >
                  Added Categories
                </label>
                <div className="category-list">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        className="category-item"
                        onClick={() => categoryEdit(category)}
                      >
                        {category.name}
                      </button>
                    ))
                  ) : (
                    <div>No categories found</div>
                  )}
                </div>
              </div>
              {isPopupVisible && (
                <div className="popup">
                  <div className="popup-content-cat">
                    <label
                      style={{
                        fontWeight: "600",
                        marginTop: "-15vh",
                        marginBottom: "5vh",
                      }}
                    >
                      Update Categories
                    </label>
                    <div
                      className="input-categoryy"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2vh",
                      }}
                    >
                      <input
                        type="text"
                        id="category-name"
                        placeholder="Previous Category Name"
                        value={previousCategoryName}
                        disabled
                        style={{ marginBottom: "2vh" }}
                      />
                      <input
                        type="text"
                        id="new-category-name"
                        placeholder="Enter New Category Name"
                        // value={updateCategoryData.newName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <button onClick={handleUpdateCategory}>Update</button>
                    <div onClick={closePopup} className="cancel-buttonn">
                      <RxCross2 />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {role !== "admin" && activeTab === "closeAccount" && (
            <div className="tab-pane active" style={{ minHeight: "25rem" }}>
              <div
                className="pb-5 d-flex flex-column align-items-start justify-content-between w-md-50 h-100"
                style={{ minHeight: "23rem" }}
              >
                <p>
                  If you close your account, you will be unsubscribed from all
                  of your courses and will lose access to your account and data
                  associated with your account forever, even if you choose to
                  create a new account using the same email address in the
                  future.
                </p>
                <button
                  className="signup-now py-2 px-3 fw-lightBold mb-0 h-auto"
                  onClick={() => setIsModalDelete(true)}
                >
                  Close Account
                </button>
              </div>

              <Modal
                show={isModalDelete}
                onClose={closeModalDelete}
                btnName="Close Account"
                heading="Close Account?"
                handleClickAction={handleNextAction}
              >
                <div className="form-group text-start">
                  <label
                    htmlFor="formBasicPassword"
                    className="mb-2 fw-light fs-small"
                  >
                    Are you sure you want to delete your account?
                  </label>
                  <input
                    type="password"
                    className="form-control py-3"
                    id="formBasicPassword"
                    placeholder="Enter your password"
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
              </Modal>

              <Modal show={finalDelete} path="/" btnName="Continue">
                Your account has been successfully deleted!
              </Modal>
            </div>
          )}
        </div>
      </div>
    </div>


    <div style={{marginBottom:"4rem"}} className="mobile-settings w-100">
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
            className={`p-1 px-2 justify-content-center align-items-center rounded-2 fs-6 border-2 ${
              mobileActiveTab === "editProfile"
                ? "app-black border-black app-text-white"
                : "border border-1 text-secondary"
            }`}
            onClick={() => setMobileActiveTab("editProfile")}
          >
            {/* {category.category_name} */}
            Edit Profile
          </h4>
          <h4 
          style={{cursor:"pointer"}}
          className={`p-1 px-2 d-flex justify-content-center align-items-center rounded-2 fs-6 fw-regular border-2 ${mobileActiveTab === "security" ? "app-black app-text-white border-black" : "border border-1 text-secondary"}`}
          onClick={() => setMobileActiveTab("security")}>
            Security
          </h4>
          
          <h4
            style={{cursor:"pointer"}}
            className={`p-1 px-2 rounded-2 justify-content-center align-items-center fs-6 border-2 ${
              mobileActiveTab === "closeAccount"
                ? "app-black border-black app-text-white"
                : "border border-1 text-secondary"
            }`}
            onClick={() => setMobileActiveTab("closeAccount")}
          >
            {/* {category.category_name} */}
            Close Account
          </h4>
        </div>

        <div className="w-100 p-1 mt-2 px-2">
          {mobileActiveTab === "security" && (
            <div style={{height:"70vh"}} className="w-100 app-white rounded-2 p-2">
              
              <div className="mb-2">
                <label htmlFor="password" className="form-label fs-6 fw-medium ">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="password"
                  placeholder="youremail@example.com"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fs-6 fw-medium">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="********"
                />
              </div>
              <div style={{width:"max-content", cursor:"pointer"}} className="app-red app-text-white rounded-2 px-4 py-2 fs-6 fw-bold">
                Save Changes
              </div>
            </div>
          )}
          {mobileActiveTab === "editProfile" && (
            <div className="w-100 app-white rounded-2 p-2">
              <div className="mb-2">
                <label htmlFor="fullName" className="form-label fs-6 fw-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  placeholder="Jack"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="dob" className="form-label fs-6 fw-medium">
                  Profile Picture
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="dob"
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div style={{width:"max-content", cursor:"pointer"}} className="app-red app-text-white rounded-2 px-4 py-2 fs-6 fw-bold">
                Save Changes
              </div>
              <div className="mb-2 justify-content-center border border-1 mt-3 p-2 rounded-2">

                <div className="w-100 d-flex justify-content-center">

              <h4
            style={{width:"max-content"}}
            className={`p-1 px-2 rounded-2 justify-content-center  mb-2 align-self-center align-items-center fs-6 border-2 ${
              "app-black border-black app-text-white"
                
            }`}
            
          > Add Matches 
          </h4>
                </div>
                <label htmlFor="dob" className="form-label fs-6 fw-medium">
                  Match Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  placeholder="Black Belt Asia"
                />
                <label htmlFor="dob" className="form-label mt-2 fs-6 fw-medium">
                  Match Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="fullName"
                  placeholder="Black Belt Asia"
                />
                <div style={{width:"max-content", cursor:"pointer"}} className="app-red app-text-white mt-2 rounded-2 px-3 py-1 fs-6 fw-bold">
                Add
              </div>

              <div className="w-100 app-black rounded-1 pt-2 mt-2">
                <span style={{borderBottom:"1px solid white"}} className="app-text-white pb-2 d-flex align-items-center justify-content-evenly">
                  <h5 className="fs-6 fw-normal">Black Belt Asia</h5>
                  <h5 className="fs-6 fw-normal">2022</h5>
                  <span className="d-flex gap-2"><MdDelete/>  <BiEdit/></span>
                </span>
                <span style={{borderBottom:"1px solid white"}} className="app-text-white pt-2 pb-2 d-flex align-items-center justify-content-evenly">
                  <h5 className="fs-6 fw-normal">Black Belt Asia</h5>
                  <h5 className="fs-6 fw-normal">2022</h5>
                  <span className="d-flex gap-2"><MdDelete/>  <BiEdit/></span>
                </span>
                <span style={{borderBottom:"1px solid white"}} className="app-text-white pb-2 pt-2 d-flex align-items-center justify-content-evenly">
                  <h5 className="fs-6 fw-normal">Black Belt Asia</h5>
                  <h5 className="fs-6 fw-normal">2022</h5>
                  <span className="d-flex gap-2"><MdDelete/>  <BiEdit/></span>
                </span>
              </div>
              </div>
              
            </div>
          )}

          {mobileActiveTab === "closeAccount" && (
            <div style={{height:"70vh"}} className="w-100 app-white rounded-2 p-3">
              <CgDanger style={{fontSize:"4rem"}} className=" app-text-red text-center align-self-center w-100"/>
              <h2 className="fs-4 fw-bold app-text-red text-center mb-2">Account Closure</h2>
              <p className="text-center">If you close your account, you will be unsubscribed from all of your courses and will lose access to your account and data associated with your account forever, even if you choose to create a new account using the same email address in the future.</p>
              <div className="w-100 d-flex justify-content-center">
              <div style={{width:"max-content",cursor:"pointer"}} className="mt-2 app-red app-text-white rounded-2 align-self-center px-4 py-2 fs-6 fw-bold">
                Delete Account
              </div>
              </div>
            </div>
          )}
        </div>

    </div>

    </>
  );
}
