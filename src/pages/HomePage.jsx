import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks';
import { ButtonAddToContact} from '../components';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const HomePage = () => {

    const [activeScreen, setActiveScreen] = useState('chats');
    const {onLogoutUser} = useAuth();

    const navigate = useNavigate();

    const {pathname} = useLocation();

   


  
    useEffect(() => {
      
        if(pathname === '/'){
            setActiveScreen('chats');
        } else if(pathname === '/contacts'){
            setActiveScreen('contacts');
        } else if(pathname === '/settings'){
            setActiveScreen('settings');
        };

    }, [activeScreen])
    

  


    

    

  return (
    <>
    
    
        <div className="h-svh bg-white animate__animated animate__fadeIn">

        <div className='w-full text-center border-b py-4 border-gray-400'>
                <p className='text-slate-900 font-semibold'>{activeScreen.toUpperCase()}</p>
            </div>



            {/* SCREENS */}

            <Outlet/>









            {/* TOOLS BAR */}

            <div className='fixed bottom-3 right-0 left-0 py-3 mx-4 flex bg-gray-300 rounded-full shadow-md'>
                <div 
                    className='grow flex justify-center'
                    onClick={() => navigate('/')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 -960 960 960" width="2rem" fill='#0f172a'><path d="M880-80 720-240H320q-33 0-56.5-23.5T240-320v-40h440q33 0 56.5-23.5T760-440v-280h40q33 0 56.5 23.5T880-640v560ZM160-473l47-47h393v-280H160v327ZM80-280v-520q0-33 23.5-56.5T160-880h440q33 0 56.5 23.5T680-800v280q0 33-23.5 56.5T600-440H240L80-280Zm80-240v-280 280Z"/></svg>
                </div>
                <div 
                    className='grow flex justify-center'
                    
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 -960 960 960" width="2rem" fill="#0f172a"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-43 9-84.5t26-80.5l62 62q-8 26-12.5 51.5T160-480q0 134 93 227t227 93q134 0 227-93t93-227q0-134-93-227t-227-93q-27 0-52.5 4.5T377-783l-61-61q40-18 80-27t84-9q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80ZM220-680q-25 0-42.5-17.5T160-740q0-25 17.5-42.5T220-800q25 0 42.5 17.5T280-740q0 25-17.5 42.5T220-680Zm260 200Z"/></svg>
                </div>
                <div 
                    className='grow flex justify-center'
                    onClick={() => navigate('/contacts')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 -960 960 960" width="2rem" fill="#0f172a"><path d="M160-40v-80h640v80H160Zm0-800v-80h640v80H160Zm320 400q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm70-80q45-56 109-88t141-32q77 0 141 32t109 88h70v-480H160v480h70Zm118 0h264q-29-20-62.5-30T480-280q-36 0-69.5 10T348-240Zm132-280q-17 0-28.5-11.5T440-560q0-17 11.5-28.5T480-600q17 0 28.5 11.5T520-560q0 17-11.5 28.5T480-520Zm0 40Z"/></svg>
                </div>
                <div 
                    className='grow flex justify-center'
                    onClick={() => navigate('/settings')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 -960 960 960" width="2rem" fill="#0f172a"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
                </div>
                
                <div 
                    className='grow flex justify-center'
                    onClick={onLogoutUser}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 -960 960 960" width="2rem" fill="#0f172a"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
                </div>
            </div>

                <ButtonAddToContact/>
        </div>

    
    </>
  )
}
