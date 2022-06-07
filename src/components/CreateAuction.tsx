import * as React from 'react';
import Navbar from "./Navbar";
import {
    Button, CardMedia, CardActions, TextField, FormControl, InputLabel, MenuItem,
    Select, SelectChangeEvent, Card, Alert, AlertTitle, CardContent
} from "@mui/material";

import defaultImage from "../images/default-picture-auction.png"
import * as auctionApi from "../API/auctionApi";
import * as auctionImageApi from "../API/auctionImageApi";
import {useUserStore} from "../store";
import {useNavigate} from "react-router-dom";

const CreateAuction = () => {
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [reservePrice, setReservePrice] = React.useState(1)
    const [image, setImage] = React.useState("")
    const [objectURL, setObjectURL] = React.useState("")
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [date, setDate] = React.useState("")
    const localUser = useUserStore (state => state.user)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")


    const [categoryId, setCategoryId] = React.useState('');

    const navigate = useNavigate()

    React.useEffect(() => {
        auctionApi.getCategory().then((response) => {
            console.log(response.data)
            setCategories(response.data)
        })
    }, [])

    const handleCapture = ({ target }: any) => {
        setObjectURL(URL.createObjectURL(target.files[0]))
        setImage(target.files[0]);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setCategoryId(event.target.value as string);
    };


    const addAuction = () => {

        const currentDate = new Date()
        const resultDate = new Date(date)


        if (!title) {
            setErrorFlag(true)
            setErrorMessage("Error: Must include title")
            return
        } else if (!categoryId) {
            setErrorFlag(true)
            setErrorMessage("Error: Must include category")
            return
        } else if (!date) {
            setErrorFlag(true)
            setErrorMessage("Error: Must include date")
            return
        } else if (!description) {
            setErrorFlag(true)
            setErrorMessage("Error: Must include description")
            return
        } else if (!image) {
            setErrorFlag(true)
            setErrorMessage("Error: Must upload image with Auction")
            return
        } else if (reservePrice === 0) {
            setReservePrice(1)
        } else if (currentDate > resultDate) {
            setErrorFlag(true)
            setErrorMessage("Error: Date must be in the future")
        }

        const auct = {"title":title, "categoryId":parseInt(categoryId, 10), "sellerId":localUser.userId,
            "reserve":reservePrice, "endDate":date, "description":description}
        console.log(auct)
        auctionApi.createAuction(auct, localUser.authToken).then((response) => {
            auctionImageApi.putAuctionImage(response.data.auctionId, image, localUser.authToken).then((response) => {
                console.log(response.data)
                setErrorFlag(false)
                setErrorMessage("")
                navigate('/my-auctions')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
                return
            })

        })




    }


    return (
        <div id={"Profile-page"}>
            <Navbar/>
            <Card sx={{ maxWidth: 550}} id="User-Profile">
                    <CardMedia
                        component="img"
                        height="350"
                        image={objectURL===""?defaultImage:objectURL}
                    />
                    <CardContent>
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            required
                            sx={{pb:2}}
                            label="Title"
                            variant="outlined"
                            onChange={(event) => setTitle(event.target.value)}/>
                        <FormControl fullWidth sx={{pb:2}}>
                            <InputLabel id="demo-simple-select-label" >Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                required
                                value={categoryId}
                                label="Category"
                                onChange={handleChange}
                            >
                                {categories.map(({categoryId, name}) => (
                                    <MenuItem key={categoryId} value={categoryId}>
                                        {name}
                                    </MenuItem>
                                    ))}
                            </Select>
                            <TextField
                                id="outlined-basic"
                                fullWidth
                                required
                                sx={{pt:2}}
                                variant="outlined"
                                type={"datetime-local"}
                                onChange={(event) => setDate(event.target.value)}/>
                        </FormControl>
                        <TextField id="outlined-basic"
                                   fullWidth
                                   required
                                   sx={{pb:2}}
                                   label="Description"
                                   variant="outlined"
                                   multiline
                                   onChange={(event) => setDescription(event.target.value)}/>
                        <TextField id="outlined-number"
                                   fullWidth
                                   label="Reserve Price (Min $1)"
                                   type="number"
                                   required
                                   sx={{pb:2}}
                                   InputProps={{
                                       inputProps: {min: 1}
                                   }}
                                   onChange={(event) => setReservePrice(parseInt(event.target.value))}/>
                        <label htmlFor="contained-button-file" >
                            <input accept="image/*" hidden id="contained-button-file" multiple type="file" onChange={handleCapture} />
                            <Button variant="contained" component="span" >
                                Upload Image
                            </Button>
                        </label>
                    </CardContent>
                <Button variant="contained" fullWidth component="span" onClick={addAuction}>
                    Create Auction
                </Button>
                <CardActions>
                </CardActions>
                {errorFlag?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    :""}
            </Card>
        </div>

    )
}
export default CreateAuction;