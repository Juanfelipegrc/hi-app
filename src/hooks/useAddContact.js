import { addDoc, collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore"
import { FirebaseDB } from "../firebase/config"
import { useAuth } from "./useAuth"
import { setChats, setContacts } from "../store/slices";
import { useDispatch } from "react-redux";


export const useAddContact = () => {
  
    const authState = useAuth();
    const dispatch = useDispatch();
    const {uid, email:actualUserEmail} = authState;

    const onAddContact = async(email, name) => {
        
        try {
            const userRef = collection(FirebaseDB, 'users');
            const q = query(userRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if(email === actualUserEmail) {
                return {
                    ok: false,
                    msg: "You can't add yourself",
                }
            } else {


                if(!querySnapshot.empty) {
                    const userData = querySnapshot.docs.map(doc => ({
                        uid: doc.id,
                        nickname: name,
                        ...doc.data()
                    }));
    
    
                    const currentUserRef = doc(FirebaseDB, 'users', uid);
                    
                    const contactsRef = collection(currentUserRef, 'contacts');
    
                   const q = query(contactsRef, where('email', '==', email));
                   
                   const querySnapshotContacts = await getDocs(q);
    
                   if(querySnapshotContacts.empty) {
    
                        const newContactUid = userData[0].uid;
                        const newContactRef = doc(contactsRef, newContactUid);
    
                        await setDoc(newContactRef, {
                            ...userData[0]
                        });
                   } else {
                        return {
                            ok: false,
                            msg: 'User is already added',
                        }
                   }
    
                    return {
                        ok: true,
                        msg: `User ${name} created correctly`,
                    }
    
                } else {
                    return {
                        ok: false,
                        msg: "User don't exist",
                    }
                }


            }

            
            
        } catch (error) {
            console.error(error)
        }

    };


    const onSetContacts = (contacts) => {
        dispatch(setContacts(contacts));
    }


    

    return {
        onAddContact,
       onSetContacts,
    }
}
