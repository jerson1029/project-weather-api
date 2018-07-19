require('dotenv').config();
import api from '../../helpers/apiHelper';
import { weatherPath } from '../../helpers/pathHelper';
import { storeWeatherData, queryWeatherDataByCity, queryWeatherDataByLonLat } from '../../model/processWeatherData';

const formatWeatherDDBData = (data) => {
    return {
        "id": String(data.id), 
        "weather": String(data.weather[0].description),
        "temp": String(data.main.temp),
        "temp_min": String(data.main.temp_min),
        "temp_max": String(data.main.temp_max),
        "wind_speed": String(data.wind.speed),
        "clouds": String(data.clouds.all),
        "city": String(data.name),
        "lon": String(data.coord.lon),
        "lat": String(data.coord.lat)
    }
};

const getWeatherFromApi = async params => {
    const header = { "x-api-key": process.env.API_KEY};
    const getWeatherDataFromAPI = await api.getWeatherData(weatherPath, params, header);
    const formattedWeatherData = formatWeatherDDBData(getWeatherDataFromAPI.data);
    return formattedWeatherData;
};

export const getWeatherDataByCity = async searchParams => {
    try {
        // Get Current Weather By City
        const params = searchParams;
        const header = { "x-api-key": process.env.API_KEY};
        const getWeatherDataFromAPI = await api.getWeatherData(weatherPath, params, header).catch(async () => {
            const getWeatherFromDDB = await queryWeatherDataByLonLat(String(oppositeWeatherParams.lon), String(oppositeWeatherParams.lat));
            return getWeatherFromDDB[0];
        });
        const currentLocationWeather = formatWeatherDDBData(getWeatherDataFromAPI.data);
        await storeWeatherData(currentLocationWeather);
        return currentLocationWeather; 
    } catch (error) {
        throw new Error('Something Went Wrong');
    }
};

export const getWeatherDataByCoordinates = async (searchParams) => {
    try {
        // Get Weather Halfway Around the world
        const calclonValue = 180 - searchParams.lon;
        const newlonValue = calclonValue-(2*calclonValue);
        const newlatValue = searchParams.lat * -1;
        const oppositeWeatherParams = { "lon": newlonValue, "lat": newlatValue };
        const header = { "x-api-key": process.env.API_KEY};
        const getWeatherDataFromAPI = await api.getWeatherData(weatherPath, oppositeWeatherParams, header).catch(async () => {
            const getWeatherFromDDB = await queryWeatherDataByLonLat(String(oppositeWeatherParams.lon), String(oppositeWeatherParams.lat));
            return getWeatherFromDDB[0];
        });
        const oppositeLocationWeather = formatWeatherDDBData(getWeatherDataFromAPI.data);
        await storeWeatherData(oppositeLocationWeather);     
        return oppositeLocationWeather;    
    } catch (error) {
        throw new Error('Something Went Wrong');
    }
};

module.exports = {
    getWeatherDataByCity,
    getWeatherDataByCoordinates,
    formatWeatherDDBData,
    getWeatherFromApi
};