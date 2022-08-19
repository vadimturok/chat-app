import React, {useEffect, useState} from 'react';
import styles from './layout.module.scss'
import Sidebar from "../Sidebar/Sidebar";
import {useRouter} from "next/router";

const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [width, setWidth] = useState<number>(window.innerWidth);
    const [show, setShow] = useState(false)
    const router = useRouter()
    const {id} = router.query


    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    useEffect(() => {
       if(id){
           setShow(true)
       } else{
           setShow(false)
       }
    }, [id])

    const isMobile = width <= 420;
    const isMiddle = width <= 1020;
    return (
        isMobile ?
            <div className={styles.mobileLayout}>
                <div style={{display: show ? 'none' : 'block'}} className={styles.mobileSidebar}>
                    <Sidebar/>
                </div>
                <main style={{display: show ? 'block' : 'none'}} className={styles.mobileMain}>{children}</main>
            </div>
            :
        <div className={styles.layout}>
            <div style={{display: show && isMiddle ? 'none' : 'block'}} className={styles.sidebar}>
                <Sidebar/>
            </div>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
};

export default Layout;