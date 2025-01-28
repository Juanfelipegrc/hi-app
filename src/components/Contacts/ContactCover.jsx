import React from 'react'
import { UserProfilePicture } from '../../assets';
import { useActiveChat } from '../../hooks';

export const ContactCover = ({user}) => {


    const {onSetActiveChat} = useActiveChat();
    const {displayName, email, nickname, id, uid} = user;


    const onActiveChat = () => {
        
        onSetActiveChat({displayName, email, nickname, id, uid});

    }

    

  return (
    <>
    
        <div 
            className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition-all"
            onClick={onActiveChat}
        >
        {/* Imagen de perfil */}
        <div className="flex-shrink-0">
            <img
            className="w-12 h-12 rounded-full object-cover"
            src={UserProfilePicture}
            alt="User Profile"
            />
        </div>

        {/* Contenido del chat */}
        <div className="ms-4 flex-1">
            {/* Nombre del usuario */}
            <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{nickname}</h3>
            </div>

        </div>
        </div>
    
    </>
  )
}
