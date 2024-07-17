const fetch = require('node-fetch').default;
require('dotenv').config();

const API_KEY = process.env.GEOCODE_KEY;
async function getCoordinates(address) {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${API_KEY}`);
    const data = await response.json();
    
    if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { latitude: lat, longitude: lng };
    } else {
        throw new Error('Address not found');
    }
}

module.exports = getCoordinates;