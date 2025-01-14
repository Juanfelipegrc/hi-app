import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "firebase/auth";
import { FirebaseAuth } from "./config";
  


export const registerWithEmailAndPassword = async(email, displayName, password) => {
    try {
        const res = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
        const {uid, photoURL} = res.user;

        await updateProfile(FirebaseAuth.currentUser, {displayName})
        return {
            ok: true,
            displayName,
            email,
            photoURL,
            uid,
        }
    } catch (error) {
        return{
            ok: false,
            msg: 'User already exists',
        }
    }
};


export const loginWithEmailAndPassword = async(email, password) => {

    try {
        const res = await signInWithEmailAndPassword(FirebaseAuth, email, password);


        const {uid, photoURL, displayName} = res.user;

        return {
            ok: true,
            displayName,
            uid,
            photoURL
        }
    } catch (error) {
        return {
            ok: false,
            msg: "User doesn't exist"
        }
    }

};


