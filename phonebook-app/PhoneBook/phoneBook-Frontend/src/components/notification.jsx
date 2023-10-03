const Notification = ({ message }) => {
  if (message.length < 3 ) {
    return null
  }
  return (
    <div className='notify'>
       {message}
    </div>
  )
}

export default Notification
