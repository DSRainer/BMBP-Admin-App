export interface Booking {
  id: number;
  customerName: string;
  eventDate: string;
  package: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export const bookings: Booking[] = [
  { id: 1, customerName: 'Alice Johnson', eventDate: '2025-10-15', package: 'Premium Package', status: 'Confirmed' },
  { id: 2, customerName: 'Bob Williams', eventDate: '2025-10-20', package: 'Standard Package', status: 'Confirmed' },
  { id: 3, customerName: 'Charlie Brown', eventDate: '2025-11-05', package: 'Basic Package', status: 'Pending' },
  { id: 4, customerName: 'Diana Miller', eventDate: '2025-11-12', package: 'Premium Package', status: 'Confirmed' },
  { id: 5, customerName: 'Ethan Davis', eventDate: '2025-12-01', package: 'Standard Package', status: 'Cancelled' },
];
