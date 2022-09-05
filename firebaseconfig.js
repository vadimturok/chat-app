import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: process.env.F_API_KEY,
    authDomain: process.env.F_AUTH_DOMAIN,
    projectId: process.env.F_PROJECT_ID,
    storageBucket: process.env.F_STORAGE_BUCKET,
    messagingSenderId: process.env.F_MESSAGING_SENDER_ID,
    appId: process.env.F_APP_ID
};


const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const firestore = getFirestore(app)

export {auth, firestore}