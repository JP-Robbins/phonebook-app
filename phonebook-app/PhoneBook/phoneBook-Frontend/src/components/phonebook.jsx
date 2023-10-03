import Person from './person'

const Phonebook = (props) => {
   return (
      <div>
        <ul className='phonebook'>
          {props.persons.map((person) => (
            <Person key={person.id} name={person.name} number={person.number} id={person.id} />
          ))}
        </ul>
      </div>
    )
  }





export default Phonebook
