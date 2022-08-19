import {collection, getDocs, query, where} from "@firebase/firestore";
import {firestore} from "../../firebaseconfig";
import {User} from "@firebase/auth";
import {Chat} from "../types/chat-type";

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
    console.log('chat: ', chat)
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