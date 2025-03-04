import { useState } from "react";
import axios from "axios";
import { BASE_URI } from "../../Config/url";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

import './AddExpert.css'

export default function AddExpert() {
  const [expertName, setExpertName] = useState("");
  const [expertEmail, setExpertEmail] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSaveExpert = async () => {
    if (!expertName || !expertEmail) {
      toast.error("Both name and email cannot be empty!");
      return;
    }

    const expertData = {
      name: expertName, // Payload for the API
      email: expertEmail, // Include the email in the payload
    };

    try {
      const response = await axios.post(
        `${BASE_URI}/api/v1/admin/expertsForAdmin`, // Assuming this is the correct endpoint for adding an expert
        expertData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      toast.success(response.data.message);
      setExpertName(""); // Clear input after saving
      setExpertEmail(""); // Clear email input after saving
       // Navigate to the Expert page after saving
       navigate('/experts'); 
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create expert");
    }
  };

  return (
    <div className="w-100">
        <div className="addExpert-resp"
        style={{
          marginBottom: "4vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
         
        }}
      >
        <div className="upper-text">
          <span>
            Welcome Back, <strong>Basit Bashir</strong>
          </span>
          <p style={{ fontWeight: "lighter" }}>Track & manage your platform</p>
        </div>
       
      </div>
      <div className="addexpert"
  style={{
    display: "flex",
    justifyContent: "flex-end", // Aligns content to the right
    alignItems: "center",

  }}
>
  <button
    className="add-expert expertcss"
    style={{
      display: "flex",
      alignItems: "center",
      // You can add more styles here if needed, e.g. padding, margin
    }}
    onClick={() => {
      
      navigate("/AddExperts");
    }}
  >
    Add Expert
  </button>
</div>

       
      <header
        className="bg-gradient-custom-div p-2 pb-0 rounded-bottom-0 custom-box"
        style={{ overflowX: "auto" }}
      >
        <h5 className="pb-2" style={{
          textAlign: 'center',
          fontWeight: '300'  // Adjust this for lighter weight, e.g. 300 or 200
        }}>
          Add Experts
        </h5>
      </header>
      <div className="tab-content px-3 py-4 custom-box rounded-top-0"
        style={{ background: "white" }}>
        <div className="addExpert ">
          <div className="input-category a-expert">
            <label htmlFor="expert-name">Full Name </label>
            <input
              type="text"
              id="expert-name" // Unique ID for the name input
              placeholder="Enter Full Name"
              value={expertName} // Bind the input to the state
              onChange={(e) => setExpertName(e.target.value)}
            />
          </div>
          <div className="input-category a-expert">
            <label htmlFor="expert-email">Email </label>
            <input
              type="text"
              id="expert-email" // Unique ID for the email input
              placeholder="Enter Email"
              value={expertEmail} // Bind the input to the state
              onChange={(e) => setExpertEmail(e.target.value)} // Update the email state
            />
          </div>
          <div className="button-category">
            <button
              className="cancel-cat"
              onClick={() => {
                setExpertName(""); // Clear name input
                setExpertEmail(""); // Clear email input
              }}
            >
              Discard
            </button>
            <button className="save-cat" onClick={handleSaveExpert}>
              Add & close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}