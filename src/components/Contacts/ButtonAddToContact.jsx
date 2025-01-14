import React from 'react'
import { useNavigate } from 'react-router-dom'

export const ButtonAddToContact = () => {

    const navigate = useNavigate();


  return (
    <>
    
    
        <button 
            className='fixed bottom-24 right-7 rounded-full bg-gray-300 p-4 shadow-md' 
            id='expand-button'
            onClick={() => navigate('/add-contact')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 -960 960 960" width="2rem" fill="#0f172a"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
        </button>
    
    
    </>
  )
}
