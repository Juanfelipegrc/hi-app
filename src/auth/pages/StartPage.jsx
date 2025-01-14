import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth, useForm } from '../../hooks';
import { LoadingPage } from '../../components';


const registerAndLoginValues = {
    displayName: '',
    email: '',
    passwordRegister: '',
    passwordLogin: '',
}

export const StartPage = () => {

    const [authPage, setAuthPage] = useState('login');

    const {displayName, email, passwordRegister, passwordLogin, onInputChange, resetFormValues} = useForm(registerAndLoginValues);
    const [validationsErrors, setValidationsErrors] = useState({});
    const {onRegisterNewUser, onLoginUser, error, cleanError, status} = useAuth();

    const onSubmitForm = async(event) => {
        event.preventDefault();

        let errors = {}

       if(authPage === 'register'){
            if(displayName.length <= 2){
                errors.displayNameError = 'very short name';
            }
            if(!/\d/.test(passwordRegister)) {
                errors.passwordError = 'password must include a number';
                
            };
            if(passwordRegister.length < 10) {
                errors.passwordError = 'very short password';
                
            };
       }

        if(!email.includes('@')){
            errors.emailError = 'email is not valid';
            
        };
        

       
        setValidationsErrors(errors);

        if(Object.keys(errors).length != 0) return;


       if(authPage === 'login'){
            await onLoginUser(email, passwordLogin);
       };
       if(authPage === 'register') {
            await onRegisterNewUser(email, displayName, passwordRegister);
       }
       
    }

    useEffect(() => {
        resetFormValues();
        cleanError();
    }, [authPage]);


    useEffect(() => {
      
        const onBlur = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        };

        const inputs = document.querySelectorAll('input');

        inputs.forEach((input) => {
            input.addEventListener('blur', onBlur);
        });



        return () => {
            inputs.forEach((input) => {
                input.removeEventListener('blur', onBlur);
            })
        }



    }, [])
    
   
    

  return (
    <>
    
        {
            status === 'checking'?

            <LoadingPage/>

            :

            <>
            
                <div className="bg-white h-screen flex flex-col items-center justify-center overflow-hidden">
                <h1 className='text-3xl text-center text-black font-medium w-full animate-pulse'>WELCOME TO "HI"</h1>


                    {
                        authPage === 'register'?
                        (
                            <form onSubmit={onSubmitForm} className='mt-5 w-96 flex flex-col gap-4 animate__animated animate__fadeInLeft'>
                        
                        
                                <div>
                                    <input 
                                        name='displayName'
                                        type="text"
                                        placeholder='Name'
                                        className='w-full py-4 ps-3 rounded-full bg-gray-100 focus-visible:outline-slate-900' 
                                        onChange={onInputChange}
                                        value={displayName}
                                    />
                                    {
                                        validationsErrors.displayNameError? (<p className='text-sm text-slate-700 ms-4'>{validationsErrors.displayNameError}</p>) : <></>
                                    }
                                </div>
                                
                                <div>
                                    <input 
                                        name='email'
                                        type="text"
                                        placeholder='Email'
                                        className='w-full py-4 ps-3 rounded-full bg-gray-100 focus-visible:outline-slate-900' 
                                        onChange={onInputChange}
                                        value={email}
                                    />
                                    {
                                        validationsErrors.emailError? (<p className='text-sm text-slate-700 ms-4'>{validationsErrors.emailError}</p>) : <></>
                                    }
                                </div>

                                <div>
                                    <input 
                                        name='passwordRegister'
                                        type="password"
                                        placeholder='Password'
                                        className='w-full py-4 ps-3 rounded-full bg-gray-100 focus-visible:outline-slate-900' 
                                        onChange={onInputChange}
                                        value={passwordRegister}
                                    />
                                    {
                                        validationsErrors.passwordError? (<p className='text-sm text-slate-700 ms-4'>{validationsErrors.passwordError}</p>) : <></>
                                    }
                                </div>

                                {
                                    error != ''? (<p className='text-sm text-center text-slate-700 ms-4'>{error}</p>) : <></>
                                }

                                <div className='flex justify-center w-full'>
                                    

                                    <input 
                                        className='bg-slate-300 text-slate-900 shadow-lg w-24 py-2 px-3 rounded-full font-medium
                                        hover:bg-slate-900 hover:border-white hover:border hover:text-white transition-all'
                                        type='submit'
                                        value='Register'
                                    />
                                </div>

                                <div className='w-full flex justify-center'>
                                    <p>Do you have already account? <Link className='text-blue-700 underline underline-offset-2' onClick={() => setAuthPage('login')}>Login</Link> </p>
                                </div>
                                
                            </form>
                        )

                        :

                        (
                            <form onSubmit={onSubmitForm} className='mt-5 w-96 flex flex-col gap-4 animate__animated animate__fadeInRight'>
                        
                        
                                <div>
                                    <input 
                                        name='email'
                                        type="text"
                                        placeholder='Email'
                                        className='w-full py-4 ps-3 rounded-full bg-gray-100 focus-visible:outline-slate-900' 
                                        onChange={onInputChange}
                                        value={email}
                                    />
                                    {
                                        validationsErrors.emailError? (<p className='text-sm text-slate-700 ms-4'>{validationsErrors.emailError}</p>) : <></>
                                    }
                                </div>

                                <input 
                                    name='passwordLogin'
                                    type="password"
                                    placeholder='Password'
                                    className='w-full py-4 ps-3 rounded-full bg-gray-100 focus-visible:outline-slate-900' 
                                    onChange={onInputChange}
                                    value={passwordLogin}
                                />

                                {
                                    error != ''? (<p className='text-sm text-center text-slate-700 ms-4'>{error}</p>) : <></>
                                }

                                <div className='flex justify-center w-full'>
                                    

                                    <input 
                                        className='bg-slate-300 text-slate-900 shadow-lg w-24 py-2 px-3 rounded-full font-medium
                                        hover:bg-slate-900 hover:border-white hover:border hover:text-white transition-all'
                                        type='submit'
                                        value='Login'
                                    />
                                </div>

                                <div className='w-full flex justify-center'>
                                    <p>Don't you have any account? <Link className='text-blue-700 underline underline-offset-2' onClick={() => setAuthPage('register')}>Register</Link> </p>
                                </div>
                                
                            </form>
                        )
                    }
                    


                
                </div>
            
            </>
        }
    
    </>
  )
}
