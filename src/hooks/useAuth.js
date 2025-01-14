import { useDispatch, useSelector } from "react-redux"
import { loginWithEmailAndPassword, registerWithEmailAndPassword } from "../firebase/providers";
import {FirebaseDB} from '../firebase/config';
import { checkingCredentials, login, logout, setActiveChat, setContacts, setError } from "../store/slices";
import { doc, setDoc } from "firebase/firestore";


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

        console.log(res)

        dispatch(login({email, displayName, uid}));

        localStorage.setItem('userLogged', JSON.stringify({email, displayName, uid}))
    };




    const onLogoutUser = () => {
        dispatch(logout());
        localStorage.removeItem('userLogged');
        dispatch(setActiveChat({
            nickname: '',
            email: '',
            displayName: '',
            id: '',
            uid: '',
            messages: [],
            chats: [],
        }));
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
    }


   

    
    


    return {
        ...authState,
        onRegisterNewUser,
        onLoginUser,
        onLogoutUser,
        validateLogged,
        cleanError,
    }


}