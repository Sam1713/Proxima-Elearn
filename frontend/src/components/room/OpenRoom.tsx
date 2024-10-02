import React from 'react'
import { useNavigate } from 'react-router-dom'

const OpenRoom:React.FC = () => {
    const navigate=useNavigate()
    const handleNaivgate=()=>{
       navigate('/room')
    }
  return (
    <div className='py-20'>
        <button onClick={handleNaivgate}>Lets Video chat</button>
      
    </div>
  )
}

export default OpenRoom
