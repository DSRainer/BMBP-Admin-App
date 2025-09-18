import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enquiriesApiService, MongoEnquiry } from '../services/enquiriesService';
import { bookingApiService, MongoBooking } from '../services/bookingService';

const Dashboard: React.FC = () => {
  const [enquiries, setEnquiries] = useState<MongoEnquiry[]>([]);
  const [bookings, setBookings] = useState<MongoBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('📋 === Dashboard - Fetching fresh data ===');
        const [enquiriesData, bookingsData] = await Promise.all([
          enquiriesApiService.getAllEnquiries(),
          bookingApiService.getAllBookings()
        ]);
        console.log('📋 Dashboard fetched:', {
          enquiries: enquiriesData.length,
          bookings: bookingsData.length,
          bookingStatuses: bookingsData.map(b => ({ id: b._id, status: b.status }))
        });
        setEnquiries(enquiriesData);
        setBookings(bookingsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Also fetch fresh data when the page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('📋 Dashboard became visible - fetching fresh data');
        fetchData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Keep dependency array empty for now

  // Manual refresh function
  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    try {
      setLoading(true);
      const [enquiriesData, bookingsData] = await Promise.all([
        enquiriesApiService.getAllEnquiries(),
        bookingApiService.getAllBookings()
      ]);
      console.log('🔄 Manual refresh - fresh data loaded:', {
        enquiries: enquiriesData.length,
        bookings: bookingsData.length,
        confirmedBookings: bookingsData.filter(b => b.status === 'Confirmed').length,
        pendingBookings: bookingsData.filter(b => b.status === 'Pending').length
      });
      setEnquiries(enquiriesData);
      setBookings(bookingsData);
      setError(null);
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      setError('Failed to refresh dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // Compute derived data
  const recentLeads = enquiries.slice(0, 5);
  
  // Filter for pending events: ALL pending bookings (regardless of date)
  const upcomingEvents = bookings
    .filter(b => b.status === 'Pending') // Only show pending bookings
    .sort((a, b) => {
      // Sort by date (most recent first, handle missing dates)
      const dateA = a.eventDate ? new Date(a.eventDate).getTime() : 0;
      const dateB = b.eventDate ? new Date(b.eventDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5); // Show only top 5 pending events
  
  const convertedLeads = enquiries.filter(e => e.status === 'Reviewed' || e.status === 'Closed').length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  
  // Calculate pending events count for the card (all pending bookings)
  const upcomingCount = bookings.filter(b => b.status === 'Pending').length;

  // Debug logging
  console.log('Dashboard Debug - Total bookings:', bookings.length);
  console.log('Dashboard Debug - All booking details:', bookings.map(b => ({
    name: b.customerName,
    status: b.status,
    eventDate: b.eventDate,
    eventDateParsed: b.eventDate ? new Date(b.eventDate) : null
  })));
  console.log('Dashboard Debug - Confirmed bookings:', bookings.filter(b => b.status === 'Confirmed').length);
  console.log('Dashboard Debug - Pending bookings:', bookings.filter(b => b.status === 'Pending').length);
  console.log('Dashboard Debug - Cancelled bookings:', bookings.filter(b => b.status === 'Cancelled').length);
  console.log('Dashboard Debug - Pending events (all pending, no date filter):', upcomingEvents.length);
  console.log('Dashboard Debug - Final pending count for card:', upcomingCount);

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-warning" role="alert">
          <h5 className="alert-heading">Data Loading Issue</h5>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <button className="btn btn-outline-warning" onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">Home</li>
            <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
          </ol>
        </nav>
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-sm btn-outline-primary" 
            onClick={handleRefresh}
            disabled={loading}
          >
            🔄 {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <small className="text-muted">Birthday chaos? Not on our watch.</small>
          <div className="dropdown">
            <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Theme: Default
            </button>
            <ul className="dropdown-menu">
              <li><button className="dropdown-item">Default</button></li>
              <li><button className="dropdown-item">Dark</button></li>
            </ul>
          </div>
        </div>
      </div>

      <h4 className="mb-3">Dashboard Overview</h4>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted">Total Leads</span>
                <span className="text-muted">👥</span>
              </div>
              <div className="display-6">{enquiries.length}</div>
              <small className="text-muted">{convertedLeads} converted</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted">Confirmed Bookings</span>
                <span className="text-muted">📅</span>
              </div>
              <div className="display-6">{bookings.filter(b => b.status === 'Confirmed').length}</div>
              <small className="text-muted">{pendingBookings} pending</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted">Total Conversations</span>
                <span className="text-muted">💬</span>
              </div>
              <div className="display-6">0</div>
              <small className="text-muted">Across all leads</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted">Pending Events</span>
                <span className="text-muted">💲</span>
              </div>
              <div className="display-6">{upcomingCount}</div>
              <small className="text-muted">All pending bookings</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Recent Leads</h5>
              <div className="d-flex flex-column gap-3">
                {recentLeads.map(lead => (
                  <div className="d-flex justify-content-between" key={lead._id || lead.id}>
                    <div>{lead.name}</div>
                    <div className="text-end">
                      <div className={`text-${lead.status === 'Pending' ? 'primary' : lead.status === 'Reviewed' ? 'success' : 'muted'} small`}>{lead.status}</div>
                      <div className="text-muted small">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <Link to="/enquiries" className="btn btn-outline-secondary w-100">
                  View All Leads ↗
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Pending Events</h5>
              <div className="d-flex flex-column gap-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(event => (
                    <div className="d-flex justify-content-between align-items-start" key={event._id || event.id}>
                      <div>
                        <div className="fw-semibold">{event.package}</div>
                        <div className="text-muted small">{event.customerName}</div>
                      </div>
                      <div className="text-end">
                        <div className="small">{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'N/A'}</div>
                        <div className={`badge text-bg-warning`}>{event.status}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-3">
                    <div className="mb-2">📅</div>
                    {bookings.filter(b => b.status === 'Pending').length > 0 ? (
                      <div>
                        <p className="mb-0">No pending events</p>
                        <small>All pending events have been processed</small>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-0">No pending events found</p>
                        <small>Events will appear here when bookings are pending approval</small>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-3">
                <Link to="/bookings" className="btn btn-outline-secondary w-100">
                  View All Bookings →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



