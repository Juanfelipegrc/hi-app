import React from 'react'
import { ContactCover } from '../components';
import { useAuth } from '../hooks';


export const Contacts = () => {

  const {contacts} = useAuth();

  return (
    <>
    
        <div className={`w-full animate__animated animate__fadeIn animate__faster ${contacts.length === 0? 'flex items-center justify-center h-[32rem]' : ''}`}>
        
          {
            contacts.map((contact, index) => (
              <ContactCover key={index} user={contact}/>
            ))
          }

          {
            contacts.length === 0?
            <>
              <p className='text-slate-900 font-medium'>No contacts yet</p>
            </>
            :
            <></>
          }

        </div>
    
    
    </>
  )
}
