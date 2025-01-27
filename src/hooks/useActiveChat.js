import { useDispatch, useSelector } from "react-redux"
import { setActiveChat, setChats, setContacts, setMessages } from "../store/slices";
import { useNavigate } from "react-router-dom";
import { FirebaseDB } from "../firebase/config";
import { collection, setDoc, doc, getDoc, getDocs, query, orderBy, onSnapshot, updateDoc, limit} from "firebase/firestore";
import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";
import { useAddContact } from "./useAddContact";


export const useActiveChat = () => {
 
    const activeChatState = useSelector(state => state.activeChat);
    const [messageSending, setMessageSending] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {displayName: senderDisplayName, email: senderEmail, uid: senderUid, contacts} = useAuth();
    const {onSetContacts} = useAddContact();


    // ON SET ACTIVE CHAT

    const onSetActiveChat = (displayName, email, nickname, id, uid) => {
        dispatch(setActiveChat({displayName, email, nickname, id, uid}));
        navigate(`/chat/${nickname}`);
    };
    
    
    // GET CONTACTS

    const getContacts = () => {
        

        const userRef = collection(FirebaseDB, `users/${senderUid}/contacts`);


        const unsubscribe = onSnapshot(userRef, (snapshot) => {
            const contacts = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            });

            onSetContacts(contacts)
        });


        return unsubscribe;
    }

    

    // UPDATE NICKNAMES

    const updateChatsNicknames = async() => {
        const userChats = collection(FirebaseDB, `users/${senderUid}/chats`);
        const userChatsSnap = await getDocs(userChats);
        



        if(!userChatsSnap.empty){
            
            userChatsSnap.docs.forEach(async(doc) => {

                const contactFilter = contacts.find(contact => {
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


    



    // GET MESSAGES


    const getMessagesDB = () => {


        const messagesRef = collection(FirebaseDB, `users/${senderUid}/chats/${senderUid}_${activeChatState.uid}/messages`);
        const q = query(messagesRef, orderBy('message.timestamp', 'asc'));
        
        const unsuscribe = onSnapshot(q, (snapshot) => {

            const messages = snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            });
            dispatch(setMessages(messages));

            updateLastMessage();
            
            
            
        });

        return unsuscribe;

    };



    // GET CHATS



    const getChatsDB = () => {
        
        const chatRef = collection(FirebaseDB, `users/${senderUid}/chats`);

        
        const unsubscribe = onSnapshot(chatRef, (snapshot) => {
        
                const chats = snapshot.docs.map((doc) => {
                    
                    
                    const {receiver, sender, lastMessage} = doc.data();


        
                   if(sender.id === senderUid){
                        return {
                            id: doc.id,
                            lastMessage,
                            ...receiver,
                        }
                   } else {
                        return {
                            id: doc.id,
                            lastMessage,
                            ...sender,
                        }
                   };


        
                });


                dispatch(setChats(chats));

                updateLastMessage();
        
        });

        return unsubscribe;
        
    };


    // CLEAR MESSAGES

    const clearMessages = () => {
        dispatch(setMessages([]));
    }
    
    // 
    
    
    
    // SET LAST MESSAGE

    const getLastMessage = async(receiverUidLM = '') => {

      
        
        let lastMessageSender;
        let lastMessageReceiver;
        const receiverRefForPath = activeChatState.uid.length != 0? activeChatState.uid :  receiverUidLM;

        const lastMessageSenderRef = collection(FirebaseDB, `users/${senderUid}/chats/${senderUid}_${receiverRefForPath}/messages`);

        const lastMessageReceiverRef = collection(FirebaseDB, `users/${receiverRefForPath}/chats/${receiverRefForPath}_${senderUid}/messages`);
        
        



        const querySender = query(lastMessageSenderRef, orderBy('message.timestamp', 'desc'), limit(1));
        const queryReceiver = query(lastMessageReceiverRef, orderBy('message.timestamp', 'desc'), limit(1));

        const lastMessageSenderSnap = await getDocs(querySender);
        const lastMessageReceiverSnap = await getDocs(queryReceiver);

       

        if(!lastMessageSenderSnap.empty){
           lastMessageSender = {
                content: lastMessageSenderSnap.docs[0].data().message.content,
                sender: lastMessageSenderSnap.docs[0].data().sender.id,
           };


        } else {
            lastMessageSender = {
                content: 'No messages yet',
                sender: 'nobody',
            }
        };


        if(!lastMessageReceiverSnap.empty){
            lastMessageReceiver = {
                content: lastMessageReceiverSnap.docs[0].data().message.content,
                sender: lastMessageReceiverSnap.docs[0].data().sender.id,
           };

      
        } else {
            lastMessageReceiver = {
                content: 'No messages yet',
                sender: 'nobody',
            }
        };

    

        return {
            lastMessageSender,
            lastMessageReceiver,
        }



    };


    const updateLastMessage = async() => {
        try {
            const senderChatRef = collection(FirebaseDB, `users/${senderUid}/chats`);

            
            
            
            const senderChatSnap = await getDocs(senderChatRef);
            
            

            if(!senderChatSnap.empty){
                senderChatSnap.docs.forEach(async(doc) => {




                    try {
                        let lastMessage = '';
 


                        lastMessage = (await getLastMessage(doc.data().receiver.id)).lastMessageSender;

     

                        
                        if(lastMessage != undefined){
                            await updateDoc(doc.ref, {
                                lastMessage,
                            })
                        };


                        const receiverChatRef = collection(FirebaseDB, `users/${doc.data().receiver.id}/chats`);
                        
                        const receiverChatSnap = await getDocs(receiverChatRef);

                        if(!receiverChatSnap.empty){
                            
                            receiverChatSnap.docs.forEach(async(doc) => {

                                lastMessage = (await getLastMessage(doc.data().sender.id)).lastMessageReceiver;

                                if(lastMessage != undefined){
                                    await updateDoc(doc.ref, {
                                        lastMessage,
                                    })
                                };

                            })
                        }



                        
                    } catch (error) {
                        console.log('Error updating last message', error);
                    }
                })
                
            };

            
            
        } catch (error) {
            console.log('Error updating last message', error);   
        }

    };
    


    
    // CREATE NEW CHAT
    
    const createNewChatDB = async(userActive) => {

        const lastMessage = {
            content:'No messages yet', 
            sender: 'nobody',
        };
        

        const chatIDSender = `${senderUid}_${userActive.uid}`;
        const chatIDReceiver = `${userActive.uid}_${senderUid}`;
        
        const senderRef = doc(collection(FirebaseDB, `users/${senderUid}/chats`), chatIDSender );
        
        const receiverRef = doc(collection(FirebaseDB, `users/${userActive.uid}/chats`), chatIDReceiver );

        const contactExistsInContactsReciever = doc(collection(FirebaseDB, `users/${userActive.uid}/contacts${senderUid}`));



        const contactExistsInContactsRecieverSnap = await getDoc(contactExistsInContactsReciever);

        const obtainNickname = () => {
            if(contactExistsInContactsRecieverSnap.exists()){
                return contactExistsInContactsRecieverSnap.data().nickname;
            } else {
                return senderDisplayName;
            }
        }

        const nicknameSender = obtainNickname();



        const chatDataSender = {
            lastMessage,
            sender: {
                id: senderUid,
                displayName: senderDisplayName,
                nickname: nicknameSender,
                email: senderEmail,
            },
            receiver: {
                id: userActive.uid,
                displayName: userActive.displayName,
                nickname: userActive.nickname,
                email: userActive.email,
            },
        };

        const chatDataReceiver = {
            lastMessage,
            sender: {
                id: userActive.uid,
                displayName: userActive.displayName,
                nickname: userActive.nickname,
                email: userActive.email,
                
            },
            receiver: {
                id: senderUid,
                displayName: senderDisplayName,
                nickname: nicknameSender,
                email: senderEmail,
            },
        };


        const chatValidationSender = doc(collection(FirebaseDB, `users/${senderUid}/chats`), `${senderUid}_${userActive.uid}`);

        const chatValidationReceiver = doc(collection(FirebaseDB, `users/${userActive.uid}/chats`), `${userActive.uid}_${senderUid}`);

        const senderDocSnap = await getDoc(chatValidationSender);
        const receiverDocSnap = await getDoc(chatValidationReceiver);
        


        
        if(senderDocSnap.exists() && receiverDocSnap.exists()){
            return;
        } else if(senderDocSnap.exists() && !receiverDocSnap.exists()){
            await setDoc(receiverRef, chatDataReceiver);
            return;
        } else if(!senderDocSnap.exists() && receiverDocSnap.exists()){
            await setDoc(senderRef, chatDataSender);
            return;
        }
        
        
        

        dispatch(setChats([...(activeChatState.chats ?? []), chatDataSender]));
        await setDoc(senderRef, chatDataSender);
        await setDoc(receiverRef, chatDataReceiver);

    }

    // CREATE MESSAGE
     
    const createMessage = async(message) => {
        
        const senderMessage = doc(collection(FirebaseDB, `users/${senderUid}/chats/${senderUid}_${activeChatState.uid}/messages`));
        const receiverMessage = doc(collection(FirebaseDB, `users/${activeChatState.uid}/chats/${activeChatState.uid}_${senderUid}/messages`));


        const date = new Date();

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const dateSerialized = `${hours}:${minutes}`;


        const messageData = {
            sender: {
                id: senderUid,
                displayName: senderDisplayName,
                email: senderEmail,
            },
            receiver: {
                id: activeChatState.uid,
                displayName: activeChatState.displayName,
                email: activeChatState.email,
            },
            message: {
                content: message,
                timestampSerialized: dateSerialized,
                timestamp: date,
            }
        };

        setMessageSending(true);


        await createNewChatDB(activeChatState);

        await setDoc(senderMessage, messageData);
        await setDoc(receiverMessage, messageData);

        setMessageSending(false);
    };










    // USEEFFECTS





    // OBTAIN CHATS

    useEffect(() => {

       
        const unsubscribeChats = getChatsDB();


        return () => {
            unsubscribeChats();
        }

        

    }, [senderUid]);

    // OBTAIN MESSAGES
    useEffect(() => {
        
        const unsubscribe = getMessagesDB();

        return () => {
            unsubscribe();
        }
        
    }, [senderUid, activeChatState.uid]);




    // OBTAIN LAST MESSAGE
    useEffect(() => {
      
        const obtainLastMessage = async() => {
            await updateLastMessage();
        };

        obtainLastMessage();

    }, [activeChatState.messages.length]);
    


    // OBTAIN NICKNAMES

    useEffect(() => {
        
        const unsubscribeContacts = getContacts();

        

        const updateNicknames = async() => {
            await updateChatsNicknames();
        };

        updateNicknames();

        return () => {
            unsubscribeContacts();
        }

    }, [contacts.length, senderUid])





    return {
        ...activeChatState,
        onSetActiveChat,
        createNewChatDB,
        createMessage,
        getChatsDB,
        getMessagesDB,
        clearMessages,
        messageSending
    }

}