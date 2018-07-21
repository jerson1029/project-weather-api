import api from '../../helpers/apiHelper';
import { weatherPath } from '../../helpers/pathHelper';
import { storeWeatherData, queryWeatherDataByCity, queryWeatherDataByLonLat } from '../../model/processWeatherData';

const formatWeatherDDBData = (data) => {
    return { 
        "weather": String(data.weather[0].description),
        "temp": String(parseInt(data.main.temp - 273.15)),
        "temp_min": String(parseInt(data.main.temp_min - 273.15)),
        "temp_max": String(parseInt(data.main.temp_max - 273.15)),
        "wind_speed": String(data.wind.speed),
        "clouds": String(data.clouds.all),
        "city": String(data.name || "Ocean"),
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

const calculateLongitude = (longitude) => {
    const deductFromWholeSize = 180 - longitude;
    const calculateValidLongitude = deductFromWholeSize >= 180 ? 180 : deductFromWholeSize;
    if (calculateValidLongitude > 0 && calculateValidLongitude >= 180) {
        return calculateValidLongitude;
    } else {
        return calculateValidLongitude * -1;
    }
};

export const getWeatherDataByCity = async searchParams => {
    try {
        // Get Current Weather By City
        const params = searchParams;
        const header = { "x-api-key": process.env.API_KEY};
        const getWeatherDataFromAPI = await api.getWeatherData(weatherPath, params, header).catch(async () => {
            const getWeatherFromDDB = await queryWeatherDataByCity(searchParams.q);
            return getWeatherFromDDB[0];
        });
        const currentLocationWeather = formatWeatherDDBData(getWeatherDataFromAPI.data);
        await storeWeatherData(currentLocationWeather);
        return currentLocationWeather; 
    } catch (error) {
        throw new Error('Something went wrong');
    }
};

export const getWeatherDataByCoordinates = async (searchParams) => {
    try {
        // Get Weather Halfway Around the world
        const newlonValue = calculateLongitude(searchParams.lon);
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
        throw new Error('Something went wrong');
    }
};

module.exports = {
    getWeatherDataByCity,
    getWeatherDataByCoordinates,
    formatWeatherDDBData,
    getWeatherFromApi
};