import { useState, useEffect } from "react";
import "./ToggleSwitch.css";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ToggleSwitch = ({ onChange }) => {
  // Get initial state from localStorage
  const [isExpert, setIsExpert] = useState(() => localStorage.getItem("userType") === "expert");
  const navigate = useNavigate();


  useEffect(() => {
    localStorage.setItem("userType", isExpert ? "expert" : "user");
    if (onChange) onChange(isExpert);
  }, [isExpert, onChange]);

  const handleToggle = () => {
    const newState = !isExpert;
  
    if (isExpert) {
      // Switching from Expert to User
      localStorage.setItem("oldUserType", "expert");
      toast.success("You have been toggled as User");
    } else {
      // Switching from User to Expert (if eligible)
      if (localStorage.getItem("oldUserType") === "expert") {
        localStorage.removeItem("oldUserType");
        toast.success("You are now an Expert");
      } else {
        toast.error("You are not eligible for this feature");
        return; // Prevent state update if not eligible
      }
    }
  
    // Update state which immediately updates the UI
    setIsExpert(newState);
  
    // Navigate after a short delay to allow UI transition
    setTimeout(() => {
        
      if (newState) {
        navigate("/courses");
      } else {
        navigate("/categories");
      }
    }, 500);
  };
  

  return (
    <label className={`switch ${isExpert ? "checked" : ""}`} aria-label="Toggle User Type">
      <input type="checkbox" checked={isExpert} onChange={handleToggle} />
      <span>User</span>
      <span>Expert</span>
    </label>
  );
};

export default ToggleSwitch;
