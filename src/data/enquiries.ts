export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
  status: 'Pending' | 'Reviewed' | 'Closed';
}

export const enquiries: Enquiry[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    date: '2025-10-15',
    message: 'Interested in the Gold Package for my son\'s 10th birthday.',
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    date: '2025-11-02',
    message: 'Do you have any availability in November? Looking for a package for 20 kids.',
    status: 'Reviewed',
  },
  {
    id: 3,
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    phone: '456-123-7890',
    date: '2025-09-28',
    message: 'I would like to know more about the custom themes.',
    status: 'Closed',
  },
];
