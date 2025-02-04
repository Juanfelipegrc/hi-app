import React from 'react'
import { ChatCover } from '../components';
import {  useAuth } from '../hooks';



export const Chats = () => {

  const {chats, chatsLoading} = useAuth();


  
  


  return (
    <>
    
        <div className={`w-full animate__animated animate__fadeInLeft animate__faster ${chats?.length === 0? 'flex items-center justify-center h-svh' : ''}`}>
          {
            chatsLoading?
            (
              <div className='w-full h-svh flex items-center justify-center'>
                <div className='border-8 border-slate-900 border-t-gray-300 animate-spin rounded-full w-12 h-12 mb-36'>

                </div>
              </div>
            )
            :
            <>
            
              {
                chats?.map((chat, index) => (
                  <ChatCover key={index} chat={chat}/>
                ))
              }
              
              {
                chats?.length === 0?
                <>
                  <p className='text-slate-900 font-medium mb-36'>No chats yet</p>
                </>
              
                :
                <></>
              }
            
            </>
          }
        </div>

    
    </>
  )
}


