import { createSlice } from '@reduxjs/toolkit';


export const activeChatSlice = createSlice({
    name: 'activeChatSlice',
    initialState: {
        nickname: '',
        email: '',
        displayName: '',
        id: '',
        uid: '',
        messages: [],
        chats: [],
    },
    reducers: {
        setActiveChat: (state, {payload}) =>{
            state.displayName = payload.displayName;
            state.email = payload.email;
            state.nickname = payload.nickname;
            state.id = payload.id;
            state.uid = payload.uid;
        },
        setMessages: (state, {payload}) => {
            state.messages = payload;
        },
        setChats: (state, {payload}) => {
            state.chats = payload;
        }
    }
});


export const { setActiveChat, setMessages, setChats } = activeChatSlice.actions;