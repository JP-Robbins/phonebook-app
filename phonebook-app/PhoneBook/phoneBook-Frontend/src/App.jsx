import { useState, useEffect } from 'react'
import Search from './components/search'
import PersonForm from './components/personform'
import Phonebook from  './components/phonebook'
import personService from './services/persons'
import Notification from './components/notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber , setNumber] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [notify, setNotify] = useState('')

useEffect(() => {
  personService
  .getAll()
  .then(initialPersons => {
    setPersons(initialPersons)
  })
  .catch(error => {
    console.error('Error fetching data: ', error)
  })
}, [])



 const addPerson = (event) => {
  event.preventDefault()
  
  const exsistingPerson = persons.find((person) => person.name === newName)
  
  if (exsistingPerson) {
    const confirmedUpdate = window.confirm(`${newName} already exsists. Would you like to replace the old number with a new one?`)

    if (confirmedUpdate) {
      const updatedPerson = {...exsistingPerson, number: newNumber}
            personService
              .update(exsistingPerson.id, updatedPerson)
              .then((returnedUpdatedPerson) => {
                setPersons((prevPersons) =>
                  prevPersons.map((person) =>
                    person.id === returnedUpdatedPerson.id ? returnedUpdatedPerson : person
                  )
                )
              })
            .catch((error) => {
              console.error('Error updating person: ', error)
            })
    }
  } else {
  
  const personObject = {
    name: newName,
    number: newNumber,
  }
  
  personService
  .create(personObject)
  .then(returnedPersons => {
    setPersons(prevPersons => [...prevPersons, returnedPersons])
    setNewName('')
    setNumber('')
    setNotify(`added ${newName}`)
    setTimeout(()=> {
      setNotify('')
    }, 3000)
  })
  .catch(error => {
    console.error('Error adding person: ', error)
  })
  }
 }


const handleNameChange = (event) => {
  setNewName(event.target.value)
}

const handleNumberChange = (event) => {
  setNumber(event.target.value)
}

const handleSearchChange = (event) => {
 setSearchQuery(event.target.value)
  const inputValue = event.target.value.toLowerCase()

 const filteredResults = persons.filter((person) =>
 person.name.toLowerCase().includes(inputValue))

 setSearchResults(filteredResults)
}

const searchBar = (event) => {
event.preventDefault()

const results = persons.filter((person) =>
person.name.toLowerCase().includes(searchQuery.toLowerCase())
)

if (results.length === 0) {
  alert('no matching results')
} else {
setSearchResults(results)
}
}

  return (
    <div>
      <h2>Phonebook</h2>
     <Search 
     searchQuery={searchQuery}
     searchResults={searchResults}
     handleSearchChange={handleSearchChange}
     searchBar={searchBar}
     />
     <br />
      <Notification message={notify}/>
     <PersonForm 
      addPerson={addPerson}
      newName={newName}
      handleNameChange={handleNameChange}
      newNumber={newNumber}
      handleNumberChange={handleNumberChange}
     />
      <h2>Numbers</h2>
      <Phonebook persons={persons} />
    </div>
  )
}

export default App

