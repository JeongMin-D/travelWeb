import fs from 'fs';

let content = fs.readFileSync('src/utils/itineraryEngine.js', 'utf8');

const exportRegenerate = `
export const regenerateSlot = (cityName, countryName, style, currentCategory, dayZone, currentItineraryIds = []) => {
  const poiList = getCityPOIs(cityName, countryName);
  
  // Filter out already used IDs
  let pool = poiList.filter(item => !currentItineraryIds.includes(item.id));
  
  if (currentCategory === 'restaurant') {
    pool = pool.filter(item => item.category === 'restaurant');
  } else if (currentCategory === 'cafe') {
    pool = pool.filter(item => item.category === 'cafe');
  } else if (currentCategory === 'activity') {
    pool = pool.filter(item => item.category === 'activity' || item.category === 'attraction');
  } else if (currentCategory === 'relaxation') {
    pool = pool.filter(item => item.category === 'relaxation' || item.category === 'attraction' || item.category === 'cafe');
  } else {
    pool = pool.filter(item => item.category === 'attraction' || item.category === 'relaxation' || item.category === 'nightview');
  }

  // Shuffle pool to give a different one each time
  pool = pool.sort(() => Math.random() - 0.5);

  if (pool.length > 0) {
    return pool[0];
  }
  return null; // No alternative found
};
`;

if (!content.includes('export const regenerateSlot')) {
  content += exportRegenerate;
  fs.writeFileSync('src/utils/itineraryEngine.js', content, 'utf8');
}
console.log('patched');
