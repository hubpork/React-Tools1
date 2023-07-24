import React, { useState, useEffect } from 'react';
import {
    Flex,
    Input,
    Button,
    Heading,
    Box,
    Text
} from "@chakra-ui/react"
import axios from 'axios';
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';

interface WeatherData {
    name: string;
    main: {
        temp: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
}

interface DailyForecast {
    date: string;
    temperature: number;
    weather: string;
    icon: string;
}

const WeatherForecast = () => {
    const [forecastData, setForecastData] = useState<WeatherData | null>(null);
    const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
    const apiKey = process.env.REACT_APP_API_KEY;
    const [city, setCity] = useState('Olten'); // Default city
    const [searchCity, setSearchCity] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
            );
            setForecastData(response.data);
            } catch (error) {
            console.log(error);
            }
        };
        fetchData();
    }, [apiKey, city]);



    useEffect(() => {
        const fetchDailyForecast = async () => {
            try {
                const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
                );
                const dailyData = response.data.list.filter((item: any) => item.dt_txt.includes('12:00:00'));
                const formattedData = dailyData.map((item: any) => ({
                date: item.dt_txt.split(' ')[0],
                temperature: Math.round(item.main.temp - 273.15),
                weather: item.weather[0].description,
                icon: item.weather[0].icon,
                }));
                setDailyForecast(formattedData);
            } catch (error) {
                console.log(error);
            }
        };
        fetchDailyForecast();
    }, [apiKey, city]);


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCity(searchCity);
        setSearchCity('');
    };

    const convertKelvinToCelsius = (kelvin: number) => {
        return Math.round(kelvin - 273.15);
    };

    const getWeatherIcon = (iconCode: string) => {
        switch (iconCode) {
            case '01d':
                return <WiDaySunny />;
            case '01n':
                return <WiDaySunny />;
            case '02d':
                return <WiCloudy />;
            case '02n':
                return <WiCloudy />;
            case '03d':
            case '03n':
                return <WiCloudy />;
            case '04d':
            case '04n':
                return <WiCloudy />;
            case '09d':
            case '09n':
                return <WiRain />;
            case '10d':
            case '10n':
                return <WiRain />;
            case '11d':
            case '11n':
                return <WiRain />;
            case '13d':
            case '13n':
                return <WiSnow />;
            case '50d':
            case '50n':
                return <WiCloudy />;
            default:
                return null;
        }
    };

    const getFormattedDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const getRecommendation = (temperature: number) => {
        if (temperature > 25) {
            return 'It\'s going to be hot! Stay hydrated and wear light clothing.';
        } else if (temperature < 10) {
            return 'It\'s going to be cold! Bundle up and wear warm layers.';
        } else {
            return 'The weather will be pleasant. Enjoy your day!';
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <Flex gap={4} mt={4} maxW={{ base: '100%', lg: '75%' }} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                    <Input
                        type="text"
                        placeholder="Enter a city"
                        value={searchCity}
                        onChange={e => setSearchCity(e.target.value)}
                    />
                    <Button type="submit" colorScheme="teal" variant="solid" flexShrink={0}>Search</Button>
                </Flex>
            </form>

        {forecastData ? (
            <Flex gap={5} mt={4} maxW={{ base: '100%', lg: '75%' }} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                <Flex 
                    textAlign={'center'}
                    width={'100%'}
                    flexDirection={'column'} 
                    boxShadow='sm' 
                    p={5}
                    rounded='md' 
                    bg='white'
                    borderRadius='md'
                    border='1px' 
                    borderColor='gray.200'
                > 
                    <Heading as='h2' size='2xl'>{convertKelvinToCelsius(forecastData.main.temp)}°C </Heading>
                    <Text>{getFormattedDate(new Date().toISOString().split('T')[0])}</Text>
                    <Text mb={4} mt={'auto'}>{getRecommendation(convertKelvinToCelsius(forecastData.main.temp))}</Text>
                </Flex>
                <Flex 
                    textAlign={'center'}
                    width={'100%'}
                    flexDirection={'column'} 
                    boxShadow='sm' 
                    p={5}
                    rounded='md' 
                    bg='white'
                    borderRadius='md'
                    border='1px' 
                    borderColor='gray.200'
                > 
                    <Heading as='h2' size='2xl'>{forecastData.name}</Heading>
                    <Text>{forecastData.weather[0].description}</Text>
                    <Box fontSize={86} mx={'auto'}>{getWeatherIcon(forecastData.weather[0].icon)}</Box>
                </Flex>
            </Flex>
        ) : (
            <p>Loading...</p>
        )}
        <Heading as='h2' mt={5}>Week Forecast</Heading>
        {dailyForecast.length > 0 ? (
            <Flex gap={4} mt={4} maxW={{ base: '100%', lg: '75%' }} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                {dailyForecast.map((forecast) => (
                    <Flex 
                        textAlign={'center'}
                        width={'100%'}
                        flexDirection={'column'} 
                        boxShadow='sm' 
                        p={5}
                        rounded='md' 
                        bg='white'
                        borderRadius='md'
                        border='1px' 
                        borderColor='gray.200'
                        key={forecast.date}
                    > 
                        <Text fontSize='sm'>{getFormattedDate(forecast.date)}</Text>
                        <Heading as='h3' mt={3}>{forecast.temperature}°C</Heading>
                        <Text>{forecast.weather}</Text>
                        <Box fontSize={48} mx={'auto'}>{getWeatherIcon(forecast.icon)}</Box>
                    </Flex>
                ))}
            </Flex>
        ) : (
            <p>Loading...</p>
        )}
        </div>
    );
};

export default WeatherForecast;
