import axios from "axios";
import { BASE_URI } from "../../Config/url";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PulseLoader } from "react-spinners";

const Logout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    setIsLoading(true);
    axios
      .post(
        `${BASE_URI}/api/v1/auth/logout`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        setIsLoading(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        navigate("/");
        window.location.reload();
        toast.success(`Logged out successfully!`);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error(`Failed to log out. Please try again.`);
      });
  };

  return (
    <div className=" w-100" style={{ height: "36rem" }}>
      <div className="text-center p-5 bg-light rounded custom-box h-100 d-flex align-items-center justify-content-center">
        <div>
          <h2 className="mb-3">Confirm Logout</h2>
          <p className="mb-4">Are you sure you want to logout?</p>
          <div size="lg" onClick={handleLogout} style={{cursor:"pointer"}} className="app-black p-2 app-text-white fw-regular rounded">
            {isLoading ? <PulseLoader size={8} color="white" /> : "Logout"}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Logout;
