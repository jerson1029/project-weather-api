require('dotenv').config();
import DDB from '../helpers/dynamoDBHelper';

export const storeWeatherData = async weatherData => {
    try {
        const params = {
            Item: weatherData,
            TableName: process.env.DYNAMODB_TABLE
        };
        const response = await DDB.put(params);
    } catch (error) {
        throw error;
    }
};

export const queryWeatherDataByCity = async searchItem => {
    try {
        const weatherData = await DDB.queryItems({
            ExpressionAttributeValues: {
                ':city': searchItem,
            },
            KeyConditionExpression: 'city = :city',
            TableName: process.env.DYNAMODB_TABLE,
        });
        return weatherData;
    } catch (error) {
        throw error;
    }
};

export const queryWeatherDataByLonLat = async (lonValue, latValue) => {
    try {
        const weatherData = await DDB.queryItems({
            IndexName: 'lon-lat-index',
            ExpressionAttributeValues: {
                ':lon': lonValue,
                ':lat': latValue,
            },
            KeyConditionExpression: 'lon = :lon and lat = :lat',
            TableName: process.env.DYNAMODB_TABLE,
        });
        return weatherData;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    storeWeatherData,
    queryWeatherDataByCity,
    queryWeatherDataByLonLat
};
