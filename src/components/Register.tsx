import React from 'react';
import {
    TextField, Box, Button, ThemeProvider, Container,
    CssBaseline, Avatar, Typography, Grid, Link, createTheme,
    Paper, IconButton,
    Alert, AlertTitle
} from '@mui/material';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import * as userApi from '../API/userApi'
import * as imageUser from '../API/userImageAPi'
import {useUserStore} from '../store';
import {useNavigate} from "react-router-dom";
import Navbar from "./Navbar";

import defaultImage from "../images/default-picture.png";


const Register = () => {
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [image, setImage] = React.useState("")
    const [objectURL, setObjectURL] = React.useState("")
    const addUserToStore = useUserStore (state => state.setUser)
    const localUser = useUserStore (state => state.user)

    const navigate = useNavigate()

    const handleCapture = ({ target }: any) => {
        setObjectURL(URL.createObjectURL(target.files[0]))
        setImage(target.files[0]);
    };


    interface State {
        password: string;
        showPassword: boolean;
    }


    const [values, setValues] = React.useState<State>({
        password: '',
        showPassword: false,
    });

    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({...values, [prop]: event.target.value});
        };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };


    const emailValidation = () => {
        const re = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,25}(.[a-z{1,25}])?/g;
        let emailValid = true
        if (!email.match(re)) {
            emailValid = false
        }
        return emailValid
    }


    const registerUser = () => {
        const emailValidity = emailValidation()
        if (!firstName){
            setErrorFlag(true)
            setErrorMessage("First Name field is required")
            return
        }
        else if (!lastName){
            setErrorFlag(true)
            setErrorMessage("Last Name field is required")
            return
        }
        else if (!email){
            setErrorFlag(true)
            setErrorMessage("Email field is required")
            return
        }
        else if (!emailValidity){
            setErrorFlag(true)
            setErrorMessage("Email must contain '@' and a top-level domain")
            return
        }
        else if (values.password.length < 6) {
            setErrorFlag(true)
            setErrorMessage("Password must be at least 6 characters long")
            return
        }
        const user = {"firstName": firstName, "lastName": lastName, "email": email, "password": values.password}

        userApi.Register(user).then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            if (response.status === 201) {
                userApi.Login(user).then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    const userNew: loggedUser = {"userId": response.data.userId, "authToken": response.data.token}
                    addUserToStore(userNew)
                    if (image !== "") {
                        imageUser.putImageUser(response.data.userId, response.data.token, image).then((response) => {
                            setErrorFlag(false)
                            setErrorMessage("")
                            console.log("Picture Uploaded")
                        }, (error) => {
                            setErrorFlag(true)
                            setErrorMessage(error.response.statusText)
                            return
                        })

                    }
                    navigate('/')
                    window.location.reload()


                }, (error) => {
                    setErrorFlag(true)
                })
            }
        }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.response.statusText)
            return

        })



    }



    React.useEffect(() => {
        if (localUser !== null) {
            navigate('/')
            return
        }

    }, [])


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
                    <Avatar sx={{ m: 1, bgcolor: 'blue' }}>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box>
                        <img src={objectURL === "" ? defaultImage : objectURL} alt={"User Photo"} width={180}/>
                    </Box>
                    <Box component="form" noValidate  sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    onChange={(event) => setFirstName(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    onChange={(event) => setLastName(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    className="inputLog"
                                    label="Password"
                                    required
                                    id="outlined-adornment-password"
                                    name="password"
                                    type={values.showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    onChange={handleChange('password')}
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
                                <label htmlFor="contained-button-file">
                                    <input accept=".png, .jpg, .jpeg, .gif" id="contained-button-file" hidden multiple type="file" onChange={handleCapture} />
                                    <Button variant="contained" component="span" sx={{p:2}}>
                                        Upload
                                    </Button>
                                </label>
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={registerUser}
                        >
                            Register
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="http://localhost:8000/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
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
export default Register;