import axios from 'axios';

// API base URL - in a real scenario, this would point to your backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enquiry interface matching MongoDB document structure
export interface MongoEnquiry {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  eventDate?: string;
  location?: string;
  guests?: string;
  budget?: string;
  specialRequests?: string;
  message?: string;
  isResolved?: boolean;
  status?: 'Pending' | 'Reviewed' | 'Closed';
  createdAt?: string;
  updatedAt?: string;
}

// API service for enquiries
export const enquiriesApiService = {
  // Helper method to map resolution status to display status
  mapEnquiryStatus(isResolved: boolean | undefined, status?: string): 'Pending' | 'Reviewed' | 'Closed' {
    if (status) {
      const statusMap: {[key: string]: 'Pending' | 'Reviewed' | 'Closed'} = {
        'pending': 'Pending',
        'reviewed': 'Reviewed', 
        'closed': 'Closed'
      };
      return statusMap[status.toLowerCase()] || 'Pending';
    }
    
    // Fallback to isResolved boolean
    if (isResolved === true) return 'Closed';
    if (isResolved === false) return 'Pending';
    return 'Pending';
  },

  // Helper method to format date
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  },

  // Get all enquiries
  async getAllEnquiries(): Promise<MongoEnquiry[]> {
    try {
      console.log('Fetching enquiries from API...');
      
      // Try to fetch from backend API first
      try {
        const response = await apiClient.get('/enquiries');
        console.log(`Successfully fetched ${response.data.length} enquiries from API`);
        
        // Transform MongoDB documents to our interface
        const transformedEnquiries: MongoEnquiry[] = response.data.map((enquiry: any) => {
          // Prioritize 'status' field over 'isResolved' for current status
          const transformedStatus = this.mapEnquiryStatus(enquiry.isResolved, enquiry.status);
          
          return {
            _id: enquiry._id?.toString() || enquiry.id?.toString(),
            name: enquiry.name || 'Unknown Name',
            email: enquiry.email || 'No Email',
            phone: enquiry.phone || 'No Phone',
            eventDate: enquiry.eventDate || enquiry.event_date || enquiry.date,
            location: enquiry.location || 'No Location',
            guests: enquiry.guests || enquiry.numberOfGuests || enquiry.expectedGuests,
            budget: enquiry.budget || 'Not specified',
            specialRequests: enquiry.specialRequests || enquiry.special_requests || enquiry.message || '',
            message: enquiry.message || enquiry.specialRequests || enquiry.notes || '',
            isResolved: enquiry.isResolved || false,
            status: transformedStatus,
            createdAt: enquiry.createdAt || enquiry.created_at || enquiry.createdDate,
            updatedAt: enquiry.updatedAt || enquiry.updated_at || enquiry.updatedDate
          };
        });
        
        return transformedEnquiries;
        
      } catch (apiError: any) {
        console.warn('API call failed, using simulated data:', apiError.message);
        
        // Show a user-friendly message about API connection
        if (apiError.code === 'ECONNREFUSED' || apiError.code === 'ERR_NETWORK') {
          console.log('Backend server not running. To connect to MongoDB:');
          console.log('1. Install backend dependencies: npm install express cors mongodb dotenv');
          console.log('2. Start the backend server: node server.js');
          console.log('3. Refresh this page');
        }
        
        // Final fallback to simulated data
        return this.getSimulatedEnquiries();
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      // Return simulated data as final fallback
      return this.getSimulatedEnquiries();
    }
  },

  // Get simulated enquiries (fallback data)
  getSimulatedEnquiries(): MongoEnquiry[] {
    return [
      {
        _id: '507f1f77bcf86cd799439021',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        eventDate: '2025-10-15',
        location: 'New York',
        guests: '10-15',
        budget: '$500-800',
        specialRequests: 'Interested in the Gold Package for my son\'s 10th birthday.',
        message: 'Interested in the Gold Package for my son\'s 10th birthday.',
        isResolved: false,
        status: 'Pending',
        createdAt: '2025-01-10T10:00:00Z',
        updatedAt: '2025-01-10T10:00:00Z'
      },
      {
        _id: '507f1f77bcf86cd799439022',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '098-765-4321',
        eventDate: '2025-11-02',
        location: 'Los Angeles',
        guests: '20-25',
        budget: '$800-1200',
        specialRequests: 'Do you have any availability in November? Looking for a package for 20 kids.',
        message: 'Do you have any availability in November? Looking for a package for 20 kids.',
        isResolved: false,
        status: 'Reviewed',
        createdAt: '2025-01-08T09:15:00Z',
        updatedAt: '2025-01-10T11:20:00Z'
      },
      {
        _id: '507f1f77bcf86cd799439023',
        name: 'Peter Jones',
        email: 'peter.jones@example.com',
        phone: '456-123-7890',
        eventDate: '2025-09-28',
        location: 'Chicago',
        guests: '15-20',
        budget: '$600-900',
        specialRequests: 'I would like to know more about the custom themes.',
        message: 'I would like to know more about the custom themes.',
        isResolved: true,
        status: 'Closed',
        createdAt: '2025-01-05T14:30:00Z',
        updatedAt: '2025-01-06T16:45:00Z'
      }
    ];
  },

  // Get enquiry by ID
  async getEnquiryById(id: string): Promise<MongoEnquiry | null> {
    try {
      const response = await apiClient.get(`/enquiries/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enquiry by ID:', error);
      
      // Fallback to finding in simulated data
      const allEnquiries = await this.getAllEnquiries();
      return allEnquiries.find(enquiry => enquiry._id === id) || null;
    }
  },

  // Create new enquiry
  async createEnquiry(enquiry: Omit<MongoEnquiry, '_id'>): Promise<MongoEnquiry> {
    try {
      const response = await apiClient.post('/enquiries', enquiry);
      return response.data;
    } catch (error) {
      console.error('Error creating enquiry:', error);
      
      // Simulate creating an enquiry
      const newEnquiry: MongoEnquiry = {
        ...enquiry,
        _id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return newEnquiry;
    }
  },

  // Update enquiry
  async updateEnquiry(id: string, updateData: Partial<MongoEnquiry>): Promise<MongoEnquiry> {
    try {
      console.log('🔄 Starting enquiry update process...');
      console.log('📝 Original update data:', updateData);

      // Clean and prepare the update data for MongoDB
      const cleanUpdateData: any = {};
      
      // Copy all valid fields, excluding undefined values
      Object.keys(updateData).forEach(key => {
        const value = (updateData as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          cleanUpdateData[key] = value;
        }
      });

      // Always include the updatedAt timestamp
      cleanUpdateData.updatedAt = new Date().toISOString();
      
      console.log('🧹 Cleaned update data for MongoDB:', cleanUpdateData);

      const response = await apiClient.put(`/enquiries/${id}`, cleanUpdateData);
      console.log('✅ MongoDB update response:', response.data);
      
      // Transform the response back to frontend format if needed
      const transformedEnquiry: MongoEnquiry = {
        _id: response.data._id?.toString() || id,
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        eventDate: response.data.eventDate || response.data.event_date || response.data.date,
        location: response.data.location || '',
        guests: response.data.guests || response.data.numberOfGuests || response.data.expectedGuests,
        budget: response.data.budget || '',
        specialRequests: response.data.specialRequests || response.data.special_requests || response.data.message || '',
        message: response.data.message || response.data.specialRequests || response.data.notes || '',
        isResolved: response.data.isResolved || false,
        status: this.mapEnquiryStatus(response.data.isResolved, response.data.status),
        createdAt: response.data.createdAt || response.data.created_at || response.data.createdDate,
        updatedAt: response.data.updatedAt || response.data.updated_at || response.data.updatedDate
      };
      
      console.log('🔄 Transformed enquiry for frontend:', transformedEnquiry);
      return transformedEnquiry;
      
    } catch (error: any) {
      console.error('❌ Failed to update enquiry:', error);
      
      if (error.response) {
        console.error('❌ Response error:', error.response.status, error.response.data);
        throw new Error(`Failed to update enquiry in database (HTTP ${error.response.status}): ${error.message}`);
      } else if (error.request) {
        console.error('❌ Network error:', error.request);
        throw new Error('Cannot save to database: Backend server is not running');
      } else {
        console.error('❌ Setup error:', error.message);
        throw new Error(`Failed to update enquiry: ${error.message}`);
      }
    }
  },

  // Delete enquiry
  async deleteEnquiry(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/enquiries/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      // Simulate deletion
      return true;
    }
  }
};

export default enquiriesApiService;