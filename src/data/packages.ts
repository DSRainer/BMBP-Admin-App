
import { Activity } from './activities';
import { Theme } from './themes';
import { Addon } from './addons';

export interface Package {
  id: number;
  name: string;
  price: number;
  description: string;
  activities: Activity[];
  themes: Theme[];
  addons: Addon[];
}

export const packages: Package[] = [
  {
    id: 1,
    name: 'Standard Package',
    price: 500,
    description: 'The ultimate birthday experience with all the bells and whistles.',
    activities: [{ id: 1, name: 'Magic Show' }, { id: 2, name: 'Face Painting' }],
    themes: [{ id: 1, name: 'Princess', color: '#ffc0cb' }, { id: 2, name: 'Superhero', color: '#ff0000' }],
    addons: [{ id: 1, name: 'Birthday Cake', price: 50 }, { id: 2, name: 'Goodie Bags', price: 15 }],
  },
  {
    id: 2,
    name: 'Eco-Friendly Package',
    price: 350,
    description: 'A great value package with a selection of our most popular activities.',
    activities: [{ id: 3, name: 'Balloon Twisting' }, { id: 4, name: 'Bouncy Castle' }],
    themes: [{ id: 3, name: 'Jungle', color: '#008000' }, { id: 4, name: 'Space', color: '#0000ff' }],
    addons: [{ id: 3, name: 'Piñata', price: 30 }],
  },
  {
    id: 3,
    name: 'Premium Package',
    price: 250,
    description: 'An affordable option for a fun-filled birthday party.',
    activities: [{ id: 5, name: 'Clown Performance' }],
    themes: [{ id: 5, name: 'Pirate', color: '#a52a2a' }],
    addons: [],
  },
];
