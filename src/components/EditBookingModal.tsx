import React, { useState, useEffect } from 'react';
import { MongoBooking } from '../services/bookingService';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBooking: MongoBooking) => void;
  bookingToEdit: MongoBooking | null;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  bookingToEdit 
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<'Confirmed' | 'Pending' | 'Cancelled' | 'Completed'>('Pending');
  const [paymentStatus, setPaymentStatus] = useState<'Pending' | 'Partial' | 'Paid' | 'Refunded'>('Pending');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookingToEdit) {
      console.log('=== EditBookingModal - Loading booking data ===');
      console.log('Booking ID:', bookingToEdit._id || bookingToEdit.id);
      console.log('Current status:', bookingToEdit.status);
      
      // Parse the date to ensure it's in the correct format for HTML date input (YYYY-MM-DD)
      const parsedDate = bookingToEdit.eventDate ? 
        new Date(bookingToEdit.eventDate).toISOString().split('T')[0] : '';
      
      // Parse the time to ensure it's in the correct format for HTML time input (HH:MM)
      let parsedTime = bookingToEdit.eventTime || '';
      if (parsedTime) {
        // Handle different time formats (e.g., "14:00", "2:00 PM", etc.)
        try {
          // If it's already in HH:MM format (24-hour), use as-is
          if (/^\d{1,2}:\d{2}$/.test(parsedTime)) {
            // Ensure two-digit hour format
            const [hour, minute] = parsedTime.split(':');
            parsedTime = `${hour.padStart(2, '0')}:${minute}`;
          } else {
            // Try to parse other formats
            const timeDate = new Date(`1970-01-01 ${parsedTime}`);
            if (!isNaN(timeDate.getTime())) {
              parsedTime = timeDate.toTimeString().slice(0, 5); // HH:MM format
            }
          }
        } catch (error) {
          console.warn('Could not parse time format:', parsedTime, error);
          parsedTime = bookingToEdit.eventTime || ''; // Fallback to original
        }
      }
      
      setCustomerName(bookingToEdit.customerName || '');
      setCustomerEmail(bookingToEdit.customerEmail || '');
      setCustomerPhone(bookingToEdit.customerPhone || '');
      setEventDate(parsedDate);
      setEventTime(parsedTime);
      setEventLocation(bookingToEdit.eventLocation || '');
      setNumberOfGuests(bookingToEdit.numberOfGuests);
      setStatus(bookingToEdit.status);
      setPaymentStatus(bookingToEdit.paymentStatus || 'Pending');
      setNotes(bookingToEdit.notes || '');
    }
  }, [bookingToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingToEdit) return;

    setLoading(true);
    try {
      console.log('=== EditBookingModal - Preparing update data ===');
      console.log('Original booking:', bookingToEdit);
      console.log('Form values:', {
        customerName,
        customerEmail,
        customerPhone,
        eventDate,
        eventTime,
        eventLocation,
        numberOfGuests,
        status,
        paymentStatus,
        notes
      });
      
      const updatedBooking: MongoBooking = {
        ...bookingToEdit,
        customerName,
        customerEmail: customerEmail || undefined,
        customerPhone: customerPhone || undefined,
        eventDate,
        eventTime: eventTime || undefined,
        eventLocation: eventLocation || undefined,
        numberOfGuests,
        status,
        paymentStatus,
        notes: notes || undefined,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Final update payload:', JSON.stringify(updatedBooking, null, 2));
      console.log('Booking ID being updated:', updatedBooking._id || updatedBooking.id);

      await onSave(updatedBooking);
      onClose();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen || !bookingToEdit) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Booking</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleCancel}
              disabled={loading}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                {/* Customer Information */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="customerName" className="form-label">Customer Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="customerEmail" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="customerEmail"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="customerPhone" className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="numberOfGuests" className="form-label">Number of Guests</label>
                  <input
                    type="number"
                    className="form-control"
                    id="numberOfGuests"
                    value={numberOfGuests || ''}
                    onChange={(e) => setNumberOfGuests(e.target.value ? parseInt(e.target.value) : undefined)}
                    min="1"
                    disabled={loading}
                  />
                </div>
                
                {/* Event Information */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="eventDate" className="form-label">Event Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    id="eventDate"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="eventTime" className="form-label">Event Time</label>
                  <input
                    type="time"
                    className="form-control"
                    id="eventTime"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="col-12 mb-3">
                  <label htmlFor="eventLocation" className="form-label">Event Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="eventLocation"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Enter event location"
                    disabled={loading}
                  />
                </div>
                
                {/* Status Information */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="status" className="form-label">Booking Status *</label>
                  <select
                    className="form-select"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as typeof status)}
                    required
                    disabled={loading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="paymentStatus" className="form-label">Payment Status</label>
                  <select
                    className="form-select"
                    id="paymentStatus"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as typeof paymentStatus)}
                    disabled={loading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
                
                {/* Package Information (Read-only) */}
                <div className="col-12 mb-3">
                  <label className="form-label">Package</label>
                  <div className="form-control-plaintext bg-light p-2 rounded">
                    <strong>{bookingToEdit.package}</strong>
                    {bookingToEdit.totalAmount && (
                      <span className="text-muted ms-2">- ${bookingToEdit.totalAmount.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                
                {/* Notes */}
                <div className="col-12 mb-3">
                  <label htmlFor="notes" className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes..."
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
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;