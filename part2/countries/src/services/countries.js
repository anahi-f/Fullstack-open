import axios from 'axios'

const baseUrl = 'https://restcountries.com/v3.1/name'

const searchByName = (name) => {
  // fields: name, capital, population, area, flags, languages
  const fields = 'name,capital,population,area,flags,languages'
  const url = `${baseUrl}/${encodeURIComponent(name)}?fields=${fields}`
  return axios.get(url).then(res => res.data)
}

export default { searchByName }
