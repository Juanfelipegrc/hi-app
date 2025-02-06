import React from 'react'
import { useAuth } from '../../hooks';

export const Message = ({message}) => {


  const {uid} = useAuth();

  return (
    <>
    
      <div className={`max-w-[50%] rounded-lg my-3 mx-5 animate__animated animate__fadeIn ${message.sender.id === uid? 'self-end bg-gray-200 text-slate-900' : 'self-start bg-slate-900 text-white'}`}>

        <p className={`font-medium break-words p-2 ${message.sender.id === uid? 'ps-3.5 pe-3' : 'pe-3.5 ps-3'}`}>
            {message.message.content}
          </p>
        

      </div>

      <span className={`text-[0.7rem] font-medium ${message.sender.id === uid? 'self-end me-4' : 'self-start ms-4'}`}>{message.message.timestampSerialized} PM</span>
    
    </>
  )
}
