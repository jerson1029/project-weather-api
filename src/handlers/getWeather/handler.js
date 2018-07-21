import { getWeatherDataByCity, getWeatherDataByCoordinates } from './getWeatherData';

const responseHandler = (code , body) => {
    const header = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
    const resp = { statusCode: code, body: JSON.stringify(body), headers: header };
    return resp;
};

export const handler = async (event, context, callback) => {
    try {
        const getWeatherByCity = await getWeatherDataByCity(event.queryStringParameters);
        const getWeatherByCoordinates = await getWeatherDataByCoordinates(getWeatherByCity);
        callback(null, responseHandler(200, { currentWeather: [getWeatherByCity], oppositeWeather: [getWeatherByCoordinates]}));
    
    } catch (error) {
        callback(error);
    }
};

export default {
    handler
};