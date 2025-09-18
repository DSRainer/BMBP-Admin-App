import axios from 'axios';

// API base URL - in a real scenario, this would point to your backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

console.log('🔧 BookingService Configuration:');
console.log('REACT_APP_API_URL from env:', process.env.REACT_APP_API_URL);
console.log('Final API_BASE_URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 Making API request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API response received:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      dataLength: Array.isArray(response.data) ? response.data.length : 'Not an array'
    });
    return response;
  },
  (error) => {
    console.error('❌ API response error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    return Promise.reject(error);
  }
);

// Booking interface matching MongoDB document structure
export interface MongoBooking {
  _id?: string;
  id?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  eventDate: string;
  eventTime?: string;
  eventLocation?: string;
  package: string;
  packageDetails?: {
    name: string;
    price: number;
    duration: string;
    includedServices: string[];
  };
  addons?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  activities?: Array<{
    name: string;
    duration: string;
    ageGroup: string;
  }>;
  themes?: Array<{
    name: string;
    decorations: string[];
    colors: string[];
  }>;
  totalAmount?: number;
  paymentStatus?: 'Pending' | 'Partial' | 'Paid' | 'Refunded';
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  numberOfGuests?: number;
  specialRequests?: string[];
}

// API service for bookings
export const bookingApiService = {
  // Helper method to transform addons
  transformAddons(addons: any[]): Array<{name: string; price: number; quantity: number}> {
    return addons.map(addon => ({
      name: addon.name || addon.title || 'Unknown Addon',
      price: addon.price || 0,
      quantity: addon.quantity || 1
    }));
  },

  // Helper method to transform activities  
  transformActivities(activities: any[]): Array<{name: string; duration: string; ageGroup: string}> {
    return activities.map(activity => ({
      name: activity.name || activity.title || 'Unknown Activity',
      duration: activity.duration || 'N/A',
      ageGroup: activity.ageGroup || activity.age_group || 'All ages'
    }));
  },

  // Helper method to transform themes
  transformThemes(themes: any[]): Array<{name: string; decorations: string[]; colors: string[]}> {
    return themes.map(theme => ({
      name: theme.title || theme.name || 'Unknown Theme',
      decorations: theme.decorations || [],
      colors: theme.colors || []
    }));
  },

  // Helper method to map booking status
  mapBookingStatus(status: string | undefined): 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed' {
    if (!status) {
      console.log('No status provided, defaulting to Pending');
      return 'Pending';
    }
    
    console.log('Mapping status:', status, 'to standardized format');
    const statusMap: {[key: string]: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed'} = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'cancelled': 'Cancelled',
      'completed': 'Completed',
      // Handle potential variations
      'confirm': 'Confirmed',
      'active': 'Confirmed',
      'booked': 'Confirmed',
      'cancel': 'Cancelled',
      'canceled': 'Cancelled',
      'complete': 'Completed',
      'finished': 'Completed',
      'done': 'Completed'
    };
    const mappedStatus = statusMap[status.toLowerCase()] || 'Pending';
    console.log('Status mapped from', status, 'to', mappedStatus);
    return mappedStatus;
  },

  // Helper method to parse guest count from string like "15-25 guests"
  parseGuestCount(guestString: string | number): number | undefined {
    if (typeof guestString === 'number') return guestString;
    if (typeof guestString === 'string') {
      // Extract first number from string like "15-25 guests"
      const match = guestString.match(/\d+/);
      return match ? parseInt(match[0]) : undefined;
    }
    return undefined;
  },
  // Get all bookings
  async getAllBookings(): Promise<MongoBooking[]> {
    try {
      console.log('Fetching bookings from MongoDB API...');
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Full API URL:', `${API_BASE_URL}/bookings`);
      
      const response = await apiClient.get('/bookings');
      console.log('API Response Status:', response.status);
      console.log('API Response Data Length:', response.data.length);
      
      if (response.data.length === 0) {
        console.warn('No bookings found in MongoDB database');
        return [];
      }
      
      // Transform MongoDB documents to our interface
      const transformedBookings: MongoBooking[] = response.data.map((booking: any, index: number) => {
        console.log(`=== TRANSFORMING BOOKING ${index + 1} ===`);
        console.log('Raw booking status fields:', {
          bookingStatus: booking.bookingStatus,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          eventDate: booking.eventDate,
          date: booking.date,
          event_date: booking.event_date
        });
        
        const transformedStatus = this.mapBookingStatus(booking.status || booking.bookingStatus || 'Pending');
        console.log('Final status for booking:', transformedStatus);
        
        return {
          _id: booking._id?.toString() || booking.id?.toString(),
          customerName: booking.fullName || booking.customerName || 'Unknown Customer',
          customerEmail: booking.email || booking.customerEmail || undefined,
          customerPhone: booking.phoneNumber || booking.customerPhone || booking.phone || undefined,
          eventDate: booking.eventDate || booking.event_date || booking.date,
          eventTime: booking.eventTime || booking.time || undefined,
          eventLocation: booking.location || booking.eventLocation || 'TBD',
          package: booking.packageTitle || booking.package || booking.packageName || 'Unknown Package',
          packageDetails: booking.packageDetails || {
            name: booking.packageTitle || booking.package || 'Unknown Package',
            price: booking.basePrice || booking.packagePrice || booking.price || 0,
            duration: booking.packageDuration || booking.duration || 'N/A',
            includedServices: booking.includedServices || []
          },
          addons: this.transformAddons(booking.selectedAddOns || booking.addons || []),
          activities: this.transformActivities(booking.selectedActivities || booking.activities || []),
          themes: this.transformThemes(booking.selectedTheme ? [booking.selectedTheme] : booking.themes || []),
          totalAmount: booking.totalPrice || booking.totalAmount || booking.total || booking.price || 0,
          paymentStatus: booking.paymentStatus || 'Pending',
          status: transformedStatus,
          numberOfGuests: this.parseGuestCount(booking.expectedGuests) || booking.numberOfGuests || booking.guests || undefined,
          specialRequests: booking.specialRequests || booking.special_requests || [],
          notes: booking.notes || booking.description || '',
          createdAt: booking.createdAt || booking.created_at || booking.createdDate,
          updatedAt: booking.updatedAt || booking.updated_at || booking.updatedDate
        };
      });
      
      console.log('Successfully transformed bookings from MongoDB:', transformedBookings.length);
      return transformedBookings;
      
    } catch (error: any) {
      console.error('=== MongoDB API CONNECTION FAILED ===');
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);
      console.error('Request URL:', error.config?.url);
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.error('❌ Backend server is not running!');
        console.error('To start the backend server:');
        console.error('1. Open a new terminal');
        console.error('2. Navigate to the project directory');
        console.error('3. Run: node server.js');
        console.error('4. The server should start on http://localhost:3001');
        console.error('5. Refresh this page after starting the server');
        
        throw new Error('Backend server is not running. Please start the server with "node server.js" and try again.');
      }
      
      console.error('Unknown API error:', error);
      throw new Error(`Failed to fetch bookings from database: ${error.message}`);
    }
  },

  // Get simulated bookings (fallback data - only used if MongoDB is empty or API fails)
  getSimulatedBookings(): MongoBooking[] {
    console.warn('⚠️  USING SIMULATED DATA - MongoDB connection failed or database is empty');
    return [
        {
          _id: '507f1f77bcf86cd799439011',
          customerName: 'Alice Johnson',
          customerEmail: 'alice.johnson@email.com',
          customerPhone: '+1-555-0123',
          eventDate: '2025-10-15',
          eventTime: '14:00',
          eventLocation: 'Party Hall A',
          package: 'Premium Package',
          packageDetails: {
            name: 'Premium Package',
            price: 500,
            duration: '4 hours',
            includedServices: ['Decorations', 'Entertainment', 'Catering', 'Photography']
          },
          addons: [
            { name: 'Extra Hour', price: 100, quantity: 1 },
            { name: 'Face Painting', price: 75, quantity: 1 }
          ],
          activities: [
            { name: 'Magic Show', duration: '45 minutes', ageGroup: '5-12' },
            { name: 'Balloon Animals', duration: '30 minutes', ageGroup: '3-10' }
          ],
          themes: [
            { 
              name: 'Superhero Theme', 
              decorations: ['Superhero banners', 'Colored balloons', 'Table covers'],
              colors: ['Red', 'Blue', 'Yellow']
            }
          ],
          totalAmount: 675,
          paymentStatus: 'Paid',
          status: 'Confirmed',
          numberOfGuests: 15,
          specialRequests: ['Gluten-free cake', 'No nuts in food'],
          notes: 'Birthday child loves Superman',
          createdAt: '2025-01-10T10:00:00Z',
          updatedAt: '2025-01-11T14:30:00Z'
        },
        {
          _id: '507f1f77bcf86cd799439012',
          customerName: 'Bob Williams',
          customerEmail: 'bob.williams@email.com',
          customerPhone: '+1-555-0124',
          eventDate: '2025-10-20',
          eventTime: '16:00',
          eventLocation: 'Garden Area',
          package: 'Standard Package',
          packageDetails: {
            name: 'Standard Package',
            price: 300,
            duration: '3 hours',
            includedServices: ['Basic Decorations', 'Entertainment', 'Light Refreshments']
          },
          addons: [
            { name: 'DJ Service', price: 150, quantity: 1 }
          ],
          activities: [
            { name: 'Games & Activities', duration: '60 minutes', ageGroup: '6-14' }
          ],
          themes: [
            { 
              name: 'Princess Theme', 
              decorations: ['Pink banners', 'Princess castle backdrop', 'Sparkly table covers'],
              colors: ['Pink', 'Purple', 'Gold']
            }
          ],
          totalAmount: 450,
          paymentStatus: 'Partial',
          status: 'Confirmed',
          numberOfGuests: 12,
          specialRequests: ['Vegetarian food only'],
          notes: 'Princess dress-up requested',
          createdAt: '2025-01-08T09:15:00Z',
          updatedAt: '2025-01-10T11:20:00Z'
        },
        {
          _id: '507f1f77bcf86cd799439013',
          customerName: 'Charlie Brown',
          customerEmail: 'charlie.brown@email.com',
          customerPhone: '+1-555-0125',
          eventDate: '2025-11-05',
          eventTime: '13:00',
          eventLocation: 'Main Hall',
          package: 'Basic Package',
          packageDetails: {
            name: 'Basic Package',
            price: 200,
            duration: '2 hours',
            includedServices: ['Simple Decorations', 'Basic Entertainment']
          },
          addons: [],
          activities: [
            { name: 'Clown Performance', duration: '30 minutes', ageGroup: '3-8' }
          ],
          themes: [
            { 
              name: 'Cartoon Theme', 
              decorations: ['Cartoon character cutouts', 'Colorful balloons'],
              colors: ['Red', 'Yellow', 'Blue', 'Green']
            }
          ],
          totalAmount: 200,
          paymentStatus: 'Pending',
          status: 'Pending',
          numberOfGuests: 8,
          specialRequests: [],
          notes: 'Simple celebration for 5-year-old',
          createdAt: '2025-01-12T15:45:00Z',
          updatedAt: '2025-01-12T15:45:00Z'
        },
        {
          _id: '507f1f77bcf86cd799439014',
          customerName: 'Diana Miller',
          customerEmail: 'diana.miller@email.com',
          customerPhone: '+1-555-0126',
          eventDate: '2025-11-12',
          eventTime: '15:30',
          eventLocation: 'VIP Room',
          package: 'Premium Package',
          packageDetails: {
            name: 'Premium Package',
            price: 500,
            duration: '4 hours',
            includedServices: ['Decorations', 'Entertainment', 'Catering', 'Photography']
          },
          addons: [
            { name: 'Video Recording', price: 200, quantity: 1 },
            { name: 'Live Music', price: 300, quantity: 1 },
            { name: 'Extra Decorations', price: 100, quantity: 1 }
          ],
          activities: [
            { name: 'Dance Performance', duration: '45 minutes', ageGroup: '8-16' },
            { name: 'Game Station', duration: '120 minutes', ageGroup: '8-16' },
            { name: 'Art & Craft Corner', duration: '60 minutes', ageGroup: '5-12' }
          ],
          themes: [
            { 
              name: 'Space Adventure', 
              decorations: ['Space backdrop', 'Planet decorations', 'LED lights', 'Galaxy tablecloths'],
              colors: ['Dark Blue', 'Purple', 'Silver', 'Neon Green']
            }
          ],
          totalAmount: 1100,
          paymentStatus: 'Paid',
          status: 'Confirmed',
          numberOfGuests: 25,
          specialRequests: ['Lactose-free options', 'Wheelchair accessible setup', 'Photo booth'],
          notes: 'Sweet 16 celebration - space theme specifically requested',
          createdAt: '2025-01-05T12:30:00Z',
          updatedAt: '2025-01-09T16:45:00Z'
        },
        {
          _id: '507f1f77bcf86cd799439015',
          customerName: 'Ethan Davis',
          customerEmail: 'ethan.davis@email.com',
          customerPhone: '+1-555-0127',
          eventDate: '2025-12-01',
          eventTime: '17:00',
          eventLocation: 'Outdoor Pavilion',
          package: 'Standard Package',
          packageDetails: {
            name: 'Standard Package',
            price: 300,
            duration: '3 hours',
            includedServices: ['Basic Decorations', 'Entertainment', 'Light Refreshments']
          },
          addons: [
            { name: 'Weather Protection Tent', price: 150, quantity: 1 }
          ],
          activities: [
            { name: 'Outdoor Games', duration: '90 minutes', ageGroup: '10-16' }
          ],
          themes: [
            { 
              name: 'Sports Theme', 
              decorations: ['Team banners', 'Sports equipment display', 'Goal posts'],
              colors: ['Green', 'White', 'Black']
            }
          ],
          totalAmount: 450,
          paymentStatus: 'Refunded',
          status: 'Cancelled',
          numberOfGuests: 20,
          specialRequests: ['Indoor backup plan needed'],
          notes: 'Cancelled due to weather concerns - full refund processed',
          createdAt: '2025-01-15T11:00:00Z',
          updatedAt: '2025-01-18T09:30:00Z'
        }
      ];
  },

  // Get booking by ID
  async getBookingById(id: string): Promise<MongoBooking | null> {
    try {
      // Try API first for single booking
      const response = await apiClient.get(`/bookings/${id}`);
      return response.data;
    } catch (apiError) {
      console.warn('Single booking API call failed, trying to find in all bookings');
      // Fallback to searching in all bookings
      const allBookings = await this.getAllBookings();
      return allBookings.find(booking => 
        booking._id === id || booking.id === id
      ) || null;
    }
  },

  // Create new booking
  async createBooking(booking: Omit<MongoBooking, '_id'>): Promise<MongoBooking> {
    try {
      // const response = await apiClient.post('/bookings', booking);
      // return response.data;
      
      // Simulate creating a booking
      const newBooking: MongoBooking = {
        ...booking,
        _id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update booking
  async updateBooking(id: string, updateData: Partial<MongoBooking>): Promise<MongoBooking> {
    console.log('🔄 === STARTING BOOKING UPDATE ===');
    console.log('Booking ID to update:', id);
    console.log('Update data (frontend format):', updateData);
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Full update URL will be:', `${API_BASE_URL}/bookings/${id}`);
    
    try {
      console.log('🚀 Attempting API call to update booking...');
      
      // Transform the update data from frontend format to MongoDB format
      const mongoUpdateData = {
        // Basic fields - map frontend field names to MongoDB field names
        fullName: updateData.customerName,
        email: updateData.customerEmail,
        phoneNumber: updateData.customerPhone,
        eventDate: updateData.eventDate,
        eventTime: updateData.eventTime,
        location: updateData.eventLocation,
        expectedGuests: updateData.numberOfGuests ? `${updateData.numberOfGuests}-${updateData.numberOfGuests + 10} guests` : undefined,
        status: updateData.status,
        paymentStatus: updateData.paymentStatus,
        notes: updateData.notes,
        
        // Complex nested fields - preserve MongoDB structure
        packageTitle: updateData.package,
        packageSubtitle: updateData.packageDetails?.name,
        basePrice: updateData.packageDetails?.price,
        packageDuration: updateData.packageDetails?.duration,
        includedServices: updateData.packageDetails?.includedServices,
        
        // Transform addons back to MongoDB format
        selectedAddOns: updateData.addons?.map(addon => ({
          name: addon.name,
          price: addon.price,
          quantity: addon.quantity
        })),
        
        // Transform activities back to MongoDB format
        selectedActivities: updateData.activities?.map(activity => ({
          name: activity.name,
          duration: activity.duration,
          ageGroup: activity.ageGroup
        })),
        
        // Transform themes back to MongoDB format  
        selectedTheme: updateData.themes?.[0] ? {
          title: updateData.themes[0].name,
          decorations: updateData.themes[0].decorations,
          colors: updateData.themes[0].colors
        } : undefined,
        
        totalPrice: updateData.totalAmount,
        specialRequests: updateData.specialRequests,
        createdAt: updateData.createdAt,
        updatedAt: new Date().toISOString()
      };
      
      // Remove undefined values
      const cleanMongoData = Object.fromEntries(
        Object.entries(mongoUpdateData).filter(([_, value]) => value !== undefined)
      );
      
      console.log('📦 Transformed data to MongoDB format:', cleanMongoData);
      console.log('📦 Request payload size:', JSON.stringify(cleanMongoData).length, 'characters');
      
      // Make the API call with MongoDB-formatted data
      const response = await apiClient.put(`/bookings/${id}`, cleanMongoData);
      
      console.log('✅ Booking updated successfully via MongoDB API!');
      console.log('📥 Response status:', response.status);
      console.log('📥 Raw response data:', response.data);
      
      // Transform the response back to frontend format
      const transformedResponse = {
        _id: response.data._id?.toString() || response.data.id?.toString(),
        customerName: response.data.fullName || response.data.customerName || 'Unknown Customer',
        customerEmail: response.data.email || response.data.customerEmail || undefined,
        customerPhone: response.data.phoneNumber || response.data.customerPhone || response.data.phone || undefined,
        eventDate: response.data.eventDate || response.data.event_date || response.data.date,
        eventTime: response.data.eventTime || response.data.time || undefined,
        eventLocation: response.data.location || response.data.eventLocation || 'TBD',
        package: response.data.packageTitle || response.data.package || response.data.packageName || 'Unknown Package',
        packageDetails: response.data.packageDetails || {
          name: response.data.packageTitle || response.data.package || 'Unknown Package',
          price: response.data.basePrice || response.data.packagePrice || response.data.price || 0,
          duration: response.data.packageDuration || response.data.duration || 'N/A',
          includedServices: response.data.includedServices || []
        },
        addons: this.transformAddons(response.data.selectedAddOns || response.data.addons || []),
        activities: this.transformActivities(response.data.selectedActivities || response.data.activities || []),
        themes: this.transformThemes(response.data.selectedTheme ? [response.data.selectedTheme] : response.data.themes || []),
        totalAmount: response.data.totalPrice || response.data.totalAmount || response.data.total || response.data.price || 0,
        paymentStatus: response.data.paymentStatus || 'Pending',
        status: this.mapBookingStatus(response.data.status),
        numberOfGuests: this.parseGuestCount(response.data.expectedGuests) || response.data.numberOfGuests || response.data.guests || undefined,
        specialRequests: response.data.specialRequests || response.data.special_requests || [],
        notes: response.data.notes || response.data.description || '',
        createdAt: response.data.createdAt || response.data.created_at || response.data.createdDate,
        updatedAt: response.data.updatedAt || response.data.updated_at || response.data.updatedDate
      };
      
      console.log('📥 Transformed response to frontend format:', transformedResponse);
      console.log('📥 Response data status field:', transformedResponse.status);
      
      // Verify the response has the expected data
      if (!transformedResponse._id) {
        console.error('❌ WARNING: Response missing ID field!');
      }
      if (!transformedResponse.status) {
        console.error('❌ WARNING: Response missing status field!');
      }
      
      return transformedResponse;
      
    } catch (apiError: any) {
      console.error('❌ === API UPDATE FAILED ===');
      console.error('Error details:', {
        message: apiError.message,
        code: apiError.code,
        response: apiError.response?.data,
        status: apiError.response?.status,
        url: apiError.config?.url,
        method: apiError.config?.method
      });
      
      // Check if it's a network/connection error
      if (apiError.code === 'ECONNREFUSED' || apiError.code === 'ERR_NETWORK' || apiError.code === 'ENOTFOUND') {
        throw new Error('Backend server is not running or not accessible. Please start the server with "node server.js" and try again.');
      }
      
      // Check if it's a timeout
      if (apiError.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Backend server may be overloaded or not responding.');
      }
      
      // For other errors, include the status code if available
      const statusText = apiError.response?.status ? ` (HTTP ${apiError.response.status})` : '';
      throw new Error(`Failed to update booking in database${statusText}: ${apiError.message}`);
    }
  },

  // Delete booking
  async deleteBooking(id: string): Promise<boolean> {
    try {
      // const response = await apiClient.delete(`/bookings/${id}`);
      // return response.status === 200;
      
      // Simulate deletion
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }
};

export default bookingApiService;