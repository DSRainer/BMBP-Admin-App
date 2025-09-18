import React, { useState, useEffect } from 'react';
import { bookingApiService, MongoBooking } from '../services/bookingService';
import EditBookingModal from '../components/EditBookingModal';
import Icon from '../components/Icon';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiChevronDown, FiChevronRight } from 'react-icons/fi';

const Bookings = () => {
  const [bookings, setBookings] = useState<MongoBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBookings, setExpandedBookings] = useState<Set<string>>(new Set());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState<MongoBooking | null>(null);

  // Fetch bookings from MongoDB
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        console.log('=== Bookings Component - Fetching bookings ===');
        const fetchedBookings = await bookingApiService.getAllBookings();
        console.log('Fetched bookings count:', fetchedBookings.length);
        console.log('Sample booking statuses:', fetchedBookings.slice(0, 3).map(b => ({ id: b._id, status: b.status })));
        setBookings(fetchedBookings);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Toggle expanded view for booking details
  const toggleBookingExpansion = (bookingId: string) => {
    const newExpanded = new Set(expandedBookings);
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId);
    } else {
      newExpanded.add(bookingId);
    }
    setExpandedBookings(newExpanded);
  };

  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    return amount ? `$${amount.toFixed(2)}` : 'N/A';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'danger';
      case 'Completed': return 'info';
      default: return 'secondary';
    }
  };

  // Get payment status badge class
  const getPaymentStatusBadgeClass = (status: string | undefined) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Partial': return 'warning';
      case 'Pending': return 'secondary';
      case 'Refunded': return 'info';
      default: return 'secondary';
    }
  };

  // Handle edit booking
  const handleEditBooking = (booking: MongoBooking) => {
    console.log('=== Bookings Component - Opening edit modal ===');
    console.log('Booking to edit:', booking);
    console.log('Booking eventDate:', booking.eventDate);
    console.log('Booking eventTime:', booking.eventTime);
    console.log('eventDate type:', typeof booking.eventDate);
    console.log('eventTime type:', typeof booking.eventTime);
    
    setBookingToEdit(booking);
    setEditModalOpen(true);
  };

  // Handle save booking
  const handleSaveBooking = async (updatedBooking: MongoBooking) => {
    try {
      console.log('=== Bookings Component - Saving booking ===');
      const bookingIdToUpdate = updatedBooking._id || updatedBooking.id;
      console.log('Booking ID to update:', bookingIdToUpdate);
      
      if (!bookingIdToUpdate) {
        throw new Error('No valid booking ID found for update');
      }
      
      // Find the original booking to preserve all complex nested data
      const originalBooking = bookings.find(b => (b._id || b.id) === bookingIdToUpdate);
      if (!originalBooking) {
        throw new Error('Original booking not found in current state');
      }
      
      // Create clean update data that includes all original complex data
      // Only update the fields that were actually changed in the modal
      const updateData = {
        // Basic fields that can be updated via modal
        customerName: updatedBooking.customerName,
        customerEmail: updatedBooking.customerEmail,
        customerPhone: updatedBooking.customerPhone,
        eventDate: updatedBooking.eventDate,
        eventTime: updatedBooking.eventTime,
        eventLocation: updatedBooking.eventLocation,
        numberOfGuests: updatedBooking.numberOfGuests,
        status: updatedBooking.status,
        paymentStatus: updatedBooking.paymentStatus,
        notes: updatedBooking.notes,
        
        // Preserve all complex nested data from original booking (clean versions)
        package: originalBooking.package,
        packageDetails: originalBooking.packageDetails ? {
          name: originalBooking.packageDetails.name,
          price: originalBooking.packageDetails.price,
          duration: originalBooking.packageDetails.duration,
          includedServices: originalBooking.packageDetails.includedServices || []
        } : undefined,
        addons: originalBooking.addons ? originalBooking.addons.map(addon => ({
          name: addon.name,
          price: addon.price,
          quantity: addon.quantity
        })) : undefined,
        activities: originalBooking.activities ? originalBooking.activities.map(activity => ({
          name: activity.name,
          duration: activity.duration,
          ageGroup: activity.ageGroup
        })) : undefined,
        themes: originalBooking.themes ? originalBooking.themes.map(theme => ({
          name: theme.name,
          decorations: theme.decorations || [],
          colors: theme.colors || []
        })) : undefined,
        totalAmount: originalBooking.totalAmount,
        specialRequests: originalBooking.specialRequests || [],
        createdAt: originalBooking.createdAt
      };
      
      // Remove undefined values to avoid sending null/undefined to MongoDB
      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      ) as Partial<MongoBooking>;
      
      console.log('Sending clean update data (preserving nested data):', cleanUpdateData);
      console.log('Data integrity check before sending:', {
        hasPackageDetails: !!cleanUpdateData.packageDetails,
        hasThemes: Array.isArray(cleanUpdateData.themes) && cleanUpdateData.themes.length > 0,
        hasAddons: Array.isArray(cleanUpdateData.addons) && cleanUpdateData.addons.length > 0,
        totalAmount: cleanUpdateData.totalAmount,
        status: cleanUpdateData.status
      });
      
      // Update the booking via API
      const savedBooking = await bookingApiService.updateBooking(
        bookingIdToUpdate, 
        cleanUpdateData
      );
      
      console.log('API returned updated booking:', savedBooking);
      console.log('Saved booking complex data check:', {
        hasPackageDetails: !!savedBooking.packageDetails,
        hasThemes: !!savedBooking.themes?.length,
        hasAddons: !!savedBooking.addons?.length,
        totalAmount: savedBooking.totalAmount,
        status: savedBooking.status
      });
      
      // Update ONLY the specific booking in local state with the complete data from backend
      setBookings(prevBookings => {
        console.log('=== State Update - Before ===');
        console.log('Total bookings:', prevBookings.length);
        console.log('Looking for booking with ID:', bookingIdToUpdate);
        
        const updatedBookings = prevBookings.map((booking, index) => {
          // Use strict ID matching - only match the exact ID we're updating
          const currentBookingId = booking._id || booking.id;
          const isMatch = currentBookingId === bookingIdToUpdate;
          
          console.log(`Booking ${index + 1}: ID=${currentBookingId}, isMatch=${isMatch}`);
          
          if (isMatch) {
            console.log('✅ UPDATING booking with complete data:', currentBookingId);
            // Return the complete booking from backend (which should now have all data)
            return {
              ...savedBooking,
              _id: currentBookingId, // Preserve the original ID format
              id: booking.id // Preserve secondary ID if it exists
            };
          }
          return booking;
        });
        
        console.log('=== State Update - After ===');
        console.log('Updated bookings count:', updatedBookings.length);
        
        // Verify the updated booking has complete data
        const updatedBooking = updatedBookings.find(b => (b._id || b.id) === bookingIdToUpdate);
        if (updatedBooking) {
          console.log('✅ Updated booking data integrity check:', {
            hasPackageDetails: !!updatedBooking.packageDetails,
            hasThemes: !!updatedBooking.themes?.length,
            hasAddons: !!updatedBooking.addons?.length,
            totalAmount: updatedBooking.totalAmount,
            status: updatedBooking.status
          });
        }
        
        return updatedBookings;
      });
      
      console.log('✅ Booking updated successfully with all data preserved!');
      console.log('ℹ️ IMPORTANT: Changes are saved to MongoDB and should persist on page reload.');
      alert('Booking updated successfully and saved to MongoDB!\n\nThe changes should now be visible in the Dashboard and persist after page reloads.');
    } catch (error: any) {
      console.error('❌ Error saving booking:', error);
      
      // Provide specific error messages to the user
      if (error.message.includes('Backend server may not be running')) {
        alert('❌ Cannot save to database: Backend server is not running.\n\nTo fix this:\n1. Open a new terminal\n2. Run: node server.js\n3. Try updating the booking again');
      } else if (error.message.includes('HTTP 500')) {
        alert(`❌ Server Error: There was a problem updating the booking in the database.

Check the server console for detailed error information.

Error: ${error.message}`);
      } else {
        alert(`❌ Failed to save booking: ${error.message}`);
      }
      
      throw error; // Let the modal handle the error display
    }
  };

  // Handle close edit modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setBookingToEdit(null);
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
        <h1>Bookings</h1>
        <button className="btn btn-primary">
          <Icon component={FiPlus} className="me-2" />
          Add Booking
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Event Date & Time</th>
                  <th>Location</th>
                  <th>Package</th>
                  <th>Guests</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: MongoBooking) => (
                  <React.Fragment key={booking._id}>
                    <tr>
                      <td>
                        <button
                          className="btn btn-sm btn-link p-0"
                          onClick={() => toggleBookingExpansion(booking._id || '')}
                          aria-label="Toggle details"
                        >
                          <Icon 
                            component={expandedBookings.has(booking._id || '') ? FiChevronDown : FiChevronRight} 
                          />
                        </button>
                      </td>
                      <td>
                        <div>
                          <strong>{booking.customerName}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          {booking.customerEmail && <div>{booking.customerEmail}</div>}
                          {booking.customerPhone && <div>{booking.customerPhone}</div>}
                        </div>
                      </td>
                      <td>
                        <div>{formatDate(booking.eventDate)}</div>
                        {booking.eventTime && <div className="small text-muted">{booking.eventTime}</div>}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{booking.eventLocation || 'TBD'}</span>
                      </td>
                      <td>
                        <div>{booking.package}</div>
                        {booking.packageDetails && (
                          <div className="small text-muted">
                            {formatCurrency(booking.packageDetails.price)} • {booking.packageDetails.duration}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-info">{booking.numberOfGuests || 'N/A'}</span>
                      </td>
                      <td>
                        <strong>{formatCurrency(booking.totalAmount)}</strong>
                      </td>
                      <td>
                        <span className={`badge bg-${getPaymentStatusBadgeClass(booking.paymentStatus)}`}>
                          {booking.paymentStatus || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${getStatusBadgeClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-info">
                            <Icon component={FiEye} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditBooking(booking)}
                          >
                            <Icon component={FiEdit} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <Icon component={FiTrash2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {expandedBookings.has(booking._id || '') && (
                      <tr>
                        <td colSpan={11}>
                          <div className="bg-light p-3 rounded">
                            <div className="row">
                              
                              {/* Package Details */}
                              {booking.packageDetails && (
                                <div className="col-md-4 mb-3">
                                  <h6 className="text-primary">Package Details</h6>
                                  <div><strong>Name:</strong> {booking.packageDetails.name}</div>
                                  <div><strong>Price:</strong> {formatCurrency(booking.packageDetails.price)}</div>
                                  <div><strong>Duration:</strong> {booking.packageDetails.duration}</div>
                                  {booking.packageDetails.includedServices && booking.packageDetails.includedServices.length > 0 && (
                                    <div>
                                      <strong>Included Services:</strong>
                                      <ul className="list-unstyled ms-2">
                                        {booking.packageDetails.includedServices.map((service, index) => (
                                          <li key={index} className="small">• {service}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Add-ons */}
                              {booking.addons && booking.addons.length > 0 && (
                                <div className="col-md-4 mb-3">
                                  <h6 className="text-primary">Add-ons</h6>
                                  <div className="table-responsive">
                                    <table className="table table-sm">
                                      <thead>
                                        <tr>
                                          <th>Name</th>
                                          <th>Qty</th>
                                          <th>Price</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {booking.addons.map((addon, index) => (
                                          <tr key={index}>
                                            <td>{addon.name}</td>
                                            <td>{addon.quantity}</td>
                                            <td>{formatCurrency(addon.price)}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                              
                              {/* Activities */}
                              {booking.activities && booking.activities.length > 0 && (
                                <div className="col-md-4 mb-3">
                                  <h6 className="text-primary">Activities</h6>
                                  {booking.activities.map((activity, index) => (
                                    <div key={index} className="border rounded p-2 mb-2 bg-white">
                                      <div><strong>{activity.name}</strong></div>
                                      <div className="small text-muted">
                                        Duration: {activity.duration} | Age: {activity.ageGroup}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Themes */}
                              {booking.themes && booking.themes.length > 0 && (
                                <div className="col-md-6 mb-3">
                                  <h6 className="text-primary">Themes</h6>
                                  {booking.themes.map((theme, index) => (
                                    <div key={index} className="border rounded p-2 mb-2 bg-white">
                                      <div><strong>{theme.name}</strong></div>
                                      {theme.colors && theme.colors.length > 0 && (
                                        <div className="small">
                                          <strong>Colors:</strong> {theme.colors.join(', ')}
                                        </div>
                                      )}
                                      {theme.decorations && theme.decorations.length > 0 && (
                                        <div className="small">
                                          <strong>Decorations:</strong>
                                          <ul className="list-unstyled ms-2">
                                            {theme.decorations.map((decoration, idx) => (
                                              <li key={idx}>• {decoration}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Special Requests & Notes */}
                              <div className="col-md-6 mb-3">
                                {booking.specialRequests && booking.specialRequests.length > 0 && (
                                  <div className="mb-3">
                                    <h6 className="text-primary">Special Requests</h6>
                                    <ul className="list-unstyled">
                                      {booking.specialRequests.map((request, index) => (
                                        <li key={index} className="small">• {request}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {booking.notes && (
                                  <div>
                                    <h6 className="text-primary">Notes</h6>
                                    <p className="small mb-0">{booking.notes}</p>
                                  </div>
                                )}
                                
                                {/* Timestamps */}
                                <div className="mt-3 small text-muted">
                                  {booking.createdAt && <div>Created: {new Date(booking.createdAt).toLocaleString()}</div>}
                                  {booking.updatedAt && <div>Updated: {new Date(booking.updatedAt).toLocaleString()}</div>}
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
          
          {bookings.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No bookings found.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Booking Modal */}
      <EditBookingModal
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveBooking}
        bookingToEdit={bookingToEdit}
      />
    </div>
  );
};

export default Bookings;