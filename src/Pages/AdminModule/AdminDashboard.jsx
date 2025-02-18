import { useState, useEffect, useMemo } from "react";
import "./AdminDashboard.css";
import { Line, Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { FaCalendar } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, set } from "date-fns";
import useFetch from "../../hooks/useFetch";
import { BASE_URI } from "../../Config/url";
import axios from "axios";
import { RiH1 } from "react-icons/ri";
import { HashLoader } from "react-spinners";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement
);

function AdminDashboard() {
  const [data, setData] = useState({});
  const [courseCompletion, setCourseCompletion] = useState({});
  const [mostBoughtCourses, setMostBoughtCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [type, setType] = useState("week");
  const [revenue, setRevenue] = useState([]);
  const [loading, setIsLoading] = useState(false)
  const [loading1, setIsLoading1] = useState(false)
  const [isOpen, setIsOpen] = useState(false);

  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);


  const token = localStorage.getItem("token");

  // const url = `${BASE_URI}/api/v1/admin/adminDashboard?from=2024-09-1&to=2024-09-6`;
  // const { adminData, error, refetch, isLoading } = useFetch(url, {
  //   headers: {
  //     Authorization: "Bearer " + token,
  //   },
  // });

  // // // const coursesData = data;
  // const coursesData = useMemo(() => adminData?.data || [], [adminData]);

  function getCurrentWeekDates() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // Sunday is 0, Monday is 1, etc.
    const startOfWeek = new Date(now); // Create a copy of the current date
    const endOfWeek = new Date(now);

    // Adjust to the start of the week (Monday)
    startOfWeek.setDate(now.getDate() - (dayOfWeek - 1));

    // Adjust to the end of the week (Sunday)
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const from = format(startOfWeek, "yyyy-MM-dd");
    const to = format(endOfWeek, "yyyy-MM-dd");

    return { from, to };
  }

  // Usage
  const { from, to } = getCurrentWeekDates();
  

  // You can now use this in your API call
  // const url = `${BASE_URI}/api/v1/admin/adminDashboard?from=${from}&to=${to}`;

  const fetchDashboard = async () => {
    const reqData = formatWeekRange();
    setIsLoading(true)
    const adminData = await axios({
      method: "GET",
      url: `${BASE_URI}/api/v1/admin/adminDashboard`,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    
    setData({
      TotalStudents: {
        value: adminData?.data?.data?.enrolls?.total_students,
      },
      TotalCourses: {
        value: adminData?.data?.data?.enrolls?.total_courses,
      },
      TotalExperts: {
        value: adminData?.data?.data?.enrolls?.total_experts,
      },
      TotalRevenue: {
        value: adminData?.data?.data?.enrolls?.total_revenue,
      },
      TotalCommission: {
        value: Math.floor(adminData?.data?.data?.enrolls?.total_commission),
      },
    });
    setCourseCompletion({
      completed: adminData?.data?.data?.total_users?.certified_user,
      incomplete: adminData?.data?.data?.total_users?.uncertified_users,
    });

    const colors = ["#82CA9D", "#00AEEF", "#88929D", "#A4A7AD"];
    setMostBoughtCourses(
      adminData?.data?.data?.coursesInDemand
        ?.slice(0, 4)
        .map((course, index) => ({
          name: course.title,
          value: course.enrolled,
          color: colors[index],
        }))
    );
    setIsLoading(false)
  };
  const fetchGraphDashboard = async () => {
    setIsLoading1(true)
    const adminGraphData = await axios({
      method: "GET",
      url: `${BASE_URI}/api/v1/admin/adminDashboardGraphs?type=${type}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    
  
    if (type === "week") {
      // Handling weekly data
      setEnrollments([
        { day: "Mon", value: adminGraphData?.data?.data?.Enrolled[0]?.daily_enrolled },
        { day: "Tue", value: adminGraphData?.data?.data?.Enrolled[1]?.daily_enrolled },
        { day: "Wed", value: adminGraphData?.data?.data?.Enrolled[2]?.daily_enrolled },
        { day: "Thu", value: adminGraphData?.data?.data?.Enrolled[3]?.daily_enrolled },
        { day: "Fri", value: adminGraphData?.data?.data?.Enrolled[4]?.daily_enrolled },
        { day: "Sat", value: adminGraphData?.data?.data?.Enrolled[5]?.daily_enrolled },
        { day: "Sun", value: adminGraphData?.data?.data?.Enrolled[6]?.daily_enrolled },
      ]);
  
      setRevenue([
        { day: "Mon", value: adminGraphData?.data?.data?.Revenue[0]?.daily_revenue },
        { day: "Tue", value: adminGraphData?.data?.data?.Revenue[1]?.daily_revenue },
        { day: "Wed", value: adminGraphData?.data?.data?.Revenue[2]?.daily_revenue },
        { day: "Thu", value: adminGraphData?.data?.data?.Revenue[3]?.daily_revenue },
        { day: "Fri", value: adminGraphData?.data?.data?.Revenue[4]?.daily_revenue },
        { day: "Sat", value: adminGraphData?.data?.data?.Revenue[5]?.daily_revenue },
        { day: "Sun", value: adminGraphData?.data?.data?.Revenue[6]?.daily_revenue },
      ]);
    }
  
    if (type === "month") {
      // Handling monthly data
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
      const getWeekIndex = (weekStart) => {
        const date = new Date(weekStart);
        const day = date.getDate();
        return Math.floor((day - 1) / 7);
      };
      
      const monthlyEnrollments = Array(5).fill(0);
      const monthlyRevenue = Array(5).fill(0);
  
      adminGraphData?.data?.data?.Enrolled?.forEach((item) => {
        const weekIndex = getWeekIndex(item.week_start);
        if (weekIndex >= 0 && weekIndex < 5) {
          monthlyEnrollments[weekIndex] += item.weekly_enrolled;
        }
      });
  
      adminGraphData?.data?.data?.Revenue?.forEach((item) => {
        const weekIndex = getWeekIndex(item.week_start);
        if (weekIndex >= 0 && weekIndex < 5) {
          monthlyRevenue[weekIndex] += parseFloat(item.weekly_revenue);
        }
      });
  
      setEnrollments(
        weeks.map((week, index) => ({
          week: week,
          value: monthlyEnrollments[index],
        }))
      );
  
      setRevenue(
        weeks.map((week, index) => ({
          week: week,
          value: monthlyRevenue[index].toFixed(2),
        }))
      );
    }
  
    if (type === "year") {
      // Handling yearly data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
      const yearlyEnrollments = Array(12).fill(0);
      const yearlyRevenue = Array(12).fill(0);
  
      adminGraphData?.data?.data?.Enrolled?.forEach((item, index) => {
        yearlyEnrollments[index] = item.monthly_enrolled;
      });
  
      adminGraphData?.data?.data?.Revenue?.forEach((item, index) => {
        yearlyRevenue[index] = parseFloat(item.monthly_revenue);
      });
  
      setEnrollments(
        months.map((month, index) => ({
          month: month,
          value: yearlyEnrollments[index],
        }))
      );
  
      setRevenue(
        months.map((month, index) => ({
          month: month,
          value: yearlyRevenue[index].toFixed(2),
        }))
      );
    }
  
    if (type === "all time") {
      // Handling all-time data
      const currentYear = new Date().getFullYear();
      const yearsRange = [];
      
      // Create an array of years from two years before to two years after the current year
      for (let i = currentYear - 2; i <= currentYear + 2; i++) {
        yearsRange.push(i);
      }
    
      const allTimeEnrollments = yearsRange.map(year => {
        const yearData = adminGraphData?.data?.data?.Enrolled.find(item => item.year === year);
        return {
          year: year,
          value: yearData ? yearData.yearly_enrolled : 0, // Default to 0 if no data for that year
        };
      });
    
      const allTimeRevenue = yearsRange.map(year => {
        const yearData = adminGraphData?.data?.data?.Revenue.find(item => item.year === year);
        return {
          year: year,
          value: yearData ? parseFloat(yearData.yearly_revenue).toFixed(2) : "0.00", // Default to "0.00" if no data for that year
        };
      });
    
      setEnrollments(allTimeEnrollments);
      setRevenue(allTimeRevenue);
    }
    setIsLoading1(false)
    
  };
  
  useEffect(() => {
    fetchDashboard();
    fetchGraphDashboard();
  }, [type]);
  
  // Enrollment chart data
const enrollmentData = {
  labels: type === "week"
    ? enrollments.map((e) => e.day)
    : type === "month"
    ? enrollments.map((e) => e.week)
    : type === "year"
    ? enrollments.map((e) => e.month)
    : enrollments.map((e) => e.year), // For 'all time'
  datasets: [
    {
      label: "Enrollments",
      data: enrollments.map((e) => e.value),
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
      fill: true,
      tension: 0.4,
    },
  ],
};

// Revenue chart data
const revenueData = {
  labels: type === "week"
    ? revenue.map((r) => r.day)
    : type === "month"
    ? revenue.map((r) => r.week)
    : type === "year"
    ? revenue.map((r) => r.month)
    : revenue.map((r) => r.year), // For 'all time'
  datasets: [
    {
      label: "Revenue",
      data: revenue.map((r) => r.value),
      backgroundColor: "rgba(153,102,255,0.2)",
      borderColor: "rgba(153,102,255,1)",
      fill: true,
      tension: 0.4,
    },
  ],
};

  
  
  

  // Enrollment and revenue chart data
  // if(type === 'week'){
  //   const enrollmentData = {
  //     labels: enrollments.map((e) => e.day),
  //     datasets: [
  //       {
  //         label: "Enrollments",
  //         data: enrollments.map((e) => e.value),
  //         backgroundColor: "rgba(75,192,192,0.2)",
  //         borderColor: "rgba(75,192,192,1)",
  //         fill: true,
  //         tension: 0.4,
  //       },
  //     ],
  //   // };
  // }

  const [startDate, setStartDate] = useState(new Date());

  const handleWeekChange = (date) => {
    const startOfWeek = date;
    const endOfWeek = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + 6
    );
    setStartDate(startOfWeek);
  };

  const formatWeekRange = () => {
    const endOfWeek = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    return `${format(startDate, "MMM-d")} - ${format(endOfWeek, "MMM-d")}`;
  };

  // const revenueData = {
  //   labels: revenue.map((r) => r.day),
  //   datasets: [
  //     {
  //       label: "Revenue",
  //       data: revenue.map((r) => r.value),
  //       backgroundColor: "rgba(153,102,255,0.2)",
  //       borderColor: "rgba(153,102,255,1)",
  //       fill: true,
  //       tension: 0.4,
  //     },
  //   ],
  // };

  // Course completion doughnut data
  const courseCompletionData = {
    labels: ["Completed", "Incomplete"],
    datasets: [
      {
        data: [courseCompletion.completed, courseCompletion.incomplete],
        backgroundColor: ["#00AEEF", "#F7464A"],
        cutout: "80%",
      },
    ],
  };

  // Most bought courses doughnut data
  const mostBoughtCoursesData = {
    labels: mostBoughtCourses.map((course) => course.name),
    datasets: [
      {
        data: mostBoughtCourses.map((course) => course.value),
        backgroundColor: mostBoughtCourses.map((course) => course.color),
        cutout: "80%",
      },
    ],
  };

  return (
    <div className="container-fluid">
      {(loading || loading1) ? <div style={{height:"90vh"}} className="flex align-items-center justify-content-center w-100">
        <HashLoader size="60" color="#0c243c"/>
      </div>
      :
      <>
      <div className="d-flex align-items-center justify-content-between w-100 mb-5">
        <div>
          <h3>Welcome Back, {user?.name}</h3>
          <p>Track & Manage your Platform</p>
        </div>
        {/* <div className="d-flex align-items-center gap-3 border shadow-sm rounded-3 px-3 py-2"> */}
        {/* <FaCalendar className="fs-4" /> */}

        {/* <DatePicker
            selected={startDate}
            onChange={handleWeekChange}
            dateFormat="MM/yyyy"
            showWeekNumbers
            showPopperArrow={false}
            customInput={<FaCalendar className="fs-4" />}
            highlightDates
            calendarStartDay={0}
          /> */}
        {/* <h5 className="fw-normal">{formatWeekRange()}</h5> */}
        {/* </div> */}
      </div>
      <div className="row admin-card-row">
        {Object.keys(data).map((key) => (
          <div key={key} className="col-md-4 card-md-4">
            <div
              className="card shadow-sm mb-3"
              style={{ width: "300px", margin: "auto" }}
            >
              <div className="card-body">
                <h5 className="card-title text-center">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </h5>
                <div className="d-flex justify-content-center align-items-center">
                  <i
                    className={`fas fa-lg ${data[key].icon} me-2`}
                    style={{ color: "#007bff" }}
                  ></i>
                  <h2 className="card-text me-2">{data[key].value}</h2>
                  {/* <span
                    className={`text-${
                      data[key].type === "increase" ? "success" : "danger"
                    }`}
                  >
                    {data[key].percentage}
                    <i
                      className={`fas fa-${
                        data[key].type === "increase"
                          ? "arrow-up"
                          : "arrow-down"
                      }`}
                      style={{ fontSize: "0.8rem" }}
                    ></i>
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row position-relative">
      <select 
  style={{ top: "-10%", right: "7.5%", width: "7rem" }} 
  className="position-absolute w-10 p-second  "
  value={type} // This binds the select element to the state
  onChange={(e) => setType(e.target.value)} // Handle change here
>
  <option  className="custom-option" value="week">Week</option>
  <option   className="custom-option"value="month">Month</option>
  <option   className="custom-option"value="year">Year</option>
  <option  className="custom-option" value="all time">All Time</option>
</select>


  

        <div className="col-md-6">
          <div className="card shadow-sm mb-4 admin-card">
            <div className="card-body">
              <h5 className="card-title text-center">New Enrollments</h5>
              <Line data={enrollmentData} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm mb-4 admin-card">
            <div className="card-body">
              <h5 className="card-title text-center">Revenue</h5>
              <Line data={revenueData} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="  mb-4">
            <div className="card-body">
              <h5 className="card-title text-center">Course Completion Rate</h5>
              <div className="d-flex align-items-center justify-content-center">
                <div className="completion-class" style={{ width: "20rem", height: "20rem" }}>
                  <Doughnut data={courseCompletionData} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-4">
            <div className="card-body">
              <h5 className="card-title text-center">Most Bought Courses</h5>
              <div className="d-flex align-items-center justify-content-center">
                <div  className="bought-class"style={{ width: "20rem", height: "20rem" }}>
                  <Doughnut data={mostBoughtCoursesData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      }
      
    </div>
  );
}

export default AdminDashboard;
