import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import "./FighterDetails.css"
import { BASE_URI } from '../../Config/url';
const FighterDetails = () => {
  const { id } = useParams();
  const [fighter, setFighter] = useState(null);
  const [fightHistory, setFightHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFighterData = async () => {
      try {
        setLoading(true);
        // Fetch fighter profile data
        const profileResponse = await fetch(`${BASE_URI}/api/v1/expert/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const profileData = await profileResponse.json();
        
        // Fetch fighter history data
        const historyResponse = await fetch(`${BASE_URI}/api/v1/users/getFighterHistory?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const historyData = await historyResponse.json();
        
        if (profileData.status === "success" && historyData.status === "success") {
          setFighter(profileData.data.expert);
          setFightHistory(historyData.data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (err) {
        setError("Failed to load fighter data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFighterData();
  }, [id, BASE_URI]);

  useEffect(() => {
    console.log(fighter);
  }, [fighter]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !fighter) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">{error || "Fighter not found"}</div>
      </div>
    );
  }

  return (
    <div className="fighter-profile w-100">
      {/* Header */}
      <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
        <div className="h5 mb-0">{fighter.name}</div>
        <div className="country">
          <span className="me-2">{fighter.country}</span>
          <img src={`https://flagcdn.com/w20/${fighter.country.toLowerCase()}.png`} alt="Country flag" />
        </div>
      </div>

      {/* Profile Image */}
      <div className="w-100 d-flex justify-content-center">
        <img src={fighter.profile_picture} alt={fighter.name} style={{ objectFit: "cover", width: "30rem"}} />
      </div>

      {/* Stats Section */}
      <div className="container-fluid bg-dark text-white p-4">
  <div className="row">
    {/* Left Side - Personal Info */}
    <div className="col-md-6">
      <div className="d-flex align-items-center mb-3">
        <span className="fw-bold me-4">AGE</span>
        <span>{fighter.age} <span className="text-danger">/</span> Aug 27,1998</span>
      </div>
      
      <div className="d-flex align-items-center mb-3">
        <span className="fw-bold me-4">HEIGHT</span>
        <span>{fighter.height}</span>
      </div>
      
      <hr className="my-4" />
      
      <div className="mb-3">
        <div className="fw-bold fs-4 mb-2">Associations</div>
        <div className="text-danger">{fighter.company_name}</div>
      </div>
      
      <div className="mb-3">
        <div className="fw-bold fs-4 mb-2">Class</div>
        <div className="text-danger">{fighter.fighter_class}</div>
      </div>
    </div>
    
    {/* Right Side - Stats */}
    <div className="col-md-6">
      <div className="row mb-4 justify-content-end">
        {/* Wins */}
        <div className="col-4">
        <div className="d-flex align-items-center mb-2 mt-3">
  <span className="bg-success text-white px-3 py-1 position-relative">Wins</span>
  <span className="text-success px-3 py-1 fw-bold position-relative" style={{ 
      boxShadow: 'inset 0 0 0 2px #198754', 
      // borderRadius: '0 5px 5px 0' 
    }}>{fighter.wins}</span>
</div>


          
          <div className="mb-2">
            <div className="d-flex align-items-center mb-1">
              <span className="bg-danger text-white px-2 py-1 me-2">1</span>
              <span>KO / KTO</span>
              <span className="ms-auto">{fighter.kto_percentage}%</span>
            </div>
            <div className="progress mb-2" style={{ height: "8px" }}>
              <div className="progress-bar bg-danger" role="progressbar" style={{ width: "80%" }}></div>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="d-flex align-items-center mb-1">
              <span className="bg-danger text-white px-2 py-1 me-2">2</span>
              <span>Submission</span>
              <span className="ms-auto">{fighter.submission_percentage}%</span>
            </div>
            <div className="progress mb-2" style={{ height: "8px" }}>
              <div className="progress-bar bg-danger" role="progressbar" style={{ width: "60%" }}></div>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="d-flex align-items-center mb-1">
              <span className="bg-danger text-white px-2 py-1 me-2">3</span>
              <span>Decisions</span>
              <span className="ms-auto">50%</span>
            </div>
            <div className="progress mb-2" style={{ height: "8px" }}>
              <div className="progress-bar bg-danger" role="progressbar" style={{ width: "50%" }}></div>
            </div>
          </div>
        </div>
        
        {/* Losses */}
        <div className="col-4">
        <div className="d-flex align-items-center mb-2 mt-3">
  <span className="bg-danger text-white px-3 py-1 position-relative">Losses</span>
  <span className="text-danger px-3 py-1 fw-bold position-relative" style={{ 
      boxShadow: 'inset 0 0 0 2px #dc3545', 
      // borderRadius: '0 5px 5px 0' 
    }}>{fighter.losses}</span>
</div>

          
          <div className="mb-2">
            <div className="d-flex align-items-center mb-1">
              <span className="bg-danger text-white px-2 py-1 me-2">1</span>
              <span>KO / KTO</span>
              <span className="ms-auto">{fighter.kto_percentage}%</span>
            </div>
            <div className="progress mb-2" style={{ height: "8px" }}>
              <div className="progress-bar bg-danger" role="progressbar" style={{ width: "55%" }}></div>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="d-flex align-items-center mb-1">
              <span className="bg-danger text-white px-2 py-1 me-2">2</span>
              <span>Submission</span>
              <span className="ms-auto">{fighter.submission_percentage}%</span>
            </div>
            <div className="progress mb-2" style={{ height: "8px" }}>
              <div className="progress-bar bg-danger" role="progressbar" style={{ width: "60%" }}></div>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="d-flex align-items-center mb-1">
              <span className="bg-danger text-white px-2 py-1 me-2">3</span>
              <span>Decisions</span>
              <span className="ms-auto">50%</span>
            </div>
            <div className="progress mb-2" style={{ height: "8px" }}>
              <div className="progress-bar bg-danger" role="progressbar" style={{ width: "50%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Fight History Section */}
      <div className="fight-history mt-3">
        <div className="bg-dark text-white p-3 mb-2">
          <h5 className="mb-0">Fight History - Pro</h5>
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
              </tr>
            </thead>
            <tbody>
              {fightHistory.map((fight) => (
                <tr key={fight.id} className={fight.result === "win" ? "table-success" : "table-danger"}>
                  <td className={`fw-bold ${fight.result === "win" ? "text-success" : "text-danger"}`}>
                    {fight.result.charAt(0).toUpperCase() + fight.result.slice(1)}
                  </td>
                  <td>{fight.fighter_name}</td>
                  <td>{fight.event_name}

                  <div className="text-center mt-2">
                  <a 
  href={fight.fight_video_link.startsWith("http") ? fight.fight_video_link : `https://${fight.fight_video_link}`} 
  target="_blank" 
  rel="noopener noreferrer" 
  className="btn btn-warning"
>
  View Play-by-Play
</a>
          </div>
                  </td>
                  <td>
                    <div className="fw-bold">{fight.method_referee.split(" ")[0]}</div>
                    <div className="small text-muted">{fight.method_referee.substring(fight.method_referee.indexOf(" ") + 1)}</div>
                  </td>
                  <td>{fight.rounds}</td>
                  <td>{fight.time.substring(0, 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
      </div>
    </div>
  );
}

export default FighterDetails