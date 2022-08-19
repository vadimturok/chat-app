import React, {FC} from 'react';
import styles from './sidemenu.module.scss'
import {Box, Drawer, SwipeableDrawer} from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";

const SideMenu: FC<{isOpen: boolean, setIsOpen: (isOpen: boolean) => void}> = ({isOpen, setIsOpen}) => {
    return (
        <SwipeableDrawer onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)} anchor={'left'} open={isOpen}>
            <Box sx={{width: 400}}>
                <Sidebar/>
            </Box>
        </SwipeableDrawer>
    );
};

export default SideMenu;