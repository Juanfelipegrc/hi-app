import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { StartPage } from '../auth'
import { AddAContact, Chat, Chats, Contacts, EditProfile, HomePage, Settings } from '../pages'
import { useActiveChat, useAuth } from '../hooks'
import { useLockScroll } from '../helpers'

export const AppRouter = () => {

    const {status, validateLogged} = useAuth();
    const {onSetActiveChat} = useActiveChat();

    useEffect(() => {
      

        validateLogged();

        if(status === 'not-autheticated'){
            onSetActiveChat({
                nickname: '',
                email: '',
                displayName: '',
                id: '',
                uid: '',
                messages: [],
                chats: [],
            })
        }

    }, []);


    useLockScroll(status === 'not-authenticated')






    
    

  return (
    <>
    
        <Routes>
            {
                status === 'authenticated'?
                
                <>
                    <Route path='/' element={<HomePage/>}>
                        <Route  index element={<Chats/>}/>
                        <Route path='/contacts' element={<Contacts/>}/>
                        <Route path='/settings' element={<Settings/>}/>
                        <Route path='*' element={<Navigate to='/'/>}/>
                    </Route>

                    <Route path='/edit-profile' element={<EditProfile/>}/>
                    <Route path='/add-contact' element={<AddAContact/>}/>
                    <Route path='/chat/:name' element={<Chat/>}/>
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
