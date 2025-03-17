import { useState, useEffect } from "react";
import axios from "axios";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { BASE_URI } from "../../Config/url";
import formatDate from "../../utils/formatDate";
import toast from "react-hot-toast";
import "./ExpertWallet.css";
import jiujitsuCoin from "../../assets/jiujitsuCoin.png";
import Popup from "../../Components/PopUp/PopUp";
import { CustomLoader } from "../../Components/CustomLoader/CustomLoader";



export default function ExpertWallet() {
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
  const [mobileActiveTab, setMobileActiveTab] = useState("purchases");
  const [mobileWithdrawPopup, setMobileWithdrawPopup] = useState(false);



  useEffect(() => {
    async function fetchWalletData() {
      try {
        const response = await axios.get(
          `${BASE_URI}/api/v1/expert/expertWallet`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setWalletData(response.data.data);
        // console.log(response.data.data)
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <div className="w-100 wrapper-experts">
        <header className="py-3">
         
          <ShimmerThumbnail
            width={150}
            height={20}
            style={{ marginTop: "10px" }}
          />
        </header>
        <main className="custom-box py-5">
          <div className="d-flex align-items-center justify-content-between px-5 pb-3">
            <div>
              <ShimmerThumbnail
                width={200}
                height={20}
                style={{ marginBottom: "10px" }}
              />
              <ShimmerThumbnail
                width={150}
                height={20}
                style={{ marginBottom: "10px" }}
              />
              <ShimmerThumbnail width={100} height={20} />
            </div>
            
              <ShimmerThumbnail
                width={200}
                height={20}
                style={{ marginBottom: "10px" }}
              />
              <ShimmerThumbnail width={150} height={30} />
              <ShimmerThumbnail
                width={100}
                height={30}
                style={{ marginTop: "10px" }}
              />
           
          </div>
          <div className="d-flex gap-5 px-4 border-bottom">
            <ShimmerThumbnail
              width={100}
              height={20}
              style={{ marginBottom: "10px" }}
            />
          </div>
          <div className="tab-pane active">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                  <th scope="col" className="text-center py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                  <th scope="col" className="text-center py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                  <th scope="col" className="text-center py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                  <th scope="col" className="text-center py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                  <th scope="col" className="text-center py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                  <th scope="col" className="text-center py-3">
                    <ShimmerThumbnail width={80} height={20} />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="7">
                    <ShimmerThumbnail width="100%" height={20} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );
  }

  if (!walletData) {
    return <div className="wrapper-experts">No data available</div>;
  }

  const { lastWithdrawal, orders, payable_amount } = walletData;
  const recentPayout = lastWithdrawal[0]?.withdrawal_amount || "$0.00";
  const accountBalance = `$${payable_amount}`;

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
      // console.log(response?.data?.data);
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
      
      // Resetting the state
      setEditable(false); // Set editable to false
      handleClear(); // Clear all input fields
      setBankDetails(""); // Clear bank details
  
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const togleEditable = () => {
    setEditable(!editable);
  };

  const handleWithdraw = async () => {
    try {
      const response = await axios.post(
        `${BASE_URI}/api/v1/payment/payoutRequest`,
        {
          amount: withdrawalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setWithdrawalAmount("");
      setMobileWithdrawPopup(false);
      setWithDrawPopup(false);
      toast.success("Withdrawal successful");
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const withdrawlHistoryClick = async()=>{
    try {
      const response = await axios.get(
        `${BASE_URI}/api/v1/expert/withdrawalHistory`,
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
  }

  return (
    <>
    <div className="w-100 position-relative wrapper-experts">
      {/* {withDrawPopup && (
        <div className="rating-popup d-flex justify-content-center align-items-center">
          <div className=" flex-column gap-2 card p-4 shadow-lg bg-white rounded">
            <h5 className="text-center">Withdraw Money</h5>
            <span>
              <h6>Enter Amount</h6>
              <input
                type="text"
                placeholder="Enter Amount"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
              />
            </span>
            <p className="text-red">{"* Please enter amount >= $50"}</p>
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
                <p>Send Request</p>
              </div>
            </div>
          </div>
        </div>
      )} */}
      <header className="py-3">
        <h3 className="fw-bold">
          Welcome back, <span className="text-capitalize">{user.name}</span>
        </h3>
      </header>
      <main className="custom-box">
        <div style={{borderTopRightRadius:"10px", borderTopLeftRadius:"10px"}} className="d-sm-flex justify-content-between px-5 py-5 bg-gradient-custom-div pb-3">
          <div>
            <h5 className="mb-3 fw-normal">
              Account type:{" "}
              <span className="fw-light text-capitalize">
                {user.user_type}
              </span>
            </h5>
            <h5 className="mb-3 fw-normal">
              Status: <span className="fw-light">Verified</span>
            </h5>
            <h5 className="mb-3 fw-normal">
              Recent Payout: <span className="fw-light">{recentPayout}</span>
            </h5>
          </div>
          <div style={{boxShadow: "0px 0px 12px 0px #FFFFFF80"}} className="bg-white text-center text-black p-4 w-md-25 rounded position-relative">
            <h5 className="mb-4 fw-light ">Account Balance</h5>
            <div className="mb-4 d-flex align-items-center justify-content-center">
              <h2 style={{filter: "blur(1px)", transform:"rotate(-30deg)", fontSize:"1.3rem", position:"absolute", bottom:"40%", left:"5%"}}>💰</h2>
              <h5>{accountBalance}</h5>
              <h2  style={{filter: "blur(1px)", transform:"rotate(-30deg)", fontSize:"1.3rem", position:"absolute", bottom:"55%", right:"5%"}}>💰</h2>
            </div>
            <div
              onClick={() => setMobileWithdrawPopup(true)}
              className="cursor-pointer border bg-transparent text-black  border-black rounded fw-light p-1"
            >
              Withdraw money
            </div>
          </div>
        </div>
        <div className="d-flex gap-1 bg-gradient-custom-div" style={{overflowX:"auto"}}>
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
          <div onClick={withdrawlHistoryClick}
            className="d-flex gap-5 px-4 border-bottom">
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
              Withdrawal History
            </h5>
          </div>
          <div onClick={bankClick} className="d-flex gap-5 px-4 border-bottom">
            <h5
              className={
                activeTab !== "bank-account"
                  ? `text-white fw-light px-3 cursor-pointer pt-2`
                  : `text-white px-3 pb-2 fw-light cursor-pointer ${
                      activeTab === "bank-account"
                        ? "border-bottom border-4 pt-2 rounded-top"
                        : ""
                    }`
              }
              onClick={() => setActiveTab("bank-account")}
            >
              Bank account
            </h5>
          </div>
          
        </div>
        {activeTab === "activity" && (
          orders?.length === 0 ? <>
          <div className="no-courses-userCourses">
            <div>
              <h1>No Purchase History Found Yet!</h1>
            </div>
          </div>
        </> :
          <div className="tab-pane active" style={{ overflowX: "auto" }}>
            <table className="table w-md-reverse-50">
              <thead>
                <tr>
                  <th scope="col" className="py-3">
                    Serial No.
                  </th>
                  <th scope="col" className="text-center py-3">
                    Date
                  </th>
                  <th scope="col" className="text-center py-3">
                    Type
                  </th>
                  <th scope="col" className="text-center py-3">
                    Payment Status
                  </th>
                  <th scope="col" className="text-center py-3">
                    Amount
                  </th>
                  <th scope="col" className="text-center py-3">
                    Service Charges
                  </th>
                  <th scope="col" className="text-center py-3">
                    Payable
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td className="align-middle fs-small py-3 ps-4">
                      {index + 1}.
                    </td>
                    <td className="text-center align-middle fs-small">
                      {formatDate(order.payment_date)}
                    </td>
                    <td className="text-center align-middle fs-small text-capitalize">
                      {order.payment_type}
                    </td>
                    <td className="text-center align-middle fs-small text-capitalize">
                      {order.payment_status}
                    </td>
                    <td className="text-center align-middle fs-small">
                      ${order.amount}
                    </td>
                    <td className="text-center align-middle fs-small">
                      ${order.service_charges}
                    </td>
                    <td className="text-center align-middle fs-small">
                      ${order.payable_amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
{activeTab === "withdrawl-history" && (
  (!withdrawalHistory || withdrawalHistory?.data?.length === "0" ) ? <>
  <div className="no-courses-userCourses">
    <div>
      <h1>No History Found Yet!</h1>
    </div>
  </div>
</>:
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
                    Transaction id
                  </th>
                  <th scope="col" className="text-center py-3">
                    Withdrawal Status
                  </th>
                  
                </tr>
              </thead>
              <tbody>
                {withdrawalHistory?.data?.map((order, index) => (
                  <tr key={index}>
                    
                    <td className="text-center align-middle fs-small">
                      {formatDate(order?.withdrawal_date)}
                    </td>
                    <td className="text-center align-middle fs-small text-capitalize">
                    ${order?.withdrawal_amount}
                    </td>
                    <td className="text-center align-middle fs-small text-capitalize">
                      {order?.transaction_id}
                    </td>
                    <td className="text-center align-middle fs-small">
                      {order?.withdrawal_status}
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
                  "Enter account number"
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
                  // bankDetails?.account_holder_name ||
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
                  "Enter Routing / IFSC Number"
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
                <option value="individual">Individual</option>
                <option value="company">Company</option>
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
    className="fs-5 fw-bold "
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
          Recent Payout
        </h6>
        <h4 className="fw-regular app-text-black opacity-75 pt-1">
          ${recentPayout} 
        </h4>
      </div>
      <div className="w-50 d-flex flex-column align-items-center gap-1 justify-content-center">
        <h5 className="fs-4 fw-medium app-text-black opacity-75">
          Ballance
        </h5>
        <span className="d-flex gap-2">
          <h5 className="fs-5 fw-medium app-text-black opacity-75">
            {accountBalance}
          </h5>
          
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
        onClick={() => setMobileWithdrawPopup(!withDrawPopup)

        }
      >
        Withdraw
      </h5>
    </div>
  </div>
</div>


<div
  style={{
    zIndex: "100",
    width: "max-content",
    justifySelf: "start",
    position: "sticky",
    top: "-0.3%",
  }}
  className="mobile-top-myLearning w-100 gap-3 ps-3 p-2 px-2 justify-content-start mt-2 rounded-1 app-white gap-2"
>
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
    Purchases
  </h4>

  <div onClick={withdrawlHistoryClick}>

  <h4 
  style={{cursor: "pointer" }}
  className={`p-1 px-2 rounded-2 fs-6 fw-regular border-2 ${mobileActiveTab === "transactions" ? "app-black app-text-white border-black" : "border border-1 text-secondary"}`}
  onClick={() => setMobileActiveTab("transactions")}>
    Transactions
  </h4>
  </div>


  <div onClick={bankClick}>

  <h4 
  style={{cursor: "pointer" }}
  className={`p-1 px-2 rounded-2 fs-6 fw-regular border-2 ${mobileActiveTab === "bank-account" ? "app-black app-text-white border-black" : "border border-1 text-secondary"}`}
  onClick={() => setMobileActiveTab("bank-account")}>
    Bank
  </h4>
  </div>
  
</div>


<div style={{ marginBottom: "4rem" }} className="w-100 app-white p-2 mt-2 d-flex flex-column rounded-2">
{loading ? 
  <div className="d-flex w-100 p-1 app-white flex-column mt-1">

<CustomLoader width="100%" height="10rem" className="rounded-3 mt-2"/>
<CustomLoader width="100%" height="10rem" className="rounded-3 mt-2"/>

<CustomLoader width="100%" height="10rem" className="rounded-3 mt-2"/>

<CustomLoader width="100%" height="10rem" className="rounded-3 mt-2"/>

  </div>
  :
  <>
  {
mobileActiveTab === "transactions" && withdrawalHistory?.data?.map((transaction, index) => (
  <div key={index} className="w-100 border border-1 p-2 rounded-1 mb-2">
    <span className="w-100 d-flex justify-content-evenly">
      <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Amount:</h6>
      <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{transaction.withdrawal_amount}</h6>
    </span>
    <span className="w-100 d-flex justify-content-evenly pt-2">
      <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Date:</h6>
      <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{formatDate(transaction.withdrawal_date)}</h6>
    </span>
    <span className="w-100 d-flex justify-content-evenly pt-2">
      <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Transaction ID:</h6>
      <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="text-break fw-regular app-text-black opacity-75">{transaction.transaction_id}</h6>
    </span>
    <span className="w-100 d-flex justify-content-evenly pt-2">
      <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Status:</h6>
      <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{transaction.withdrawal_status}</h6>
    </span>
  </div>
))}

{mobileActiveTab === "purchases" && orders?.map((order, index) => (
  <div key={index} className="w-100 border border-1 p-2 rounded-1 mb-2">
    <span className="w-100 d-flex justify-content-evenly">
      <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Type:</h6>
      <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{order.payment_type}</h6>
    </span>
    <span className="w-100 d-flex justify-content-evenly pt-2">
      <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Date:</h6>
      <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{formatDate(order.payment_date)}</h6>
    </span>
    <span className="w-100 d-flex justify-content-evenly pt-2">
      <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Status:</h6>
      <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{order.payment_status}</h6>
    </span>
    <span className="w-100 d-flex justify-content-evenly pt-2">
      <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Amount:</h6>
      <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{order.amount}</h6>
    </span>
    <span className="w-100 d-flex justify-content-evenly pt-2">
      <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Service Charges:</h6>
      <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{order.service_charges}</h6>
    </span>
    <span className="w-100 d-flex justify-content-evenly pt-2">
      <h6 style={{ fontSize: "0.9rem", width: "40%" }} className="fw-regular app-text-black opacity-75">Payable Amount:</h6>
      <h6 style={{ fontSize: "0.9rem", width: "25%" }} className="fw-regular app-text-black opacity-75">{order.payable_amount}</h6>
    </span>
  </div>
))}

{
  mobileActiveTab === "bank-account" &&
  <div className="w-100">
            <span className="d-block">
              <h6 className="d-flex fw-light">
                Account Number<h6 className="text-red">*</h6>
              </h6>
              <input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                type="text"
                className="px-2 pe-2 py-2 border mt-1 rounded w-100 app-white"
                placeholder={
                  "Enter account number"
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
                className="px-2 pe-2 py-2 border mt-1 rounded w-100 app-white"
                type="text"
                placeholder={
                  // bankDetails?.account_holder_name ||
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
                className="px-2 pe-2 py-2 border mt-1 rounded w-100 app-white"
                type="text"
                placeholder={
                  "Enter Routing / IFSC Number"
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
                className="w-100 px-2 pe-2 py-2 border mt-1 rounded"
                // style={{ height: "5vh" }}
                name="countries"
                id="countries"
                disabled={editable}
              >
                <option value={bankDetails?.account_holder_type}>
                  {bankDetails?.account_holder_type || "Select account type"}
                </option>
                <option value="individual">Individual</option>
                <option value="company">Company</option>
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
                className="w-100 mb-2 px-2 pe-2 py-2 border mt-1 rounded"
                // style={{ height: "5vh" }}
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

            <div className="w-100 h-100 d-flex align-items-end justify-content-end gap-2">
              {!bankDetails && (
                <>
                  <span
                    onClick={handleClear}
                    className="ps-3 pe-3 pt-2 pb-2 cursor-pointer rounded app-black cursor-pointer app-text-white d-flex justify-content-center"
                  >
                    Cancel
                  </span>
                  <span
                    onClick={AddAccountHandler}
                    className="app-red cursor-pointer app-text-white cursor-pointer p-2 rounded "
                  >
                    Add account
                  </span>
                </>
              )}

              {bankDetails && (
                <>
                  <span
                    onClick={handleDeleteAccount}
                    // style={{ backgroundColor: "red" }}
                    className="cursor-pointer app-black text-white p-2 rounded"
                  >
                    Delete
                  </span>
                  {editable === false ? (
                    <span
                      onClick={handleEdit}
                      className="app-red cursor-pointer app-text-white ps-4 pe-4 pt-2 pb-2 rounded"
                    >
                      Save Changes
                    </span>
                  ) : (
                    <span
                      onClick={togleEditable}
                      className="app-red cursor-pointer app-text-white ps-4 pe-4 pt-2 pb-2 rounded"
                    >
                      Edit
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
}
  </>
  }

</div>
</div>
<Popup title={"Withdraw"} isOpen={mobileWithdrawPopup} onClose={() => setMobileWithdrawPopup(false)}>
  <div className="bg-white p-2 rounded border shadow-sm"> {/* Container with rounded border */}
    {/* <h4 className="app-text-black text-center mb-3 fw-bold">Enter Coins</h4> */}

    <input
      type="text"
      className="form-control rounded border p-2"
      placeholder="Enter Withdraw amount"
      value={withdrawalAmount}
      onChange={(e) => setWithdrawalAmount(e.target.value)}
    />

    <p className="text-warning text-center fw-bold mt-2">
      Minimum withdrawal amount is $50.
    </p>




    <div className="d-flex justify-content-between mt-3 gap-2">
      <button className="btn app-black app-text-white w-50 border rounded py-2 fw-bold" onClick={() => setMobileWithdrawPopup(false)}>
        Cancel
      </button>
      <button
        className="btn w-50 app-text-white border fw-bold rounded py-2 app-red"
        // style={{ background: "linear-gradient(91.96deg, #0C243C 0%, #7E8C9C 100%)" }}
        onClick={handleWithdraw}
      >
        Proceed
      </button>
    </div>
  </div>
</Popup>
</>
  );
}
