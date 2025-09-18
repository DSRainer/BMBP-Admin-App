import React, { useState, useEffect } from 'react';
import { MongoEnquiry, enquiriesApiService } from '../services/enquiriesService';

interface EditEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEnquiry: MongoEnquiry) => void;
  enquiryToEdit: MongoEnquiry | null;
}

const EditEnquiryModal: React.FC<EditEnquiryModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  enquiryToEdit 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState<'Pending' | 'Reviewed' | 'Closed'>('Pending');
  const [specialRequests, setSpecialRequests] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (enquiryToEdit) {
      console.log('=== EditEnquiryModal - Loading enquiry data ===');
      console.log('Enquiry ID:', enquiryToEdit._id || enquiryToEdit.id);
      console.log('Current status:', enquiryToEdit.status);
      
      // Parse the date to ensure it's in the correct format for HTML date input (YYYY-MM-DD)
      const parsedDate = enquiryToEdit.eventDate ? 
        new Date(enquiryToEdit.eventDate).toISOString().split('T')[0] : '';
      
      setName(enquiryToEdit.name || '');
      setEmail(enquiryToEdit.email || '');
      setPhone(enquiryToEdit.phone || '');
      setEventDate(parsedDate);
      setLocation(enquiryToEdit.location || '');
      setGuests(enquiryToEdit.guests || '');
      setBudget(enquiryToEdit.budget || '');
      setStatus(enquiryToEdit.status || 'Pending');
      setSpecialRequests(enquiryToEdit.specialRequests || '');
      setMessage(enquiryToEdit.message || '');
    }
  }, [enquiryToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryToEdit) return;

    setLoading(true);
    try {
      console.log('=== EditEnquiryModal - Preparing update data ===');
      console.log('Original enquiry:', enquiryToEdit);
      console.log('Form values:', {
        name,
        email,
        phone,
        eventDate,
        location,
        guests,
        budget,
        status,
        specialRequests,
        message
      });
      
      const updatedEnquiry: MongoEnquiry = {
        ...enquiryToEdit,
        name,
        email: email || '',
        phone: phone || '',
        eventDate,
        location: location || undefined,
        guests: guests || undefined,
        budget: budget || undefined,
        status,
        specialRequests: specialRequests || undefined,
        message: message || undefined,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Final update payload:', JSON.stringify(updatedEnquiry, null, 2));
      console.log('Enquiry ID being updated:', updatedEnquiry._id || updatedEnquiry.id);

      // Call API to update enquiry
      const updatedFromApi = await enquiriesApiService.updateEnquiry(
        updatedEnquiry._id || '',
        updatedEnquiry
      );
      
      console.log('✅ API update successful:', updatedFromApi);

      // Call parent component's save handler with the updated data
      onSave(updatedFromApi);
      
      alert('Enquiry updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating enquiry:', error);
      alert('Failed to update enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen || !enquiryToEdit) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Enquiry</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleCancel}
              disabled={loading}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                
                {/* Contact Information */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                {/* Event Information */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="eventDate" className="form-label">Event Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="eventDate"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Event location"
                    disabled={loading}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="guests" className="form-label">Expected Guests</label>
                  <input
                    type="text"
                    className="form-control"
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    placeholder="e.g., 10-15 or 20"
                    disabled={loading}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="budget" className="form-label">Budget</label>
                  <input
                    type="text"
                    className="form-control"
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g., $500-800"
                    disabled={loading}
                  />
                </div>
                
                {/* Status */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="status" className="form-label">Status *</label>
                  <select
                    className="form-select"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as typeof status)}
                    required
                    disabled={loading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                
                {/* Special Requests */}
                <div className="col-12 mb-3">
                  <label htmlFor="specialRequests" className="form-label">Special Requests</label>
                  <textarea
                    className="form-control"
                    id="specialRequests"
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special requirements or requests"
                    disabled={loading}
                  />
                </div>
                
                {/* Message */}
                <div className="col-12 mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Additional message or notes"
                    disabled={loading}
                  />
                </div>
                
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEnquiryModal;