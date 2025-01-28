import { useNavigate } from "react-router-dom";
import { FirebaseDB } from "../firebase/config";
import { collection, setDoc, doc, getDoc, getDocs, query, orderBy, onSnapshot, updateDoc, limit} from "firebase/firestore";
import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";
import { useAddContact } from "./useAddContact";


export const useActiveChat = () => {

    const [activeChatState, setActiveChatState] = useState({
        nickname: '',
        email: '',
        displayName: '',
        id: '',
        uid: '',
        messages: [],
        chats: [],
        messageState: '',
    })
    const [messageSending, setMessageSending] = useState(false);
    const navigate = useNavigate();
    const {displayName: senderDisplayName, email: senderEmail, uid: senderUid, contacts} = useAuth();
    const {onSetContacts} = useAddContact();

    
        // ON SET ACTIVE CHAT
    
    const onSetActiveChat = (payload) => {

        const LCStorage = JSON.parse(localStorage.getItem('activeChat'));


        if(LCStorage){
            setActiveChatState(LCStorage);
            return;
        }

        const newState ={
            ...activeChatState,
            ...payload,
        };

        setActiveChatState(newState);

        localStorage.setItem('activeChat', JSON.stringify(newState));

        navigate(`/chat/${payload.nickname}`);
    };

    const cleanActiveChat = () => {
        setActiveChatState({
            nickname: '',
            email: '',
            displayName: '',
            id: '',
            uid: '',
            messages: [],
            chats: [],
            messageState: '',
        });

        localStorage.removeItem('activeChat');
    }



    const setMessages = (payload) => {
        setActiveChatState((prevState) => ({
            ...prevState,
            messages: payload,
        }));
    };

    const setChats = (payload) => {
        setActiveChatState((prevState) => ({
            ...prevState,
            chats: payload,
        }));
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

            
            setMessages(messages);

            
            
            
        });

        return unsuscribe;

    };



    // GET CHATS



    const getChatsDB = () => {

        
        const chatRef = collection(FirebaseDB, `users/${senderUid}/chats`);

        
        const unsubscribe = onSnapshot(chatRef, (snapshot) => {
        
                const chats = snapshot.docs.map((doc) => {
                    
                    
                    const {receiver, lastMessage} = doc.data();


                        return {
                            id: doc.id,
                            lastMessage,
                            ...receiver,
                   };


        
                });

            

                setChats(chats);
                

        
        });

        return unsubscribe;
        
    };


    // CLEAR MESSAGES

    const clearMessages = () => {
        setMessages([]);
    }
    
    // 
    
    
    
    // SET LAST MESSAGE

    const getLastMessage = async() => {

      
        
        let lastMessageSender;
        let lastMessageReceiver;

        if(activeChatState.uid.length === 0) return;

        const receiverRefForPath = activeChatState.uid;

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
                    lastMessage: lastMessageSender,
                });
                
            }
        }

        if(!lastMessageReceiverSnap.empty){
            if(lastMessageReceiver != undefined){
                await updateDoc(chatReceiverRef, {
                    lastMessage: lastMessageReceiver,
                })
            }
        }



    };


    const monitoringLatestMessages = () => {
      

            const senderChatRef = collection(FirebaseDB, `users/${senderUid}/chats`);

            const unsubscribe = onSnapshot(senderChatRef, (snapshot) => {
                snapshot.docChanges().forEach(async(change) => {
                    if(change.type === 'modified' || change.type === 'removed') {

                        const messageRef = collection(FirebaseDB, `${change.doc.ref.path}/messages`);

                        const queryMessageRef = query(messageRef, orderBy('message.timestamp', 'desc'), limit(1));
                        
                        onSnapshot(queryMessageRef, async(messageSnapshot) => {

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

                        

                            
                }});
            });
            
            
            return unsubscribe;

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
        
        
        

        setChats([...(activeChatState.chats ?? []), chatDataSender]);
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



    // CLEAN ACTIVE CHAT
    
    useEffect(() => {

      const LCStorage = JSON.parse(localStorage.getItem('activeChat'));


        if(LCStorage && LCStorage.uid != activeChatState.uid){
            setActiveChatState(LCStorage);
        }
    }, [activeChatState.uid]);

    



    // OBTAIN CHATS
    

    useEffect(() => {

        if(senderUid.length === 0) return;
       
        const unsubscribeChats = getChatsDB();


        return () => {
            unsubscribeChats();
        }

        

    }, [senderUid]);

    // OBTAIN MESSAGES
    useEffect(() => {

        if(senderUid.length === 0) return;

        
        const unsubscribe = getMessagesDB();

        return () => {
            unsubscribe();
        }
        
    }, [senderUid, activeChatState.uid]);




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

    }, [senderUid, activeChatState.uid, activeChatState.messages.length]);
    


    // OBTAIN NICKNAMES

    useEffect(() => {

        if(senderUid.length === 0) return;
        
        const unsubscribeContacts = getContacts();

        

        const updateNicknames = async() => {
            await updateChatsNicknames();
        };

        updateNicknames();

        return () => {
            unsubscribeContacts();
        }

    }, [senderUid])





    return {
        ...activeChatState,
        onSetActiveChat,
        createNewChatDB,
        createMessage,
        getChatsDB,
        getMessagesDB,
        clearMessages,
        messageSending,
        cleanActiveChat,
    }

}