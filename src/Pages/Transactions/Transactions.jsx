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
import formatDate from "../../utils/formatDate";
import toast from "react-hot-toast";
import Error from "../../Components/Error/Error";
import SearchNotFound from "../../assets/searchNotFound.svg";
import { CustomLoader } from "../../Components/CustomLoader/CustomLoader";
import Popup from "../../Components/PopUp/PopUp";


const UserManagement = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("payoutRequests");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
      console.log(response?.data?.data);
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
      console.log(response.data.data.history);
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

  useEffect(() => {
    if (activeTab === "payoutRequests") {
      fetchPayoutRequests();
    }
  }, [refreshTrigger]);

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
      // Update the local state immediately
      setPayoutRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === request 
            ? { ...req, is_paid: 1 } 
            : req
        )
      );
    } catch (err) {
      setError(err?.response?.data?.message);
      toast.error(err?.response?.data?.message || "Payout failed");
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
    fetchPayoutRequests(); // Fetch fresh data when popup closes
  };

  // useEffect(() => {
  //   if(payoutSuccess === "false"){
  //     fetchPayoutRequests();
  //   }
  // }, [payoutSuccess, closePopup]);

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
    <>
    <div className="w-100 wrapper-experts">

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



    <div style={{marginBottom:"4.5rem"}} className="mobile-experts w-100">
    {
       
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

          className={`p-1 px-2 rounded-2 fs-6 fw-regular border-2 ${activeTab === "payoutRequests" ? "app-black app-text-white border-black" : "border border-1 text-secondary"}`}
          onClick={() => setActiveTab("payoutRequests")}>
            Requests
          </h4>
          <h4
                    style={{cursor:"pointer"}}

            className={`p-1 px-2 rounded-2 fs-6 border-2 ${
              activeTab === "transactions"
                ? "app-black border-black app-text-white"
                : "border border-1 text-secondary"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            {/* {category.category_name} */}
            PayLogs
          </h4>
          <h4
                    style={{cursor:"pointer"}}

            className={`p-1 px-2 rounded-2 fs-6 border-2 ${
              activeTab === "editCommission"
                ? "app-black border-black app-text-white"
                : "border border-1 text-secondary"
            }`}
            onClick={() => setActiveTab("editCommission")}
          >
            {/* {category.category_name} */}
            Commission
          </h4>
        </div>}

{
  loading ? 
  <div className="d-flex w-100 p-1 app-white flex-column mt-1">

<CustomLoader width="100%" height="10rem" className="rounded-3 mt-2"/>
<CustomLoader width="100%" height="10rem" className="rounded-3 mt-2"/>

<CustomLoader width="100%" height="10rem" className="rounded-3 mt-2"/>

<CustomLoader width="100%" height="10rem" className="rounded-3 mt-2"/>

  </div>
  :
  activeTab === "payoutRequests" && (
    <div className="px-2 w-100 mt-2">
    <div className="w-100 d-flex flex-column justify-content-center align-items-center app-white p-2 rounded-1">
    {
    !payoutRequests.length ?
    <Error imageSrc={SearchNotFound} message="No Requests Found" />
    :
    payoutRequests?.map((order, index) => {
      return (
        <div key={index} className="w-100 border border-1 p-2 rounded-1 mb-2">
          <span className="w-100 d-flex justify-content-evenly">
            <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Name:</h6>
            <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{order.name}</h6>
          </span>
    
          <span className="w-100 d-flex justify-content-evenly pt-2">
            <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Date:</h6>
            <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{formatDate(order.created_at)}</h6>
          </span>
    
          <span className="w-100 d-flex justify-content-evenly pt-2">
            <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Amount:</h6>
            <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{order.amount}</h6>
          </span>
    
          <span className="w-100 d-flex justify-content-evenly pt-2">
            <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Action:</h6>
            {
              order.is_paid === 0 ? 
              <button
              onClick={() => handleAction(order.id)}
              style={{ fontSize: "0.9rem", width: "25%" }}
              className="fw-regular border-0 app-text-white app-black d-flex align-items-center justify-content-center p-1 px-2 rounded-1"
            >
              Pay
            </button> :
             <button
             onClick={() => toast.success("Already paid")}
             style={{ fontSize: "0.9rem", width: "25%" }}
             className="fw-regular border-0 app-text-white app-black d-flex align-items-center justify-content-center p-1 px-2 rounded-1"
           >
             Paid
           </button>
            }
           
          </span>
        </div>
      );
    })}
    
    </div>
    </div>
  )
}

{
  activeTab === "transactions" && (
    <div className="px-2 w-100 mt-2">
    <div className="w-100 d-flex flex-column justify-content-center align-items-center app-white p-2 rounded-1">
    {
    !transactions.length ?
    <Error imageSrc={SearchNotFound} message="No Pay Logs Found" />
    :
    transactions?.map((order, index) => {
      return (
        <div key={index} className="w-100 border border-1 p-2 rounded-1 mb-2">
          <span className="w-100 d-flex justify-content-evenly">
            <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Name:</h6>
            <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{order.name}</h6>
          </span>
    
          <span className="w-100 d-flex justify-content-evenly pt-2">
            <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Date:</h6>
            <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{formatDate(order.withdrawal_date)}</h6>
          </span>
    
          <span className="w-100 d-flex justify-content-evenly pt-2">
            <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Transaction ID:</h6>
            <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75 text-break">{order.transaction_id}</h6>
          </span>

          <span className="w-100 d-flex justify-content-evenly pt-2">
            <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Withdrawal Amount:</h6>
            <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{order.withdrawal_amount}</h6>
          </span>

          <span className="w-100 d-flex justify-content-evenly pt-2">
            <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Status:</h6>
            <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{order.withdrawal_status}</h6>
          </span>
    
          
        </div>
      );
    })}
    
    </div>
    </div>
  )
}

{

activeTab === "editCommission" && (
            <div className="tab-pane active px-2 app-white mx-2 mt-2 ">
              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="commission" className="form-label app-black app-text-white p-1 rounded-1 mt-2"> 
                    <strong >Commission Rate</strong>
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
                        <div className="button-btn d-flex gap-2">
                          <button
                            className=" border-0 rounded-1 px-3  p-2 comission-button app-red app-text-white"
                            style={{
                              // background:
                              //   "linear-gradient(92.36deg, #0c243c 0%, #7e8c9c 98.67%)",
                              color: "white",
                            }}
                            onClick={handlesave}
                          >
                            Save
                          </button>
                          <button
                            className="border-0 rounded-1 px-3 p-2 comission-button app-black app-text-white"
                            // style={{
                            //   background: "white",
                            //   color: "black",
                            //   border: "white",
                            //   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            // }}
                            onClick={handleDiscard}
                          >
                            Discard
                          </button>
                        </div>
                      ) : (
                        <button
                          className="border-0 rounded-1 px-3  p-2 comission-button  app-text-white h-100  px-4 bg-light-custom cursor-pointer "
                          // style={{
                          //   background:
                          //     "linear-gradient(92.36deg, #0c243c 0%, #7e8c9c 98.67%)",
                          //   color: "white",
                          //   border: "white",
                          //   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          // }}
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
    <Popup isOpen={payoutSuccess} onClose={closePopup} title="Payout Successful!">
  <div className="text-center p-4">
    <div className="checkmark-container">
      <i className="bi bi-check-circle-fill text-success fs-1 checkmark-animation"></i>
    </div>
    <p className="mt-3 fw-semibold text-secondary">Your payout has been processed successfully!</p>
    <button className="btn btn-success mt-3 px-4" onClick={closePopup}>
      Close
    </button>
  </div>
</Popup>

    </>
  );
};

export default UserManagement;
