import React, {FC} from 'react';
import styles from './message.module.scss'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebaseconfig";
import {Avatar} from "@mui/material";
import {MessageType} from '../../types/message-type'
import {User} from "@firebase/auth";
import moment from 'moment'

const Message: FC<{message: MessageType, contact: User}> = ({message, contact}) => {
    const [user] = useAuthState(auth)
    const sender = message.sender !== user?.email
    let date

    if(message?.timestamp){
        date = new Date(message?.timestamp?.seconds * 1000)
    }


    return (
        <div className={styles.message}>
            <div style={{float: !sender ? 'right' : 'left'}} className={styles.messageInfo}>
                {(sender && Object.keys(contact).length > 0) && <Avatar sx={{width: 40, height: 40}} alt={user?.email!} src={contact?.photoURL!} />}
                <div style={{alignItems: !sender ? 'flex-end' : 'flex-start'}} className={styles.messageWrapper}>
                    <div style={{backgroundColor: !sender ? 'rgba(211, 211, 211, 0.42)' : '#222', color: !sender ? 'black' : 'white'}} className={styles.messageText}>{message.text}</div>
                    <div className={styles.messageDate}>
                        {date && <span>{moment(date).format('l')}, {moment(date).format('LT')}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;