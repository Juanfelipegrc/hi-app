import { createSlice } from '@reduxjs/toolkit';


export const authSlice = createSlice({
    name: 'authSlice',
    initialState: {
        status: 'not-authenticated',
        displayName: '',
        uid: '',
        email: '',
        contacts: [],
        error: '',
    },
    reducers: {
        login: (state, {payload}) =>{
            state.status = 'authenticated';
            state.displayName = payload.displayName;
            state.uid = payload.uid;
            state.email = payload.email;
            state.error = '';
        },

        logout: (state, {payload}) => {
            state.status = 'not-authenticated';
            state.displayName = '';
            state.uid = '';
            state.email = '';
            state.contacts = [];
        },

        checkingCredentials: (state, {payload}) => {
            state.status = 'checking'
        },

        setError: (state, {payload}) => {
            state.error = payload
        },
        
        setContacts: (state, {payload}) => {
            state.contacts = payload
        }
    }
});


export const { login, logout, checkingCredentials, setError, setContacts} = authSlice.actions;