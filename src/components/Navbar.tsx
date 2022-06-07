import {AppBar, Box, Button, IconButton, Menu, MenuItem, MenuList, Toolbar, Typography, Avatar} from "@mui/material";
import React from "react";
import {useUserStore} from "../store";
import * as userApi from "../API/userApi";
import {useNavigate} from "react-router-dom";
import defaultImage from "../images/default-picture.png";
import * as userImageApi from "../API/userImageAPi";





function Navbar() {
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const user = useUserStore (state => state.user)
    const logoutUser = useUserStore (state => state.removeUser)
    let loggedUser = JSON.parse(localStorage.getItem("user") as string)
    const [objectURL, setObjectURL] = React.useState("")



    const navigate = useNavigate()

    React.useEffect( () => {
        loggedUser = JSON.parse(localStorage.getItem("user") as string)
        if (loggedUser !== null) {
            getImage()
        }
    }, [])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };




    const logoutFunc = () => {
        userApi.Logout(user.authToken).then((response) => {
            if (response.status === 200) {
                setErrorFlag(false)
                setErrorMessage("")
                logoutUser()
                navigate("/login")
            }
        }, (error) => {
            console.log("error")
            setErrorFlag(true)
            setErrorMessage("Error Logging out")
        })
    }

    const getImage = () => {
        userImageApi.getImageUser(loggedUser.userId).then((response) => {
            if (response.status === 200) {
                setObjectURL(URL.createObjectURL(response.data))
            }
        }, (error) => {
            if (error.response.status === 404) {
                setErrorFlag(false)
                setErrorMessage("Image is not correct file type")
            }
        })
    }

    return (
        <div className="App">
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static" style={{background: '#2F8F9D'}}>
                    <Toolbar>
                        <Typography variant="h4" m={2}>
                            SENG365 Auction
                        </Typography>
                        <Button variant="contained"
                                onClick={() => window.location.href = '/'}
                        >Auctions
                        </Button>
                        <Button variant="contained" style={loggedUser===null || (loggedUser.token===""&& loggedUser.userId===-1)?{display:'none'}:{display:'', marginLeft:"10px"}}
                                onClick={() => window.location.href = '/my-auctions'}
                        >My Auctions
                        </Button>
                        <Box sx={{flexGrow: 1}}/>
                        <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                                <Avatar alt="User Picture" src={objectURL===""?defaultImage:objectURL} onClick={handleMenu} />
                        </Box>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}

                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >

                            <div>
                                <MenuList style={loggedUser===null || (loggedUser.token===""&& loggedUser.userId===-1)?{display:''}:{display:'none'}}>
                                    <MenuItem
                                    onClick={() => window.location.href = '/login'}>Login</MenuItem>
                                    <MenuItem
                                        onClick={() => window.location.href = '/register'}>Register</MenuItem>
                                </MenuList>
                                <MenuList style={loggedUser===null || (loggedUser.token===""&& loggedUser.userId===-1)?{display:'none'}:{display:''}}>
                                    <MenuItem
                                        onClick={() => window.location.href = '/profile'}>Profile</MenuItem>
                                    <MenuItem
                                        onClick={logoutFunc}>Logout</MenuItem>
                                </MenuList>

                            </div>
                        </Menu>
                    </Toolbar>
                </AppBar>

            </Box>
        </div>

    );
}
export default Navbar;