import React, {FC} from 'react';
import styles from './searchresults.module.scss'
import ChatItem from "../ChatItem/ChatItem";
import {getOtherEmail} from "../../utils";
import {Avatar} from "@mui/material";
import {User} from "@firebase/auth";
import {Chat} from "../../types/chat-type";

interface SearchResultsProps{
    foundContact: User;
    notFound: boolean;
    chat: Chat;
    clearResult: () => void;
    addContact: (email: string) => void;
    user: User
}

const SearchResults: FC<SearchResultsProps> = ({foundContact, notFound, chat, clearResult, addContact, user}) => {
    return (
        <div className={styles.foundContact}>
            {(Object.keys(foundContact).length > 0 || notFound || Object.keys(foundContact).length > 0) && <button onClick={clearResult} className={styles.clearContactBtn}>Clear</button>}
            {Object.keys(foundContact).length > 0 &&
                <>
                    {Object.keys(chat).length > 0 ?
                        <>
                            <h2 className={styles.searchResultTitle}>Result:</h2>
                            <ChatItem chatId={chat.id} key={chat.id} email={getOtherEmail(chat.users, user!)[0]}/>
                        </>
                        :
                        <>
                            <h2 className={styles.searchResultTitle}>Result:</h2>
                            <div className={styles.contactUser}>
                                <div className={styles.contactInfo}>
                                    <Avatar sx={{width: 60, height: 60}} alt={foundContact?.email!} src={foundContact?.photoURL!} />
                                    <span>{foundContact.displayName}</span>
                                </div>
                                <div className={styles.contactActions}>
                                    <button onClick={() => addContact(foundContact?.email!)} className={styles.addContactBtn}>Add to contacts</button>
                                </div>
                            </div>
                        </>
                    }
                </>
            }
            {notFound && <><h2 className={styles.searchResultTitle}>Result:</h2><div className={styles.notFound}>User not found</div></>}
        </div>
    );
};

export default SearchResults;