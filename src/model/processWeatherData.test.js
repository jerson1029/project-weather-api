import {
    storeWeatherData,
    queryWeatherDataByCity,
    queryWeatherDataByLonLat
} from './processWeatherData';
import DDB from '../helpers/dynamoDBHelper';

describe('processWeatherData', () => {
    beforeEach(() => {
        process.env.DYNAMODB_TABLE = 'test_table';
    });
    
    describe('storeWeatherData', () => {
        it('should execute DDB.put with the correct params', async () => {
            DDB.put = jest.fn().mockImplementation(() => Promise.resolve({}));

            await storeWeatherData({
                "city":"Kuala Lumpur",
                "temp":"24"
            });

            expect(DDB.put).toHaveBeenCalledWith({
                Item: { "city": "Kuala Lumpur", "temp":"24" },
                TableName: process.env.DYNAMODB_TABLE
            });
        });
    });

    describe('queryWeatherDataByCity', () => {
        it('should execute DDB.query with correct parameters', async () => {
            DDB.query = jest.fn().mockImplementation(() => Promise.resolve({}));
            await queryWeatherDataByCity("Kuala Lumpur");
            expect(DDB.query).toHaveBeenCalledWith({
                ExpressionAttributeValues: {
                    ':city': "Kuala Lumpur",
                },
                KeyConditionExpression: 'city = :city',
                TableName: process.env.DYNAMODB_TABLE,
            });
        });
    });

    describe('queryWeatherDataByLonLat', () => {
        it('should execute DDB.query with correct parameters', async () => {
            DDB.query = jest.fn().mockImplementation(() => Promise.resolve({}));
            await queryWeatherDataByLonLat(123, 5);
            expect(DDB.query).toHaveBeenCalledWith({
                IndexName: 'lon-lat-index',
                ExpressionAttributeValues: {
                    ':lon': 123,
                    ':lat': 5,
                },
                KeyConditionExpression: 'lon = :lon and lat = :lat',
                TableName: process.env.DYNAMODB_TABLE,
            });
        });
    });
});