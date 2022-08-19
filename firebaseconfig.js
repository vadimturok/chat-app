import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBR-Mjx8WqWFrP9Ea0YQf292yRA0yDSe80",
    authDomain: "chat-application-deaf3.firebaseapp.com",
    projectId: "chat-application-deaf3",
    storageBucket: "chat-application-deaf3.appspot.com",
    messagingSenderId: "884701103260",
    appId: "1:884701103260:web:a11b50e42a4018d72c1959"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const firestore = getFirestore(app)

export {auth, firestore}