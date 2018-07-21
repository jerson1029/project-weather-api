import api from '../../helpers/apiHelper';
import {
    getWeatherDataByCity,
    getWeatherDataByCoordinates,
    formatWeatherDDBData,
    getWeatherFromApi
} from './getWeatherData';
import processWeather from '../../model/processWeatherData';

const weatherSearchData = { "q" : "Kuala Lumpur" };
const weatherSearchDataCoord = { "lon": '-1.56', "lat": '18.14' };
const weatherPayload = { data: {
    coord: { lon: -1.56, lat: 18.14 },
    weather:
    [ { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' } ],
    base: 'stations',
    main:
        { temp: 313.864,
            pressure: 991.02,
            humidity: 28,
            temp_min: 313.864,
            temp_max: 313.864,
            sea_level: 1020.04,
            grnd_level: 991.02 
        },
    wind: { speed: 1.96, deg: 272.501 },
    clouds: { all: 0 },
    dt: 1531840177,
    sys: { message: 0.0048, sunrise: 1531805977, sunset: 1531853109 },
    id: 123,
    name: 'Kuala Lumpur',
    cod: 200 
}};

const expectedObjFormatForDDB = { id: '123',
weather: 'clear sky',
temp: '40.714',
temp_min: '40.714',
temp_max: '40.714',
wind_speed: '1.96',
clouds: '0',
city: 'Kuala Lumpur',
lon: '-1.56',
lat: '18.14' };

describe('getWeatherData', () => {
    beforeEach(() => {
        process.env.API_KEY = 'acb20588808ef012922edb1f08477a38';
    });
    describe('formatWeatherDDBData', () => {
        it('should return weather data with city property', async () => {
            const getWeather = await formatWeatherDDBData(weatherPayload.data);
            expect(getWeather).toHaveProperty('temp_min');
        });        
    });

    describe('getWeatherDataByCity', () => {
        it('should get weather data without error', async () => {
            api.getWeatherData = jest.fn().mockImplementation(() => Promise.resolve(weatherPayload));
            processWeather.storeWeatherData = jest.fn().mockImplementation(() => Promise.resolve({}));
            await getWeatherDataByCity(weatherSearchData);
            expect(api.getWeatherData).toHaveBeenCalled();
            expect(processWeather.storeWeatherData).toHaveBeenCalledWith(expectedObjFormatForDDB);
        });
    });

    describe('getWeatherDataByCoordinates', () => {
        it('should get weather data without error', async () => {
            api.getWeatherData = jest.fn().mockImplementation(() => Promise.resolve(weatherPayload));
            processWeather.storeWeatherData = jest.fn().mockImplementation(() => Promise.resolve({}));
            await getWeatherDataByCoordinates(weatherSearchDataCoord);
            expect(api.getWeatherData).toHaveBeenCalled();
            expect(processWeather.storeWeatherData).toHaveBeenCalledWith(expectedObjFormatForDDB);
        });
    });

});