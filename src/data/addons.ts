
export interface Addon {
  id: number;
  name: string;
  price: number;
}

export const addons: Addon[] = [
  { id: 1, name: 'Birthday Cake', price: 50 },
  { id: 2, name: 'Goodie Bags', price: 15 },
  { id: 3, name: 'Piñata', price: 30 },
  { id: 4, name: 'Extra Hour of Play', price: 100 },
  { id: 5, name: 'Popcorn Machine', price: 40 },
];
