import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URI } from '../../Config/url';
import { format } from 'date-fns';
import defaultUser from '../../assets/defaultUser.svg';

const styles = {
  container: {
    padding: '20px',
    width: '100%',
    margin: '0',
    marginBottom: '5rem'

  },
  title: {
    color: '#333',
    fontWeight: 600,
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #F90815'
  },
  // Mobile styles
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  header: {
    backgroundColor: '#000',
    color: 'white',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  userImage: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid white'
  },
  userName: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 600
  },
  bookingType: {
    margin: 0,
    fontSize: '0.9rem',
    opacity: 0.9
  },
  bookingDate: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  dateLabel: {
    fontSize: '0.8rem',
    opacity: 0.9
  },
  dateValue: {
    fontWeight: 600
  },
  details: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  detailItem: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px'
  },
  detailLabel: {
    fontWeight: 600,
    minWidth: '100px',
    color: '#555'
  },
  detailValue: {
    flex: 1
  },
  topics: {
    flexDirection: 'column'
  },
  topicsText: {
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '4px',
    marginTop: '5px',
    whiteSpace: 'pre-line'
  },
  noBookings: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    color: '#6c757d'
  },
  // Mobile view details button
  mobileViewDetails: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 15px',
    borderTop: '1px solid #eee'
  },
  mobileExpandButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#F90815',
    fontWeight: 600,
    padding: '8px 16px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease'
  },
  mobileExpandButtonHover: {
    backgroundColor: 'rgba(249, 8, 21, 0.05)'
  },
  // Desktop styles
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    backgroundColor: '#555555',
    color: 'white',
    textAlign: 'left',
    padding: '15px',
    fontWeight: 600
  },
  tableRow: {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s ease'
  },
  tableRowHover: {
    backgroundColor: '#f9f9f9'
  },
  tableCell: {
    padding: '15px',
    verticalAlign: 'middle'
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  expandButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#555555',
    fontWeight: 600,
    padding: '5px 10px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease'
  },
  expandButtonHover: {
    backgroundColor: '#f0f0f0'
  },
  expandedContent: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderTop: '1px solid #eee'
  }
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedMobileCards, setExpandedMobileCards] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URI}/api/v1/expert/getSeminarBookings`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data.data)

          setBookings(response.data.data);
      
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again later.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy - h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  const toggleExpandRow = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const toggleMobileCard = (id) => {
    setExpandedMobileCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div style={styles.container} className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  // Mobile view - Card layout
  const renderMobileView = () => {
    return (
      <div style={styles.list}>
        {bookings.map((booking) => (
          <div key={booking.id} style={styles.card}>
            <div style={styles.header}>
              <div style={styles.userInfo}>
                <img 
                  src={booking.user_profile_picture || defaultUser} 
                  alt={booking.user_name}
                  style={styles.userImage}
                  onError={(e) => { e.target.src = defaultUser }}
                />
                <div>
                  <h3 style={styles.userName}>{booking.user_name}</h3>
                  <p style={styles.bookingType}>{booking.inquiry_about}</p>
                </div>
              </div>
              <div style={styles.bookingDate}>
                <span style={styles.dateLabel}>Seminar Date:</span>
                <span style={styles.dateValue}>{formatDate(booking.date)}</span>
              </div>
            </div>
            
            {/* Basic info always visible */}
            <div style={{
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{
                ...styles.detailItem,
                flexDirection: 'column',
                gap: '2px'
              }}>
                <span style={{
                  ...styles.detailLabel,
                  minWidth: 'auto'
                }}>Location:</span>
                <span style={styles.detailValue}>{booking.location}</span>
              </div>
            </div>

            {/* View Details button */}
            <div style={styles.mobileViewDetails}>
              <button 
                style={{
                  ...styles.mobileExpandButton,
                  ...(expandedMobileCards[booking.id] && styles.mobileExpandButtonHover)
                }}
                onClick={() => toggleMobileCard(booking.id)}
              >
                {expandedMobileCards[booking.id] ? 'Hide Details' : 'View Details'}
              </button>
            </div>
            
            {/* Expanded details */}
            {expandedMobileCards[booking.id] && (
              <div style={{
                ...styles.details,
                borderTop: '1px solid #eee',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{
                  ...styles.detailItem,
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  <span style={{
                    ...styles.detailLabel,
                    minWidth: 'auto'
                  }}>Full Name:</span>
                  <span style={styles.detailValue}>{booking.full_name}</span>
                </div>
                <div style={{
                  ...styles.detailItem,
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  <span style={{
                    ...styles.detailLabel,
                    minWidth: 'auto'
                  }}>Email:</span>
                  <span style={styles.detailValue}>{booking.email}</span>
                </div>
                <div style={{
                  ...styles.detailItem,
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  <span style={{
                    ...styles.detailLabel,
                    minWidth: 'auto'
                  }}>Phone:</span>
                  <span style={styles.detailValue}>{booking.phone_number}</span>
                </div>
                <div style={{
                  ...styles.detailItem,
                  ...styles.topics
                }}>
                  <span style={{
                    ...styles.detailLabel,
                    minWidth: 'auto'
                  }}>Topics:</span>
                  <p style={styles.topicsText}>{booking.topics}</p>
                </div>
                <div style={{
                  ...styles.detailItem,
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  <span style={{
                    ...styles.detailLabel,
                    minWidth: 'auto'
                  }}>Requested on:</span>
                  <span style={styles.detailValue}>{formatDate(booking.created_at)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Desktop view - Table layout
  const renderDesktopView = () => {
    return (
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Requester</th>
              <th style={styles.tableHeader}>Type</th>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Location</th>
              <th style={styles.tableHeader}>Requested On</th>
              <th style={styles.tableHeader}>Details</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <React.Fragment key={booking.id}>
                <tr 
                  style={{
                    ...styles.tableRow,
                    ...(expandedRow === booking.id && styles.tableRowHover)
                  }}
                >
                  <td style={styles.tableCell}>
                    <div style={styles.userCell}>
                      <img 
                        src={booking.user_profile_picture || defaultUser} 
                        alt={booking.user_name}
                        style={{...styles.userImage, width: '40px', height: '40px', borderColor: '#555555'}}
                        onError={(e) => { e.target.src = defaultUser }}
                      />
                      <div>
                        <div style={{fontWeight: 600}}>{booking.user_name}</div>
                        <div style={{fontSize: '0.9rem', color: '#666'}}>{booking.full_name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>{booking.inquiry_about}</td>
                  <td style={styles.tableCell}>{formatDate(booking.date)}</td>
                  <td style={styles.tableCell}>{booking.location}</td>
                  <td style={styles.tableCell}>{formatDate(booking.created_at)}</td>
                  <td style={styles.tableCell}>
                    <button 
                      style={{
                        ...styles.expandButton,
                        ...(expandedRow === booking.id && styles.expandButtonHover)
                      }}
                      onClick={() => toggleExpandRow(booking.id)}
                    >
                      {expandedRow === booking.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </td>
                </tr>
                {expandedRow === booking.id && (
                  <tr>
                    <td colSpan="6" style={{...styles.expandedContent, borderTop: '1px solid #555555'}}>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                        <div>
                          <h4 style={{fontSize: '1rem', fontWeight: 600, marginBottom: '10px', color: '#555555'}}>
                            Contact Information
                          </h4>
                          <div style={{marginBottom: '5px'}}>
                            <span style={{fontWeight: 600, marginRight: '10px', color: '#555555'}}>
                              Email:
                            </span>
                            <span>{booking.email}</span>
                          </div>
                          <div>
                            <span style={{fontWeight: 600, marginRight: '10px', color: '#555555'}}>
                              Phone:
                            </span>
                            <span>{booking.phone_number}</span>
                          </div>
                        </div>
                        <div>
                          <h4 style={{fontSize: '1rem', fontWeight: 600, marginBottom: '10px', color: '#555555'}}>
                            Topics
                          </h4>
                          <p style={{
                            backgroundColor: 'white',
                            padding: '10px',
                            borderRadius: '4px',
                            margin: 0,
                            whiteSpace: 'pre-line',
                            border: '1px solid #e0e0e0'
                          }}>{booking.topics}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title} className="mb-4">Seminar Bookings</h2>
      
      {bookings.length === 0 ? (
        <div style={styles.noBookings}>
          <p>No bookings found.</p>
        </div>
      ) : (
        isMobile ? renderMobileView() : renderDesktopView()
      )}
    </div>
  );
};

export default Bookings;