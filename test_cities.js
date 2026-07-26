import { destinations } from './src/data/destinations.js';
const krcities = destinations.filter(d => d.country === '대한민국').map(d => d.name);
console.log(krcities);
