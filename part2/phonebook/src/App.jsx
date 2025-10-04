import { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'
import Notification from './components/Notifications.jsx'
import personService from './services/persons.js'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  // notification: { message: string, type: 'success'|'error' } or null
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => {
        if (Array.isArray(initialPersons)) setPersons(initialPersons)
        else setPersons([])
      })
      .catch(err => {
        console.error('Error fetching initial data:', err)
        showNotification('Error fetching initial data from server', 'error', 5000)
      })
  }, [])

  const showNotification = (message, type = 'success', duration = 4000) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), duration)
  }

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setFilter(e.target.value)

  const addPerson = (e) => {
    e.preventDefault()
    const name = newName.trim()
    const number = newNumber.trim()
    if (!name || !number) return

    const existing = persons.find(p => p.name.toLowerCase() === name.toLowerCase())

    if (existing) {
      if (!window.confirm(`${existing.name} is already added to phonebook. Replace the old number with the new one?`)) {
        return
      }

      const updatedPerson = { ...existing, number }

      // PUT (update)
      personService.update(existing.id, updatedPerson)
        .then(returnedPerson => {
          // replace in local state
          setPersons(prev => prev.map(p => p.id !== existing.id ? p : returnedPerson))
          showNotification(`${returnedPerson.name} updated successfully`, 'success', 4000)
          setNewName('')
          setNewNumber('')
        })
        .catch(err => {
          // Always handle errors so promise rejection is consumed
          console.error('Error updating person:', err)
          // If resource was removed in the server (404), tell the user and sync local state
          if (err.response && err.response.status === 404) {
            showNotification(`Information of ${existing.name} has already been removed from server`, 'error', 6000)
            setPersons(prev => prev.filter(p => p.id !== existing.id))
          } else {
            // Generic error message
            showNotification(`Could not update ${existing.name}. See console for details.`, 'error', 6000)
          }
        })

      return
    }

    // POST (create)
    const personObj = { name, number }

    personService.create(personObj)
      .then(returnedPerson => {
        setPersons(prev => prev.concat(returnedPerson))
        showNotification(`${returnedPerson.name} added`, 'success', 4000)
        setNewName('')
        setNewNumber('')
      })
      .catch(err => {
        console.error('Error creating person:', err)
        showNotification('Could not create person. See console for details.', 'error', 6000)
      })
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    if (!person) return
    if (!window.confirm(`Delete ${person.name}?`)) return

    personService.remove(id)
      .then(() => {
        setPersons(prev => prev.filter(p => p.id !== id))
        showNotification(`${person.name} deleted`, 'success', 4000)
      })
      .catch(err => {
        console.error('Error deleting person:', err)
        if (err.response && err.response.status === 404) {
          // Already removed from server — sync UI and show error notification
          setPersons(prev => prev.filter(p => p.id !== id))
          showNotification(`${person.name} was already removed from server`, 'error', 6000)
        } else {
          showNotification(`Could not delete ${person.name}`, 'error', 6000)
        }
      })
  }

  const personsToShow = persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification ? notification.message : null} type={notification ? notification.type : null} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
