import { useDispatch, useSelector } from "react-redux"
import { loginWithEmailAndPassword, registerWithEmailAndPassword } from "../firebase/providers";
import {FirebaseDB} from '../firebase/config';
import { checkingCredentials, login, logout, setChats, setContacts, setError } from "../store/slices";
import { collection, doc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useRef } from "react";


export const useAuth = () => {


    const authState = useSelector(state => state.auth);


    
    const dispatch = useDispatch();


    



    const onRegisterNewUser = async(email, displayName, password) => {

        dispatch(checkingCredentials());

        const res = await registerWithEmailAndPassword(email, displayName, password);
        if(!res.ok){
            console.log('Register Error');
            dispatch(setError(res.msg));
            dispatch(logout());
            return;
        }

        const userRef = doc(FirebaseDB, 'users', res.uid);

        await setDoc(userRef, {
            displayName,
            email
        });

        dispatch(login({email, displayName, uid: res.uid}));

        localStorage.setItem('userLogged', JSON.stringify({email, displayName, uid: res.uid}));
    };


    



    const onLoginUser = async(email, password) => {
        

        dispatch(setError(''))

        dispatch(checkingCredentials());

        const res = await loginWithEmailAndPassword(email, password);
        if(!res.ok){
            console.log('Login Error');
            dispatch(setError(res.msg));
            dispatch(logout());
            return;
        }

        dispatch(setError(''))

        const {displayName, uid} = res;

   

        dispatch(login({email, displayName, uid}));

        localStorage.setItem('userLogged', JSON.stringify({email, displayName, uid}))
    };




    const onLogoutUser = () => {
        dispatch(logout());
        localStorage.removeItem('userLogged');
    };



    const validateLogged = () => {
        const isLogged = JSON.parse(localStorage.getItem('userLogged'));

        if(!isLogged) {
            dispatch(logout());
        } else {
            dispatch(login(isLogged));
        }
    }

    const cleanError = () => {
        dispatch(setError(''))
    };

    const getContacts = () => {
        

        const userRef = collection(FirebaseDB, `users/${authState.uid}/contacts`);


        const unsubscribe = onSnapshot(userRef, (snapshot) => {
            const contacts = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            });

            dispatch(setContacts(contacts))
        });


        return unsubscribe;
    }




    const updateChatsNicknames = () => {
    
            const chats = collection(FirebaseDB, `users/${authState.uid}/chats`);
    
            const userContacts = collection(FirebaseDB, `users/${authState.uid}/contacts`);


            
            const unsubscribe = onSnapshot(userContacts, async(snapshot) => {
                const contacts = snapshot.docs.map((doc) => {
                    return {
                        id: doc.id,
                        ...doc.data(),
                    };

                });

                const chatsSnap = await getDocs(chats);


                if(!chatsSnap.empty){

                    chatsSnap.docs.forEach(async(chat) => {

                        const contact = contacts?.find((contact) => contact.email === chat.data().receiver.email);

                        const newNickname = contact? contact.nickname : chat.data().receiver.displayName



         
                        await updateDoc(chat.ref, {
                            receiver: {
                                displayName: chat.data().receiver.displayName,
                                email: chat.data().receiver.email,
                                id: chat.data().receiver.id,
                                nickname: newNickname,

                            }
                        });

                        const LSActiveChat = JSON.parse(localStorage.getItem('activeChat')) || null;

                        if(LSActiveChat){
                            if(LSActiveChat.uid === chat.data().receiver.id){
                                const activeChat = chatsSnap.docs.find((chat) => chat.data().receiver.id === LSActiveChat.uid);

                                if(activeChat){
                                    if(activeChat.data().receiver.nickname !== newNickname){

                                        const newUser = {...LSActiveChat, nickname: newNickname}
                                        localStorage.setItem('activeChat', JSON.stringify(newUser));

                                        const event = new CustomEvent('activeChatUpdate', {detail: newUser});

                                        window.dispatchEvent(event);
                                    }
                                }
                            }
                        }
                    })
                }
            });

            return unsubscribe;
    
        };


        

   
    const getChatsDB = () => {
    
            
            const chatRef = collection(FirebaseDB, `users/${authState.uid}/chats`);

            const q = query(chatRef, orderBy('lastMessage.timestamp', 'desc'))
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
            
                    const chats = snapshot.docs.map((doc) => {
                        
                        
                        const {receiver, lastMessage} = doc.data();
    
    
                            return {
                                id: doc.id,
                                lastMessage,
                                ...receiver,
                       };
    
    
            
                    });
    
                
    
                dispatch(setChats(chats));
    
            
            });
    
            return unsubscribe;
            
        };



            useEffect(() => {
        
                if(authState.uid.length === 0) return;
               
                const unsubscribeChats = getChatsDB();

        
        
                return () => {
                    unsubscribeChats();
                }
        
                
        
            }, [authState.uid]);


            useEffect(() => {
                        

                if(!authState.uid) return;
        
                const unsubscribe = updateChatsNicknames();

                return () => {
                    unsubscribe();
                }
                      
            }, [authState.uid])
            


            useEffect(() => {

                if(authState.uid.length === 0) return;
                
                const unsubscribeContacts = getContacts();
        
                
        
              
        
                return () => {
                    unsubscribeContacts();
                }
        
            }, [authState.uid])
    
    
    


    return {
        ...authState,
        onRegisterNewUser,
        onLoginUser,
        onLogoutUser,
        validateLogged,
        cleanError,
    }


}