import React from 'react'
import { useAuth } from '../../hooks';

export const Message = ({message}) => {


  const {uid} = useAuth();

  return (
    <>
    
      <div className={`w-fit max-w-[50%] rounded-lg bg  my-3 mx-5 animate__animated animate__fadeIn ${message.sender.id === uid? 'self-end bg-gray-200 text-slate-900' : 'self-start bg-slate-900 text-white'}`}>

        <p className='font-medium p-2'>
          {message.message.content}
        </p>

      </div>
    
    </>
  )
}
