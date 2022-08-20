import {addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, Timestamp, where} from "@firebase/firestore";
import {firestore} from "../../firebaseconfig";
import {User} from "@firebase/auth";
import {Chat} from "../types/chat-type";
import {MessageType} from "../types/message-type";
import {useCollection} from "react-firebase-hooks/firestore";

export const getUserByEmail = async (email: string) => {
    try{
        const q = query(
            collection(firestore, 'users'),
            where('email', '==', email)
        )
        const docs = await getDocs(q)
        const user = docs.docs.map(doc => ({...doc.data()}))[0]
        return user as User
    }catch(e){
        console.log('Error fetching user: ', e)
    }
}

export const getOtherEmail = (users: string[], user: User) => {
    return users?.filter(u => u !== user.email)
}

export const getChat = (chats: Chat[], contactEmail: string, userEmail: string) => {
    const chat = chats.find(chat => chat.users.includes(contactEmail) && chat.users.includes(userEmail))
    return chat
}

export const getNewJoke = async () => {
    try{
        const response = await fetch('https://api.chucknorris.io/jokes/random')
        const data = await response.json()
        return data
    }catch(e){
        console.log('Error fetching joke', e)
    }
}

export const seedInitialData = async (user: User) => {
    await addDoc(collection(firestore, 'chats'), {users: [user.email, 'alice@gmail.com']})
    await addDoc(collection(firestore, 'chats'), {users: [user.email, 'lewis@gmail.com']})
    await addDoc(collection(firestore, 'chats'), {users: [user.email, 'alex@gmail.com']})
    const q = query(
        collection(firestore, 'chats'),
        where('users', '==', [user.email, 'alice@gmail.com'])
    )
    const chats = await getDocs(q)
    const chat: Chat = chats.docs.map(doc => ({id: doc.id, ...doc.data()}))[0] as Chat
    const userMessage: MessageType = {
        text: "Hey, what's up?)",
        sender: user?.email!,
        timestamp: serverTimestamp() as Timestamp
    }
    const contactMessage: MessageType = {
        text: "All good, what's new?",
        sender: 'alice@gmail.com',
        timestamp: serverTimestamp() as Timestamp
    }
    await addDoc(collection(firestore, `chats/${chat.id}/messages`), userMessage)
    await addDoc(collection(firestore, `chats/${chat.id}/messages`), contactMessage)
    await setLastMessage(contactMessage, chat, chat.id)
}

export const setLastMessage = async (message: MessageType, chat: Chat, chatId: string) => {
    const docRef = doc(firestore, `chats/${chatId}`)
    const newData = {
        users: chat.users,
        latestMessage: message
    }
    await setDoc(docRef, newData)
}