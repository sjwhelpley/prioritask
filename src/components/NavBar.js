import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import './NavBar.css';
import logo from './prioriTaskLogo.png';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
// import SearchIcon from '@material-ui/icons/Search';
// import MoreIcon from '@material-ui/icons/MoreVert';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
// import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DraftsIcon from '@material-ui/icons/Drafts';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ArchiveIcon from '@material-ui/icons/Archive';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles({
    primary: {
        backgroundColor: '#577568',
    },
});

const NavBar = (props) => {
    const classes = useStyles();
    const [state, setState] = React.useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState(open);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <AppBar className={classes.primary} position="static">
                <Toolbar>
                    <IconButton edge="start" onClick={toggleDrawer(true)} className="menuButton" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className="title">
                        {props.title}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Sort</MenuItem>
                <MenuItem onClick={handleClose}>Select tasks</MenuItem>
                <MenuItem>
                    <Checkbox
                        edge="start"
                        disableRipple
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    Hide completed tasks
                </MenuItem>
            </Menu>

            <React.Fragment key='left'>
                <SwipeableDrawer
                    anchor='left'
                    open={state}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                    PaperProps={{ style: { width: '50%', maxWidth: '400px' } }}
                >
                    <div
                        className="list"
                        role="presentation"
                        onClick={toggleDrawer(false)}
                        onKeyDown={toggleDrawer(false)}
                        style={{ width: '100%' }}
                    >
                        <div className="drawer-header">
                            <img id="logo" src={logo} alt="background" />
                        </div>
                        <List>
                            <Link className="list-link" to="/">
                                <ListItem button key='Today'>
                                    <ListItemIcon> <DraftsIcon /> </ListItemIcon>
                                    <ListItemText primary='Today' />
                                </ListItem>
                            </Link>

                            <Link className="list-link" to="/upcoming">
                                <ListItem button key='Upcoming'>
                                    <ListItemIcon> <CalendarTodayIcon /> </ListItemIcon>
                                    <ListItemText primary='Upcoming' />
                                </ListItem>
                            </Link>

                            <Link className="list-link" to="/all">
                                <ListItem button key='All Tasks'>
                                    <ListItemIcon> <ArchiveIcon /> </ListItemIcon>
                                    <ListItemText primary='All Tasks' />
                                </ListItem>
                            </Link>
                        </List>
                    </div>
                </SwipeableDrawer>
            </React.Fragment>
        </div>
    )
}
export default NavBar;