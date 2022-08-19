import React, {FC, useEffect, useState} from 'react';
import styles from './chatitem.module.scss'
import {User} from "@firebase/auth";
import {Avatar} from "@mui/material";
import {useRouter} from "next/router";
import {getUserByEmail} from "../../utils";
import {collection, orderBy, query} from "@firebase/firestore";
import {firestore} from "../../../firebaseconfig";
import {useCollectionData} from "react-firebase-hooks/firestore";
import moment from 'moment'

interface ChatItemProps{
    email: string;
    chatId: string;
}


const ChatItem: FC<ChatItemProps> = ({email, chatId}) => {
    const [user, setUser] = useState({} as User)
    const router = useRouter()
    const redirect = (id: string) => {
        console.log('chat id: ', chatId)
        router.push(`/chat/${id}`)
    }

    const q = query(collection(firestore, `chats/${chatId}/messages`), orderBy('timestamp'))
    const [messages] = useCollectionData(q)
    let date
    if(messages?.[messages.length - 1]?.timestamp){
        date = new Date(messages[messages.length - 1]?.timestamp?.seconds * 1000)
    }

    useEffect(() => {
        getUserByEmail(email).then(user => {setUser(user!); console.log('user: ', user)})
    }, [])
    return (
        user ?
        <div onClick={() => redirect(chatId)} className={styles.chatItem}>
            <div className={styles.top}>
                <div className={styles.userInfo}>
                    <Avatar sx={{width: 60, height: 60}} alt={user?.email!} src={user?.photoURL!} />
                    <div className={styles.chatInfo}>
                        <span>{user?.displayName}</span>
                        <span style={{color:  messages && messages[messages.length - 1]?.sender !== user.email ? 'gray' : 'black'}}>{messages ? messages[messages.length - 1]?.text : ''}</span>
                    </div>
                </div>
                <div className={styles.messageDate}>
                    {date && <span>{moment(date).format('ll')}</span>}
                </div>
            </div>
        </div> : null
    );
};

export default ChatItem;