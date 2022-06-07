import React, {useEffect} from 'react';
import {
    TextField, Button, IconButton, Typography, Paper, Box, Alert,
    AlertTitle, styled, ThemeProvider, Container, CssBaseline, Grid, createTheme
} from '@mui/material';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import * as userApi from '../API/userApi'
import * as userImageApi from '../API/userImageAPi'
import {useUserStore} from "../store";
import defaultImage from "../images/default-picture.png"
import Navbar from "./Navbar";
import {useNavigate} from "react-router-dom";




const Profile = () => {
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")



    const [email, setEmail] = React.useState("")
    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [image, setImage] = React.useState("")
    const localUser = useUserStore (state => state.user)
    const [objectURL, setObjectURL] = React.useState("")

    const [currPass, setCurrPass] = React.useState("")
    const [newPass, setNewPass] = React.useState("")


    const navigate = useNavigate()
    const Input = styled('input')({
        display: 'none',
    });

    const [values, setValues] = React.useState<State>({
        password: '',
        showPassword: false,
    });
    interface State {
        password: string;
        showPassword: boolean;
    }

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const [values2, setValues2] = React.useState<State2>({
        currentPassword: '',
        showPasswordCurrent: false,
    });
    interface State2 {
        currentPassword: string;
        showPasswordCurrent: boolean;
    }


    const handleClickShowPassword2 = () => {
        setValues2({
            ...values2,
            showPasswordCurrent: !values2.showPasswordCurrent,
        });
    };

    const handleMouseDownPassword2 = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleCapture = ({ target }: any) => {
        setObjectURL(URL.createObjectURL(target.files[0]))
        setImage(target.files[0]);
    };




    const emailValidation = () => {
        const re = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,25}(.[a-z{1,25}])?/g;
        let emailValid = true
        if (!email.match(re)) {
            emailValid = false
        }
        return emailValid
    }



    React.useEffect(() => {
        if (localUser === null) {
            navigate('/')
            return
        }

        const getUser = () => {
            userApi.getUser(localUser.userId, localUser.authToken).then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setFirstName(response.data.firstName)
                setEmail(response.data.email)
                setLastName(response.data.lastName)
            })}
        getUser()
        getImage()
    }, []);


    const getImage = () => {
        userImageApi.getImageUser(localUser.userId).then((response) => {
            if (response.status === 200) {
                setObjectURL(URL.createObjectURL(response.data))
            }
        })}


    const handleDelete = () => {
        userImageApi.deleteImageUser(localUser.userId, localUser.authToken).then((response) => {
            if (response.status === 200) {
                console.log('delete image')
                console.log(response.status)
                setImage("")
                window.location.reload()
            }
        }, (error) => {
            if (error.response.status === 404) {
                setErrorFlag(true)
                setErrorMessage('Error: No Image to delete')
                return
            }

        })
    }


    const updateUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Get user values from form
        const userValues = new FormData(event.currentTarget);
        const firstName = userValues.get("firstName");
        const lastName = userValues.get("lastName");
        const email = userValues.get("email");
        const currentPass = userValues.get("currentPass");
        const newPass = userValues.get("newPass");
        const validEmail = emailValidation()

        if (firstName !== null && lastName !== null && email !== null && currentPass !== null && newPass !== null) {
            if (firstName.toString().length < 1 || firstName.toString().length > 64 || /^\s+$/.test(firstName.toString())) {
                setErrorFlag(true)
                if (/^\s+$/.test(firstName.toString())) {
                    setErrorMessage("First name must not contain any white space")
                } else {
                    setErrorMessage("First name must be between 1 - 64 characters")
                }
                return
            } else if (lastName.toString().length < 1 || lastName.toString().length > 64 || /^\s+$/.test(lastName.toString())) {
                setErrorFlag(true)
                if (/^\s+$/.test(lastName.toString())) {
                    setErrorMessage("Last name must not contain any white space")
                } else {
                    setErrorMessage("Last name must be between 1 - 64 characters")
                }
                return
            } else if (!validEmail) {
                setErrorFlag(true)
                setErrorMessage("Email must contain '@' and a top-level domain")
                return
            } else if (currentPass !== '' || newPass !== '') {
                if (currentPass === '' && newPass !== '') {
                    setErrorFlag(true)
                    setErrorMessage("Current password must not be empty")
                    return
                } else if (newPass == '' && currentPass !== '') {
                    setErrorFlag(true)
                    setErrorMessage("New password must not be empty")
                    return
                } else if (newPass.toString().length < 6 || newPass.toString().length > 256 || /^\s+$/.test(newPass.toString())) {
                    setErrorFlag(true)
                    if (/^\s+$/.test(newPass.toString())) {
                        setErrorMessage("New Password must not contain any white space")
                    } else {
                        setErrorMessage("New Password must be between 6 - 256 characters")
                    }
                    return
                } else if (currentPass.toString().length < 6 || currentPass.toString().length > 256 || /^\s+$/.test(currentPass.toString())) {
                    setErrorFlag(true)
                    if (/^\s+$/.test(currentPass.toString())) {
                        setErrorMessage("Current Password must not contain any white space")
                    } else {
                        setErrorMessage("Current Password must be between 6 - 256 length")
                    }
                    return
                }
            }
        }


        if (image !== "") {
            userImageApi.putImageUser(localUser.userId, localUser.authToken, image).then((response) => {
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText)
                    return
                }
            )
        }

        userApi.editUser(localUser.userId, localUser.authToken, firstName, lastName, email, currentPass, newPass).then((response) => {
            if (response.status === 200) {
                setErrorFlag(false)
                navigate('/profile')
            }
        }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.response.statusText)
            return
        })

        setErrorFlag(false)

    };


    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Navbar/>
            <Container component="main" maxWidth="xs">
                <Paper sx={{pb:2, pl:2, pr:2}}>
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Edit Profile
                        </Typography>

                        <Box>
                            <img src={objectURL === "" ? defaultImage : objectURL} alt={"User Photo"} width={180}/>
                        </Box>
                        <Box component="form" onSubmit={updateUser} noValidate  sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        value={firstName}
                                        focused
                                        autoFocus
                                        onChange={(event) => setFirstName(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        value={lastName}
                                        label="Last Name"
                                        name="lastName"
                                        focused
                                        autoComplete="family-name"
                                        onChange={(event) => setLastName(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        value={email}
                                        label="Email Address"
                                        name="email"
                                        focused
                                        autoComplete="email"
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                        <TextField
                                            className="inputLog"
                                            label="New Password"
                                            required
                                            id="newPass"
                                            name="newPass"
                                            type={values.showPassword? 'text' : 'password'}
                                            value={newPass}
                                            onChange={event => setNewPass(event.target.value)}
                                            fullWidth
                                            InputProps={{ endAdornment: (
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {values.showPassword ? <Visibility/> : <VisibilityOff/>}
                                                    </IconButton>
                                                )}}

                                        />
                                        <TextField
                                            className="inputLog"
                                            label="Current Password"
                                            required
                                            id="currentPass"
                                            name="currentPass"
                                            sx={{mt:2}}
                                            type={values2.showPasswordCurrent? 'text' : 'password'}
                                            value={currPass}
                                            onChange={event => setCurrPass(event.target.value)}
                                            fullWidth
                                            InputProps={{ endAdornment: (
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword2}
                                                        onMouseDown={handleMouseDownPassword2}
                                                    >

                                                        {values2.showPasswordCurrent ? <Visibility/> : <VisibilityOff/>}
                                                    </IconButton>
                                                )}}

                                        />
                                    <label htmlFor="contained-button-file">
                                        <input accept=".png, .jpg, .jpeg, .gif" id="contained-button-file" hidden multiple type="file" onChange={handleCapture} />
                                        <Button variant="contained" component="span" sx={{mr:2, mt:2}}>
                                            Upload Image
                                        </Button>
                                    </label>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        onClick={handleDelete}
                                        sx={{backgroundColor:"red", mt:2}}
                                    >
                                        Delete Image
                                    </Button>

                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                type="submit"
                            >
                                Update User
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
            {errorFlag?
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
                :""}
        </ThemeProvider>
    );
}
export default Profile;
