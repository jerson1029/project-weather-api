import axios from 'axios';
import { getWeatherData, getFullPathWithParams } from './apiHelper';

jest.mock('axios', () => ({
    get: () => {},
}));

describe('apiHelper', () => {
    describe('getFullPathWithParams', () => {
        it('should build the full path with parameters', () => {
            process.env.WEATHER_URL = 'http://test-weather.com';
            const relativePath = '/weather';
            const params = { q: 'Kuala Lumpur' };
            const response = getFullPathWithParams(relativePath, params);
            expect(response).toBe(`${process.env.WEATHER_URL}${relativePath}?q=Kuala Lumpur`);
        });
    });
    describe('getWeatherData', () => {
        beforeAll(() => {
            process.env.WEATHER_URL = 'http://test-papi.com';
            process.env.API_KEY = 'testApiKey';
            axios.get = jest.fn(() =>
                Promise.resolve({
                    data: {
                        coord:{  
                            lon:101.71,
                            lat:3.15
                        },
                        weather:[  
                            [  
                                Object
                            ]
                        ],
                        base:'stations',
                        main:{  
                            temp:304.68,
                            pressure:1009,
                            humidity:62,
                            temp_min:304.15,
                            temp_max:305.15
                        },
                        visibility:10000,
                        wind:{  
                            speed:3.6,
                            deg:210
                        },
                        clouds:{  
                            all:75
                        },
                        dt:1531629000,
                        sys:{  
                            type:1,
                            id:8132,
                            message:0.0063,
                            country:'MY',
                            sunrise:1531609832,
                            sunset:1531654062
                        },
                        id:1733046,
                        name:'Kuala Lumpur',
                        cod:200
                    },
                }));
        });
        afterAll(() => {
            delete process.env.WEATHER_URL;
            delete process.env.API_KEY;
        });
        it('should only execute get request if it has headers', async () => {
            const relativePath = '/weather';
            const params = { q: 'Kuala Lumpur' };
            const header = { 'x-api-key': process.env.API_KEY };
            const path = getFullPathWithParams(relativePath, params);
            const res = await getWeatherData(
                relativePath,
                params,
                header,
            );
            expect(axios.get).toHaveBeenCalledWith(path, { headers: header });
        });
    });

});
