import { useNavigate } from "react-router-dom";
import { FirebaseDB } from "../firebase/config";
import { collection, setDoc, doc, getDoc, getDocs, query, orderBy, onSnapshot, updateDoc, limit} from "firebase/firestore";
import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";


export const useActiveChat = () => {

    const [activeChatState, setActiveChatState] = useState({
        nickname: '',
        email: '',
        displayName: '',
        id: '',
        uid: '',
        messages: [],
        messageState: '',
    })
    const [messageSending, setMessageSending] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const {displayName: senderDisplayName, email: senderEmail, uid: senderUid, contacts} = useAuth();
    

    
        // ON SET ACTIVE CHAT
    
    const onSetActiveChat = async(payload) => {
        
        
        if(!payload.uid) return;

        const messagesRef = collection(FirebaseDB, `users/${senderUid}/chats/${senderUid}_${payload.uid}/messages`);

        const q = query(messagesRef, orderBy('message.timestamp', 'asc'));

        const messages = await getDocs(q);
        
        let messagesData = [];

        if(!messages.empty){
            messagesData = messages.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            })
        };

        const newState = {
            nickname: payload.nickname || '',
            email: payload.email || '',
            displayName: payload.displayName || '',
            id: payload.id || '',
            uid: payload.uid || '',
            messages: messagesData,
            messageState: '',
        };

        localStorage.setItem('activeChat', JSON.stringify(newState));

            const event = new CustomEvent('activeChatUpdate', {detail: newState});

            window.dispatchEvent(event);
            


            if(screenWidth <= 1024){
                navigate(`/chat/${payload.nickname}`);
            }


    };
    

    
 



    // CLEAN ACTIVE CHAT


    const cleanActiveChat = () => {

        const emptyChat = {
            nickname: '',
            email: '',
            displayName: '',
            id: '',
            uid: '',
            messages: [],
            messageState: '',
        }

        localStorage.setItem('activeChat', JSON.stringify(emptyChat));
        setActiveChatState(emptyChat);

        const event = new CustomEvent('activeChatUpdate', {detail: emptyChat});

        window.dispatchEvent(event);
        

        
    }


 



    



    // GET MESSAGES


    const getMessagesDB = () => {

  
            
            const messagesRef = collection(FirebaseDB, `users/${senderUid}/chats/${senderUid}_${activeChatState?.uid}/messages`);

            const q = query(messagesRef, orderBy('message.timestamp', 'asc'));
            
            const unsubscribe = onSnapshot(q, (snapshot) => {

                const messages = snapshot.docs.map(doc => {
                    return {
                        id: doc.id,
                        ...doc.data()
                    }
                });


                if(messages.length === 0) return;
               
                const prevState = JSON.parse(localStorage.getItem('activeChat'));

                if(JSON.stringify(prevState?.messages) === JSON.stringify(messages)) return;

                const newState = {
                    ...prevState,
                    messages,
                }



                localStorage.setItem('activeChat', JSON.stringify(newState));
                
                
                setTimeout(() => {
                    const event = new CustomEvent('activeChatUpdate', {detail: newState});

                    window.dispatchEvent(event);
                }, 0);
                    
                
        
                
            });

            return unsubscribe;

       

    };


    





    
    
    // SET LAST MESSAGE

    const getLastMessage = async() => {



      
        
        let lastMessageSender;
        let lastMessageReceiver;

        if(activeChatState?.uid?.length === 0) return;

        const receiverRefForPath = activeChatState?.uid;

        const lastMessageSenderRef = collection(FirebaseDB, `users/${senderUid}/chats/${senderUid}_${receiverRefForPath}/messages`);

        const chatSenderRef =  doc(FirebaseDB, `users/${senderUid}/chats/${senderUid}_${receiverRefForPath}`);

        const lastMessageReceiverRef = collection(FirebaseDB, `users/${receiverRefForPath}/chats/${receiverRefForPath}_${senderUid}/messages`);

        const chatReceiverRef = doc(FirebaseDB, `users/${receiverRefForPath}/chats/${receiverRefForPath}_${senderUid}`);
        
        



        const querySender = query(lastMessageSenderRef, orderBy('message.timestamp', 'desc'), limit(1));
        const queryReceiver = query(lastMessageReceiverRef, orderBy('message.timestamp', 'desc'), limit(1));

        const lastMessageSenderSnap = await getDocs(querySender);
        const lastMessageReceiverSnap = await getDocs(queryReceiver);

       

        if(!lastMessageSenderSnap.empty){
           lastMessageSender = {
                content: lastMessageSenderSnap.docs[0].data().message.content,
                sender: lastMessageSenderSnap.docs[0].data().sender.id,
                timestamp: lastMessageSenderSnap.docs[0].data().message.timestamp,
                timestampSerialized: lastMessageSenderSnap.docs[0].data().message.timestampSerialized,
           };


        } else {
            lastMessageSender = {
                content: 'No messages yet',
                sender: 'nobody',
                timestamp: '',
                timestampSerialized: '',
            }
        };


        if(!lastMessageReceiverSnap.empty){
            lastMessageReceiver = {
                content: lastMessageReceiverSnap.docs[0].data().message.content,
                sender: lastMessageReceiverSnap.docs[0].data().sender.id,
                timestamp: lastMessageReceiverSnap.docs[0].data().message.timestamp,
                timestampSerialized: lastMessageReceiverSnap.docs[0].data().message.timestampSerialized,
           };

      
        } else {
            lastMessageReceiver = {
                content: 'No messages yet',
                sender: 'nobody',
                timestamp: '',
                timestampSerialized: '',
            }
        };

       

        
        if(!lastMessageSenderSnap.empty){
            if(lastMessageSender != undefined){
                await updateDoc(chatSenderRef, {
                    lastMessage: {...lastMessageSender},
                });
                
            }
        }

        if(!lastMessageReceiverSnap.empty){
            if(lastMessageReceiver != undefined){
                await updateDoc(chatReceiverRef, {
                    lastMessage: {...lastMessageReceiver},
                })
            }
        }



    };








    // MONITORING LATEST MESSAGES

    const monitoringLatestMessages = () => {


            const senderChatRef = collection(FirebaseDB, `users/${senderUid}/chats`);

            let messagesUnsubscriptions = new Map();

            const unsubscribe = onSnapshot(senderChatRef, (snapshot) => {
                snapshot.docChanges().forEach(async(change) => {
  
                    if(change.type === 'modified' || change.type === 'removed') {

                        const chatPath = change.doc.ref.path;

                        const messageRef = collection(FirebaseDB, `${chatPath}/messages`);

                        const queryMessageRef = query(messageRef, orderBy('message.timestamp', 'desc'), limit(1));

                        if(messagesUnsubscriptions.has(chatPath)){
                            messagesUnsubscriptions.get(chatPath)();
                        };
                        
                        const messageUnsubscription = onSnapshot(queryMessageRef, async(messageSnapshot) => {

                            const messages = messageSnapshot.docs.map(doc => {
                                return {
                                    id: doc.id,
                                    ...doc.data(),
                                }
                            });

                            
                            if(messages.length > 0){
                                const lastMessage = messages[0].message;

                                await updateDoc(change.doc.ref, {
                                    lastMessage,
                                });
                            } else {
                                await updateDoc(change.doc.ref, {
                                    lastMessage: {
                                        content: 'No messages yet',
                                        sender: 'nobody',
                                        timestamp: '',
                                        timestampSerialized: '',
                                    }
                                });
                            }
                        });
                    
                        messagesUnsubscriptions.set(chatPath, messageUnsubscription);
                    }
            
                });
            });
            
            
            return () => {
                messagesUnsubscriptions.forEach((unsubs) => unsubs());
                unsubscribe();
            };

    };





    


    
    // CREATE NEW CHAT
    
    const createNewChatDB = async(userActive) => {

        const lastMessage = {
            content:'No messages yet', 
            sender: 'nobody',
            timestamp: '',
            timestampSerialized: '',
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


    




    // GET SAVED CONTACT (ACTIVE CHAT)
    
    useEffect(() => {

        const savedContact = JSON.parse(localStorage.getItem('activeChat'));


        if(savedContact && savedContact?.uid ){
  
            setActiveChatState(savedContact);
        };
    }, []);

    


    



    // OBTAIN MESSAGES

    useEffect(() => {

        if(!senderUid || !activeChatState?.uid ) return;


        const unsubscribe = getMessagesDB();

        


        return () => {
            unsubscribe();
        }
        
    }, [senderUid, activeChatState?.uid]);




    // MONITORING LATEST MESSAGES

    useEffect(() => {
      
        if(senderUid.length === 0) return;


        const unsubscribe = monitoringLatestMessages();


        return () => {
            unsubscribe();
        }

    }, [senderUid]);
    


    // OBTAIN LAST MESSAGE

    useEffect(() => {

        if(senderUid.length === 0) return;

        

      
        getLastMessage();

    }, [senderUid, activeChatState?.uid, activeChatState?.messages?.length]);
    

    

    // ACTIVE CHAT UPDATE BY THE LOCALSTORAGE

     useEffect(() => {
    
    
    
        const handleActiveChat = (event) => {

            const updatedChat = event.detail;

            setActiveChatState(updatedChat);
        }
           
    
           window.addEventListener('activeChatUpdate', handleActiveChat);
    
    
           return () => {
                window.removeEventListener('activeChatUpdate', handleActiveChat);    
            }
    
                
    

          
        }, []);



        useEffect(() => {
          

            const onResizeScreenWith = () => {
                setScreenWidth(window.innerWidth);   
            };
            
            window.addEventListener('resize', onResizeScreenWith);


            return () => {
                window.removeEventListener('resize', onResizeScreenWith);
            }


        }, [])
        

    





    return {
        ...activeChatState,
        onSetActiveChat,
        createNewChatDB,
        createMessage,
        getMessagesDB,
        messageSending,
        cleanActiveChat,
        screenWidth
    }

}