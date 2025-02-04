import React, { useEffect, useRef } from 'react'
import { UserProfilePicture } from '../../assets'
import { Link, useNavigate } from 'react-router-dom'
import { Message } from './Message'
import { useActiveChat, useForm } from '../../hooks'





const initialFormValue = {
    message: '',
}

export const ChatLg = () => {

    const {nickname, messages, createMessage, clearMessages, getMessagesDB, messageSending, cleanActiveChat, screenWidth} = useActiveChat();

    const {message, onInputChange, resetFormValues} = useForm(initialFormValue);

    const messagesEndRef = useRef(null);

    const inputRef = useRef(null);

    const navigate = useNavigate();



    


    const scrollToBottom = () => {
        if(messagesEndRef.current){
            messagesEndRef.current.scrollTo({
                top: messagesEndRef.current.scrollHeight,
                behavior: 'smooth'
            });

        };

    };

    

    const onSubmitForm = async(event) => {
        let clonedMessage = '';
        event.preventDefault();
        clonedMessage = message;
        resetFormValues();
        await createMessage(clonedMessage);
        setTimeout(() => {
            scrollToBottom();
        }, 500);
    }


    useEffect(() => {
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    }, [messages?.length])
    


    useEffect(() => {


            setTimeout(() => {
                scrollToBottom();
            }, 50);

            getMessagesDB();

            

           

    }, []);

    useEffect(() => {


        if(!messageSending && inputRef.current){
            inputRef.current.focus();
        }
    }, [messageSending])
    
    

    const navigateHome = () => {
        cleanActiveChat();

        if(screenWidth <= 1024){
        
            navigate('/');
        
        }

    }




  return (
    <>

    
        <div className='overflow-hidden h-full'>
            <div className="w-full h-full animate__animated animate__fadeIn animate__faster">

                {/* CHAT HEADER */}
                <div className='w-full py-3 flex justify-center items-center gap-4 sticky top-0 bg-gray-100'>

                    <div className='flex-shrink-0 ms-4'>
                        <a 
                            onClick={navigateHome}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="1.3rem" viewBox="0 -960 960 960" width="1.3rem" fill="#0f172a"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
                        </a>
                    </div>

                    <div className='flex-shrink-0'>
                        <img className='w-10 h-10 rounded-full object-cover' src={UserProfilePicture} alt="" />
                    </div>

                    <div className='flex-1'>
                        <h3 className='font-semibold text-slate-900'>
                            {nickname}
                        </h3>
                    </div>
                </div>

                <div className='h-[74%] w-full'>
                    
                    
                    {/* MESSAGES */}

                    <div className='h-full w-full flex flex-col-reverse justify-end pb-5 pt-2 '>

                        <div 
                        ref={messagesEndRef}
                        className={`w-full h-full flex flex-col justify-start ${messages?.length === 0? 'overflow-hidden' : 'overflow-y-auto'}`}>
                            {
                                messages?.map((message, index) => (
                                    <Message key={index} message={message}/>
                                ))
                            }
                        </div>

                    </div>

                    


                </div>


                {/* INPUT CHAT */}
                <div className='w-full flex py-3 sticky bottom-0 bg-gray-200'>

                        <form 
                            className='w-full flex items-center justify-center'
                            onSubmit={onSubmitForm}
                        >

                            {
                                !messageSending? (
                                    <input 
                                        name='message'
                                        ref={inputRef}
                                        type="text"
                                        className='py-4 px-3 focus-visible:outline-slate-900 bg-gray-50 rounded-full w-full mx-5'
                                        autoComplete='off'
                                        placeholder={'Message...'} 
                                        value={message}
                                        onChange={onInputChange}
                                    />
                                )

                                :
                                (
                                    <h3 className='font-bold text-3xl text-slate-900 text-center animate__animated animate__fadeInLeft animate__faster'>
                                        SENDING...
                                    </h3>
                                )
                            }

                        </form>

                        <div className='me-5'>
                            <button 
                                className='w-14 h-14 relative bg-slate-900 flex justify-center items-center rounded-full'
                                onClick={onSubmitForm}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="1.75rem" viewBox="0 -960 960 960" width="1.75rem" fill="#ffff"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>
                            </button>
                        </div>

                        </div>
                </div>

        </div>
        
    
    </>
  )
}
