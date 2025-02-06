import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActiveChat, useAddContact, useAuth, useForm } from '../hooks';
import Swal from 'sweetalert2';

const initialForm = {
  email: '',
  nickname: ''
};

export const AddAContact = () => {

  const [contactStatus, setContactStatus] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const {email, nickname, onInputChange, resetFormValues} = useForm(initialForm);
  const {chats} = useAuth();
  const {onAddContact} = useAddContact();
  const {onSetActiveChat} = useActiveChat();






  const onSubmitForm = async(event) => {
    event.preventDefault();

    let errors = {};

    if(!email.includes('@')) {
      errors.emailError = 'email is not valid';
    };

    if(nickname.length === 0) {
      errors.nicknameError = 'name is required'
    };

    setValidationErrors(errors);

    if(Object.keys(errors).length != 0) return;


    const res = await onAddContact(email, nickname)
    setContactStatus(res);

    
    if(res.ok){
      Swal.fire({
        title: 'User Added',
        text: res.msg,
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#6b7280',
        cancelButtonColor: '#0f172a',
        cancelButtonText: 'Start chat',
        confirmButtonText: 'Close',
      }).then((result) => {
        if(result.isConfirmed){
          navigate('/')
        } else{

          const {displayName: displayNameRes, email: emailRes, uid: uidRes} = res.user;

          if(chats?.length != 0) {
            const chatSelected = chats?.find((chat) => {
              return chat.email === email
            });

  
            if(chatSelected){
              onSetActiveChat({...chatSelected, uid: chatSelected.id, nickname})
            } else {
              onSetActiveChat({displayName: displayNameRes, email: emailRes, uid: uidRes, nickname: nickname, id: uidRes});
            }

          } else {  
            onSetActiveChat({displayName: displayNameRes, email: emailRes, uid: uidRes, nickname: nickname, id: uidRes});
          };

          if(screenWidth < 1024){
            navigate(`/chat/${nickname}`);
          } else {
            navigate('/');
          }
        
        }
      });
    }
   
  };


  useEffect(() => {
    
    const onResizeScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };


    window.addEventListener('resize', onResizeScreenWidth);
  
    return () => {
      window.removeEventListener('resize', onResizeScreenWidth);
    }
  }, [])
  





  return (
    <>
    
      <div className='w-full h-svh flex flex-col justify-center items-center overflow-hidden bg-gray-100'> 
    
        <h1 className='w-full font-semibold text-3xl text-slate-900 text-center my-8 animate__animated animate__fadeInDown'>
          Add to Contact
        </h1>
        <p className='w-96 text-slate-900 font-normal my-3'><b>IMPORTANT:</b> Make sure the email is correct so you can write to your contact.</p>

        <div className='w-96'>
          <form
            onSubmit={onSubmitForm} 
            className='w-full flex flex-col items-center gap-4'
          >
            <input 
              name='email'
              type="text"
              className='py-3 bg-white focus-visible:outline-slate-900 rounded-full ps-2 w-full'
              placeholder='Email'
              onChange={onInputChange} 
              value={email}
            />

            <input 
              name='nickname'
              type="text"
              className='py-3 bg-white focus-visible:outline-slate-900 rounded-full ps-2 w-full'
              placeholder='Name' 
              onChange={onInputChange}
              value={nickname}
            />

            {
              !contactStatus.ok? (<p className='text-sm text-slate-700 ms-4'>{contactStatus.msg}</p>) : <></>
            }

            <div className='w-full flex justify-center gap-3'>
              <input 
                type="button"
                onClick={() => navigate('/')}
                className='bg-gray-300 w-32 h-10 rounded-full text-slate-900 font-semibold cursor-pointer'
                value='Cancel'
              />
              <input 
                type="submit"
                className='bg-gray-300 w-32 h-10 rounded-full text-slate-900 font-semibold cursor-pointer'
                value='Save contact'
              />
            </div>
          </form>
        </div>

      </div>
    
    
    </>
  )
}
