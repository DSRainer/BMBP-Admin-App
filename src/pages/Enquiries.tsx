import React, { useState, useEffect } from 'react';
import { enquiriesApiService, MongoEnquiry } from '../services/enquiriesService';
import EditEnquiryModal from '../components/EditEnquiryModal';
import Icon from '../components/Icon';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiChevronDown, FiChevronRight } from 'react-icons/fi';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState<MongoEnquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEnquiries, setExpandedEnquiries] = useState<Set<string>>(new Set());
  
  // Edit modal state
  const [selectedEnquiry, setSelectedEnquiry] = useState<MongoEnquiry | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  // Fetch enquiries from MongoDB
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const fetchedEnquiries = await enquiriesApiService.getAllEnquiries();
        setEnquiries(fetchedEnquiries);
      } catch (err) {
        setError('Failed to fetch enquiries. Please try again later.');
        console.error('Error fetching enquiries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  // Toggle expanded view for enquiry details
  const toggleEnquiryExpansion = (enquiryId: string) => {
    const newExpanded = new Set(expandedEnquiries);
    if (newExpanded.has(enquiryId)) {
      newExpanded.delete(enquiryId);
    } else {
      newExpanded.add(enquiryId);
    }
    setExpandedEnquiries(newExpanded);
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string | undefined) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Reviewed': return 'info';
      case 'Closed': return 'success';
      default: return 'secondary';
    }
  };

  // Handle edit enquiry
  const handleEditEnquiry = (enquiry: MongoEnquiry) => {
    console.log('📝 Opening edit modal for enquiry:', enquiry);
    setSelectedEnquiry(enquiry);
    setShowEditModal(true);
  };

  // Handle enquiry update
  const handleEnquiryUpdate = async (updatedEnquiry: MongoEnquiry) => {
    console.log('💾 Handling enquiry update:', updatedEnquiry);
    
    try {
      // Update local state immediately with clean data
      const cleanUpdatedData = {
        ...updatedEnquiry,
        // Ensure required fields are properly set
        name: updatedEnquiry.name || 'Unknown Name',
        email: updatedEnquiry.email || '',
        phone: updatedEnquiry.phone || '',
        budget: updatedEnquiry.budget || 'Not specified',
        status: updatedEnquiry.status || 'Pending'
      };
      
      console.log('🔄 Updating local state with:', cleanUpdatedData);
      
      setEnquiries(prevEnquiries => {
        const updatedEnquiries = prevEnquiries.map(enquiry => 
          enquiry._id === updatedEnquiry._id ? cleanUpdatedData : enquiry
        );
        console.log('📋 Updated enquiries list:', updatedEnquiries);
        return updatedEnquiries;
      });
      
      // Close modal and clear selection
      setShowEditModal(false);
      setSelectedEnquiry(null);
      
      console.log('✅ Enquiry updated successfully in state');
      
    } catch (error) {
      console.error('❌ Error handling enquiry update:', error);
      alert('Failed to update enquiry in local state');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Enquiries</h1>
        <button className="btn btn-primary">
          <Icon component={FiPlus} className="me-2" />
          Add Enquiry
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Event Details</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry: MongoEnquiry) => (
                  <React.Fragment key={enquiry._id}>
                    <tr>
                      <td>
                        <button
                          className="btn btn-sm btn-link p-0"
                          onClick={() => toggleEnquiryExpansion(enquiry._id || '')}
                          aria-label="Toggle details"
                        >
                          <Icon 
                            component={expandedEnquiries.has(enquiry._id || '') ? FiChevronDown : FiChevronRight} 
                          />
                        </button>
                      </td>
                      <td>
                        <div>
                          <strong>{enquiry.name}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          {enquiry.email && <div>{enquiry.email}</div>}
                          {enquiry.phone && <div>{enquiry.phone}</div>}
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          {enquiry.eventDate && <div><strong>Date:</strong> {formatDate(enquiry.eventDate)}</div>}
                          {enquiry.location && <div><strong>Location:</strong> {enquiry.location}</div>}
                          {enquiry.guests && <div><strong>Guests:</strong> {enquiry.guests}</div>}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{enquiry.budget || 'Not specified'}</span>
                      </td>
                      <td>
                        <span className={`badge bg-${getStatusBadgeClass(enquiry.status)}`}>
                          {enquiry.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div>{formatDate(enquiry.createdAt)}</div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-info">
                            <Icon component={FiEye} />
                          </button>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditEnquiry(enquiry)}>
                            <Icon component={FiEdit} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <Icon component={FiTrash2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {expandedEnquiries.has(enquiry._id || '') && (
                      <tr>
                        <td colSpan={8}>
                          <div className="bg-light p-3 rounded">
                            <div className="row">
                              
                              {/* Contact Information */}
                              <div className="col-md-4 mb-3">
                                <h6 className="text-primary">Contact Information</h6>
                                <div><strong>Name:</strong> {enquiry.name}</div>
                                <div><strong>Email:</strong> {enquiry.email}</div>
                                <div><strong>Phone:</strong> {enquiry.phone}</div>
                              </div>
                              
                              {/* Event Details */}
                              <div className="col-md-4 mb-3">
                                <h6 className="text-primary">Event Details</h6>
                                {enquiry.eventDate && <div><strong>Event Date:</strong> {formatDate(enquiry.eventDate)}</div>}
                                {enquiry.location && <div><strong>Location:</strong> {enquiry.location}</div>}
                                {enquiry.guests && <div><strong>Expected Guests:</strong> {enquiry.guests}</div>}
                                {enquiry.budget && <div><strong>Budget:</strong> {enquiry.budget}</div>}
                              </div>
                              
                              {/* Special Requests & Messages */}
                              <div className="col-md-4 mb-3">
                                <h6 className="text-primary">Requirements</h6>
                                {enquiry.specialRequests && (
                                  <div className="mb-2">
                                    <strong>Special Requests:</strong>
                                    <p className="small mb-0 mt-1">{enquiry.specialRequests}</p>
                                  </div>
                                )}
                                
                                {enquiry.message && enquiry.message !== enquiry.specialRequests && (
                                  <div className="mb-2">
                                    <strong>Message:</strong>
                                    <p className="small mb-0 mt-1">{enquiry.message}</p>
                                  </div>
                                )}
                                
                                {/* Timestamps */}
                                <div className="mt-3 small text-muted">
                                  {enquiry.createdAt && <div>Submitted: {new Date(enquiry.createdAt).toLocaleString()}</div>}
                                  {enquiry.updatedAt && <div>Updated: {new Date(enquiry.updatedAt).toLocaleString()}</div>}
                                </div>
                              </div>
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
          
          {enquiries.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No enquiries found.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Enquiry Modal */}
      {selectedEnquiry && (
        <EditEnquiryModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEnquiry(null);
          }}
          enquiryToEdit={selectedEnquiry}
          onSave={handleEnquiryUpdate}
        />
      )}
    </div>
  );
};

export default Enquiries;