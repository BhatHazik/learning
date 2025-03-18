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
import { Link, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { GoArrowDown } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { BiEdit, BiPlus } from "react-icons/bi";
import { CgDanger } from "react-icons/cg";
import defaultUser from "../../assets/defaultUser.svg";
import Popup from "../../Components/PopUp/PopUp";
import ReactFlagsSelect from "react-flags-select";

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
  const [isSubPopupVisible, setIsSubPopupVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [newSubName, setNewSubName] = useState("");
  const [editingSub, setEditingSub] = useState(null);
  const [pastMatchData, setPastMatchData] = useState({
    competition_name: "",
    competition_date: "",
    acheavements: "",
    location: "",
    match_link: ""
  });
  const [pastUpcomingMatchData, setPastUpcomingMatchData] = useState({
    competition_name: "",
    competition_date: "",
    location: "",
    match_link: ""
  });
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Add states for past and upcoming matches
  const [pastMatches, setPastMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [matchesActiveTab, setMatchesActiveTab] = useState("past");
  const [isEditingMatch, setIsEditingMatch] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState(null);

  // Add fighter history state
  const [fighterHistoryData, setFighterHistoryData] = useState({
    result: "win", // Default to win
    fighter_name: "",
    event_name: "",
    event_date: "",
    method: "",
    rounds: "",
    time: "",
    video_link: "",
    ko: false,
    submission: false
  });

  // Add a new state for storing fighter history data
  const [fightHistory, setFightHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFightId, setEditingFightId] = useState(null);

  const handlePastUpcomingMatchChange = (e) => {
    // For date validation
    if (e.target.name === "competition_date") {
      const selectedDate = new Date(e.target.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
      
      if (selectedDate < today) {
        toast.error("Upcoming competitions cannot have past dates");
        return;
      }
    }
    
    setPastUpcomingMatchData({
      ...pastUpcomingMatchData,
      [e.target.name]: e.target.value
    });
  };

  const handlePastMatchChange = (e) => {
    // For date validation
    if (e.target.name === "competition_date") {
      const selectedDate = new Date(e.target.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
      
      if (selectedDate > today) {
        toast.error("Past competitions cannot have future dates");
        return;
      }
    }
    
    setPastMatchData({
      ...pastMatchData,
      [e.target.name]: e.target.value
    });
  };

  // Add handler for fighter history data changes
  const handleFighterHistoryChange = (e) => {
    // console.log(e.target.value)
    setFighterHistoryData({
      ...fighterHistoryData,
      [e.target.name]: e.target.value
    });
  };

  const [userData, setUserData] = useState({
    users: {
      name: "",
      company_name: "",
      youtube: "",
      twitter: "",
      website: "",
      bio: "",
      age: "",
      height: "",
      country: "",
      class: "",
      wins: "",
      losses: "",
      kto_percentage: "",
      submission_percentage: "",
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
    age,
    height,
    country,
    fighter_class,
    wins,
    losses,
    kto_percentage,
    submission_percentage,
  } = data?.data[0] || [];
  // console.log(data?.data[0])

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
          age: data?.data[0]?.age || "",
          height: data?.data[0]?.height || "",
          country: data?.data[0]?.country || "",
          class: data?.data[0]?.fighter_class || "",
          wins: data?.data[0]?.wins || "",
          losses: data?.data[0]?.losses || "",
          kto_percentage: data?.data[0]?.kto_percentage || "",
          submission_percentage: data?.data[0]?.submission_percentage || "",
        },
      });
      
      // Also update the country selector if country data exists
      if (data?.data[0]?.country) {
        setSelectedCountry(data?.data[0]?.country);
      }
    }
  }, [data]);

  const handleUpcomingMatchPost = async()=>{
    try {
      // Validate date before submission
      const selectedDate = new Date(pastUpcomingMatchData.competition_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
      
      if (selectedDate < today) {
        toast.error("Upcoming competitions cannot have past dates");
        return;
      }
      
      if (isEditingMatch) {
        // Update existing upcoming match
        const response = await axios.patch(
          `${BASE_URI}/api/v1/expert/updateUpcomingMatch/${editingMatchId}`,
          pastUpcomingMatchData,
          fetchOptions
        );
        
        toast.success(response.data.message || "Upcoming match updated successfully");
        
        // Update the local state
        setUpcomingMatches(upcomingMatches.map(match => 
          match.id === editingMatchId ? {
            ...match,
            ...pastUpcomingMatchData
          } : match
        ));
        
        // Reset form and editing state
        setIsEditingMatch(false);
        setEditingMatchId(null);
      } else {
        // Add new upcoming match
      const response = await axios.post(
        `${BASE_URI}/api/v1/expert/addUpcomingMatch`,
        pastUpcomingMatchData,
        fetchOptions
      );
      
      toast.success(response.data.message);
        // Refresh the list of upcoming matches
        fetchUpcomingMatches();
      }
      
      // Reset form
      setPastUpcomingMatchData({
        competition_name: "",
        competition_date: "",
        location: "",
        match_link: ""
      });

    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Error with upcoming match:", error);
    }
  }

  const handleMatchPost = async()=>{
    try {
      // Validate date before submission
      const selectedDate = new Date(pastMatchData.competition_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
      
      if (selectedDate > today) {
        toast.error("Past competitions cannot have future dates");
        return;
      }
      
      if (isEditingMatch) {
        // Update existing past match
        const response = await axios.patch(
          `${BASE_URI}/api/v1/expert/updatePastMatch/${editingMatchId}`,
          pastMatchData,
          fetchOptions
        );
        
        toast.success(response.data.message || "Past match updated successfully");
        
        // Update the local state
        setPastMatches(pastMatches.map(match => 
          match.id === editingMatchId ? {
            ...match,
            ...pastMatchData
          } : match
        ));
        
        // Reset form and editing state
        setIsEditingMatch(false);
        setEditingMatchId(null);
      } else {
        // Add new past match
      const response = await axios.post(
        `${BASE_URI}/api/v1/expert/addPastMatch`,
        pastMatchData,
        fetchOptions
      );
      
      toast.success(response.data.message);
        // Refresh the list of past matches
        fetchPastMatches();
      }
      
      // Reset form
      setPastMatchData({
        competition_name: "",
        competition_date: "",
        acheavements: "",
        location: "",
        match_link: ""
      });

    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Error with past match:", error);
    }
  }

  // Add function to handle fighter history submission
  const handleFighterHistoryPost = async () => {
    try {
      let response;
      
      if (isEditing) {
        // Update existing record
        response = await axios.patch(
          `${BASE_URI}/api/v1/expert/updateFighterHistory/${editingFightId}`,
          {
            result: fighterHistoryData.result,
            fighter_name: fighterHistoryData.fighter_name,
            event_name: fighterHistoryData.event_name,
            date: fighterHistoryData.event_date,
            method_referee: fighterHistoryData.method,
            rounds: fighterHistoryData.rounds,
            time: fighterHistoryData.time,
            fight_video_link: fighterHistoryData.video_link,
            ko: fighterHistoryData.ko,
            submission: fighterHistoryData.submission
          },
          fetchOptions
        );
        
        if (response.data.status === "success") {
          toast.success("Fighter details updated successfully");
          
          // Update the local state to reflect the changes
          setFightHistory(fightHistory.map(fight => 
            fight.id === editingFightId ? {
              ...fight,
              result: fighterHistoryData.result,
              fighter_name: fighterHistoryData.fighter_name,
              event_name: fighterHistoryData.event_name,
              date: fighterHistoryData.event_date,
              method_referee: fighterHistoryData.method,
              rounds: fighterHistoryData.rounds,
              time: fighterHistoryData.time,
              fight_video_link: fighterHistoryData.video_link,
              ko: fighterHistoryData.ko,
              submission: fighterHistoryData.submission
            } : fight
          ));
        } else {
          throw new Error("Failed to update fighter details");
        }
      } else {
        // Add new record
        response = await axios.post(
          `${BASE_URI}/api/v1/expert/addFighterHistory`,
          fighterHistoryData,
          fetchOptions
        );
        
        toast.success("Fighter details added successfully");
      }
      
      // Reset form data
      setFighterHistoryData({
        result: "win",
        fighter_name: "",
        event_name: "",
        event_date: "",
        method: "",
        rounds: "",
        time: "",
        video_link: "",
        ko: false,
        submission: false
      });
      
      // Reset editing state
      setIsEditing(false);
      setEditingFightId(null);

      // Refresh the fight history
      fetchFighterHistory();

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save fighter details");
      console.error("Error saving fighter history:", error);
    }
  }

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
    
    // Append new fields
    formData.append("age", userData?.users?.age || age || "");
    formData.append("height", userData?.users?.height || height || "");
    formData.append("country", selectedCountry || country || "");
    formData.append("fighter_class", userData?.users?.class || fighter_class || "");
    formData.append("wins", userData?.users?.wins || wins || "");
    formData.append("losses", userData?.users?.losses || losses || "");
    formData.append("kto_percentage", userData?.users?.kto_percentage || kto_percentage || "");
    formData.append("submission_percentage", userData?.users?.submission_percentage || submission_percentage || "");

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

  const handleNextAction = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URI}/api/v1/auth/deleteAccount`,
        { password: oldpassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsModalDelete(false);
      setFinalDelete(true);
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      localStorage.removeItem("token");
      localStorage.removeItem("rememberMe");
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred while deleting the account");
    }
  };

  // const handleEditNameClick = () => {
  //   setIsReadOnly(false);
  //   inputRef.current.focus();
  // };
  const handleEditNameClick = () => {
    setIsReadOnly(false);
    inputRef.current.focus();
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

  const handleSubDelete = async (sub) => {
    
    try {
      await axios.delete(`${BASE_URI}/api/v1/category/${sub.subcategory_id}/subcategories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubcategories((prev) =>
        prev.filter((s) => s.subcategory_id !== sub.subcategory_id)
      );
      // Reset input if the currently editing subcategory is deleted
      if (editingSub && editingSub.subcategory_id === sub.subcategory_id) {
        setEditingSub(null);
        setNewSubName("");
      }
    } catch (error) {
      console.error("Error deleting subcategory", error);
    }
  };

  const handleCreateOrUpdateSub = async () => {
    if (!activeCategory || !newSubName) return;

    if (editingSub) {
      // Update existing subcategory
      try {
        // console.log(`${BASE_URI}/api/v1/category/${editingSub.subcategory_id}/subcategories`);
        await axios.patch(`${BASE_URI}/api/v1/category/${editingSub.subcategory_id}/subcategories`, {
          name: newSubName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        setSubcategories((prev) =>
          prev.map((s) =>
            s.subcategory_id === editingSub.subcategory_id
              ? { ...s, subcategory_name: newSubName }
              : s
          )
        );
        setEditingSub(null);
        setNewSubName("");
        toast.success("Successfully updated");
      } catch (error) {
        console.error("Error updating subcategory", error);
      }
    } else {
      // Create new subcategory
      try {
        await axios.post(`${BASE_URI}/api/v1/category/${activeCategory.category_id}/subcategories`, {
          name: newSubName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        // Refresh the subcategory list
        const response = await axios.get(
          `${BASE_URI}/api/v1/category/${activeCategory.category_id}/subcategories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubcategories(response.data.data);

        setNewSubName("");
        toast.success("Successfully created");
      } catch (error) {
        console.error("Error creating subcategory", error);
      }
    }
  };

  const handleEditBioClick = () => {
    setIsReadOnly(false);
    bioRef.current.focus();
  };
  
  // Add handlers for new fields
  const handleEditAgeClick = () => {
    setIsReadOnly(false);
  };
  
  const handleEditHeightClick = () => {
    setIsReadOnly(false);
  };
  
  const handleEditClassClick = () => {
    setIsReadOnly(false);
  };
  
  const handleEditWinsClick = () => {
    setIsReadOnly(false);
  };
  
  const handleEditLossesClick = () => {
    setIsReadOnly(false);
  };
  
  const handleEditKtoClick = () => {
    setIsReadOnly(false);
  };
  
  const handleEditSubmissionClick = () => {
    setIsReadOnly(false);
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
   // Open the subcategory popup and fetch subcategories via API
   const openSubPopup = async (category) => {
    // console.log(category);
    setActiveCategory(category);
    try {
      const response = await axios.get(
        `${BASE_URI}/api/v1/category/${category.category_id}/subcategories`
      );
      setSubcategories(response.data.data);
      // console.log(response.data.data)
      setIsSubPopupVisible(true);
    } catch (error) {
      setIsSubPopupVisible(true);
      console.error("Error fetching subcategories", error);
    }
  };

  const closeSubPopup = () => {
    setSubcategories([])
    setIsSubPopupVisible(false);
    setActiveCategory(null);
    setNewSubName("");
    setEditingSub(null);
  };

  const handleStartEditingSub = (sub) => {
    setEditingSub(sub);
    setNewSubName(sub.subcategory_name);
  };

  

  const handleCreateSub = async () => {
    if (!activeCategory || !newSubName) return;
    try {
      await axios.post(`/api/v1/subcategories`, {
        categoryId: activeCategory.id,
        name: newSubName,
      });
      // Refresh the subcategory list
      const response = await axios.get(
        `/api/v1/subcategories?categoryId=${activeCategory.id}`
      );
      setSubcategories(response.data.subcategories);
      setNewSubName("");
    } catch (error) {
      console.error("Error creating subcategory", error);
    }
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
      toast.success("Email changed, please confirm your email address");
      // Close the modal
    } catch (error) {
      toast.error(error.response.data.message);
      
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
      // console.log(response.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // setError("Failed to load categories"); // Set error state
    } finally {
      // setLoading(false); // Stop loading once the API call is done
    }
  };

  useEffect(() => {
    addedcategories(); // Fetch categories when the component mounts
  }, [categoryName]);

  const categoryEdit = (category) => {
    setPopupVisible(true);
    setPreviousCategoryName(category.category_name);
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

  // Add a function to fetch fighter history data
  const fetchFighterHistory = async () => {
    try {
      const response = await axios.get(
        `${BASE_URI}/api/v1/users/getFighterHistory?id=${data?.data[0]?.id}`,
        fetchOptions
      );
      
      if (response.data.status === "success") {
        setFightHistory(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching fighter history:", error);
      toast.error("Failed to load fighter history");
    }
  };

  // Call fetchFighterHistory when data is loaded
  useEffect(() => {
    if (data?.data[0]?.id) {
      fetchFighterHistory();
    }
  }, [data]);

  // Add function to handle editing a fight
  const handleEditFight = (fight) => {
    setIsEditing(true);
    setEditingFightId(fight.id);
    setFighterHistoryData({
      result: fight.result || "win",
      fighter_name: fight.fighter_name || "",
      event_name: fight.event_name || "",
      event_date: fight.date ? fight.date.split('T')[0] : "",
      method: fight.method_referee || "",
      rounds: fight.rounds || "",
      time: fight.time ? fight.time.substring(0, 5) : "",
      video_link: fight.fight_video_link || "",
      ko: fight.ko || false,
      submission: fight.submission || false
    });
    
    // Scroll to the form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Add function to handle deleting a fight
  const handleDeleteFight = async (fightId) => {
    // if (window.confirm("Are you sure you want to delete this fight record?")) {
      try {
        const response = await axios.delete(
          `${BASE_URI}/api/v1/expert/deleteFighterHistory/${fightId}`,
          fetchOptions
        );
        
        if (response.data.status === "success") {
          toast.success("Fight record deleted successfully");
          // Update the local state by filtering out the deleted fight
          setFightHistory(fightHistory.filter(fight => fight.id !== fightId));
        } else {
          throw new Error("Failed to delete fight record");
        }
      } catch (error) {
        console.error("Error deleting fight record:", error);
        toast.error(error?.response?.data?.message || "Failed to delete fight record");
      }
    // }
  };

  // Add function to cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingFightId(null);
    setFighterHistoryData({
      result: "win",
      fighter_name: "",
      event_name: "",
      event_date: "",
      method: "",
      rounds: "",
      time: "",
      video_link: "",
      ko: false,
      submission: false
    });
  }

  // Functions to fetch past and upcoming matches
  const fetchPastMatches = async () => {
    try {
      const response = await axios.get(
        `${BASE_URI}/api/v1/users/getPastMatch/?id=${data?.data[0]?.id}`,
        fetchOptions
      );
      
      if (response.data.status === "success") {
        setPastMatches(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching past matches:", error);
      // toast.error("Failed to load past matches");
    }
  };

  const fetchUpcomingMatches = async () => {
    try {
      const response = await axios.get(
        `${BASE_URI}/api/v1/users/getUpcomingMatch/?id=${data?.data[0]?.id}`,
        fetchOptions
      );
      
      if (response.data.status === "success") {
        setUpcomingMatches(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching upcoming matches:", error);
      // toast.error("Failed to load upcoming matches");
    }
  };

  // Function to handle editing a past match
  const handleEditPastMatch = (match) => {
    // Validate date before editing
    if (match.competition_date) {
      const matchDate = new Date(match.competition_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
      
      if (matchDate > today) {
        toast.error("Past competitions cannot have future dates");
        return;
      }
    }
    
    setIsEditingMatch(true);
    setEditingMatchId(match.id);
    setPastMatchData({
      competition_name: match.competition_name || "",
      competition_date: match.competition_date ? match.competition_date.split('T')[0] : "",
      acheavements: match.acheavements || "",
      location: match.location || "",
      match_link: match.match_link || ""
    });
  };

  // Function to handle editing an upcoming match
  const handleEditUpcomingMatch = (match) => {
    // Validate date before editing
    if (match.competition_date) {
      const matchDate = new Date(match.competition_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
      
      if (matchDate < today) {
        toast.error("Upcoming competitions cannot have past dates");
        return;
      }
    }
    
    setIsEditingMatch(true);
    setEditingMatchId(match.id);
    setPastUpcomingMatchData({
      competition_name: match.competition_name || "",
      competition_date: match.competition_date ? match.competition_date.split('T')[0] : "",
      location: match.location || "",
      match_link: match.match_link || ""
    });
  };

  // Function to handle deleting a past match
  const handleDeletePastMatch = async (matchId) => {
    try {
      const response = await axios.delete(
        `${BASE_URI}/api/v1/expert/deletePastMatch/${matchId}`,
        fetchOptions
      );
      
      if (response.data.status === "success") {
        toast.success("Past match deleted successfully");
        // Update the local state by filtering out the deleted match
        setPastMatches(pastMatches.filter(match => match.id !== matchId));
      } else {
        throw new Error("Failed to delete past match");
      }
    } catch (error) {
      console.error("Error deleting past match:", error);
      toast.error(error?.response?.data?.message || "Failed to delete past match");
    }
  };

  // Function to handle deleting an upcoming match
  const handleDeleteUpcomingMatch = async (matchId) => {
    try {
      const response = await axios.delete(
        `${BASE_URI}/api/v1/expert/deleteUpcomingMatch/${matchId}`,
        fetchOptions
      );
      
      if (response.data.status === "success") {
        toast.success("Upcoming match deleted successfully");
        // Update the local state by filtering out the deleted match
        setUpcomingMatches(upcomingMatches.filter(match => match.id !== matchId));
      } else {
        throw new Error("Failed to delete upcoming match");
      }
    } catch (error) {
      console.error("Error deleting upcoming match:", error);
      toast.error(error?.response?.data?.message || "Failed to delete upcoming match");
    }
  };

  // Function to cancel editing
  const handleCancelMatchEdit = () => {
    setIsEditingMatch(false);
    setEditingMatchId(null);
    setPastMatchData({
      competition_name: "",
      competition_date: "",
      acheavements: "",
      location: "",
      match_link: ""
    });
    setPastUpcomingMatchData({
      competition_name: "",
      competition_date: "",
      location: "",
      match_link: ""
    });
  };

  // Call fetchPastMatches and fetchUpcomingMatches when data is loaded
  useEffect(() => {
    if (data?.data[0]?.id) {
      fetchPastMatches();
      fetchUpcomingMatches();
    }
  }, [data]);

  return (
    <>
      <div className="w-100 wrapper-settings">
        <header
          className="bg-gradient-custom-div p-3 pb-0 rounded-bottom-0 custom-box"
          style={{ overflowX: "auto" }}
        >
          <div >
            <h3 className="pb-5">Settings</h3>
            <div className="d-flex gap-5 px-3">
              <h5
                className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                  activeTab === "accountSecurity"
                    ? "border-bottom border-4"
                    : ""
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
              {role === "expert" && (
                <>
                  <h5
                    className={`text-white px-3 pb-2 fw-light cursor-pointer ${
                      activeTab === "matchHistory"
                        ? "border-bottom border-4"
                        : ""
                    }`}
                    onClick={() => setActiveTab("matchHistory")}
                  >
                    Matches
                  </h5>
                 
                </>
              )}
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
                {/* <Modal
                  show={isModalEmailChange}
                  onClose={closeModalEmailChange}
                  heading="Change Email"
                >
        
                  <input
                    type="text"
                    style={{ display: "none" }}
                    autoComplete="off"
                  />

                  <input
                    type="email"
                    className="py-2 px-3 mb-3 w-100 border border-2 rounded-3"
                    placeholder="Enter email"
                    name="new-email"
                
                    autoComplete="off"
                    onChange={(e) => setNewEmail(e.target.value)}
                  />

                  <input
                    type="password"
                    className="py-2 px-3 mb-3 w-100 border border-2 rounded-3"
                    placeholder="Enter password"
                    name="newpassword" 
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <p
                    className="mb-4"
                    style={{ fontSize: "13px", fontWeight: "300" }}
                  >
                    For security reason any saved card information will be
                    deleted if you change email.
                  </p>

                  <div className="d-flex align-items-center justify-content-end">
                    <button
                      className="signup-now py-1 px-3 fw-lightBold mb-0 h-auto"
                      onClick={handleVerifyClick}
                    >
                      Verify
                    </button>
                  </div>
                </Modal> */}

                {/* <Modal
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
                </Modal> */}
              </div>
            )}

            {activeTab === "matchHistory" && (
           
              <div className="mb-2 app-white justify-content-center rounded-2">
                <div className="d-flex mb-4">
                  <div 
                    className={`me-3 py-2 px-3 rounded-2 ${matchesActiveTab === "past" ? "bg-gradient-custom-div app-text-white" : "border"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setMatchesActiveTab("past")}
                  >
                    Past Competitions
                  </div>
                  <div 
                    className={`py-2 px-3 rounded-2 ${matchesActiveTab === "upcoming" ? "bg-gradient-custom-div app-text-white" : "border"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setMatchesActiveTab("upcoming")}
                  >
                    Upcoming Competitions
                  </div>
                </div>

                {matchesActiveTab === "past" ? (
                  <>
                <div className="w-100 d-flex justify-content-start">
                  <h4
                    style={{ width: "max-content" }}
                        className={`rounded-2 justify-content-center mb-2 align-self-center align-items-center fs-4 fw-bold`}
                  >
                        Add Past Competition
                  </h4>
                </div>
                <label htmlFor="dob" className="form-label fs-6 fw-medium">
                Competition Name 
                </label>
                <input
                  type="text"
                  name="competition_name"
                  value={pastMatchData.competition_name}
                  className="form-control py-3"
                  id="fullName"
                  placeholder="Black Belt Asia"
                  onChange={handlePastMatchChange}
                />
                <label htmlFor="dob" className="form-label mt-2 fs-6 fw-medium">
                  Match Date
                </label>
                <input
                name="competition_date"
                  type="date"
                  value={pastMatchData.competition_date}
                  className="form-control py-3"
                  id="fullName"
                  placeholder="Black Belt Asia"
                  onChange={handlePastMatchChange}
                      max={new Date().toISOString().split('T')[0]} // Set max date to today
                />
                <label htmlFor="dob" className="form-label mt-2 fs-6 fw-medium">
                Achievements
                </label>
                <select 
                value={pastMatchData.acheavements}
                onChange={handlePastMatchChange}
                name="acheavements"
                id="acheavements"
                className="form-control py-3"
                >
                <option value="Champion">🏆 Champion</option>
                  <option value="Runner-up">🥈 Runner-up</option>
                  <option value="Third Place">🥉 Third Place</option>
                  <option value="Fourth Place">🥈 Fourth Place</option>
                  <option value="Fifth Place">🥉 Fifth Place</option>
                </select>
               
                <label htmlFor="dob" className="form-label mt-2 fs-6 fw-medium">
                Location
                </label>
                <input
                name="location"
                onChange={handlePastMatchChange}
                  value={pastMatchData.location}
                  type="text"
                  className="form-control py-3 d-flex align-items-center"
                  id="fullName"
                  placeholder="US"
                />
                    <label htmlFor="match_link" className="form-label mt-2 fs-6 fw-medium">
                      Match Link
                    </label>
                    <input
                      name="match_link"
                      onChange={handlePastMatchChange}
                      value={pastMatchData.match_link}
                      type="url"
                      className="form-control py-3 d-flex align-items-center"
                      id="match_link"
                      placeholder="https://example.com/match-video"
                    />
                    <div className="d-flex mt-3">
                <div
                  style={{ width: "max-content", cursor: "pointer" }}
                        className="signup-now app-text-white mt-2 rounded-2 px-3 py-1 fs-6 fw-bold me-2"
                  onClick={handleMatchPost}
                >
                        {isEditingMatch ? "Update" : "Add"}
                </div>

                      {isEditingMatch && (
                        <div
                          style={{ width: "max-content", cursor: "pointer" , height: "fit-content"}}
                          className="border mt-2 rounded-2 px-3 py-2 app-text-black fs-6 fw-bold me-2"
                          onClick={handleCancelMatchEdit}
                        >
                          Cancel
                        </div>
                      )}
                    </div>

                    {/* Past Matches Table */}
                    <div className="mt-5">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold">Past Competition Records</h4>
                        <button 
                          className="btn btn-sm btn-outline-primary" 
                          onClick={fetchPastMatches}
                        >
                          Refresh
                        </button>
                      </div>
                      
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="bg-dark text-white">
                            <tr>
                              <th>Competition Name</th>
                              <th>Date</th>
                              <th>Achievement</th>
                              <th>Location</th>
                              <th>Match Link</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pastMatches.length > 0 ? (
                              [...pastMatches].reverse().map((match) => (
                                <tr key={match.id}>
                                  <td>{match.competition_name}</td>
                                  <td>{match.competition_date ? new Date(match.competition_date).toLocaleDateString() : ""}</td>
                                  <td>{match.acheavements}</td>
                                  <td>{match.location}</td>
                                  <td>
                                    {match.match_link ? (
                                      <a 
                                        href={match.match_link.startsWith("http") ? match.match_link : `https://${match.match_link}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-sm btn-info"
                                      >
                                        View
                                      </a>
                                    ) : (
                                      <span className="text-muted">No link</span>
                                    )}
                                  </td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <button 
                                        className="btn btn-sm btn-primary" 
                                        onClick={() => handleEditPastMatch(match)}
                                      >
                                        <BiEdit />
                                      </button>
                                      <button 
                                        className="btn btn-sm btn-danger" 
                                        onClick={() => handleDeletePastMatch(match.id)}
                                      >
                                        <MdDelete />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6" className="text-center py-3">No past competition records found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-100 d-flex justify-content-start">
                  <h4
                    style={{ width: "max-content" }}
                        className={`rounded-2 justify-content-center mb-2 align-self-center align-items-center fs-4 fw-bold`}
                  >
                        Add Upcoming Competition
                  </h4>
                </div>
                <label htmlFor="dob" className="form-label fs-6 fw-medium">
                Competition Name 
                </label>
                <input
                  type="text"
                  name="competition_name"
                  value={pastUpcomingMatchData.competition_name}
                  className="form-control py-3"
                  id="fullName"
                  placeholder="Black Belt Asia"
                  onChange={handlePastUpcomingMatchChange}
                />
                <label htmlFor="dob" className="form-label mt-2 fs-6 fw-medium">
                  Match Date
                </label>
                <input
                name="competition_date"
                  type="date"
                  value={pastUpcomingMatchData.competition_date}
                  className="form-control py-3"
                  id="fullName"
                  placeholder="Black Belt Asia"
                  onChange={handlePastUpcomingMatchChange}
                      min={new Date().toISOString().split('T')[0]} // Set min date to today
                />
                <label htmlFor="dob" className="form-label mt-2 fs-6 fw-medium">
                Location
                </label>
                <input
                name="location"
                onChange={handlePastUpcomingMatchChange}
                  value={pastUpcomingMatchData.location}
                  type="text"
                  className="form-control py-3 d-flex align-items-center"
                  id="fullName"
                  placeholder="US"
                />
                    <label htmlFor="match_link" className="form-label mt-2 fs-6 fw-medium">
                      Match Link
                    </label>
                    <input
                      name="match_link"
                      onChange={handlePastUpcomingMatchChange}
                      value={pastUpcomingMatchData.match_link}
                      type="url"
                      className="form-control py-3 d-flex align-items-center"
                      id="match_link"
                      placeholder="https://example.com/match-video"
                    />

                    <div className="d-flex mt-3">
                <div
                  style={{ width: "max-content", cursor: "pointer" }}
                        className="signup-now app-text-white mt-2 rounded-2 px-3 py-1 fs-6 fw-bold me-2"
                  onClick={handleUpcomingMatchPost}
                >
                        {isEditingMatch ? "Update" : "Add"}
                </div>

                      {isEditingMatch && (
                        <div
                          style={{ width: "max-content", cursor: "pointer" , height: "fit-content"}}
                        className="border mt-2 rounded-2 px-3 py-2 app-text-black fs-6 fw-bold me-2"

                          onClick={handleCancelMatchEdit}
                        >
                          Cancel
                        </div>
                      )}
                    </div>

                    {/* Upcoming Matches Table */}
                    <div className="mt-5">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold">Upcoming Competition Records</h4>
                        <button 
                          className="btn btn-sm btn-outline-primary" 
                          onClick={fetchUpcomingMatches}
                        >
                          Refresh
                        </button>
                      </div>
                      
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="bg-dark text-white">
                            <tr>
                              <th>Competition Name</th>
                              <th>Date</th>
                              <th>Location</th>
                              <th>Match Link</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {upcomingMatches.length > 0 ? (
                              [...upcomingMatches].reverse().map((match) => (
                                <tr key={match.id}>
                                  <td>{match.competition_name}</td>
                                  <td>{match.competition_date ? new Date(match.competition_date).toLocaleDateString() : ""}</td>
                                  <td>{match.location}</td>
                                  <td>
                                    {match.match_link ? (
                                      <a 
                                        href={match.match_link.startsWith("http") ? match.match_link : `https://${match.match_link}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-sm btn-info"
                                      >
                                        View
                                      </a>
                                    ) : (
                                      <span className="text-muted">No link</span>
                                    )}
                                  </td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <button 
                                        className="btn btn-sm btn-primary" 
                                        onClick={() => handleEditUpcomingMatch(match)}
                                      >
                                        <BiEdit />
                                      </button>
                                      <button 
                                        className="btn btn-sm btn-danger" 
                                        onClick={() => handleDeleteUpcomingMatch(match.id)}
                                      >
                                        <MdDelete />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center py-3">No upcoming competition records found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
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
                            isReadOnly
                              ? userData.users.name
                              : userData.users.name
                          }
                          placeholder="Enter name"
                          readOnly={isReadOnly}
                          ref={inputRef}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              users: {
                                ...userData.users,
                                name: e.target.value,
                              },
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
                  <>
                  <form>
                    <div className="form-group w-md-100 d-flex justify-content-between gap-2 mb-4">
                      <div className="w-md-50">
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
                              users: {
                                ...userData.users,
                                name: e.target.value,
                              },
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
                      <div className="w-md-50 ms-2">
                      <label
                        htmlFor="name"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Country
                      </label>
                      <div className="input-group">
                      <ReactFlagsSelect
        selected={selectedCountry}
        onSelect={(code) => setSelectedCountry(code)}
        searchable={true}
        className="w-100 mt-1"
        placeholder="Select a country"
      />
                        <div className="input-group-append">
                          
                        </div>
                      </div>

                      </div>
                    </div>

                    <div className="form-group w-md-100 mb-5">
                      <label
                        htmlFor="image"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Profile Photo
                      </label>
                      <div className="text-center mb-3">
                        {image ? (
                          <div className="w-50 border rounded-3">
                            <img
                              src={image}
                              alt="Preview"
                              className="img-thumbnail object-fit-contain"
                              style={{ maxWidth: "200px" }}
                            />
                          </div>
                        ) : (
                          <div className="w-50 border rounded-3">
                            <img
                              src={profile_picture}
                              alt="img"
                              className="img-thumbnail object-fit-contain"
                              style={{ maxWidth: "200px" }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="input-group w-md-100">
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

                    <div className="form-group mb-4 w-100 d-flex justify-content-between gap-2">
                    <div className="w-md-50">
                      <label
                        htmlFor="company_name"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Age
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control py-3"
                          id="age"
                          value={
                            isReadOnly
                              ? userData.users.age
                              : userData.users.age
                          }
                          placeholder="Enter your age"
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              users: {
                                ...userData.users,
                                age: e.target.value,
                              },
                            })
                          }
                        />
                        <div className="input-group-append">
                          <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                                onClick={handleEditAgeClick}>
                            <FaPen />
                          </span>
                        </div>
                      </div>
                      </div>
                      <div className="w-md-50 ms-2">
                      <label
                        htmlFor="company_name"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Height
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control py-3"
                          id="height"
                          value={
                            isReadOnly
                              ? userData.users.height
                              : userData.users.height
                          }
                          placeholder="Enter your height"
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              users: {
                                ...userData.users,
                                height: e.target.value,
                              },
                            })
                          }
                        />
                        <div className="input-group-append">
                          <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                                onClick={handleEditHeightClick}>
                            <FaPen />
                          </span>
                        </div>
                      </div>
                      </div>
                    
                    </div>

                    <div className="form-group mb-4 w-100 d-flex justify-content-between gap-2">
                    <div className="w-md-50">
                      <label
                        htmlFor="company_name"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Association
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control py-3"
                          id="company_name"
                          
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
                      <div className="w-md-50 ms-2">
                      <label
                        htmlFor="company_name"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Class
                      </label>
                      <div className="input-group">
                        <select
                          className="form-control py-3"
                          id="userClass"
                          value={
                            isReadOnly
                              ? userData.users.class
                              : userData.users.class
                          }
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              users: {
                                ...userData.users,
                                class: e.target.value,
                              },
                            })
                          }
                        >
                          <option value="">Select a class</option>
                          <option value="lightWeight">Light Weight</option>
                          <option value="middleWeight">Middle Weight</option>
                          <option value="heavyWeight">Heavy Weight</option>
                        </select>
                        <div className="input-group-append">
                          <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={handleEditClassClick}>
                    <FaPen />
                  </span>
                        </div>
                      </div>
                      </div>
                    
                    </div>

                    {/* <div className="form-group mb-4 w-100 d-flex justify-content-between gap-2">
                    <div className="w-md-50">
                      <label
                        htmlFor="company_name"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Wins
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control py-3"
                          id="wins"
                          value={
                            isReadOnly
                              ? userData.users.wins
                              : userData.users.wins
                          }
                          placeholder="Enter wins count"
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              users: {
                                ...userData.users,
                                wins: e.target.value,
                              },
                            })
                          }
                        />
                        <div className="input-group-append">
                          <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={handleEditWinsClick}>
                    <FaPen />
                  </span>
                        </div>
                      </div>
                      </div>
                      <div className="w-md-50 ms-2">
                      <label
                        htmlFor="company_name"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Losses
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control py-3"
                          id="losses"
                          value={
                            isReadOnly
                              ? userData.users.losses
                              : userData.users.losses
                          }
                          placeholder="Enter losses count"
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              users: {
                                ...userData.users,
                                losses: e.target.value,
                              },
                            })
                          }
                        />
                        <div className="input-group-append">
                          <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={handleEditLossesClick}>
                    <FaPen />
                  </span>
                        </div>
                      </div>
                      </div>
                    
                    </div> */}
                    {/* <div className="form-group mb-4 w-100 d-flex justify-content-between gap-2">
                    <div className="w-md-50">
                      <label
                        htmlFor="company_name"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        KO/TKO Percentage
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control py-3"
                          id="kto_percentage"
                          value={
                            isReadOnly
                              ? userData.users.kto_percentage
                              : userData.users.kto_percentage
                          }
                          placeholder="Enter KO/TKO percentage"
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              users: {
                                ...userData.users,
                                kto_percentage: e.target.value,
                              },
                            })
                          }
                        />
                        <div className="input-group-append">
                          <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={handleEditKtoClick}>
                    <FaPen />
                  </span>
                        </div>
                      </div>
                      </div>
                      <div className="w-md-50 ms-2">
                      <label
                        htmlFor="company_name"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Submission Percentage
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control py-3"
                          id="submission_percentage"
                          value={
                            isReadOnly
                              ? userData.users.submission_percentage
                              : userData.users.submission_percentage
                          }
                          placeholder="Enter submission percentage"
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              users: {
                                ...userData.users,
                                submission_percentage: e.target.value,
                              },
                            })
                          }
                        />
                        <div className="input-group-append">
                          <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={handleEditSubmissionClick}>
                    <FaPen />
                  </span>
                        </div>
                      </div>
                      </div>
                    
                    </div> */}

                    {/* Youtube */}

                    <div className="form-group w-md-100 mb-0 d-flex justify-content-between gap-2">
                      <div className="w-md-50">
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
                      <div className=" w-md-50 mb-4 ms-2">
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
                    </div>

                    {/* twitter */}
                    

                    {/*  personal website*/}
                    <div className="form-group w-md-100 mb-2 d-flex justify-content-between gap-2">
                      <div className="w-md-50">
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
                      <div className="w-md-50 mb-4 ms-2">
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
                    </div>
                    {/* bio */}
                    

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

                  <form className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h3 className="fw-bold">
                        {isEditing ? "Edit Fighter History" : "Fighter History - Pro"}
                      </h3>
                      {isEditing && (
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary" 
                          onClick={handleCancelEdit}
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <div className="form-group mb-4 w-100 d-flex justify-content-between gap-2">
                    <div className="w-md-50">
                      <label
                        htmlFor="result"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Results
                      </label>
                      <div className="d-flex align-items-center p-3 border rounded align-items-center">
  <div className="form-check me-3">
    <input
      className="form-check-input"
      type="radio"
      name="result"
      id="resultWin"
      value="win"
      checked={fighterHistoryData.result === "win"}
      onChange={handleFighterHistoryChange}
    />
    <label className="form-check-label fs-6" htmlFor="resultWin">
      Wins
    </label>
  </div>
  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="result"
      id="resultLoss"
      value="lose"
      checked={fighterHistoryData.result === "lose"}
      onChange={handleFighterHistoryChange}
    />
    <label className="form-check-label fs-6" htmlFor="resultLoss">
      Loses
    </label>
  </div>

</div>
                      </div>
                      <div className="w-md-50 ms-2">
                      <label
                        htmlFor="fighter_name"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Opponent Name
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control py-3"
                          id="fighter_name"
                          name="fighter_name"
                          value={fighterHistoryData.fighter_name}
                          placeholder="Enter opponent name"
                          onChange={handleFighterHistoryChange}
                        />
                       
                      </div>
                      </div>
                    
                    </div>
                    <div className="form-group mb-4 w-100 d-flex justify-content-between gap-2">
                    <div className="w-md-50">
                      <label
                        htmlFor="event_name"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Event Name
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control py-3"
                          id="event_name"
                          name="event_name"
                          value={fighterHistoryData.event_name}
                          placeholder="Enter event name"
                          onChange={handleFighterHistoryChange}
                        />
                        
                      </div>
                      </div>
                      <div className="w-md-50 ms-2">
                      <label
                        htmlFor="event_date"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Date
                      </label>
                      <div className="input-group">
                        <input
                          type="date"
                          className="form-control py-3"
                          id="event_date"
                          name="event_date"
                          value={fighterHistoryData.event_date}
                          onChange={handleFighterHistoryChange}
                        />
                        
                      </div>
                      </div>
                    
                    </div>

                    <div className="form-group mb-4 w-100 d-flex justify-content-between gap-2">
                    <div className="w-md-50">
                      <label
                        htmlFor="method"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Method Referee
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control py-3"
                          id="method"
                          name="method"
                          value={fighterHistoryData.method}
                          placeholder="Enter method"
                          onChange={handleFighterHistoryChange}
                        />
                        
                      </div>
                      </div>
                      <div className="w-md-50 ms-2">
                      <label
                        htmlFor="rounds"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Rounds
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control py-3"
                          id="rounds"
                          name="rounds"
                          value={fighterHistoryData.rounds}
                          placeholder="Enter rounds"
                          onChange={handleFighterHistoryChange}
                        />
                        
                      </div>
                      </div>
                    
                    </div>


                    <div className="form-group mb-4 w-100 d-flex justify-content-between gap-2">
                    <div className="w-md-50">
                      <label
                        htmlFor="time"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Time
                      </label>
                      <div className="input-group">
                        <input
                          type="time"
                          className="form-control py-3"
                          id="time"
                          name="time"
                          value={fighterHistoryData.time}
                          onChange={handleFighterHistoryChange}
                        />
                        
                      </div>
                      </div>
                      <div className="w-md-50 ms-2">
                      <label
                        htmlFor="video_link"
                        className="mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        Fight video link
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control py-3"
                          id="video_link"
                          name="video_link"
                          value={fighterHistoryData.video_link}
                          placeholder="Enter video link"
                          onChange={handleFighterHistoryChange}
                        />
                        
                      </div>
                      </div>
                    
                    </div>

                    {/* New Knock Out and Submission fields */}
                    <div className="form-group mb-4 w-100 d-flex justify-content-between gap-2">
                      <div className="w-md-50">
                        <label
                          htmlFor="ko"
                          className="mb-1"
                          style={{ fontSize: "20px" }}
                        >
                          Knock Out
                        </label>
                        <div className="d-flex align-items-center p-3 border rounded align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="ko"
                              id="koYes"
                              value="true"
                              checked={fighterHistoryData.ko === true}
                              onChange={() => setFighterHistoryData({...fighterHistoryData, ko: true})}
                            />
                            <label className="form-check-label fs-6" htmlFor="koYes">
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="ko"
                              id="koNo"
                              value="false"
                              checked={fighterHistoryData.ko === false}
                              onChange={() => setFighterHistoryData({...fighterHistoryData, ko: false})}
                            />
                            <label className="form-check-label fs-6" htmlFor="koNo">
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="w-md-50 ms-2">
                        <label
                          htmlFor="submission"
                          className="mb-1"
                          style={{ fontSize: "20px" }}
                        >
                          Submission
                        </label>
                        <div className="d-flex align-items-center p-3 border rounded align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="submission"
                              id="submissionYes"
                              value="true"
                              checked={fighterHistoryData.submission === true}
                              onChange={() => setFighterHistoryData({...fighterHistoryData, submission: true})}
                            />
                            <label className="form-check-label fs-6" htmlFor="submissionYes">
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="submission"
                              id="submissionNo"
                              value="false"
                              checked={fighterHistoryData.submission === false}
                              onChange={() => setFighterHistoryData({...fighterHistoryData, submission: false})}
                            />
                            <label className="form-check-label fs-6" htmlFor="submissionNo">
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="signup-now py-2 px-4 fw-lightBold mb-0 h-auto"
                      onClick={handleFighterHistoryPost}
                    >
                      {isLoading ? (
                        <PulseLoader size={8} color="white" />
                      ) : (
                        isEditing ? "Save Changes" : "Add"
                      )}
                    </button>

                  </form>

                  {/* Fighter History Table */}
                  <div className="mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="fw-bold">Fighter History Records</h3>
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={fetchFighterHistory}
                      >
                        Refresh
                      </button>
                    </div>
                    
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                          <tr>
                            <th>Result</th>
                            <th>Fighter</th>
                            <th>Event</th>
                            <th>Method/Referee</th>
                            <th>R</th>
                            <th>Time</th>
                            <th>KO</th>
                            <th>Submission</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fightHistory.length > 0 ? (
                            [...fightHistory].reverse().map((fight) => (
                              <tr key={fight.id} className={fight.result === "win" ? "table-success" : "table-danger"}>
                                <td className={`fw-bold ${fight.result === "win" ? "text-success" : "text-danger"}`}>
                                  {fight.result.charAt(0).toUpperCase() + fight.result.slice(1)}
                                </td>
                                <td>{fight.fighter_name}</td>
                                <td>
                                  {fight.event_name}
                                  {fight.fight_video_link && (
                                    <div className="text-center mt-2">
                                      <a 
                                        href={fight.fight_video_link.startsWith("http") ? fight.fight_video_link : `https://${fight.fight_video_link}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-sm btn-warning"
                                      >
                                        View Play-by-Play
                                      </a>
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <div className="fw-bold">{fight.method_referee?.split(" ")[0] || ""}</div>
                                  <div className="small text-muted">
                                    {fight.method_referee?.indexOf(" ") > -1 
                                      ? fight.method_referee.substring(fight.method_referee.indexOf(" ") + 1) 
                                      : ""}
                                  </div>
                                </td>
                                <td>{fight.rounds}</td>
                                <td>{fight.time?.substring(0, 5) || ""}</td>
                                <td>
                                  <span className={`badge ${fight.ko ? 'bg-success' : 'bg-danger'}`}>
                                    {fight.ko ? 'Yes' : 'No'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${fight.submission ? 'bg-success' : 'bg-danger'}`}>
                                    {fight.submission ? 'Yes' : 'No'}
                                  </span>
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button 
                                      className="btn btn-sm btn-primary" 
                                      onClick={() => handleEditFight(fight)}
                                    >
                                      <BiEdit />
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-danger" 
                                      onClick={() => handleDeleteFight(fight.id)}
                                    >
                                      <MdDelete />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="9" className="text-center py-3">No fight history records found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  </>

                  
                ) : null}
              </div>
            )}

{activeTab === "addCategories" && (
        <div className="tab-pane active" style={{ minHeight: "25rem" }}>
          {/* Category Form */}
          <div className="addCategory">
            <div className="input-category">
              <label htmlFor="category-name">Category Name</label>
              <input
                type="text"
                id="category-name"
                placeholder="Enter Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div className="button-category" style={{ marginTop: "1rem" }}>
              <button
                className="btn btn-secondary me-2"
                onClick={() => setCategoryName("")}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => handleSaveCat()}>
                Save
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="categories" style={{ marginTop: "3rem" }}>
            <label style={{ fontWeight: "600", marginBottom: "2rem" }}>
              Added Categories
            </label>
            <div className="category-list">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="category-item d-flex flex-column gap-2 mb-3"
                    style={{
                      border: "1px solid #dee2e6",
                      padding: "1rem",
                      borderRadius: "5px",
                    }}
                  >
                    <span>{category.category_name}</span>
                    <div className="d-flex flex-column gap-2">
                      <button
                        className="app-white border-0 rounded-1 py-1 px-2"
                        onClick={() => categoryEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="app-white border-0 rounded-1 py-1 px-2"
                        onClick={() => openSubPopup(category)}
                      >
                        Add Sub
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div>No categories found</div>
              )}
            </div>
          </div>

          {/* Subcategory Popup */}
          {isSubPopupVisible && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1050,
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  width: "500px",
                  maxHeight: "80vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Popup Header */}
                <div
                  style={{
                    padding: "1rem",
                    borderBottom: "1px solid #dee2e6",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h5 className="mb-0">
                    Subcategories for {activeCategory?.category_name}
                  </h5>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeSubPopup}
                  >
                    &times;
                  </button>
                </div>

                {/* Scrollable Subcategories List */}
                <div style={{ padding: "1rem", overflowY: "auto", flex: 1 }}>
                  {subcategories && subcategories.length > 0 ? (
                    subcategories.map((sub) => (
                      <div
                        key={sub.subcategory_id}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <span>{sub.subcategory_name}</span>
                        <div>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleStartEditingSub(sub)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleSubDelete(sub)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No subcategories available.</p>
                  )}
                </div>

                {/* Create or Update Subcategory Input */}
                <div style={{ padding: "1rem", borderTop: "1px solid #dee2e6" }}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter subcategory name"
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleCreateOrUpdateSub}>
                      {editingSub ? "Update" : "Create"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Update Category Popup (Existing UI) */}
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
                    onChange={(e) => {
                      /* handle update input change */
                    }}
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
                    of your courses and will lose access to your account and
                    data associated with your account forever, even if you
                    choose to create a new account using the same email address
                    in the future.
                  </p>
                  <button
                    className="signup-now py-2 px-3 fw-lightBold mb-0 h-auto"
                    onClick={() => setIsModalDelete(true)}
                  >
                    Close Account
                  </button>
                </div>

                {/* <Modal
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
                </Modal> */}

                <Modal show={finalDelete} path="/" btnName="Continue">
                  Your account has been successfully deleted!
                </Modal>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "4rem" }} className="mobile-settings w-100">
        <div
          style={{
            zIndex: "100",
            width: "max-content",
            justifySelf: "start",
            position: "sticky",
            top: "-0.3%",
            overflowX: "auto",
          }}
          className="mobile-top-myLearning w-100 gap-3 ps-3 p-2 px-2 justify-content-start mt-2 rounded-1 app-white d-flex gap-2"
        >
          <h4
            style={{ cursor: "pointer" }}
            className={`p-1 px-2 text-nowrap justify-content-center align-items-center rounded-2 fs-6 border-2 ${
              mobileActiveTab === "editProfile"
                ? "app-black border-black app-text-white"
                : "border border-1 text-secondary"
            }`}
            onClick={() => setMobileActiveTab("editProfile")}
          >
            {/* {category.category_name} */}
            Edit Profile
          </h4>
          {
            role === "expert" &&
            <>
            <h4
            style={{ cursor: "pointer" }}
            className={`p-1 px-2 text-nowrap justify-content-center align-items-center rounded-2 fs-6 border-2 ${
              mobileActiveTab === "matchHistory"
                ? "app-black border-black app-text-white"
                : "border border-1 text-secondary"
            }`}
            onClick={() => setMobileActiveTab("matchHistory")}
          >
            {/* {category.category_name} */}
            Matches
          </h4>
          <h4
            style={{ cursor: "pointer" }}
            className={`p-1 px-2 text-nowrap justify-content-center align-items-center rounded-2 fs-6 border-2 ${
              mobileActiveTab === "fighterHistory"
                ? "app-black border-black app-text-white"
                : "border border-1 text-secondary"
            }`}
            onClick={() => setMobileActiveTab("fighterHistory")}
          >
            {/* {category.category_name} */}
            Fighter History
          </h4>
            </>
            
          
          }
          <h4
            style={{ cursor: "pointer" }}
            className={`p-1 px-2 d-flex text-nowrap justify-content-center align-items-center rounded-2 fs-6 fw-regular border-2 ${
              mobileActiveTab === "security"
                ? "app-black app-text-white border-black"
                : "border border-1 text-secondary"
            }`}
            onClick={() => setMobileActiveTab("security")}
          >
            Security
          </h4>

          {
            role !== "admin" &&
            <h4
            style={{ cursor: "pointer" }}
            className={`p-1 px-2 rounded-2 text-nowrap justify-content-center align-items-center fs-6 border-2 ${
              mobileActiveTab === "closeAccount"
                ? "app-black border-black app-text-white"
                : "border border-1 text-secondary"
            }`}
            onClick={() => setMobileActiveTab("closeAccount")}
          >
            {/* {category.category_name} */}
            Close Account
          </h4>}
          {
            role === "admin" &&
            <h4
            style={{ cursor: "pointer" }}
            className={`p-1 px-2 rounded-2 text-nowrap justify-content-center align-items-center fs-6 border-2 ${
              mobileActiveTab === "addCategories"
                ? "app-black border-black app-text-white"
                : "border border-1 text-secondary"
            }`}
            onClick={() => setMobileActiveTab("addCategories")}
          >
            {/* {category.category_name} */}
            Add Category
          </h4>
          }
        </div>

        <div className="w-100 p-1 mt-2 px-2">
          {mobileActiveTab === "security" && (
            <div
              style={{ height: "70vh" }}
              className="w-100 app-white rounded-2 p-2"
            >
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="form-label fs-6 fw-medium "
                >
                  Email
                </label>
                <div className="input-group">

                <input
                  type="email"
                  className="form-control"
                  id="email"
                        placeholder="Enter email"
                        value={email ? email : ""}
                        readOnly
                />
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
              <div className="mb-3">
                <label
                  htmlFor="confirmPassword"
                  className="form-label fs-6 fw-medium"
                >
                  Password
                </label>
                <div className="input-group">

                <input
                  type="password"
                  className="form-control"
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
              <div
                style={{ width: "max-content", cursor: "pointer" }}
                className="app-red app-text-white rounded-2 px-4 py-2 fs-6 fw-bold"
              >
                Save Changes
              </div>
            </div>
          )}
          {/* {
            mobileActiveTab === "addCategories" && 

          } */}
          {mobileActiveTab === "editProfile" && (
            <div
              // style={{ height: "70vh" }}
              className="w-100 app-white rounded-2 p-2"
            >
              <div className="mb-2">
                <label htmlFor="fullName" className="form-label fs-6 fw-medium">
                  Full Name
                </label>
                <div className="input-group">

                <input
                  type="text"
                  className="form-control"
                  // id="fullName"
                  // placeholder="Jack"
                  id="name"
                          // value={isReadOnly ? name : userData.users.name}
                          value={
                            isReadOnly
                              ? userData.users.name
                              : userData.users.name
                          }
                          placeholder="Enter name"
                          readOnly={isReadOnly}
                          ref={inputRef}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              users: {
                                ...userData.users,
                                name: e.target.value,
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
              <div className="mb-3">
                <label htmlFor="dob" className="form-label fs-6 fw-medium">
                  Profile Picture
                </label>
                <div className="text-center d-flex justify-content-start mb-3">
                        {image ? (
                          <div className="w-75 d-flex justify-content-start rounded-3 py-2">
                            <img
                              src={image}
                              alt="Preview"
                              className="img-thumbnail object-fit-contain"
                              style={{ maxWidth: "200px" }}
                              onError={(e) => {
                                // console.log(e)
                                e.target.onerror = null;
                                e.target.src = defaultUser; // Fallback image
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-75 d-flex justify-content-start rounded-3 py-2">
                            <img
                              src={profile_picture || defaultUser}
                              alt="img"
                              className="img-thumbnail object-fit-contain"
                              style={{ maxWidth: "200px" }}
                              onError={(e) => {
                                // console.log(e)
                                e.target.onerror = null;
                                e.target.src = defaultUser; // Fallback image
                              }}
                            />
                          </div>
                        )}
                      </div>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                          accept="image/*"
                          onChange={handleImageChange}
                />
              </div>
              {role === "expert" &&
              <>
              <div className="form-group col-12 col-md-6 mb-4">
              <label htmlFor="company_name" className="mb-1 fs-5">
                Company Name
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-3"
                  id="company_name"
                  value={userData.users.company_name}
                  placeholder="Enter company name"
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

            {/* New fields for expert profile */}
            <div className="form-group col-12 mb-4">
              <label htmlFor="age" className="mb-1 fs-5">
                Age
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-3"
                  id="age"
                  value={userData.users.age}
                  placeholder="Enter your age"
                  readOnly={isReadOnly}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      users: {
                        ...userData.users,
                        age: e.target.value,
                      },
                    })
                  }
                />
                <div className="input-group-append">
                  <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={handleEditAgeClick}>
                    <FaPen />
                  </span>
                </div>
              </div>
            </div>

            <div className="form-group col-12 mb-4">
              <label htmlFor="height" className="mb-1 fs-5">
                Height
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-3"
                  id="height"
                  value={userData.users.height}
                  placeholder="Enter your height"
                  readOnly={isReadOnly}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      users: {
                        ...userData.users,
                        height: e.target.value,
                      },
                    })
                  }
                />
                <div className="input-group-append">
                  <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={handleEditHeightClick}>
                    <FaPen />
                  </span>
                </div>
              </div>
            </div>

            <div className="form-group col-12 mb-4">
              <label htmlFor="country" className="mb-1 fs-5">
                Country
              </label>
              <div className="input-group">
                <ReactFlagsSelect
                  selected={selectedCountry}
                  onSelect={(code) => setSelectedCountry(code)}
                  searchable={true}
                  className="w-100"
                  placeholder="Select a country"
                />
              </div>
            </div>

            <div className="form-group col-12 mb-4">
              <label htmlFor="userClass" className="mb-1 fs-5">
                Class
              </label>
              <div className="input-group">
                <select
                  className="form-control py-3"
                  id="userClass"
                  value={userData.users.class}
                  readOnly={isReadOnly}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      users: {
                        ...userData.users,
                        class: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">Select a class</option>
                  <option value="lightWeight">Light Weight</option>
                  <option value="middleWeight">Middle Weight</option>
                  <option value="heavyWeight">Heavy Weight</option>
                </select>
                <div className="input-group-append">
                  <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={handleEditClassClick}>
                    <FaPen />
                  </span>
                </div>
              </div>
            </div>

            {/* <div className="form-group col-12 mb-4">
              <label htmlFor="wins" className="mb-1 fs-5">
                Wins
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-3"
                  id="wins"
                  value={userData.users.wins}
                  placeholder="Enter wins count"
                  readOnly={isReadOnly}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      users: {
                        ...userData.users,
                        wins: e.target.value,
                      },
                    })
                  }
                />
                <div className="input-group-append">
                  <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={handleEditWinsClick}>
                    <FaPen />
                  </span>
                </div>
              </div>
            </div> */}

            {/* <div className="form-group col-12 mb-4">
              <label htmlFor="losses" className="mb-1 fs-5">
                Losses
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-3"
                  id="losses"
                  value={userData.users.losses}
                  placeholder="Enter losses count"
                  readOnly={isReadOnly}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      users: {
                        ...userData.users,
                        losses: e.target.value,
                      },
                    })
                  }
                />
                <div className="input-group-append">
                  <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={handleEditLossesClick}>
                    <FaPen />
                  </span>
                </div>
              </div>
            </div> */}

            {/* <div className="form-group col-12 mb-4">
              <label htmlFor="kto_percentage" className="mb-1 fs-5">
                KO/TKO Percentage
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-3"
                  id="kto_percentage"
                  value={userData.users.kto_percentage}
                  placeholder="Enter KO/TKO percentage"
                  readOnly={isReadOnly}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      users: {
                        ...userData.users,
                        kto_percentage: e.target.value,
                      },
                    })
                  }
                />
                <div className="input-group-append">
                  <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={handleEditKtoClick}>
                    <FaPen />
                  </span>
                </div>
              </div>
            </div> */}

            {/* <div className="form-group col-12 mb-4">
              <label htmlFor="submission_percentage" className="mb-1 fs-5">
                Submission Percentage
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-3"
                  id="submission_percentage"
                  value={userData.users.submission_percentage}
                  placeholder="Enter submission percentage"
                  readOnly={isReadOnly}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      users: {
                        ...userData.users,
                        submission_percentage: e.target.value,
                      },
                    })
                  }
                />
                <div className="input-group-append">
                  <span className="input-group-text h-100 rounded-start-0 px-4 bg-light-custom cursor-pointer"
                        onClick={handleEditSubmissionClick}>
                    <FaPen />
                  </span>
                </div>
              </div>
            </div> */}
            
            <div className="form-group w-md-50 mb-4">
</div>
            </>
              }


              <div
                style={{ width: "max-content", cursor: "pointer" }}
                className="app-red app-text-white rounded-2 px-4 py-2 fs-6 fw-bold"
                onClick={handleUpdateProfilePicture}
              >
                Save Changes
              </div>
            </div>
          )}

{mobileActiveTab === "addCategories" && (
        <div className="tab-pane active app-white" style={{ minHeight: "25rem", padding: "1rem" }}>
          {/* Category Form */}
          <div className="addCategory mb-3">
            <div className="input-category mb-2">
              <label htmlFor="category-name" className="form-label">
                Category Name
              </label>
              <input
                type="text"
                id="category-name"
                placeholder="Enter Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-100"
              />
            </div>
            <div className="d-flex gap-2">
              <button className="border-0 app-black app-text-white py-1 px-2 rounded-1" onClick={() => setCategoryName("")}>
                Cancel
              </button>
              <button className="border-0 app-red app-text-white py-1 px-3 rounded-1" onClick={handleSaveCat}>
                Save
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="categories mb-3">
            <label className="fw-bold mb-2">Added Categories</label>
            <div className="">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className=" mb-3 p-2 border rounded"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{category.category_name}</span>
                      <div className="d-flex gap-2">
                        <button
                          className="border-0 app-black app-text-white py-1 px-2 rounded-1"
                          onClick={() => categoryEdit(category)}
                        >
                          Edit
                        </button>
                        <button
                          className="border-0 app-red app-text-white py-1 px-2 rounded-1"
                          onClick={() => openSubPopup(category)}
                        >
                          Add Sub
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No categories found</div>
              )}
            </div>
          </div>

          {/* Subcategory Popup */}
          <Popup
            isOpen={isSubPopupVisible}
            onClose={closeSubPopup}
            title={`Subcategories for ${activeCategory?.category_name}`}
          >
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {subcategories.length > 0 ? (
                subcategories.map((sub) => (
                  <div
                    key={sub.subcategory_id}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <span>{sub.subcategory_name}</span>
                    <div className="d-flex gap-2">
                      <button
                        className="border-0 app-black app-text-white py-1 px-2 rounded-1"
                        onClick={() => handleStartEditingSub(sub)}
                      >
                        Edit
                      </button>
                      <button
                        className="border-0 app-red app-text-white py-1 px-2 rounded-1"
                        onClick={() => handleSubDelete(sub)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="mb-0">No subcategories available.</p>
              )}
            </div>
            <div className="mt-3 border-top pt-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter subcategory name"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                />
                <button className="border-0 app-red app-text-white py-1 px-2 rounded-1" onClick={handleCreateOrUpdateSub}>
                  {editingSub ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </Popup>

          {/* Update Category Popup */}
          <Popup isOpen={isPopupVisible} onClose={closePopup} title="Update Categories">
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Previous Category Name"
                value={previousCategoryName}
                disabled
              />
              <input
                type="text"
                className="form-control"
                placeholder="Enter New Category Name"
                onChange={(e) => {
                  // handle update input change
                }}
              />
            </div>
            <button className="border-0 app-red app-text-white py-1 px-2 rounded-1" onClick={handleUpdateCategory}>
              Update
            </button>
          </Popup>
        </div>
      )}
      {mobileActiveTab === "fighterHistory" && (
        <>
        <div className="app-white p-2">
        <div className="w-100 app-white rounded-2">
                  <h4
                    style={{ width: "max-content" }}
                    className={`p-1 px-2 rounded-2 bg-dark-subtle justify-content-start mb-2 align-self-center align-items-center fs-6 border-2 ${" border-black app-text-black"}`}
                  >
                    Fighter History - Pro
                  </h4>
                </div>
                
                <label htmlFor="result" className="form-label fs-6 fw-medium">
                  Results
                </label>
                <div className="d-flex align-items-center p-3 border rounded align-items-center mb-2">
                  <div className="form-check me-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="result"
                      id="mobileResultWin"
                      value="win"
                      checked={fighterHistoryData.result === "win"}
                      onChange={handleFighterHistoryChange}
                    />
                    <label className="form-check-label fs-6" htmlFor="mobileResultWin">
                      Wins
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="result"
                      id="mobileResultLoss"
                      value="loss"
                      checked={fighterHistoryData.result === "loss"}
                      onChange={handleFighterHistoryChange}
                    />
                    <label className="form-check-label fs-6" htmlFor="mobileResultLoss">
                      Loses
                    </label>
                  </div>
                </div>
                
                <label htmlFor="fighter_name" className="form-label fs-6 fw-medium">
                  Opponent Name
                </label>
                <input
                  type="text"
                  name="fighter_name"
                  value={fighterHistoryData.fighter_name}
                  className="form-control"
                  placeholder="Enter opponent name"
                  onChange={handleFighterHistoryChange}
                />
                
                <label htmlFor="event_name" className="form-label mt-2 fs-6 fw-medium">
                  Event Name
                </label>
                <input
                  type="text"
                  name="event_name"
                  value={fighterHistoryData.event_name}
                  className="form-control"
                  placeholder="Enter event name"
                  onChange={handleFighterHistoryChange}
                />
                
                <label htmlFor="event_date" className="form-label mt-2 fs-6 fw-medium">
                  Date
                </label>
                <input
                  type="date"
                  name="event_date"
                  value={fighterHistoryData.event_date}
                  className="form-control"
                  onChange={handleFighterHistoryChange}
                />
                
                <label htmlFor="method" className="form-label mt-2 fs-6 fw-medium">
                  Method Referee
                </label>
                <input
                  type="text"
                  name="method"
                  value={fighterHistoryData.method}
                  className="form-control"
                  placeholder="Enter method"
                  onChange={handleFighterHistoryChange}
                />
                
                <label htmlFor="rounds" className="form-label mt-2 fs-6 fw-medium">
                  Rounds
                </label>
                <input
                  type="number"
                  name="rounds"
                  value={fighterHistoryData.rounds}
                  className="form-control"
                  placeholder="Enter rounds"
                  onChange={handleFighterHistoryChange}
                />
                
                <label htmlFor="time" className="form-label mt-2 fs-6 fw-medium">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={fighterHistoryData.time}
                  className="form-control"
                  onChange={handleFighterHistoryChange}
                />
                
                <label htmlFor="video_link" className="form-label mt-2 fs-6 fw-medium">
                  Fight Video Link
                </label>
                <input
                  type="text"
                  name="video_link"
                  value={fighterHistoryData.video_link}
                  className="form-control"
                  placeholder="Enter video link"
                  onChange={handleFighterHistoryChange}
                />
                
                <div className="d-flex align-items-center mt-3 mb-2">
                  <div className="form-check me-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="mobileKoCheckbox"
                      name="ko"
                      checked={fighterHistoryData.ko}
                      onChange={(e) => setFighterHistoryData({
                        ...fighterHistoryData,
                        ko: e.target.checked
                      })}
                    />
                    <label className="form-check-label" htmlFor="mobileKoCheckbox">
                      KO
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="mobileSubmissionCheckbox"
                      name="submission"
                      checked={fighterHistoryData.submission}
                      onChange={(e) => setFighterHistoryData({
                        ...fighterHistoryData,
                        submission: e.target.checked
                      })}
                    />
                    <label className="form-check-label" htmlFor="mobileSubmissionCheckbox">
                      Submission
                    </label>
                  </div>
                </div>
                
                <div className="d-flex mt-3 mb-3">
                  <div
                    style={{ width: "max-content", cursor: "pointer" }}
                    className={`app-red app-text-white rounded-2 px-3 py-1 fs-6 fw-bold me-2`}
                    onClick={handleFighterHistoryPost}
                  >
                    {isEditing ? "Update" : "Add"}
                  </div>
                  
                  {isEditing && (
                    <div
                      style={{ width: "max-content", cursor: "pointer" }}
                      className="app-black app-text-white rounded-2 px-3 py-1 fs-6 fw-bold"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </div>
                  )}
                </div>
                
                {/* Fighter History Table */}
                <div className="mt-4">
                  <h5 className="mb-3">Fight History Records</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="bg-dark text-white">
                        <tr>
                          <th>Result</th>
                          <th>Fighter</th>
                          <th>Event</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fightHistory.length > 0 ? (
                          [...fightHistory].reverse().map((fight) => (
                            <tr key={fight.id} className={fight.result === "win" ? "table-success" : "table-danger"}>
                              <td className={`fw-bold ${fight.result === "win" ? "text-success" : "text-danger"}`}>
                                {fight.result.charAt(0).toUpperCase() + fight.result.slice(1)}
                              </td>
                              <td>{fight.fighter_name}</td>
                              <td>
                                {fight.event_name}
                                {fight.fight_video_link && (
                                  <div className="text-center mt-2">
                                    <a 
                                      href={fight.fight_video_link.startsWith("http") ? fight.fight_video_link : `https://${fight.fight_video_link}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="btn btn-sm btn-warning"
                                    >
                                      View
                                    </a>
                                  </div>
                                )}
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button 
                                    className="btn btn-sm btn-primary" 
                                    onClick={() => handleEditFight(fight)}
                                  >
                                    <BiEdit />
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-danger" 
                                    onClick={() => handleDeleteFight(fight.id)}
                                  >
                                    <MdDelete />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center py-3">No fight history records found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
        </div>
        
        </>
      )}
          {mobileActiveTab === "matchHistory" && (
              <div className="mb-2 app-white justify-content-center border border-1 p-2 rounded-2">
              <div className="d-flex mb-2">
                <div 
                  className={`me-2 py-1 px-2 rounded-2 ${matchesActiveTab === "past" ? "app-black app-text-white" : "border"}`}
                  style={{ cursor: "pointer", fontSize: "14px" }}
                  onClick={() => setMatchesActiveTab("past")}
                >
                  Past Competitions
                </div>
                <div 
                  className={`py-1 px-2 rounded-2 ${matchesActiveTab === "upcoming" ? "app-black app-text-white" : "border"}`}
                  style={{ cursor: "pointer", fontSize: "14px" }}
                  onClick={() => setMatchesActiveTab("upcoming")}
                >
                  Upcoming Competitions
                </div>
              </div>

              {matchesActiveTab === "past" ? (
                <>
                  
                <label htmlFor="dob" className="form-label fs-6 fw-medium">
                Competition Name 
                </label>
                <input
                  type="text"
                  name="competition_name"
                  value={pastMatchData.competition_name}
                  className="form-control"
                  id="fullName"
                  placeholder="Black Belt Asia"
                  onChange={handlePastMatchChange}
                    max={new Date().toISOString().split('T')[0]} // Set max date to today
                />
                <label htmlFor="dob" className="form-label mt-2 fs-6 fw-medium">
                  Match Date
                </label>
                <input
                name="competition_date"
                  type="date"
                  value={pastMatchData.competition_date}
                  className="form-control"
                  id="fullName"
                  placeholder="Black Belt Asia"
                  onChange={handlePastMatchChange}
                    max={new Date().toISOString().split('T')[0]} // Set max date to today
                />
                <label htmlFor="dob" className="form-label mt-2 fs-6 fw-medium">
                Achievements
                </label>
                <select 
                value={pastMatchData.acheavements}
                onChange={handlePastMatchChange}
                name="acheavements"
                id="acheavements"
                className="form-control"
                >
                <option value="Champion">🏆 Champion</option>
                  <option value="Runner-up">🥈 Runner-up</option>
                  <option value="Third Place">🥉 Third Place</option>
                  <option value="Fourth Place">🥈 Fourth Place</option>
                  <option value="Fifth Place">🥉 Fifth Place</option>
                </select>
                <label htmlFor="dob" className="form-label mt-2 fs-6 fw-medium">
                Location
                </label>
                <input
                name="location"
                onChange={handlePastMatchChange}
                  value={pastMatchData.location}
                  type="text"
                  className="form-control d-flex align-items-center"
                  id="fullName"
                  placeholder="US"
                />
                  <label htmlFor="match_link" className="form-label mt-2 fs-6 fw-medium">
                    Match Link
                  </label>
                  <input
                    name="match_link"
                    onChange={handlePastMatchChange}
                    value={pastMatchData.match_link}
                    type="url"
                    className="form-control d-flex align-items-center"
                    id="match_link"
                    placeholder="https://example.com/match-video"
                  />
                  <div className="d-flex mt-3">
                <div
                  style={{ width: "max-content", cursor: "pointer" }}
                      className="app-red app-text-white mt-2 rounded-2 px-3 py-1 fs-6 fw-bold me-2"
                  onClick={handleMatchPost}
                >
                      {isEditingMatch ? "Update" : "Add"}
                </div>

                    {isEditingMatch && (
                      <div
                        style={{ width: "max-content", cursor: "pointer" }}
                        className="app-black app-text-white mt-2 rounded-2 px-3 py-1 fs-6 fw-bold"
                        onClick={handleCancelMatchEdit}
                      >
                        Cancel
                </div>
                    )}
                  </div>

                  {/* Past Matches Table */}
                  <div className="mt-4">
                    <h5 className="mb-3">Past Competition Records</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                          <tr>
                            <th>Competition</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pastMatches.length > 0 ? (
                            [...pastMatches].reverse().map((match) => (
                              <tr key={match.id}>
                                <td>
                                  <strong>{match.competition_name}</strong>
                                  <br />
                                  <small>{match.competition_date ? new Date(match.competition_date).toLocaleDateString() : ""}</small>
                                  <br />
                                  <small>{match.acheavements} | {match.location}</small>
                                  {match.match_link && (
                                    <div className="mt-1">
                                      <a 
                                        href={match.match_link.startsWith("http") ? match.match_link : `https://${match.match_link}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-sm btn-info"
                                      >
                                        View Match
                                      </a>
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button 
                                      className="btn btn-sm btn-primary" 
                                      onClick={() => handleEditPastMatch(match)}
                                    >
                                      <BiEdit />
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-danger" 
                                      onClick={() => handleDeletePastMatch(match.id)}
                                    >
                                      <MdDelete />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="2" className="text-center py-3">No past competition records found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  
                <label htmlFor="dob" className="form-label fs-6 fw-medium">
                Competition Name 
                </label>
                <input
                  type="text"
                  name="competition_name"
                  value={pastUpcomingMatchData.competition_name}
                  className="form-control"
                  id="fullName"
                  placeholder="Black Belt Asia"
                  onChange={handlePastUpcomingMatchChange}
                    min={new Date().toISOString().split('T')[0]} // Set min date to today
                />
                <label htmlFor="dob" className="form-label mt-2 fs-6 fw-medium">
                  Match Date
                </label>
                <input
                name="competition_date"
                  type="date"
                  value={pastUpcomingMatchData.competition_date}
                  className="form-control"
                  id="fullName"
                  placeholder="Black Belt Asia"
                  onChange={handlePastUpcomingMatchChange}
                    min={new Date().toISOString().split('T')[0]} // Set min date to today
                />
                <label htmlFor="dob" className="form-label mt-2 fs-6 fw-medium">
                Location
                </label>
                <input
                name="location"
                onChange={handlePastUpcomingMatchChange}
                  value={pastUpcomingMatchData.location}
                  type="text"
                  className="form-control d-flex align-items-center"
                  id="fullName"
                  placeholder="US"
                />
                  <label htmlFor="match_link" className="form-label mt-2 fs-6 fw-medium">
                    Match Link
                  </label>
                  <input
                    name="match_link"
                    onChange={handlePastUpcomingMatchChange}
                    value={pastUpcomingMatchData.match_link}
                    type="url"
                    className="form-control d-flex align-items-center"
                    id="match_link"
                    placeholder="https://example.com/match-video"
                  />

                  <div className="d-flex mt-3">
                <div
                  style={{ width: "max-content", cursor: "pointer" }}
                      className="app-red app-text-white mt-2 rounded-2 px-3 py-1 fs-6 fw-bold me-2"
                  onClick={handleUpcomingMatchPost}
                >
                      {isEditingMatch ? "Update" : "Add"}
                </div>

                    {isEditingMatch && (
                      <div
                        style={{ width: "max-content", cursor: "pointer" }}
                        className="app-black app-text-white mt-2 rounded-2 px-3 py-1 fs-6 fw-bold"
                        onClick={handleCancelMatchEdit}
                      >
                        Cancel
            </div>
          )}
                  </div>

                  {/* Upcoming Matches Table */}
                  <div className="mt-4">
                    <h5 className="mb-3">Upcoming Competition Records</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                          <tr>
                            <th>Competition</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingMatches.length > 0 ? (
                            [...upcomingMatches].reverse().map((match) => (
                              <tr key={match.id}>
                                <td>
                                  <strong>{match.competition_name}</strong>
                                  <br />
                                  <small>{match.competition_date ? new Date(match.competition_date).toLocaleDateString() : ""}</small>
                                  <br />
                                  <small>{match.location}</small>
                                  {match.match_link && (
                                    <div className="mt-1">
                                      <a 
                                        href={match.match_link.startsWith("http") ? match.match_link : `https://${match.match_link}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-sm btn-info"
                                      >
                                        View Match
                                      </a>
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button 
                                      className="btn btn-sm btn-primary" 
                                      onClick={() => handleEditUpcomingMatch(match)}
                                    >
                                      <BiEdit />
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-danger" 
                                      onClick={() => handleDeleteUpcomingMatch(match.id)}
                                    >
                                      <MdDelete />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="2" className="text-center py-3">No upcoming competition records found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {mobileActiveTab === "closeAccount" && (
            <div
              style={{ height: "70vh" }}
              className="w-100 app-white rounded-2 p-3"
            >
              <CgDanger
                style={{ fontSize: "4rem" }}
                className=" app-text-red text-center align-self-center w-100"
              />
              <h2 className="fs-4 fw-bold app-text-red text-center mb-2">
                Account Closure
              </h2>
              <p className="text-center">
                If you close your account, you will be unsubscribed from all of
                your courses and will lose access to your account and data
                associated with your account forever, even if you choose to
                create a new account using the same email address in the future.
              </p>
              <div className="w-100 d-flex justify-content-center">
                <div
                  style={{ width: "max-content", cursor: "pointer" }}
                  className="mt-2 app-red app-text-white rounded-2 align-self-center px-4 py-2 fs-6 fw-bold"
                  onClick={() => setIsModalDelete(true)}
                >
                  Delete Account
                </div>
              </div>
              <Popup isOpen={finalDelete} >
                  Your account has been successfully deleted!
                  <div className="modal-footer justify-content-center">
                    <Link to={"/"} className="text-decoration-none">
                      <button className="app-red border-0 rounded-1 app-text-white py-2 px-3 fw-lightBold mb-0 h-auto">Continue</button>
                    </Link>
                  </div>
                </Popup>
            </div>
          )}
        </div>
      </div>
      
      <Popup 
      isOpen={isModalEmailChange}
                  onClose={closeModalEmailChange}
                  title="Change Email"
      >
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
                    For security reason any saved card information will be
                    deleted if you change email.
                  </p>

                  <div className="d-flex align-items-center gap-2 justify-content-end">
                    <button
                      className="rounded-1 border-0 app-black app-text-white py-1 px-3 fw-lightBold mb-0 h-auto"
                      onClick={()=>setIsModalEmailChange(false)}
                    >Cancel</button>
                    <button
                      className="rounded-1 border-0 app-red app-text-white py-1 px-3 fw-lightBold mb-0 h-auto"
                      onClick={handleVerifyClick}
                    >
                      Verify
                    </button>
                  </div>
      </Popup>
      
        <Popup
        isOpen={isModalDelete}
                  onClose={closeModalDelete}
                  
                  title="Close Account?"
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
                    <div className="d-flex align-items-center gap-2 justify-content-end m-3">
                      <button
                        className="app-black border-0 rounded-1 app-text-white py-1 px-3 fw-lightBold mb-0 h-auto"
                        onClick={()=>setIsModalDelete(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="app-red border-0 rounded-1 app-text-white py-1 px-3 fw-lightBold mb-0 h-auto"
                        onClick={handleNextAction}
                      >
                        Delete
                      </button>
                  </div>  
                  </div>
        </Popup>
      
      <Popup
      isOpen={isModalPasswordChange}
                  onClose={closeModalPasswordChange}
                  title="Change Password"
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
                  <div className="d-flex align-items-center gap-2 justify-content-end">
                  <button
                      className="app-black border-0 rounded-1 app-text-white py-1 px-3 fw-lightBold mb-0 h-auto"
                      onClick={()=>setIsModalPasswordChange(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="app-red border-0 rounded-1 app-text-white py-1 px-3 fw-lightBold mb-0 h-auto"
                      onClick={handlePasswordUpdateAction}
                    >
                      Save
                    </button>
                  </div>
      </Popup>

      
      
    </>
  );
}
