import React, {useEffect, useState} from 'react';
import styles from './sidebar.module.scss'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "../../../firebaseconfig";
import {Avatar} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {signOut, User} from "@firebase/auth";
import ChatItem from "../ChatItem/ChatItem";
import {useRouter} from "next/router";
import {useCollection} from "react-firebase-hooks/firestore";
import {addDoc, collection} from "@firebase/firestore";
import {getChat, getOtherEmail, getUserByEmail} from "../../utils";
import {Chat} from "../../types/chat-type";
import SearchResults from "../SearchResults/SearchResults";


const Sidebar = () => {
    const [input, setInput] = useState('')
    const [chat, setChat] = useState({} as Chat)
    const [notFound, setNotFound] = useState(false)
    const [foundContact, setFoundContact] = useState({} as User)
    const [snapshot] = useCollection(collection(firestore,'chats'))
    const chats = snapshot?.docs.map(doc => ({id: doc.id, ...doc.data()})) as Chat[]
    const [user] = useAuthState(auth)
    const router = useRouter()


    const logout = async () => {
        await signOut(auth)
        await router.push('/')
    }

    const clearResult = () => {
        setInput('')
        setFoundContact({} as User)
        setNotFound(false)
        setChat({} as Chat)
    }

    useEffect(() => {
        if(Object.keys(foundContact).length > 0){
            setChat({} as Chat)
            const chat = getChat(chats, foundContact?.email!, user?.email!)
            if(chat){
                setChat(chat)
            }
        }
    }, [foundContact])

    const addContact = async (email: string) => {
        await addDoc(collection(firestore, 'chats'), {users: [user?.email, email]})
        clearResult()
    }

    const searchContacts = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setNotFound(false)
        setFoundContact({} as User)
        if(input === user?.email!){
            setNotFound(true)
            return
        }
        const foundUser = await getUserByEmail(input)
        if(foundUser){
            setFoundContact(foundUser)
        }else{
            setNotFound(true)
        }
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.top}>
                <div className={styles.userActions}>
                    <div className={styles.userInfo}>
                        <Avatar sx={{width: 60, height: 60}} alt={user?.email!} src={user?.photoURL!} />
                        <div className={styles.userCredentials}>
                            <span>{user?.displayName}</span>
                            <span>{user?.email}</span>
                        </div>
                    </div>
                </div>
                <div onClick={logout} className={styles.logoutBtnResponsive}>
                    Log Out
                </div>
                <div className={styles.searchInput}>
                    <form onSubmit={searchContacts}>
                        <button type={'submit'}>
                            <SearchIcon className={styles.searchIcon}/>
                        </button>
                        <input
                            value={input}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                            placeholder={'Search or start new chat'}
                            className={styles.input}
                            type="text"
                        />
                    </form>
                </div>
            </div>
            <div className={styles.bottom}>
                <SearchResults
                    foundContact={foundContact}
                    notFound={notFound}
                    chat={chat}
                    clearResult={clearResult}
                    addContact={addContact}
                    user={user!}
                />
                <h2 className={styles.chatsTitle}>Chats</h2>
                <div className={styles.chatList}>
                    {chats
                        ?.filter(chat => chat?.users?.includes(user?.email!))
                        .sort((a,b) => new Date(b?.latestMessage?.timestamp?.seconds * 1000).getTime()
                            - new Date(a?.latestMessage?.timestamp?.seconds * 1000).getTime() || Object.keys(b).length - Object.keys(a).length)
                        .map(chat => <ChatItem chatId={chat.id} key={chat.id} email={getOtherEmail(chat.users, user!)[0]}/>)}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;