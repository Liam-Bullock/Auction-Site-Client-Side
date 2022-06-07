import React from 'react';
import {
    TextField, Box, Button, ThemeProvider, Container,
    CssBaseline, Avatar, Typography, Grid, Link,
    createTheme, Paper, IconButton, Alert, AlertTitle
} from '@mui/material';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import * as userApi from '../API/userApi'
import {useUserStore} from "../store";
import {useNavigate} from "react-router-dom";
import Navbar from "./Navbar";


const Login = () => {
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [email, setEmail] = React.useState("")
    const addUserToStore = useUserStore (state => state.setUser)
    const localUser = useUserStore (state => state.user)

    const navigate = useNavigate()

    interface State {
        password: string;
        showPassword: boolean;
    }

    const [values, setValues] = React.useState<State>({
        password: "",
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

    React.useEffect(() => {
        if (localUser !== null) {
            navigate('/')
            return
        }

    }, [])


    const loginUser = () => {
        if (!email) {
            setErrorFlag(true)
            setErrorMessage("Email field is required")
            return
        } else if (!values.password) {
            setErrorFlag(true)
            setErrorMessage("Password field is required")
            return
        }
        const userLogin = {"email": email, "password": values.password}
        console.log(errorFlag)
        userApi.Login(userLogin).then((response) => {
            if (response.status === 200) {
                setErrorFlag(false)
                setErrorMessage("")
                const userNew: loggedUser = {"userId": response.data.userId, "authToken": response.data.token}
                addUserToStore(userNew)
                navigate("/")
                window.location.reload()
            }
        }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.response.statusText)
            return
        })

    }




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
                        Sign in
                    </Typography>

                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoFocus
                            sx ={{backgroundColor:"white"}}
                            onChange={(event) => setEmail(event.target.value)}
                        />
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
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={loginUser}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="http://localhost:8000/register" variant="body2">
                                    {"Click here to register!"}
                                </Link>
                            </Grid>
                            <Grid item>
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
export default Login;
