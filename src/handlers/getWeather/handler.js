import { getWeatherDataByCity, getWeatherDataByCoordinates } from './getWeatherData';

export const handler = async (event, context, callback) => {
    try {
        const getWeatherByCity = await getWeatherDataByCity(event.queryStringParameters);
        const getWeatherByCoordinates = await getWeatherDataByCoordinates(getWeatherByCity);
        callback(null, { statusCode:200, Body: JSON.stringify({ currentWeather: getWeatherByCity, oppositeWeather: getWeatherByCoordinates}) });
    
    } catch (error) {
        callback(error);
    }
};

export default {
    handler
};