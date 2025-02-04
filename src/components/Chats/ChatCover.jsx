import React from 'react';
import { UserProfilePicture } from '../../assets';
import { useActiveChat } from '../../hooks';

export const ChatCover = ({chat}) => {

  
  const {onSetActiveChat} = useActiveChat();
  const {displayName, email, nickname, id} = chat;
  const uid = id;

  const onActiveChat = () => {
      
    onSetActiveChat({displayName, email, nickname, id, uid});

  };




  return (
    <div 
        onClick={onActiveChat}
        className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition-all"
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
          <h3 className="text-lg font-semibold text-gray-900">{chat.nickname}</h3>
          <span className="text-sm text-gray-500">2:45 PM</span> {/* Hora del último mensaje */}
        </div>

        {/* Último mensaje */}
        <p className="text-sm text-gray-600 truncate">{chat.lastMessage.content}</p>
      </div>
    </div>
  );
};
