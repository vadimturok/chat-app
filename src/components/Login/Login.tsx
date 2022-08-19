import React from 'react';
import styles from './login.module.scss'
import googleIcon from '../../assets/googleLogo.png'
import Image from 'next/image'
import {useSignInWithGoogle} from "react-firebase-hooks/auth";
import {auth} from '../../../firebaseconfig'


const Login = () => {
    const [signInWithGoogle] = useSignInWithGoogle(auth)

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Welcome to Chat!</h2>
            <div onClick={() => signInWithGoogle([], {prompt: 'select_account'})} className={styles.googleAuth}>
                <Image width={20} height={20}  src={googleIcon}/>
                <span>Continue with Google</span>
            </div>
            <div className={styles.chatInfo}>
                <div className={styles.searchEmails}>Find users by email to test app:</div>
                <div className={styles.emails}>turokvadim2510@gmail.com</div>
                <div className={styles.emails}>randemailtest8@gmail.com</div>
            </div>
        </div>
    );
};

export default Login;