require('dotenv').config();
const axios = require('axios');
const url = require('url');

const {
    OPENDATA_BASE_URL,
    OPENDATA_API_KEY,
    INCIDENTS_ROUTE,
    CONSTRUCTION_ROUTE,
    CAMERAS_ROUTE
} = process.env;

const headers = { apiKey: OPENDATA_API_KEY };

exports.getIncidents = () => {
    const openDataUrl = url.resolve(OPENDATA_BASE_URL, INCIDENTS_ROUTE);
    return axios.get(openDataUrl, { headers });
};

exports.getConstruction = () => {
    const openDataUrl = url.resolve(OPENDATA_BASE_URL, CONSTRUCTION_ROUTE);
    return axios.get(openDataUrl, { headers });
};

exports.getCameras = () => {
    const openDataUrl = url.resolve(OPENDATA_BASE_URL, CAMERAS_ROUTE);
    return axios.get(openDataUrl, { headers });
};