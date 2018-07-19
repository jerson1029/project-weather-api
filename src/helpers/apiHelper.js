require('dotenv').config();
import axios from 'axios';

const isObject = obj => typeof obj === 'object' && obj !== null;

const paramatise = obj => {
    if (!isObject(obj)) {
        return '';
    }
    const stringedParams = Object.keys(obj)
        .filter(key => !!obj[key])
        .map(key => `${key}=${String(obj[key])}`)
        .join('&');
    return stringedParams ? `?${stringedParams}` : stringedParams;
};

const getFullPathWithParams = (relativePath = '', params = {}) => {
    if (!isObject(params)) {
        throw Error('param needs to be an object');
    }
    return `${process.env.WEATHER_URL}${relativePath}${paramatise(params)}`;
};

const getWeatherData = async (path = '', params = {}, headers = {}) => {
    const fullPathWithParams = getFullPathWithParams(path, params);
    const response = await axios.get(fullPathWithParams, { headers });
    return response;
};

module.exports = {
    getWeatherData,
    getFullPathWithParams
};
