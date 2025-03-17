import React, { useState, useRef, useEffect } from "react";
import { BASE_URI } from "../../Config/url";
import { LuUsers2 } from "react-icons/lu";
import { IoIosTimer } from "react-icons/io";
import { TiBusinessCard } from "react-icons/ti";
import Chart from "chart.js/auto";
import { TbMoneybag } from "react-icons/tb";
import axios from "axios";
import { CustomLoader } from "../../Components/CustomLoader/CustomLoader";

const Dashboard = () => {
  const [type, setType] = useState("week");
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const revenueChartRef = useRef(null);
  const enrollmentsChartRef = useRef(null);
  const ratingsChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  const enrollmentsChartInstance = useRef(null);
  const ratingsChartInstance = useRef(null);

  const fetchGraphData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URI}/api/v1/expert/expertGraphs?type=${type}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setGraphData(response.data);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
    finally{
      setLoading(false);
    }
  };

  


  const fetchDashboardData = async () => {
    try{
      const response = await axios.get(
        `${BASE_URI}/api/v1/expert/expertDashboard?type=${type}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDashboardData(response.data.data);
      // console.log(response.data.data);
    }
    catch(error){
      console.error("Error fetching dashboard data:", error);
    }
  }

  useEffect(() => {
    fetchGraphData();
    fetchDashboardData()
  }, [type]);

  // Static data for non-API parts
  // const user = { name: "John Doe" };
  const staticData = {
    enrolls: {
      total_students: dashboardData?.enrolls?.total_students,
      current_month_revenue: dashboardData?.enrolls?.current_month_revenue,
      today_enrolled: dashboardData?.enrolls?.today_enrolled,
      total_revenue: dashboardData?.enrolls?.total_revenue,
    },
    coursesInDemand: dashboardData?.coursesInDemand,
    ratings: dashboardData?.reviews[0],
  };

  // Process data and update charts
  useEffect(() => {
    // Clean up function to destroy charts
    const cleanupCharts = () => {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
        revenueChartInstance.current = null;
      }
      if (enrollmentsChartInstance.current) {
        enrollmentsChartInstance.current.destroy();
        enrollmentsChartInstance.current = null;
      }
    };

    // Return early if no data
    if (!graphData || !graphData.data) {
      return cleanupCharts;
    }

    const analyticsData = graphData.data;

    // Process charts based on the selected type
    if (type === "week") {
      // Generate data for all 7 days of the week
      const weeklyEnrollments = Array(7).fill(0);
      const weeklyRevenue = Array(7).fill(0);
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      // Populate weekly enrollment data
      if (analyticsData.Enrolled && Array.isArray(analyticsData.Enrolled)) {
        analyticsData.Enrolled.forEach((item) => {
          if (item.enrollment_date) {
            const dayIndex = new Date(item.enrollment_date).getDay(); // 0 = Sunday, 1 = Monday, etc.
            weeklyEnrollments[dayIndex] = parseFloat(item.daily_enrolled) || 0;
          }
        });
      }

      // Populate weekly revenue data
      if (analyticsData.Revenue && Array.isArray(analyticsData.Revenue)) {
        analyticsData.Revenue.forEach((item) => {
          if (item.payment_date) {
            const dayIndex = new Date(item.payment_date).getDay();
            weeklyRevenue[dayIndex] = parseFloat(item.daily_revenue) || 0;
          }
        });
      }

      // Calculate maximum values for scaling charts
      const maxRevenue = Math.max(...weeklyRevenue, 1); // Ensure at least 1 to avoid division by zero
      const maxEnrollments = Math.max(...weeklyEnrollments, 1);

      // Chart configuration
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false } 
        },
        scales: {
          x: { 
            grid: { display: false },
            ticks: { color: "#888", font: { size: 12 } }
          },
          y: { 
            grid: { display: false },
            ticks: { color: "#888", font: { size: 12 } },
            beginAtZero: true
          }
        }
      };

      // Create revenue chart
      if (revenueChartRef.current) {
        cleanupCharts();
        
        revenueChartInstance.current = new Chart(revenueChartRef.current, {
          type: "line",
          data: {
            labels: days,
            datasets: [{
              label: "Revenue",
              data: weeklyRevenue,
              borderColor: "#F90815",
              borderWidth: 3,
              fill: false,
              tension: 0.4,
              pointRadius: 4
            }]
          },
          options: {
            ...chartOptions,
            scales: {
              ...chartOptions.scales,
              y: {
                ...chartOptions.scales.y,
                ticks: {
                  ...chartOptions.scales.y.ticks,
                  callback: (value) => `$${value}`
                },
                max: Math.ceil(maxRevenue / 100) * 100
              }
            }
          }
        });
      }

      // Create enrollments chart
      if (enrollmentsChartRef.current) {
        enrollmentsChartInstance.current = new Chart(enrollmentsChartRef.current, {
          type: "bar",
          data: {
            labels: days,
            datasets: [{
              label: "Enrollments",
              data: weeklyEnrollments,
              backgroundColor: "#F90815",
              borderWidth: 0,
              borderRadius: 4,
              barThickness: 30
            }]
          },
          options: {
            ...chartOptions,
            scales: {
              ...chartOptions.scales,
              y: {
                ...chartOptions.scales.y,
                max: Math.ceil(maxEnrollments / 10) * 10
              }
            }
          }
        });
      }
    } else if (type === "month") {
      // For monthly view, we need to show data for all weeks (Week 1-4)
      const processMonthlyData = (dataArray, isRevenue) => {
        if (!dataArray || dataArray.length === 0) return { labels: [], values: [] };
        
        // Create arrays for weekly labels and data
        const weekLabels = [];
        const weekValues = [];
        
        // Sort data by week start date
        const sortedData = [...dataArray].sort((a, b) => {
          return new Date(a.week_start) - new Date(b.week_start);
        });
        
        // Get the first day of the month
        const firstWeekStart = new Date(sortedData[0]?.week_start || new Date());
        const monthStart = new Date(firstWeekStart.getFullYear(), firstWeekStart.getMonth(), 1);
        
        // Generate labels and values for all weeks in the month
        for (let week = 0; week < 5; week++) { // Consider up to 5 weeks in a month
          const weekStart = new Date(monthStart);
          weekStart.setDate(monthStart.getDate() + (week * 7));
          
          // Stop if we're in the next month
          if (weekStart.getMonth() !== monthStart.getMonth()) break;
          
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          
          // Format the week label
          const weekLabel = `Week ${week + 1}`;
          weekLabels.push(weekLabel);
          
          // Find the matching data for this week
          const weekData = sortedData.find(item => {
            const itemWeekStart = new Date(item.week_start);
            return (
              itemWeekStart.getDate() >= weekStart.getDate() && 
              itemWeekStart.getDate() <= weekEnd.getDate()
            );
          });
          
          // Add the value or 0 if no data
          weekValues.push(
            weekData 
              ? parseFloat(isRevenue ? weekData.weekly_revenue : weekData.weekly_enrolled) || 0 
              : 0
          );
        }
        
        return { labels: weekLabels, values: weekValues };
      };

      // Create month charts
      if (revenueChartRef.current && enrollmentsChartRef.current) {
        cleanupCharts();
        
        const revenueData = processMonthlyData(analyticsData.Revenue, true);
        const enrollmentsData = processMonthlyData(analyticsData.Enrolled, false);
        
        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: "#888", font: { size: 12 } } },
            y: { grid: { display: false }, ticks: { color: "#888", font: { size: 12 } }, beginAtZero: true }
          }
        };

        // Revenue chart for month
        revenueChartInstance.current = new Chart(revenueChartRef.current, {
          type: "line",
          data: {
            labels: revenueData.labels,
            datasets: [{
              label: "Revenue",
              data: revenueData.values,
              borderColor: "#F90815",
              borderWidth: 3,
              fill: false,
              tension: 0.4,
              pointRadius: 4
            }]
          },
          options: chartOptions
        });

        // Enrollments chart for month
        enrollmentsChartInstance.current = new Chart(enrollmentsChartRef.current, {
          type: "bar",
          data: {
            labels: enrollmentsData.labels,
            datasets: [{
              label: "Enrollments",
              data: enrollmentsData.values,
              backgroundColor: "#F90815",
              borderWidth: 0,
              borderRadius: 4,
              barThickness: 30
            }]
          },
          options: {
            ...chartOptions,
            scales: { ...chartOptions.scales, y: { beginAtZero: true } }
          }
        });
      }
    } else if (type === "year") {
      // For yearly view, we need to show data for all months
      const processYearlyData = (dataArray, isRevenue) => {
        if (!dataArray || dataArray.length === 0) return { labels: [], values: [] };
        
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        
        const monthlyValues = Array(12).fill(0);
        
        // Populate with actual data
        dataArray.forEach(item => {
          if (item.month_start) {
            const monthIndex = new Date(item.month_start).getMonth();
            monthlyValues[monthIndex] = parseFloat(isRevenue ? item.monthly_revenue : item.monthly_enrolled) || 0;
          }
        });
        
        return { labels: monthNames, values: monthlyValues };
      };

      // Create year charts
      if (revenueChartRef.current && enrollmentsChartRef.current) {
        cleanupCharts();
        
        const revenueData = processYearlyData(analyticsData.Revenue, true);
        const enrollmentsData = processYearlyData(analyticsData.Enrolled, false);
        
        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: "#888", font: { size: 12 } } },
            y: { grid: { display: false }, ticks: { color: "#888", font: { size: 12 } }, beginAtZero: true }
          }
        };

        // Revenue chart for year
        revenueChartInstance.current = new Chart(revenueChartRef.current, {
          type: "line",
          data: {
            labels: revenueData.labels,
            datasets: [{
              label: "Revenue",
              data: revenueData.values,
              borderColor: "#F90815",
              borderWidth: 3,
              fill: false,
              tension: 0.4,
              pointRadius: 4
            }]
          },
          options: chartOptions
        });

        // Enrollments chart for year
        enrollmentsChartInstance.current = new Chart(enrollmentsChartRef.current, {
          type: "bar",
          data: {
            labels: enrollmentsData.labels,
            datasets: [{
              label: "Enrollments",
              data: enrollmentsData.values,
              backgroundColor: "#F90815",
              borderWidth: 0,
              borderRadius: 4,
              barThickness: 30
            }]
          },
          options: {
            ...chartOptions,
            scales: { ...chartOptions.scales, y: { beginAtZero: true } }
          }
        });
      }
    }else if (type === "all time") {
  // For all time view, show data by years
  const processAllTimeData = (dataArray, isRevenue) => {
    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      return { labels: [], values: [] };
    }
    
    // Sort data by year
    const sortedData = [...dataArray].sort((a, b) => (a.year || 0) - (b.year || 0));
    
    // Get unique years
    const uniqueYears = [...new Set(sortedData.map(item => item.year?.toString() || ''))].filter(year => year !== '');
    
    // Create year labels and data values
    const yearLabels = uniqueYears;
    const yearValues = uniqueYears.map(year => {
      const yearData = sortedData.find(item => item.year?.toString() === year);
      return yearData 
        ? parseFloat(isRevenue ? yearData.yearly_revenue : yearData.yearly_enrolled) || 0 
        : 0;
    });
    
    return { labels: yearLabels, values: yearValues };
  };

  // Create all time charts
  if (revenueChartRef.current && enrollmentsChartRef.current) {
    cleanupCharts();
    
    const revenueData = processAllTimeData(analyticsData.Revenue, true);
    const enrollmentsData = processAllTimeData(analyticsData.Enrolled, false);
    
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#888", font: { size: 12 } } },
        y: { grid: { display: false }, ticks: { color: "#888", font: { size: 12 } }, beginAtZero: true }
      }
    };

    // Revenue chart for all time
    revenueChartInstance.current = new Chart(revenueChartRef.current, {
      type: "line",
      data: {
        labels: revenueData.labels,
        datasets: [{
          label: "Revenue",
          data: revenueData.values,
          borderColor: "#F90815",
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointRadius: 4
        }]
      },
      options: chartOptions
    });

    // Enrollments chart for all time
    enrollmentsChartInstance.current = new Chart(enrollmentsChartRef.current, {
      type: "bar",
      data: {
        labels: enrollmentsData.labels,
        datasets: [{
          label: "Enrollments",
          data: enrollmentsData.values,
          backgroundColor: "#F90815",
          borderWidth: 0,
          borderRadius: 4,
          barThickness: 30
        }]
      },
      options: {
        ...chartOptions,
        scales: { ...chartOptions.scales, y: { beginAtZero: true } }
      }
    });
  }
}

    return cleanupCharts;
  }, [graphData, type]);

  const reviewData = dashboardData?.reviews[0] || {};

// Transform string values to numbers and order them from 5 stars to 1 star
const chartData = [
  parseFloat(reviewData["5_stars"] || "0"),
  parseFloat(reviewData["4_stars"] || "0"),
  parseFloat(reviewData["3_stars"] || "0"),
  parseFloat(reviewData["2_stars"] || "0"),
  parseFloat(reviewData["1_stars"] || "0")
];

// Update this useEffect to depend on dashboardData instead of just loading
useEffect(() => {
  // Only proceed if we have dashboard data and the chart ref exists
  if (dashboardData?.reviews && dashboardData.reviews[0] && ratingsChartRef.current) {
    // Destroy any previous instance
    if (ratingsChartInstance.current) {
      ratingsChartInstance.current.destroy();
    }
    
    // Get the review data
    const reviewData = dashboardData.reviews[0];
    
    // Create the chart with the latest data
    ratingsChartInstance.current = new Chart(ratingsChartRef.current, {
      type: "doughnut",
      data: {
        labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
        datasets: [{
          data: [
            parseFloat(reviewData["5_stars"] || "0"),
            parseFloat(reviewData["4_stars"] || "0"),
            parseFloat(reviewData["3_stars"] || "0"),
            parseFloat(reviewData["2_stars"] || "0"),
            parseFloat(reviewData["1_stars"] || "0")
          ],
          backgroundColor: ["#000000", "#F90815", "#8B0000", "#FF4500", "#FFA500"],
          borderWidth: 0,
          hoverOffset: 8,
        }],
      },
      options: {
        cutout: "70%",
        plugins: {
          legend: {
            position: "top",
            labels: { color: "#666", font: { size: 12 }, usePointStyle: true }
          }
        }
      }
    });
  }
  
  return () => {
    if (ratingsChartInstance.current) {
      ratingsChartInstance.current.destroy();
      ratingsChartInstance.current = null;
    }
  };
}, [dashboardData]); // Add dashboardData as a dependency

  return (
    <div className="container-fluid p-3">
      {
        loading ? 
        <div className="app-white rounded-3 p-1 ">

    <div className="d-flex align-items-center w-100 justify-content-between">
      <CustomLoader width="48.5%" height="7rem" className="rounded-3"/>
      <CustomLoader width="48.5%" height="7rem" className="rounded-3"/>
    </div> 
    <div className="d-flex mt-2 align-items-center w-100 justify-content-between">
      <CustomLoader width="48.5%" height="7rem" className="rounded-3"/>
      <CustomLoader width="48.5%" height="7rem" className="rounded-3"/>
    </div> 
    <CustomLoader width="100%" height="15rem" className="rounded-3 mt-2"/>
    <CustomLoader width="100%" height="15rem" className="rounded-3 mt-1"/>


    </div>
        :
        <>
        <div className="row mb-3">
        <div className="col-12 w-100 app-white py-2">
          <h3 className="text-capitalize fs-5 d-flex gap-2">
            {(() => {
              const hour = new Date().getHours();
              if (hour >= 5 && hour < 12) return "Good Morning";
              else if (hour >= 12 && hour < 17) return "Good Afternoon";
              else if (hour >= 17 && hour < 22) return "Good Evening";
              else return "Good Night";
            })()}
            <h6 className="align-self-center fs-5 fw-bold" style={{ width: "max-content" }}>
  {JSON.parse(localStorage.getItem('user'))?.name || "Guest"}
</h6>

          </h3>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="row mt-1 mb-1">
        {["Total Students", "Earnings", "New Enrollments", "Total Revenue"].map((title, index) => (
          <div className="col-6 px-1 col-md-3 pb-2" key={index}>
            <div className="custom-box border-0 app-white px-3 py-3 h-100 d-flex flex-column align-items-center justify-content-between text-center gap-2">
              <div className="p-2 px-3 w-50 rounded-pill border border-2 d-flex justify-content-center align-items-center" style={{ minHeight: "65px" }}>
                {index === 0 ? <LuUsers2 className="fs-1 app-text-black" /> :
                 index === 1 ? <IoIosTimer className="fs-1 app-text-black" /> :
                 index === 2 ? <TiBusinessCard className="fs-1 app-text-black" /> :
                 <TbMoneybag className="fs-1 app-text-black" />}
              </div>
              <h5 className="fw-normal fs-6 flex-grow-1 text-truncate">{title}</h5>
              <h2 className="mb-0 fs-4 fw-lightBold">
                {index === 0 ? staticData.enrolls.total_students :
                 index === 1 ? staticData.enrolls.current_month_revenue :
                 index === 2 ? staticData.enrolls.today_enrolled :
                 staticData.enrolls.total_revenue}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Time Period Selector */}
      <div className="w-100 mb-2 gap-3 ps-3 p-2 px-2 justify-content-start mt-2 rounded-1 app-white d-flex gap-2">
        {["week", "month", "year", "all time"].map((btnType) => (
          <h4
            key={btnType}
            style={{ cursor: "pointer" }}
            className={`p-1 px-2 rounded-2 fs-6 fw-regular border-2 ${
              type === btnType ? "app-black app-text-white border-black" : "border border-1 text-secondary"
            }`}
            onClick={() => setType(btnType)}
          >
            {btnType.charAt(0).toUpperCase() + btnType.slice(1)}
          </h4>
        ))}
      </div>

      {/* Charts Section */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card p-0 w-100 custom-box">
            <div className="card-body" style={{ maxHeight: "300px", paddingBottom: "50px" }}>
              <h5 className="p-1 rounded-1 fs-6 fw-normal app-black app-text-white" style={{ width: "max-content" }}>
                Revenue
              </h5>
              <canvas ref={revenueChartRef} height="200"></canvas>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card p-0 w-100 custom-box">
            <div className="card-body" style={{ maxHeight: "300px", paddingBottom: "50px" }}>
              <h5 className="p-1 rounded-1 fs-6 fw-normal app-black app-text-white" style={{ width: "max-content" }}>
                New Enrollments
              </h5>
              <canvas ref={enrollmentsChartRef} height="200"></canvas>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="row mt-3 mb-5">
        <div className="col-md-6 mb-3">
          <div className="card p-0 w-100 custom-box">
            <div className="card-body" style={{ maxHeight: "300px" }}>
              <h5 className="p-1 rounded-1 fs-6 fw-normal app-black app-text-white" style={{ width: "max-content" }}>
                Courses in Demand
              </h5>
              <ul className="list-group mt-1">
                {staticData?.coursesInDemand?.map((course, index) => (
                  <li key={course.id} className="list-group-item ps-0 border-0">
                    {index + 1}. {course.title} (Enrolled: {course.enrolled})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card p-0 w-100 custom-box">
            <div className="card-body" style={{ maxHeight: "300px", paddingBottom: "50px" }}>
              <h5 className="p-1 rounded-1 fs-6 fw-normal app-black app-text-white" style={{ width: "max-content" }}>
                Ratings Overview
              </h5>
              <div className="d-flex justify-content-center" style={{ height: "200px" }}>
                <canvas ref={ratingsChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      }
      {/* Header Section */}
      
    </div>
  );
};

export default Dashboard;