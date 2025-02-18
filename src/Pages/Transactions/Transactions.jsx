import { useEffect, useState } from "react";
import { BASE_URI } from "../../Config/url";
import axios from "axios";

import { FaCalendar } from "react-icons/fa6";
import { HiArrowCircleRight } from "react-icons/hi";
import { HiArrowCircleLeft } from "react-icons/hi";
import { FaPen } from "react-icons/fa";
import "./Transactions.css";
import { useDispatch } from "react-redux";
import { payoutActions } from "../../Store/payoutSlice";
import { HashLoader } from "react-spinners";

const UserManagement = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("payoutRequests");

  const token = localStorage.getItem("token");

  const transactionsUrl = `${BASE_URI}/api/v1/admin/adminPayHistory`;

  const payoutRequestsUrl = `${BASE_URI}/api/v1/admin/payoutRequest`; // New URL for payout requests
  const getCommissionUrl = `${BASE_URI}/api/v1/admin/commission`;

  const [transactions, setTransactions] = useState([]);

  const [payoutRequests, setPayoutRequests] = useState([]); // New state for payout requests

  const [editCommission, setEditCommission] = useState({
    id: "",
    commission: "",
  });
  const [originalCommission, setOriginalCommission] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const editCommissionUrl = `${BASE_URI}/api/v1/admin/commission/${editCommission.id}`;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // const [pageNumber, setPageNumber] = useState(1);
  // const [totalPages, setTotalPages] = useState(2);
  // const [limit, setLimit] = useState(7);

  const fetchPayoutRequests = async () => {
    setLoading(true)
    // New function to fetch payout requests
    try {
      const response = await axios.get(payoutRequestsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayoutRequests(response?.data?.data || []);
      // setTotalPages(Math.ceil(response?.data?.total / limit));
    } catch (err) {
      setError(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // const fetchTransactions = async () => {
  //   try {
  //     const response = await axios.get(transactionsUrl, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       }
  //     });
  //     setTransactions(response.data?.data?.history || []);

  //   } catch (err) {
  //     setError(err?.response?.data?.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchTransactions = async (pageNumber) => {
    setLoading(true)
    try {
      const response = await axios.get(transactionsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: pageNumber,
          limit: 5, // Set the limit to 10
        },
      });
      setTransactions(response.data.data.history || []);
      setTotalPages(2);
    } catch (err) {
      setError(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchEditCommission = async () => {
    setLoading(true)
    try {
      const response = await axios.get(getCommissionUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const commissionData = response.data.commission || {};
      setEditCommission(commissionData);
      setOriginalCommission(commissionData.commission || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data based on the active tab
  useEffect(() => {
    if (activeTab === "transactions") {
      fetchTransactions();
    } else if (activeTab === "payoutRequests") {
      fetchPayoutRequests();
    } else if (activeTab === "editCommission") {
      fetchEditCommission();
    }
  }, [activeTab]);

  const handleAction = async (request) => {
    setLoading(true)

    try {
      const response = await axios.post(
        `${BASE_URI}/api/v1/payment/payout/${request}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPayoutSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handlesave = async () => {
    setLoading(true)
    try {
      const response = await axios.patch(
        editCommissionUrl,
        {
          commission: editCommission.commission,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOriginalCommission(editCommission.commission);
      // setEditCommission(response.data || []);
      setIsEditable(false);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = () => {
    setIsEditable(true);
  };
  const handleDiscard = () => {
    setEditCommission((prev) => ({
      ...prev,
      commission: originalCommission,
    }));
    setIsEditable(false);
  };

  const closePopup = () => {
    setPayoutSuccess(false);
    setTimeout(() => {
      fetchPayoutRequests(); // Refetch payout requests
    }, 0);
  };

  // const handlePageClick = (pageNumber) => {
  //   setPageNumber(pageNumber);
  //   fetchTransactions(pageNumber);
  // };

  const getRandomColor = () => {
    const colors = [
      "#2C3E50", // Dark Blue-Gray
      "#8E44AD", // Deep Purple
      "#2980B9", // Soft Blue
      "#16A085", // Teal
      "#27AE60", // Green
      "#F39C12", // Muted Orange
      "#D35400", // Burnt Orange
      "#C0392B", // Deep Red
      "#BDC3C7", // Light Gray
      "#7F8C8D", // Slate Gray
      "#34495E", // Steel Blue
      "#E67E22", // Warm Orange
      "#9B59B6", // Purple
      "#1ABC9C", // Aquamarine
      "#3498DB", // Light Blue
      "#95A5A6", // Cool Gray
      "#E74C3C", // Muted Red
      "#F1C40F", // Soft Yellow
      "#AAB7B8", // Soft Silver
      "#5D6D7E", // Dark Slate Blue
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };
  return (
    <div className="w-100">

{
        loading ? 
        <div style={{height:"90vh"}} className="flex align-items-center justify-content-center w-100">
        <HashLoader size="60" color="#0c243c"/>
      </div>
      :
      <>
      {payoutSuccess && (
        <div className="popup">
          <div className="popup-content">
            <p>Payout Successful!</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      <div
        style={{
          marginBottom: "4vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="upper-text">
          <span>
            Welcome Back, <strong>{user?.name}</strong>
          </span>
          <p style={{ fontWeight: "lighter" }}>Track & manage your platform</p>
        </div>
        {/* <div
          className="upper-date"
          style={{ display: "flex", alignItems: "center" }}
        >
          <FaCalendar style={{ marginRight: "8px" }} />
          Sep 4, 2024
        </div> */}
      </div>
      <header
        className="header-container p-3 pb-0 rounded-bottom-0 custom-box  "
        style={{ backgroundColor: "white", overflowX: "auto" }}
      >
        <div className="d-flex gap-5 px-4 ">
  {[
    "payoutRequests", // New tab for payout requests
    "transactions",
    "editCommission",
  ].map((tab) => (
    <h5
      key={tab}
      className={`tab-item px-3 pb-3 py-1 fw-light ${
        activeTab === tab ? "active-tab" : "inactive-tab"
      }`}
      onClick={() => setActiveTab(tab)}
      style={{ cursor: "pointer" }} // Add cursor pointer style here
    >
      {tab
        .replace(/([A-Z])/g, " $1")
        .replace(/\b\w/g, (char) => char.toUpperCase())}
    </h5>
  ))}
</div>
      </header>

      <div
        className="tab-content px-3 py-1 custom-box rounded-top-0"
        style={{ backgroundColor: "white" }}
      >
        <div className="px-4">
          {/* Payout Requests */}
          <div className="bottom-transactions">
            {activeTab === "payoutRequests" &&
              (error === "no requests found" ? (
                <>
                  <div className="no-courses-transactions">
                    <div>
                      <h1>No Payment Requests Found</h1>
                    </div>
                  </div>
                </>
              ) : (
                <div className="tab-pane active" style={{ overflowX: "auto" }}>
                  <table className="table w-md-reverse-50">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col" className="text-center">
                          Amount Requested
                        </th>
                        <th scope="col" className="text-center">
                          Requested On
                        </th>
                        <th scope="col" className="text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payoutRequests?.map((request, index) => (
                        <tr key={index}>
                          <td className="align-middle fs-small py-2 text-capitalize">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {request?.profile_picture ? (
                                <img
                                  src={request.profile_picture}
                                  alt={request.name}
                                  style={{
                                    width: "33px",
                                    height: "33px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginRight: "10px",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "33px",
                                    height: "33px",
                                    borderRadius: "50%",
                                    backgroundColor: getRandomColor(), // Random background color
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "10px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#fff",
                                  }}
                                >
                                  {request?.name?.charAt(0)?.toUpperCase()}{" "}
                                  {/* Display the first initial */}
                                </div>
                              )}
                              {request?.name}
                            </div>
                          </td>
                          <td className="text-center align-middle fs-small">
                            ${request?.amount}
                          </td>
                          <td className="text-center align-middle fs-small">
  {request?.created_at ? new Date(request.created_at).toLocaleString() : "N/A"}
</td>
                          <td className="text-center align-middle fs-small">
                            <button
                              className="btn"
                              style={{
                                background:
                                  "linear-gradient(92.36deg, #0c243c 0%, #7e8c9c 98.67%)",
                                color: "white",
                              }}
                              onClick={() => handleAction(request?.id)}
                            >
                              Pay Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
          </div>

          {/* Transactions */}

          <div className="bottom-transactions">
            {activeTab === "transactions" &&
              (error === "no transactions found" ? (
                <>
                  <div className="no-courses-transactions">
                    <div>
                      <h1>No Transactions Found</h1>
                    </div>
                  </div>
                </>
              ) : (
                <div className="tab-pane active">
                  <div style={{ overflowX: "auto" }}>
                    <table className="table w-md-reverse-50">
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col" className="text-center">
                            Price
                          </th>
                          <th scope="col" className="text-center">
                            Transaction Id
                          </th>
                          <th scope="col" className="text-center">
                            Transaction Date
                          </th>
                          <th scope="col" className="text-center">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((user, index) => (
                          <tr key={index}>
                            <td className="align-middle fs-small py-2 text-capitalize">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {user.profile_picture ? (
                                  <img
                                    src={user.profile_picture}
                                    alt={user.name}
                                    style={{
                                      width: "33px",
                                      height: "33px",
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                      marginRight: "10px",
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: "33px",
                                      height: "33px",
                                      borderRadius: "50%",
                                      backgroundColor: getRandomColor(), // Random background color
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginRight: "10px",
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                      color: "#fff",
                                    }}
                                  >
                                    {user.name.charAt(0).toUpperCase()}{" "}
                                    {/* Display the first initial */}
                                  </div>
                                )}
                                {user.name}
                              </div>
                            </td>
                            <td className="text-center align-middle fs-small">
                              {user.withdrawal_amount}
                            </td>
                            <td className="text-center align-middle fs-small">
                              {user.transaction_id}
                            </td>
                            <td className="text-center align-middle fs-small">
                              {new Date(
                                user.withdrawal_date
                              ).toLocaleDateString()}
                            </td>
                            <td className="text-center align-middle fs-small">
                              <span
                                style={{
                                  color:
                                    user.withdrawal_status.toLowerCase() ===
                                    "success"
                                      ? "green"
                                      : user.withdrawal_status.toLowerCase() ===
                                        "failed"
                                      ? "red"
                                      : "black",
                                }}
                              >
                                {user.withdrawal_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* <div className="pagination">
                    {loading ? (
                      <div>Loading...</div>
                    ) : (
                      totalPages > 0 &&
                      Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          className={`btn-pagination ${
                            pageNumber === i + 1 ? "active" : ""
                          }`}
                          onClick={() => handlePageClick(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))
                    )}
                  </div> */}
                </div>
              ))}
          </div>

          {/* Edit commisson  */}
          {activeTab === "editCommission" && (
            <div className="tab-pane active">
              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="commission" className="form-label">
                    <strong>Commission Rate</strong>
                  </label>
                  <div className="input-part" style={{ display: "flex" }}>
                    <input
                      style={{
                        width: "60vh",
                        border: "1px solid #3a4e6f", // Blue border with a width of 2px
                      }}
                      type="text"
                      placeholder="Enter Percentage"
                      id="commission"
                      className="form-control f-new"
                      value={editCommission.commission || ""} // Access the commission property inside the commission object
                      onChange={(e) =>
                        setEditCommission((prev) => ({
                          ...prev,
                          commission: e.target.value,
                        }))
                      }
                      disabled={!isEditable}
                    />
                    <div className="col-12 button-group">
                      {isEditable ? (
                        <div className="button-btn">
                          <button
                            className="btn comission-button"
                            style={{
                              background:
                                "linear-gradient(92.36deg, #0c243c 0%, #7e8c9c 98.67%)",
                              color: "white",
                            }}
                            onClick={handlesave}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary ms-2 comission-button"
                            style={{
                              background: "white",
                              color: "black",
                              border: "white",
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }}
                            onClick={handleDiscard}
                          >
                            Discard
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-secondary ms-2 input-group-text h-100  px-4 bg-light-custom cursor-pointer edit-button"
                          style={{
                            background:
                              "linear-gradient(92.36deg, #0c243c 0%, #7e8c9c 98.67%)",
                            color: "white",
                            border: "white",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                          onClick={handleEdit}
                        >
                          <FaPen />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p
                  style={{
                    color: "red",
                    fontWeight: "lighter",
                  }}
                >
                  {" "}
                  *The commission will be applicable on all transactions
                </p>
                <p
                  style={{
                    color: "red",
                    fontWeight: "lighter",
                    marginBottom: "25vh",
                  }}
                >
                  {" "}
                  *The Updated commission rate will be applicable from date of
                  transaction{" "}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      </>
      }
    </div>
  );
};

export default UserManagement;
