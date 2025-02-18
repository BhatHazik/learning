import { useState, useEffect, useMemo } from "react";
import "./UserWallet.css";
import axios from "axios";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { BASE_URI } from "../../Config/url";
import formatDate from "../../utils/formatDate";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { loadStripe } from "@stripe/stripe-js";
import jiujitsuCoin from "../../assets/jiujitsuCoin.png";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

export default function UserWallet() {
  const [activeTab, setActiveTab] = useState("activity");
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const [bankDetails, setBankDetails] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [country, setCountry] = useState("");
  const [routing, setRouting] = useState("");
  const [editable, setEditable] = useState(false);
  const [withDrawPopup, setWithDrawPopup] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(null);
  const [withdrawalHistory, setWithdrawalHistory] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState("transactions");
  const [coinCost, setCoinCost] = useState(null);

  const transactions = [
    {
      date: "26/07/2024",
      amount: "$496",
      coins: "76 Coins",
      status: "Success",
    },
    {
      date: "25/07/2024",
      amount: "$320",
      coins: "50 Coins",
      status: "Pending",
    },
    { date: "24/07/2024", amount: "$150", coins: "22 Coins", status: "Failed" },
    {
      date: "23/07/2024",
      amount: "$750",
      coins: "120 Coins",
      status: "Success",
    },
    { date: "22/07/2024", amount: "$90", coins: "10 Coins", status: "Success" },
    {
      date: "21/07/2024",
      amount: "$250",
      coins: "40 Coins",
      status: "Success",
    },
    {
      date: "20/07/2024",
      amount: "$600",
      coins: "90 Coins",
      status: "Pending",
    },
    { date: "19/07/2024", amount: "$180", coins: "30 Coins", status: "Failed" },
    {
      date: "18/07/2024",
      amount: "$420",
      coins: "65 Coins",
      status: "Success",
    },
    {
      date: "17/07/2024",
      amount: "$530",
      coins: "85 Coins",
      status: "Success",
    },
    {
      date: "16/07/2024",
      amount: "$275",
      coins: "45 Coins",
      status: "Success",
    },
    {
      date: "15/07/2024",
      amount: "$380",
      coins: "60 Coins",
      status: "Pending",
    },
    {
      date: "14/07/2024",
      amount: "$110",
      coins: "18 Coins",
      status: "Success",
    },
  ];


  const purchases = [
    {
      courseName: "React Native Masterclass",
      date: "12/02/2024",
      price: "$49",
      paymentType: "Credit Card",
      receipt: "RNM12345.pdf",
    },
    {
      courseName: "Full Stack Web Development",
      date: "05/01/2024",
      price: "$99",
      paymentType: "PayPal",
      receipt: "FSWD98765.pdf",
    },
    {
      courseName: "Advanced Node.js",
      date: "22/03/2024",
      price: "$79",
      paymentType: "Debit Card",
      receipt: "ANJ56789.pdf",
    },
    {
      courseName: "UI/UX Design Fundamentals",
      date: "10/04/2024",
      price: "$59",
      paymentType: "Google Pay",
      receipt: "UXD12345.pdf",
    },
    {
      courseName: "Python for Data Science",
      date: "18/05/2024",
      price: "$89",
      paymentType: "Apple Pay",
      receipt: "PDS65432.pdf",
    },
    {
      courseName: "Machine Learning Bootcamp",
      date: "25/06/2024",
      price: "$149",
      paymentType: "Credit Card",
      receipt: "MLB09876.pdf",
    },
    {
      courseName: "JavaScript Essentials",
      date: "30/07/2024",
      price: "$39",
      paymentType: "PayPal",
      receipt: "JSE55443.pdf",
    },
    {
      courseName: "Cybersecurity Basics",
      date: "15/08/2024",
      price: "$69",
      paymentType: "Debit Card",
      receipt: "CSB33221.pdf",
    },
    {
      courseName: "Kotlin for Android",
      date: "05/09/2024",
      price: "$79",
      paymentType: "Google Pay",
      receipt: "KFA77788.pdf",
    },
    {
      courseName: "Swift for iOS Development",
      date: "12/10/2024",
      price: "$99",
      paymentType: "Apple Pay",
      receipt: "SFI99887.pdf",
    },
    {
      courseName: "Blockchain Development",
      date: "20/11/2024",
      price: "$199",
      paymentType: "Credit Card",
      receipt: "BCD55677.pdf",
    },
    {
      courseName: "Game Development with Unity",
      date: "08/12/2024",
      price: "$129",
      paymentType: "PayPal",
      receipt: "GDU11992.pdf",
    },
    {
      courseName: "Django & REST API",
      date: "19/12/2024",
      price: "$89",
      paymentType: "Debit Card",
      receipt: "DRA66543.pdf",
    },
  ];

  

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URI}/api/v1/users/userWallet`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setWalletData(response?.data?.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchWalletData();
  }, []);

  const token = localStorage.getItem("token");
  const historyUrl = `${BASE_URI}/api/v1/users/orderHistory`;

  const fetchOptions = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const { data } = useFetch(historyUrl, fetchOptions);
  const orders = useMemo(() => data?.data?.orders || [], [data]);

  // if (loading) {
  //   return (
  //     <div className="w-100">
  //       <header className="py-3">
  //         <ShimmerThumbnail
  //           width={150}
  //           height={20}
  //           style={{ marginTop: "10px" }}
  //         />
  //       </header>
  //       <main className="custom-box py-5">
  //         <div className="d-flex align-items-center justify-content-between px-5 pb-3">
  //           <div>
  //             <ShimmerThumbnail
  //               width={200}
  //               height={20}
  //               style={{ marginBottom: "10px" }}
  //             />
  //             <ShimmerThumbnail
  //               width={150}
  //               height={20}
  //               style={{ marginBottom: "10px" }}
  //             />
  //             <ShimmerThumbnail width={100} height={20} />
  //           </div>

  //           <ShimmerThumbnail
  //             width={200}
  //             height={20}
  //             style={{ marginBottom: "10px" }}
  //           />
  //           <ShimmerThumbnail width={150} height={30} />
  //           <ShimmerThumbnail
  //             width={100}
  //             height={30}
  //             style={{ marginTop: "10px" }}
  //           />
  //         </div>
  //         <div className="d-flex gap-5 px-4 border-bottom">
  //           <ShimmerThumbnail
  //             width={100}
  //             height={20}
  //             style={{ marginBottom: "10px" }}
  //           />
  //         </div>
  //         <div className="tab-pane active">
  //           <table className="table">
  //             <thead>
  //               <tr>
  //                 <th scope="col" className="py-3">
  //                   <ShimmerThumbnail width={80} height={20} />
  //                 </th>
  //                 <th scope="col" className="text-center py-3">
  //                   <ShimmerThumbnail width={80} height={20} />
  //                 </th>
  //                 <th scope="col" className="text-center py-3">
  //                   <ShimmerThumbnail width={80} height={20} />
  //                 </th>
  //                 <th scope="col" className="text-center py-3">
  //                   <ShimmerThumbnail width={80} height={20} />
  //                 </th>
  //                 <th scope="col" className="text-center py-3">
  //                   <ShimmerThumbnail width={80} height={20} />
  //                 </th>
  //                 <th scope="col" className="text-center py-3">
  //                   <ShimmerThumbnail width={80} height={20} />
  //                 </th>
  //                 <th scope="col" className="text-center py-3">
  //                   <ShimmerThumbnail width={80} height={20} />
  //                 </th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               <tr>
  //                 <td colSpan="7">
  //                   <ShimmerThumbnail width="100%" height={20} />
  //                 </td>
  //               </tr>
  //             </tbody>
  //           </table>
  //         </div>
  //       </main>
  //     </div>
  //   );
  // }

  // const { last_purchase, total_points } = walletData[0] ;
  const last_purchase = 0;
  const total_points = 0;

  const recentPayout = last_purchase;

  const accountBalance = total_points;

  const handleClear = () => {
    setCountry("");
    setRouting("");
    setAccountNumber("");
    setAccountName("");
    setAccountType("");
  };

  const bankClick = async () => {
    try {
      const response = await axios.get(
        `${BASE_URI}/api/v1/payment/accountDetails`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setEditable(true);
      setAccountName(response?.data?.data?.account_holder_name);
      setAccountNumber(response?.data?.data?.account_number);
      setAccountType(response?.data?.data?.account_holder_type);
      setCountry(response?.data?.data?.country);
      setRouting(response?.data?.data?.routing_number);
      setBankDetails(response?.data?.data);
    } catch (err) {
      // toast.error(err?.response?.data?.message);
    }
  };

  // const editableHandler =()=>{
  //   if()
  // }

  const AddAccountHandler = async () => {
    try {
      const response = await axios.post(
        `${BASE_URI}/api/v1/payment/accountDetails`,
        {
          type: accountType,
          country: country,
          routingNumber: routing,
          accountNumber: accountNumber,
          accountHolderName: accountName,
          accountHolderType: accountType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Account added successfully");
      bankClick();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.patch(
        `${BASE_URI}/api/v1/payment/accountDetails`,
        {
          type: accountType,
          country: country,
          routingNumber: routing,
          accountNumber: accountNumber,
          accountHolderName: accountName,
          accountHolderType: accountType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Account updated successfully");
      bankClick();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URI}/api/v1/payment/accountDetails`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Account deleted successfully");
      bankClick();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const togleEditable = () => {
    setEditable(!editable);
  };

  const handleCoinCost = async (withdrawAmount) => {
    setWithdrawalAmount(withdrawAmount);
    try {
      const response = await axios.get(
        `${BASE_URI}/api/v1/users/coinCost/${withdrawAmount}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setCoinCost(response?.data?.amount);
    } catch (err) {
      // toast.error(err?.response?.data?.message);
    }
  };

  const handleWithdraw = async () => {
    try {
      const stripe = await stripePromise;
      // Fetch the session from your backend
      // const session = await axios(`http://localhost:3000/api/v1/payment`);
      const session = await axios.post(
        `${BASE_URI}/api/v1/users/purchasePoints`,
        { points: withdrawalAmount },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({
        sessionId: session.data.session.id,
      });
    } catch (e) {
      toast.error(e?.response?.data?.message);
    }
  };

  const withdrawlHistoryClick = async () => {
    try {
      const response = await axios.get(
        `${BASE_URI}/api/v1/users/purchasePoints`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setWithdrawalHistory(response?.data);
    } catch (err) {
      // toast.error(err?.response?.data?.message);
    }
  };

  const handlePrint = (order) => {
    const printContent = `
      <div>
        <h3>Order Receipt</h3>
        <p><strong>Course Name:</strong> ${order.title}</p>
        <p><strong>Date:</strong> ${formatDate(order.payment_date)}</p>
        <p><strong>Transaction ID:</strong> ${order.transaction_id}</p>
        <p><strong>Price:</strong> ${order.discounted_price}</p>
        <p><strong>Payment Type:</strong> ${order.payment_type}</p>
      </div>
    `;
    const newWindow = window.open("", "_blank", "width=600,height=400");
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <>
      <div className="wrapper-userWallet w-100 position-relative">
        {withDrawPopup && (
          <div className="rating-popup d-flex justify-content-center align-items-center">
            <div className=" flex-column gap-2 card p-4 shadow-lg bg-white rounded">
              <h5 className="text-center">Add Coins</h5>
              <span>
                <h6>Enter Coins</h6>
                <input
                  type="text"
                  placeholder="Enter Coins"
                  value={withdrawalAmount}
                  onChange={(e) => handleCoinCost(e.target.value)}
                />
              </span>
              {coinCost && (
                <p className="text-red">{`You will get $${coinCost} Amount for these coins!`}</p>
              )}
              <div className=" d-flex justify-content-between">
                <div
                  onClick={() => setWithDrawPopup(false)}
                  style={{ boxShadow: "0px 0px 4px 0.2px #00000040" }}
                  className=" rounded h-100 p-2 d-flex justify-content-center cursor-pointer"
                >
                  <p>Cancel</p>
                </div>
                <div
                  onClick={handleWithdraw}
                  style={{
                    boxShadow: "0px 0px 4px 0.2px #00000040",
                    background:
                      "linear-gradient(91.96deg, #0C243C 0%, #7E8C9C 100%)",
                  }}
                  className="h-100 p-2 rounded d-flex justify-content-center text-white cursor-pointer"
                >
                  <p>Checkout</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <header className="py-3">
          <h3 className="fw-bold">
            Welcome back, <span className="text-capitalize">{user.name}</span>
          </h3>
        </header>
        <main className="custom-box">
          <div
            style={{
              borderTopRightRadius: "10px",
              borderTopLeftRadius: "10px",
            }}
            className="d-sm-flex justify-content-between px-5 py-5 bg-gradient-custom-div pb-3"
          >
            <div>
              <h5 className="mb-3 fw-normal">Wallet</h5>

              <h5 className="mb-3 fw-normal">
                Recent Purchase:{" "}
                <span className="fw-light">
                  <FontAwesomeIcon icon={faCoins} />{" "}
                  {recentPayout ? recentPayout : 0}
                </span>
              </h5>
            </div>
            <div
              style={{ boxShadow: "0px 0px 12px 0px #FFFFFF80" }}
              className="bg-white text-center text-black p-4 w-md-25 rounded position-relative"
            >
              <h5 className="mb-4 fw-light ">Account Balance</h5>
              <div className="mb-4 d-flex align-items-center justify-content-center">
                <h2
                  style={{
                    filter: "blur(1px)",
                    transform: "rotate(-30deg)",
                    fontSize: "1.3rem",
                    position: "absolute",
                    bottom: "40%",
                    left: "5%",
                  }}
                >
                  💰
                </h2>
                <h5>
                  <FontAwesomeIcon icon={faCoins} />{" "}
                  {accountBalance ? accountBalance : 0}{" "}
                </h5>
                <h2
                  style={{
                    filter: "blur(1px)",
                    transform: "rotate(-30deg)",
                    fontSize: "1.3rem",
                    position: "absolute",
                    bottom: "55%",
                    right: "5%",
                  }}
                >
                  💰
                </h2>
              </div>
              <div
                onClick={() => setWithDrawPopup(!withDrawPopup)}
                className="cursor-pointer border bg-transparent text-black  border-black rounded fw-light p-1"
              >
                Add Coins
              </div>
            </div>
          </div>
          <div className="d-flex gap-1 bg-gradient-custom-div">
            <div className="d-flex gap-5 px-4 border-bottom">
              <h5
                className={
                  activeTab !== "activity"
                    ? `text-white fw-light px-3 cursor-pointer pt-2`
                    : `text-white px-3 pb-2 fw-light cursor-pointer ${
                        activeTab === "activity"
                          ? "border-bottom border-4 pt-2 rounded-top"
                          : ""
                      }`
                }
                onClick={() => setActiveTab("activity")}
              >
                Purchase History
              </h5>
            </div>
            <div
              onClick={withdrawlHistoryClick}
              className="d-flex gap-5 px-4 border-bottom"
            >
              <h5
                className={
                  activeTab !== "withdrawl-history"
                    ? `text-white fw-light px-3 cursor-pointer pt-2`
                    : `text-white px-3 pb-2 fw-light cursor-pointer ${
                        activeTab === "withdrawl-history"
                          ? "border-bottom border-4 pt-2 rounded-top"
                          : ""
                      }`
                }
                onClick={() => setActiveTab("withdrawl-history")}
              >
                Transaction History
              </h5>
            </div>
          </div>
          {activeTab === "activity" &&
            (orders?.length === 0 ? (
              <>
                <div className="no-courses-userCourses">
                  <div>
                    <h1>No Purchase History Found Yet!</h1>
                  </div>
                </div>
              </>
            ) : (
              <div className="tab-pane active" style={{ overflowX: "auto" }}>
                <table className="table w-md-reverse-50">
                  <thead>
                    <tr>
                      <th scope="col">Course Name</th>
                      <th scope="col" className="text-center ">
                        Date
                      </th>

                      <th scope="col" className="text-center">
                        Price
                      </th>
                      <th scope="col" className="text-center">
                        Payment Type
                      </th>
                      <th scope="col" className="text-center">
                        Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <div className="w-100 d-flex justify-content-center">
                        No data avalable!
                      </div>
                    ) : (
                      orders.map((order, index) => (
                        <tr key={index}>
                          <td className="align-middle fs-small py-3 text-capitalize">
                            {order.title}
                          </td>
                          <td className="text-center align-middle fs-small">
                            {formatDate(order.payment_date)}
                          </td>

                          <td className="text-center align-middle fs-small">
                            ${order.discounted_price}
                          </td>
                          <td className="text-center align-middle fs-small text-capitalize">
                            {order.payment_type}
                          </td>
                          <td className="text-center align-middle">
                            <div className="d-flex align-items-center justify-content-center">
                              <button
                                className="signup-now py-1 px-3 fw-lightBold fs-small mb-0 h-auto"
                                onClick={() => handlePrint(order)}
                              >
                                Print
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          {activeTab === "withdrawl-history" &&
            (!withdrawalHistory || withdrawalHistory?.data?.length === "0" ? (
              <>
                <div className="no-courses-userCourses">
                  <div>
                    <h1>No History Found Yet!</h1>
                  </div>
                </div>
              </>
            ) : (
              <div className="tab-pane active" style={{ overflowX: "auto" }}>
                <table className="table w-md-reverse-50">
                  <thead>
                    <tr>
                      <th scope="col" className="text-center py-3">
                        Date
                      </th>
                      <th scope="col" className="text-center py-3">
                        Amount
                      </th>
                      <th scope="col" className="text-center py-3">
                        Coins added
                      </th>
                      <th scope="col" className="text-center py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawalHistory?.data?.coins?.length === 0 ? (
                      <div>No data avalable!</div>
                    ) : (
                      withdrawalHistory?.data?.coins?.map((order, index) => (
                        <tr key={index}>
                          <td className="text-center align-middle fs-small">
                            {formatDate(order?.payment_date)}
                          </td>
                          <td className="text-center align-middle fs-small text-capitalize">
                            ${order?.amount}
                          </td>
                          <td className="text-center align-middle fs-small text-capitalize">
                            {order?.points}
                          </td>
                          <td className="text-center align-middle fs-small">
                            {order?.payment_status}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ))}

          {activeTab === "bank-account" && (
            <div className="grid-col-2">
              <span className="d-block">
                <h6 className="d-flex fw-light">
                  Account Number<h6 className="text-red">*</h6>
                </h6>
                <input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  type="text"
                  className="pl-1 w-80"
                  placeholder={
                    bankDetails?.account_number || "Enter account number"
                  }
                  disabled={editable}
                />
              </span>
              <span className="d-block">
                <h6 className="d-flex fw-light">
                  Account Holder Name<h6 className="text-red">*</h6>
                </h6>
                <input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="pl-1 w-80"
                  type="text"
                  placeholder={
                    bankDetails?.account_holder_name ||
                    "Enter account holder name"
                  }
                  disabled={editable}
                />
              </span>
              <span className="d-block">
                <h6 className="d-flex fw-light">
                  Routing / IFSC Number<h6 className="text-red">*</h6>
                </h6>
                <input
                  value={routing}
                  onChange={(e) => setRouting(e.target.value)}
                  className="pl-1 w-80"
                  type="text"
                  placeholder={
                    bankDetails?.routing_number || "Enter Routing / IFSC Number"
                  }
                  disabled={editable}
                />
              </span>
              <span className="d-block">
                <h6 className="d-flex fw-light">
                  Account Type<h6 className="text-red">*</h6>
                </h6>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-80 pl-1"
                  style={{ height: "5vh" }}
                  name="countries"
                  id="countries"
                  disabled={editable}
                >
                  <option value={bankDetails?.account_holder_type}>
                    {bankDetails?.account_holder_type || "Select account type"}
                  </option>
                  <option value="Savings">Savings</option>
                  <option value="Main">Main</option>
                </select>
              </span>
              <span className="d-block">
                <h6 className="d-flex fw-light">
                  Country<h6 className="text-red">*</h6>
                </h6>

                <select
                  disabled={editable}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-80 pl-1"
                  style={{ height: "5vh" }}
                  name="countries"
                  id="countries"
                >
                  <option value={bankDetails?.country}>
                    {bankDetails?.country || "Select country"}
                  </option>
                  <option value="AF">Afghanistan</option>
                  <option value="AL">Albania</option>
                  <option value="DZ">Algeria</option>
                  <option value="AS">American Samoa</option>
                  <option value="AD">Andorra</option>
                  <option value="AO">Angola</option>
                  <option value="AI">Anguilla</option>
                  <option value="AQ">Antarctica</option>
                  <option value="AG">Antigua and Barbuda</option>
                  <option value="AR">Argentina</option>
                  <option value="AM">Armenia</option>
                  <option value="AW">Aruba</option>
                  <option value="AU">Australia</option>
                  <option value="AT">Austria</option>
                  <option value="AZ">Azerbaijan</option>
                  <option value="BS">Bahamas</option>
                  <option value="BH">Bahrain</option>
                  <option value="BD">Bangladesh</option>
                  <option value="BB">Barbados</option>
                  <option value="BY">Belarus</option>
                  <option value="BE">Belgium</option>
                  <option value="BZ">Belize</option>
                  <option value="BJ">Benin</option>
                  <option value="BM">Bermuda</option>
                  <option value="BT">Bhutan</option>
                  <option value="BO">Bolivia</option>
                  <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                  <option value="BA">Bosnia and Herzegovina</option>
                  <option value="BW">Botswana</option>
                  <option value="BR">Brazil</option>
                  <option value="IO">British Indian Ocean Territory</option>
                  <option value="BN">Brunei Darussalam</option>
                  <option value="BG">Bulgaria</option>
                  <option value="BF">Burkina Faso</option>
                  <option value="BI">Burundi</option>
                  <option value="CV">Cabo Verde</option>
                  <option value="KH">Cambodia</option>
                  <option value="CM">Cameroon</option>
                  <option value="CA">Canada</option>
                  <option value="KY">Cayman Islands</option>
                  <option value="CF">Central African Republic</option>
                  <option value="TD">Chad</option>
                  <option value="CL">Chile</option>
                  <option value="CN">China</option>
                  <option value="CO">Colombia</option>
                  <option value="KM">Comoros</option>
                  <option value="CG">Congo</option>
                  <option value="CD">Congo, Democratic Republic of the</option>
                  <option value="CR">Costa Rica</option>
                  <option value="CI">Côte d'Ivoire</option>
                  <option value="HR">Croatia</option>
                  <option value="CU">Cuba</option>
                  <option value="CW">Curaçao</option>
                  <option value="CY">Cyprus</option>
                  <option value="CZ">Czech Republic</option>
                  <option value="DK">Denmark</option>
                  <option value="DJ">Djibouti</option>
                  <option value="DM">Dominica</option>
                  <option value="DO">Dominican Republic</option>
                  <option value="EC">Ecuador</option>
                  <option value="EG">Egypt</option>
                  <option value="SV">El Salvador</option>
                  <option value="GQ">Equatorial Guinea</option>
                  <option value="ER">Eritrea</option>
                  <option value="EE">Estonia</option>
                  <option value="SZ">Eswatini</option>
                  <option value="ET">Ethiopia</option>
                  <option value="FJ">Fiji</option>
                  <option value="FI">Finland</option>
                  <option value="FR">France</option>
                  <option value="GF">French Guiana</option>
                  <option value="PF">French Polynesia</option>
                  <option value="GA">Gabon</option>
                  <option value="GM">Gambia</option>
                  <option value="GE">Georgia</option>
                  <option value="DE">Germany</option>
                  <option value="GH">Ghana</option>
                  <option value="GI">Gibraltar</option>
                  <option value="GR">Greece</option>
                  <option value="GL">Greenland</option>
                  <option value="GD">Grenada</option>
                  <option value="GP">Guadeloupe</option>
                  <option value="GU">Guam</option>
                  <option value="GT">Guatemala</option>
                  <option value="GG">Guernsey</option>
                  <option value="GN">Guinea</option>
                  <option value="GW">Guinea-Bissau</option>
                  <option value="GY">Guyana</option>
                  <option value="HT">Haiti</option>
                  <option value="HN">Honduras</option>
                  <option value="HK">Hong Kong</option>
                  <option value="HU">Hungary</option>
                  <option value="IS">Iceland</option>
                  <option value="IN">India</option>
                  <option value="ID">Indonesia</option>
                  <option value="IR">Iran</option>
                  <option value="IQ">Iraq</option>
                  <option value="IE">Ireland</option>
                  <option value="IM">Isle of Man</option>
                  <option value="IL">Israel</option>
                  <option value="IT">Italy</option>
                  <option value="JM">Jamaica</option>
                  <option value="JP">Japan</option>
                  <option value="JE">Jersey</option>
                  <option value="JO">Jordan</option>
                  <option value="KZ">Kazakhstan</option>
                  <option value="KE">Kenya</option>
                  <option value="KI">Kiribati</option>
                  <option value="KP">Korea (North)</option>
                  <option value="KR">Korea (South)</option>
                  <option value="KW">Kuwait</option>
                  <option value="KG">Kyrgyzstan</option>
                  <option value="LA">Lao People's Democratic Republic</option>
                  <option value="LV">Latvia</option>
                  <option value="LB">Lebanon</option>
                  <option value="LS">Lesotho</option>
                  <option value="LR">Liberia</option>
                  <option value="LY">Libya</option>
                  <option value="LI">Liechtenstein</option>
                  <option value="LT">Lithuania</option>
                  <option value="LU">Luxembourg</option>
                  <option value="MO">Macao</option>
                  <option value="MG">Madagascar</option>
                  <option value="MW">Malawi</option>
                  <option value="MY">Malaysia</option>
                  <option value="MV">Maldives</option>
                  <option value="ML">Mali</option>
                  <option value="MT">Malta</option>
                  <option value="MH">Marshall Islands</option>
                  <option value="MQ">Martinique</option>
                  <option value="MR">Mauritania</option>
                  <option value="MU">Mauritius</option>
                  <option value="MX">Mexico</option>
                  <option value="FM">Micronesia</option>
                  <option value="MD">Moldova</option>
                  <option value="MC">Monaco</option>
                  <option value="MN">Mongolia</option>
                  <option value="ME">Montenegro</option>
                  <option value="MS">Montserrat</option>
                  <option value="MA">Morocco</option>
                  <option value="MZ">Mozambique</option>
                  <option value="MM">Myanmar</option>
                  <option value="NA">Namibia</option>
                  <option value="NR">Nauru</option>
                  <option value="NP">Nepal</option>
                  <option value="NL">Netherlands</option>
                  <option value="NC">New Caledonia</option>
                  <option value="NZ">New Zealand</option>
                  <option value="NI">Nicaragua</option>
                  <option value="NE">Niger</option>
                  <option value="NG">Nigeria</option>
                  <option value="NU">Niue</option>
                  <option value="NF">Norfolk Island</option>
                  <option value="MK">North Macedonia</option>
                  <option value="MP">Northern Mariana Islands</option>
                  <option value="NO">Norway</option>
                  <option value="OM">Oman</option>
                  <option value="PK">Pakistan</option>
                  <option value="PW">Palau</option>
                  <option value="PA">Panama</option>
                  <option value="PG">Papua New Guinea</option>
                  <option value="PY">Paraguay</option>
                  <option value="PE">Peru</option>
                  <option value="PH">Philippines</option>
                  <option value="PL">Poland</option>
                  <option value="PT">Portugal</option>
                  <option value="PR">Puerto Rico</option>
                  <option value="QA">Qatar</option>
                  <option value="RO">Romania</option>
                  <option value="RU">Russian Federation</option>
                  <option value="RW">Rwanda</option>
                  <option value="RE">Réunion</option>
                  <option value="WS">Samoa</option>
                  <option value="SM">San Marino</option>
                  <option value="ST">Sao Tome and Principe</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="SN">Senegal</option>
                  <option value="RS">Serbia</option>
                  <option value="SC">Seychelles</option>
                  <option value="SL">Sierra Leone</option>
                  <option value="SG">Singapore</option>
                  <option value="SX">Sint Maarten</option>
                  <option value="SK">Slovakia</option>
                  <option value="SI">Slovenia</option>
                  <option value="SB">Solomon Islands</option>
                  <option value="SO">Somalia</option>
                  <option value="ZA">South Africa</option>
                  <option value="SS">South Sudan</option>
                  <option value="ES">Spain</option>
                  <option value="LK">Sri Lanka</option>
                  <option value="SD">Sudan</option>
                  <option value="SR">Suriname</option>
                  <option value="SE">Sweden</option>
                  <option value="CH">Switzerland</option>
                  <option value="SY">Syrian Arab Republic</option>
                  <option value="TW">Taiwan</option>
                  <option value="TJ">Tajikistan</option>
                  <option value="TZ">Tanzania</option>
                  <option value="TH">Thailand</option>
                  <option value="TL">Timor-Leste</option>
                  <option value="TG">Togo</option>
                  <option value="TO">Tonga</option>
                  <option value="TT">Trinidad and Tobago</option>
                  <option value="TN">Tunisia</option>
                  <option value="TR">Turkey</option>
                  <option value="TM">Turkmenistan</option>
                  <option value="TV">Tuvalu</option>
                  <option value="UG">Uganda</option>
                  <option value="UA">Ukraine</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="UY">Uruguay</option>
                  <option value="UZ">Uzbekistan</option>
                  <option value="VU">Vanuatu</option>
                  <option value="VE">Venezuela</option>
                  <option value="VN">Viet Nam</option>
                  <option value="YE">Yemen</option>
                  <option value="ZM">Zambia</option>
                  <option value="ZW">Zimbabwe</option>
                </select>
              </span>

              <div className="w-100 h-100 d-flex align-items-end gap-5">
                {!bankDetails && (
                  <>
                    <span
                      onClick={handleClear}
                      className="ps-3 pe-3 pt-2 pb-2 cursor-pointer rounded border border-2 d-flex justify-content-center"
                    >
                      Cancel
                    </span>
                    <span
                      onClick={AddAccountHandler}
                      className="bg-gradient-custom-div cursor-pointer p-2 rounded "
                    >
                      Add account
                    </span>
                  </>
                )}

                {bankDetails && (
                  <>
                    <span
                      onClick={handleDeleteAccount}
                      style={{ backgroundColor: "red" }}
                      className="cursor-pointer text-white p-2 rounded"
                    >
                      Delete
                    </span>
                    {editable === false ? (
                      <span
                        onClick={handleEdit}
                        className="bg-gradient-custom-div cursor-pointer text-white ps-4 pe-4 pt-2 pb-2 rounded"
                      >
                        Save Changes
                      </span>
                    ) : (
                      <span
                        onClick={togleEditable}
                        className="bg-gradient-custom-div cursor-pointer text-white ps-4 pe-4 pt-2 pb-2 rounded"
                      >
                        Edit
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <div className="mobile-userWallet w-100 p-2">
        <div className="app-white px-2 p-2 rounded-2">
          <h5
            style={{ width: "max-content" }}
            className="fs-6 fw-regular app-text-white rounded-1 app-black p-1 px-2"
          >
            Purchase History
          </h5>
          <div className="border border-1 mt-2 p-2 rounded-3 pt-3 pb-3 d-flex flex-column align-items-center gap-3">
            <div className="d-flex w-100">
              <div className="w-50 d-flex flex-column justify-content-center align-items-start ps-2">
                <h5 className="fs-5 fw-medium app-text-black opacity-75">
                  Wallet
                </h5>
                <h6
                  style={{ fontSize: "0.8rem" }}
                  className=" fw-regular app-text-black opacity-75"
                >
                  Recent Purchase
                </h6>
                <h4 className="fw-regular app-text-black opacity-75 pt-1">
                  578 Coins
                </h4>
              </div>
              <div className="w-50 d-flex flex-column align-items-center gap-1 justify-content-center">
                <h5 className="fs-4 fw-medium app-text-black opacity-75">
                  Coin Ballance
                </h5>
                <span className="d-flex gap-2">
                  <h5 className="fs-5 fw-medium app-text-black opacity-75">
                    1,254
                  </h5>
                  <img
                    style={{ width: "1.5rem" }}
                    className="object-fit-cover"
                    src={jiujitsuCoin}
                    alt=""
                  />
                </span>
              </div>
            </div>
            <div
              // style={{ background: "#0C243C" }}
              className="d-flex app-red justify-content-center align-items-center py-2 w-75  rounded-1"
            >
              <h5
                style={{ fontSize: "1rem", color: "#fff",cursor:"pointer" }}
                className="fw-regular app-text-white"
              >
                Add Coins
              </h5>
            </div>
          </div>
        </div>
        {/* <div className="mobile-top-myLearning w-100 gap-3 ps-3 p-2 px-2 justify-content-start mt-2 rounded-1 app-white d-flex gap-2">
          <Button
            className={`p-1 px-2 rounded-2 fs-6 border-2 ${
              mobileActiveTab === "transactions"
                ? "app-black border-black"
                : "border-secondary text-secondary"
            }`}
            onClick={() => setMobileActiveTab("transactions")}
          >
            Transaction History
          </Button>
          <Button
            className={`p-1 px-2 rounded-2 fs-6 border-2 ${
              mobileActiveTab === "purchases"
                ? "app-black border-black"
                : "border-secondary text-secondary"
            }`}
            onClick={() => setMobileActiveTab("purchases")}
          >
            Purchase History
          </Button>
        </div> */}

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
          style={{cursor: "pointer" }}
          className={`p-1 px-2 rounded-2 fs-6 fw-regular border-2 ${mobileActiveTab === "transactions" ? "app-black app-text-white border-black" : "border border-1 text-secondary"}`}
          onClick={() => setMobileActiveTab("transactions")}>
            Transaction History
          </h4>
          <h4
                    style={{cursor: "pointer" }}

            className={`p-1 px-2 rounded-2 fs-6 border-2 ${
              mobileActiveTab === "purchases"
                ? "app-black border-black app-text-white"
                : "border border-1 text-secondary"
            }`}
            onClick={() => setMobileActiveTab("purchases")}
          >
            {/* {category.category_name} */}
            Purchase History
          </h4>
        </div>

        <div style={{ marginBottom: "4rem" }} className="w-100 app-white p-2 mt-2 d-flex flex-column rounded-2">
        {mobileActiveTab === "transactions" && transactions.map((transaction, index) => (
          <div key={index} className="w-100 border border-1 p-2 rounded-1 mb-2">
            <span className="w-100 d-flex justify-content-evenly">
              <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Date:</h6>
              <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{transaction.date}</h6>
            </span>
            <span className="w-100 d-flex justify-content-evenly pt-2">
              <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Amount:</h6>
              <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{transaction.amount}</h6>
            </span>
            <span className="w-100 d-flex justify-content-evenly pt-2">
              <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Coins Added:</h6>
              <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{transaction.coins}</h6>
            </span>
            <span className="w-100 d-flex justify-content-evenly pt-2">
              <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Status:</h6>
              <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{transaction.status}</h6>
            </span>
          </div>
        ))}

        {mobileActiveTab === "purchases" && purchases.map((purchase, index) => (
          <div key={index} className="w-100 border border-1 p-2 rounded-1 mb-2">
            <span className="w-100 d-flex justify-content-evenly">
              <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Course Name:</h6>
              <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{purchase.courseName}</h6>
            </span>
            <span className="w-100 d-flex justify-content-evenly pt-2">
              <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Date:</h6>
              <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{purchase.date}</h6>
            </span>
            <span className="w-100 d-flex justify-content-evenly pt-2">
              <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Price:</h6>
              <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{purchase.price}</h6>
            </span>
            <span className="w-100 d-flex justify-content-evenly pt-2">
              <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Payment Type:</h6>
              <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{purchase.paymentType}</h6>
            </span>
            <span className="w-100 d-flex justify-content-evenly pt-2">
              <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Recipt:</h6>
              <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-white app-black d-flex align-items-center justify-content-center p-1 px-2 rounded-1">Print</h6>
            </span>
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
