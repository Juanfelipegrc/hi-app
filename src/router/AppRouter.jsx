import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { StartPage } from '../auth'
import { AddAContact, Chat, EditProfile, HomePage } from '../pages'
import { useAuth } from '../hooks'

export const AppRouter = () => {

    const {status, validateLogged} = useAuth();

    useEffect(() => {
      

        validateLogged();

    }, [])
    
    

  return (
    <>
    
        <Routes>
            {
                status === 'authenticated'?
                <>
                    <Route path='/' element={<HomePage/>}/>
                    <Route path='/add-contact' element={<AddAContact/>}/>
                    <Route path='/chat/:name' element={<Chat/>}/>
                    <Route path='/edit-profile' element={<EditProfile/>}/>
                    <Route path='*' element={<Navigate to='/'/>}/>
                </>
                :
                <>
                    <Route path='/' element={<StartPage/>}/>
                    <Route path='*' element={<Navigate to='/'/>}/>
                </>
                
            }
            
        </Routes>
    
    
    </>
  )
}
