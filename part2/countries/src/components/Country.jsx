import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const name = country?.name?.common ?? ''
  const capital = Array.isArray(country?.capital) ? country.capital[0] : country?.capital
  const population = country?.population ?? null
  const area = country?.area ?? null
  const languages = country?.languages ? Object.values(country.languages) : []
  const flag = country?.flags?.png || country?.flags?.svg || ''

  const [weather, setWeather] = useState(null)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [weatherErr, setWeatherErr] = useState(null)

  useEffect(() => {
    let mounted = true

    if (!capital) {
      if (mounted) {
        setWeather(null)
        setWeatherErr('No capital available')
        setLoadingWeather(false)
      }
      return
    }

    const apiKey = import.meta.env.VITE_OPENWEATHER_KEY
    if (!apiKey) {
      if (mounted) {
        setWeather(null)
        setWeatherErr('OpenWeather API key not set (VITE_OPENWEATHER_KEY).')
        setLoadingWeather(false)
      }
      return
    }

    const controller = new AbortController()
    const signal = controller.signal

    const fetchWeather = async () => {
      setLoadingWeather(true)
      setWeatherErr(null)
      setWeather(null)

      try {
        const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: { q: capital, units: 'metric', appid: apiKey },
          signal
        })
        if (mounted) setWeather(res.data)
      } catch (err) {
        if (!mounted) return
        if (axios.isCancel?.(err) || err.name === 'CanceledError') return
        console.error('Weather fetch error:', err)
        if (err.response) {
          setWeatherErr(`Weather API error: ${err.response.status} ${err.response.statusText}`)
        } else {
          setWeatherErr('Could not fetch weather for the capital.')
        }
      } finally {
        if (mounted) setLoadingWeather(false)
      }
    }

    fetchWeather()

return () => {
  mounted = false
  if (controller) {
    try {
      controller.abort()
    } catch{
      // Ignore
    }
  }
}

  }, [capital])

  if (!country) return null

  return (
    <div style={{ marginTop: 12 }}>
      <h2>{name}</h2>
      <p><strong>Capital:</strong> {capital ?? '—'}</p>
      <p><strong>Population:</strong> {population ? population.toLocaleString() : '—'}</p>
      <p><strong>Area:</strong> {area ? `${area.toLocaleString()} km²` : '—'}</p>
      <p><strong>Languages:</strong> {languages.length ? languages.join(', ') : '—'}</p>

      {flag && <img src={flag} alt={`flag of ${name}`} style={{ width: 200, border: '1px solid #ddd', margin: '10px 0' }} />}

      <h3>Weather in {capital ?? '—'}</h3>
      {loadingWeather && <div>Loading weather...</div>}
      {weatherErr && <div style={{ color: 'red', marginBottom: 8 }}>{weatherErr}</div>}
      {weather && (
        <div>
          <p><strong>Temperature:</strong> {weather.main?.temp} °C</p>
          <p><strong>Wind:</strong> {weather.wind?.speed} m/s</p>
          {weather.weather && weather.weather[0] && (
            <div>
              <p style={{ textTransform: 'capitalize' }}>{weather.weather[0].description}</p>
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Country

