import { MongoClient, Db, Collection, Document, ObjectId } from 'mongodb';

// MongoDB connection configuration
const MONGODB_URI = process.env.REACT_APP_MONGODB_URI || 'mongodb+srv://rainer:fd7w3omJWsdJ7M2x@cluster0.g2zilxi.mongodb.net/bookmybirthdayparty?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'bookmybirthdayparty';

let client: MongoClient | null = null;
let db: Db | null = null;

// Initialize MongoDB connection
export const connectToMongoDB = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// Close MongoDB connection
export const closeMongoDB = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};

// Generic function to get collection
export const getCollection = async <T extends Document = Document>(collectionName: string): Promise<Collection<T>> => {
  const database = await connectToMongoDB();
  return database.collection<T>(collectionName);
};

// Booking-specific service functions
export const bookingService = {
  // Get all bookings
  async getAllBookings() {
    try {
      const collection = await getCollection('bookings');
      const bookings = await collection.find({}).toArray();
      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get booking by ID
  async getBookingById(id: string) {
    try {
      const collection = await getCollection('bookings');
      const booking = await collection.findOne({ _id: new ObjectId(id) });
      return booking;
    } catch (error) {
      console.error('Error fetching booking by ID:', error);
      throw error;
    }
  },

  // Create new booking
  async createBooking(booking: any) {
    try {
      const collection = await getCollection('bookings');
      const result = await collection.insertOne(booking);
      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update booking
  async updateBooking(id: string, updateData: any) {
    try {
      const collection = await getCollection('bookings');
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      return result;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Delete booking
  async deleteBooking(id: string) {
    try {
      const collection = await getCollection('bookings');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }
};