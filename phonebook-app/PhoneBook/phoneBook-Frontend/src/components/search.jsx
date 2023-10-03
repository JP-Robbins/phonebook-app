import Person from './person'

const Search = (props) => {
    return (
        <div>
        <form onSubmit={props.searchBar}>
          <input value={props.searchQuery} onChange={props.handleSearchChange} />
          <button type='submit'>search</button>
        </form>
        <ul>
          {props.searchResults.map(person => (
            <Person id={person.id} name={person.name} number={person.number}/>
          ))}
        </ul>
      </div>
    )
}

export default Search