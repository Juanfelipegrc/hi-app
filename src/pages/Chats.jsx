import React, { useState } from 'react'
import { ChatCover } from '../components';
import { useActiveChat } from '../hooks';



export const Chats = () => {

  const {chats} = useActiveChat();

  


  return (
    <>
    
        <div className={`w-full animate__animated animate__fadeInLeft animate__faster ${chats.length === 0? 'flex items-center justify-center h-[32rem]' : ''}`}>
          {
            chats?.map((chat, index) => (
              <ChatCover key={index} chat={chat}/>
            ))
          }

          {
            chats.length === 0?
            <>
              <p className='text-slate-900 font-medium'>No chats yet</p>
            </>

            :
            <></>
          }
        </div>

    
    </>
  )
}
