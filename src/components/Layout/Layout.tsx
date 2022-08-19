import React from 'react';
import styles from './layout.module.scss'
import Sidebar from "../Sidebar/Sidebar";

const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
    return (
        <div className={styles.layout}>
            <div className={styles.sidebar}>
                <Sidebar/>
            </div>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
};

export default Layout;