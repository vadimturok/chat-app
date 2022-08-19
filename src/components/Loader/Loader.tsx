import React from 'react';
import styles from './loader.module.scss'
import {CircularProgress} from "@mui/material";

const Loader = () => {
    return (
        <div className={styles.loader}>
            <CircularProgress />
        </div>
    );
};

export default Loader;