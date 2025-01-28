import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const Settings = () => {


    const [settingActive, setSettingActive] = useState('');

    const navigate = useNavigate();


    
  return (
    <>
    

                <div className='w-full flex flex-col animate__animated animate__fadeIn animate__faster'>

                    <div 
                        className='border-t py-4 ps-4 border-t-gray-200 flex'
                        onClick={() => navigate('/edit-profile')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="#0f172a"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                        &nbsp;
                        <h3 className='font-semibold text-slate-900'>Edit Profile</h3>
                    </div>
                    <div 
                        className='border-t py-4 ps-4 border-t-gray-200 flex'
                        onClick={() => setSettingActive('delete-account')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="#c30000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                        &nbsp;
                        <h3 className='font-semibold text-[#c30000]'>Delete Account</h3>
                    </div>

                </div>


    </>
  )
}
