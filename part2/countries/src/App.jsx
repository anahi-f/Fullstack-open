import { useState, useEffect } from 'react'
import Search from './components/Search.jsx'
import Countries from './components/Countries.jsx'
import Country from './components/Country.jsx'
import countriesService from './services/countries.js'
import Notification from './components/Notifications.jsx'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'error', duration = 4000) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), duration)
  }

  useEffect(() => {
    if (!query.trim()) {
      setCountries([])
      setSelectedCountry(null)
      return
    }

    countriesService
      .searchByName(query.trim())
      .then(data => {
        if (!Array.isArray(data)) {
          showNotification('Unexpected response from countries API', 'error')
          setCountries([])
          return
        }
        setCountries(data)
        setSelectedCountry(data.length === 1 ? data[0] : null)
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          setCountries([])
          setSelectedCountry(null)
        } else {
          console.error('Countries API error:', err)
          showNotification('Error fetching country data', 'error', 5000)
        }
      })
  }, [query])

  const handleQueryChange = (e) => setQuery(e.target.value)
  const handleShow = (commonName) => {
    const found = countries.find(c => (c.name?.common || '').toLowerCase() === commonName.toLowerCase())
    if (found) setSelectedCountry(found)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Country info</h1>
      <Notification message={notification?.message} type={notification?.type} />
      <Search value={query} onChange={handleQueryChange} />

      {countries.length > 10 && <div>Too many matches, specify another filter.</div>}

      {countries.length > 1 && countries.length <= 10 && (
        <Countries countries={countries} onShow={handleShow} />
      )}

      {countries.length === 0 && query.trim() && <div>No matches found.</div>}

      {selectedCountry && <Country country={selectedCountry} />}
    </div>
  )
}

export default App
