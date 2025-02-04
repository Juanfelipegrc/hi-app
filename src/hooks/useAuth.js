import { useDispatch, useSelector } from "react-redux"
import { loginWithEmailAndPassword, registerWithEmailAndPassword } from "../firebase/providers";
import {FirebaseDB} from '../firebase/config';
import { checkingCredentials, login, logout, setChats, setContacts, setError } from "../store/slices";
import { collection, doc, getDocs, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";


export const useAuth = () => {


    const authState = useSelector(state => state.auth);


    
    const dispatch = useDispatch();

    const [chatsLoading, setChatsLoading] = useState(false);

    



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




    const updateChatsNicknames = async() => {
    
    
    
            const userChats = collection(FirebaseDB, `users/${authState.uid}/chats`);
            const userChatsSnap = await getDocs(userChats);
            
    
    
    
            if(!userChatsSnap.empty){
                
                userChatsSnap.docs.forEach(async(doc) => {
    
                    const contactFilter = authState.contacts.find(contact => {
                        return contact.id === doc.data().receiver.id
                    }) 
    
                    
    
                    await updateDoc(doc.ref, {
                        receiver: {
                            displayName: doc.data().receiver.displayName,
                            email: doc.data().receiver.email,
                            id: doc.data().receiver.id,
                            nickname: contactFilter?.nickname || doc.data().receiver.displayName,
                        }
                    });
    
                   
    
                })
    
            };
    
        };

   
        const getChatsDB = () => {
            setChatsLoading(true);
            
            const chatRef = collection(FirebaseDB, `users/${authState.uid}/chats`);
            
            let updatedNicknames = new Map(); // 🔹 Guardamos nicknames ya actualizados
        
            const unsubscribe = onSnapshot(chatRef, async (snapshot) => {
                const chats = snapshot.docs.map((doc) => {
                    const { receiver, lastMessage } = doc.data();
                    return {
                        id: doc.id,
                        lastMessage,
                        ...receiver,
                    };
                });
        
                dispatch(setChats(chats));
        
                snapshot.docs.forEach(async (doc) => {
                    const chatData = doc.data();
                    const contact = authState.contacts.find(contact => contact.id === chatData.receiver.id);
                    const newNickname = contact?.nickname || chatData.receiver.displayName;
        
                    // 🔹 Evitar bucle infinito: Solo actualizamos si el nickname es diferente Y no se ha actualizado antes
                    if (chatData.receiver.nickname !== newNickname && updatedNicknames.get(doc.id) !== newNickname) {
                        updatedNicknames.set(doc.id, newNickname); // 🔹 Guardamos el nickname actualizado
        
                        await updateDoc(doc.ref, {
                            receiver: {
                                displayName: chatData.receiver.displayName,
                                email: chatData.receiver.email,
                                id: chatData.receiver.id,
                                nickname: newNickname,
                            }
                        });
                    }
                });
        
                setChatsLoading(false);
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
        chatsLoading
    }


}