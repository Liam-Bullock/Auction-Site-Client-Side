import * as React from 'react';
import { Button, CardActionArea, CardActions, Card,
    CardContent, CardMedia, Typography } from '@mui/material';
import Navbar from "./Navbar";
import * as userApi from "../API/userApi";
import * as userImageApi from "../API/userImageAPi";
import {useUserStore} from "../store";
import {useNavigate} from "react-router-dom";
import defaultImage from "../images/default-picture.png";


const ProfileShow = () => {
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const localUser = useUserStore (state => state.user)
    const [email, setEmail] = React.useState("")
    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [image, setImage] = React.useState("")
    const [objectURL, setObjectURL] = React.useState("")


    const navigate = useNavigate()

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
        }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.response.statusText)
            return
        })
    }


    return (
        <div id={"Profile-page"}>
            <Navbar/>
            <Card sx={{ maxWidth: 550}} id="User-Profile">
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="350"
                        image={objectURL===""?defaultImage:objectURL}
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {firstName} {lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {email}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary" onClick={() => window.location.href = '/profile-edit'}>
                        Edit Profile
                    </Button>
                </CardActions>
            </Card>
        </div>

    );
}


export default ProfileShow;
