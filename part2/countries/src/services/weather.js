import axios from 'axios'

const apiKey = import.meta.env.VITE_OPENWEATHER_KEY

const getWeatherByCity = (city) =>{
    if(!apiKey){
        return Promise.reject(new Error ('OpenWeather API key not set (VITE_OPENWEATHER_KEY).'))
    }
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
    const params = {
        q: city,
        units: 'metric',
        appid:apiKey
    }
    return axios.get(baseUrl,{params}).then(res=> res.data)
}

export default {getWeatherByCity}