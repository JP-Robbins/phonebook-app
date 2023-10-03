import personService from '../services/persons'

const Person = (person) => {

    const handleDelete = () => {
        if (!person) {
            console.error("Person object is undefined or null")
            return
        }

        if (!person.id) {
            console.error("Person object does not have an 'id' property.")
            return
        }

        if (window.confirm(`Do you really want to delete ${person.name}?`)) {
            personService
               .personDelete(person)
               .then(() => {
                   window.location.reload()
               })
                .catch(error => {
                console.error("Error: ", error)
               })
        }
    }
    return (
     <li>{person.name} {person.number} <button onClick={handleDelete}>delete</button></li>
    )
}

export default Person
