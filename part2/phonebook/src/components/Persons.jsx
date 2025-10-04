const Persons = ({ personsToShow, handleDelete }) => (
  <ul>
    {personsToShow.map(person => (
      <li key={person.id}>
        {person.name} — {person.number}
        <button
          onClick={() => handleDelete(person.id)}
          style={{ marginLeft: 8 }}
        >
          delete
        </button>
      </li>
    ))}
  </ul>
)

export default Persons
