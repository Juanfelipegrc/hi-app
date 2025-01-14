import React from 'react'

import { useNavigate } from 'react-router-dom';
import { useAuth, useForm } from '../hooks';

export const EditProfile = () => {

    const {displayName: displayNameUser, email:emailUser} = useAuth();
    
        const initialFormValues = {
            displayName: displayNameUser,
            email: emailUser,
        }

        const {displayName, email, onInputChange, resetFormValues} = useForm(initialFormValues);

        const navigate = useNavigate();


  return (
    <>
    
        <div className='w-full flex flex-col items-center justify-center h-svh bg-gray-100 animate__animated animate__fadeIn animate__faster'>

            <h1
                className='text-center text-3xl font-semibold text-slate-900 my-8'
            >
                Editing
            </h1>

            <form 
                className='w-full flex flex-col items-center gap-4 p-4'
            >
                <input 
                    name='displayName'
                    type="text"
                    className='py-3 focus-visible:outline-slate-900 rounded-full ps-2 w-full' 
                    placeholder='Name'
                    onChange={onInputChange}
                    value={displayName}
                />
                <input 
                    name='email'
                    type="text"
                    className='py-3 focus-visible:outline-slate-900 rounded-full ps-2 w-full' 
                    placeholder='Email'
                    onChange={onInputChange}
                    value={email}
                />

                <div className='w-full flex justify-center gap-3'>
                    <input 
                        type="button"
                        onClick={() => navigate('/')}
                        className='bg-gray-300 w-32 h-10 rounded-full text-slate-900 font-semibold'
                        value='Cancel'
                    />
                    <input 
                        type="submit"
                        className='bg-gray-300 w-32 h-10 rounded-full text-slate-900 font-semibold'
                        value='Save Changes'
                    />
                </div>

            </form>

        </div>
    
    </>
  )
}
