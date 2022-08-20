import React, {useEffect, useRef, useState} from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from '../../styles/Chat.module.scss'
import {Avatar} from "@mui/material";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "../../../firebaseconfig";
import SendIcon from '@mui/icons-material/Send';
import Message from "../../components/Message/Message";
import {useRouter} from "next/router";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {addDoc, collection, doc, orderBy, query, serverTimestamp, setDoc, Timestamp} from "@firebase/firestore";
import {MessageType} from '../../types/message-type'
import {User} from "@firebase/auth";
import {getNewJoke, getOtherEmail, getUserByEmail, setLastMessage} from "../../utils";
import {Chat} from "../../types/chat-type";
import SideMenu from "../../components/SideMenu/SideMenu";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';


const Chat = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const bottomOfChat = useRef(null)
    const [input, setInput] = useState('')
    const [contact, setContact] = useState({} as User)
    const [user] = useAuthState(auth)
    const router = useRouter()
    const {id} = router.query

    const q = query(collection(firestore, `chats/${id}/messages`), orderBy('timestamp'))
    const [messages] = useCollectionData(q)
    const chat: Chat = useDocumentData(doc(firestore, `chats/${id}`))[0] as Chat
    const contactEmail = getOtherEmail(chat?.users, user!)


    useEffect(() => {
        if(contactEmail){
            getUserByEmail(contactEmail[0]).then(user => setContact(user!))
        }
    }, [id, chat])

    useEffect(() => {
        // @ts-ignore
        setTimeout(bottomOfChat?.current?.scrollIntoView({behavior: 'smooth', block: 'start'}), 100)
    }, [messages])


    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(input.length <= 0){
            return;
        }
        const newMessage: MessageType = {
            text: input,
            sender: user?.email!,
            timestamp: serverTimestamp() as Timestamp
        }
        await addDoc(collection(firestore, `chats/${id}/messages`), newMessage)
        await setLastMessage(newMessage, chat, id?.toString()!)
        setInput('')
        setTimeout(async () => {
            const jokeData = await getNewJoke();
            const responseMessage: MessageType = {
                text: jokeData.value,
                sender: contactEmail[0],
                timestamp: serverTimestamp() as Timestamp
            }
            await addDoc(collection(firestore, `chats/${id}/messages`), responseMessage)
            await setLastMessage(responseMessage, chat, id?.toString()!)
        }, 10000)
    }


    return (
        <div className={styles.chatPage}>
            <SideMenu setIsOpen={setMenuOpen} isOpen={menuOpen}/>
            <div className={styles.chat}>
                <div className={styles.top}>
                    <div className={styles.contactInfo}>
                        <Avatar sx={{width: 60, height: 60}} alt={user?.email!} src={contact?.photoURL!} />
                        <span>{contact?.displayName}</span>
                    </div>
                    <div className={styles.menuIcon}>
                        <QuestionAnswerIcon onClick={() => setMenuOpen(true)} className={styles.chatIcon}/>
                    </div>
                </div>
                <div className={styles.middle}>
                    {messages && messages.map((message, i) => <Message key={i} contact={contact} message={message as MessageType}/>)}
                    <div ref={bottomOfChat}/>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.searchInput}>
                        <form onSubmit={sendMessage}>
                            <input value={input} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} placeholder={'Type your message'} className={styles.input} type="text"/>
                            <button type={'submit'}><SendIcon type={''} className={styles.sendIcon}/></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;