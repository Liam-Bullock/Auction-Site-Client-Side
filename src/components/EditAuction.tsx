import * as React from 'react';
import Navbar from "./Navbar";
import {
    Alert, AlertTitle, Button, CardActions, FormControl,
    InputLabel, MenuItem, Select, SelectChangeEvent,
    TextField, CardMedia, CardContent, Card
} from "@mui/material";

import defaultImage from "../images/default-picture-auction.png";
import * as auctionImageApi from "../API/auctionImageApi";
import * as auctionApi from "../API/auctionApi";
import {useUserStore} from "../store";
import {useNavigate} from "react-router-dom";

const EditAuction = () => {
    const [auctId, setAuctId] = React.useState(0)
    const [auction, setAuction] = React.useState<Auction>({auctionId: 0, categoryId: 0, description: "", endDate:"", highestBid:0, numBids:0, reserve:0, sellerFirstName:"", sellerLastName:"", title:"", sellerId:0})
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [reservePrice, setReservePrice] = React.useState(0)
    const [endDate, setEndDate] = React.useState("")
    const [image, setImage] = React.useState("")
    const [objectURL, setObjectURL] = React.useState("")
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [categoryId, setCategoryId] = React.useState("")
    const [auctionId, setAuctionId] = React.useState(0)

    const localUser = useUserStore (state => state.user)

    const [sellerId, setSellerId] = React.useState(localUser.userId)

    const navigate = useNavigate()


    React.useEffect(() => {
        if (localUser === null) {
            navigate('/')
        }

    }, )

    React.useEffect(() => {
        if (localUser.userId !== sellerId){
            navigate("/")
        }
    }, [sellerId])

    React.useEffect(() => {
        const pathname = window.location.pathname
        const pathArray = pathname.split("/")
        const id = parseInt(pathArray[2])
        setAuctId(id)
        auctionApi.getAuction(id).then((response) => {
            setAuctionId(response.data.auctionId)
            setAuction(response.data)
            setTitle(response.data.title)
            setDescription(response.data.description)
            setReservePrice(response.data.reserve)
            setCategoryId(response.data.categoryId)
            getDateTrim(response.data)
            setSellerId(response.data.sellerId)

        }, (error) => {
            navigate('/my-auctions')
        })

        auctionApi.getCategory().then((response) => {
            setCategories(response.data)
        })
        auctionImageApi.getAuctionImage(id).then((response) => {
            if (response.status === 200) {
                setObjectURL(URL.createObjectURL(response.data))
            }
        }, (error) => {
            if (error.response.status === 404) {
                setErrorFlag(false)
                setErrorMessage("Image is not correct file type")
            }
        })

    }, []);

    const getDateTrim = (auction: Auction) => {
        const result = auction.endDate.slice(0, 16)
        setEndDate(result)
    }

    const handleCapture = ({ target }: any) => {
        setObjectURL(URL.createObjectURL(target.files[0]))
        setImage(target.files[0]);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setCategoryId(event.target.value as string);
    };

    const editAuction = () => {

        const currentDate = new Date()
        const resultDate = new Date(endDate)


        if (title === "") {
            setErrorFlag(true)
            setErrorMessage("Error: Title cannot be empty")
            return
        } else if (description === "") {
            setErrorFlag(true)
            setErrorMessage("Error: Description cannot be empty")
            return
        } else if (reservePrice <= 0) {
            setReservePrice(1)
        } else if (currentDate > resultDate) {
            setErrorFlag(true)
            setErrorMessage("Error: Date must be in the future")
            return
        }


        const auct = {"title":title, "categoryId":parseInt(categoryId, 10), "sellerId":localUser.userId,
            "reserve": reservePrice, "endDate":endDate, "description":description}
        if (image!== "") {
            auctionImageApi.putAuctionImage(auctionId, image, localUser.authToken).then((response) => {
                console.log("Picture Uploaded")
            })
        }
        auctionApi.editAuction(auctionId, localUser.authToken, auct).then((response) => {
            if (response.status === 200) {
                console.log(response.data)
                setErrorFlag(false)
                setErrorMessage("")
                navigate('/my-auctions')
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
                <CardMedia
                    component="img"
                    height="350"
                    image={objectURL===""?defaultImage:objectURL}
                />
                <CardContent>
                    <TextField
                        id="outlined-basic"
                        fullWidth
                        sx={{pb:2}}
                        label="Title"
                        variant="outlined"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        />
                    <TextField id="outlined-basic"
                               fullWidth
                               sx={{pb:2}}
                               label="Description"
                               variant="outlined"
                               multiline
                               value={description}
                               onChange={(event) => setDescription(event.target.value)}
                    />
                    <FormControl fullWidth sx={{pb:2}}>
                        <InputLabel id="demo-simple-select-label" >Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            required
                            value={categoryId}
                            label="Age"
                            onChange={handleChange}
                        >
                            {categories.map(({categoryId, name}) => (
                                <MenuItem key={categoryId} value={categoryId}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>

                    </FormControl>
                    <TextField
                        id="outlined-basic"
                        fullWidth
                        sx={{pb:2}}
                        label="End Date"
                        variant="outlined"
                        type={"datetime-local"}
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                    />
                    <TextField id="outlined-number"
                               fullWidth
                               label="Reserve Price"
                               variant="outlined"
                               type="number"
                               sx={{pb:2}}
                               value={reservePrice}
                               InputProps={{
                                   inputProps: {min: 1}
                               }}
                               onChange={(event) => setReservePrice(parseInt(event.target.value))}
                    />
                    <label htmlFor="contained-button-file">
                        <input accept="image/*" hidden id="contained-button-file" multiple type="file" onChange={handleCapture}/>
                        <Button variant="contained" component="span" >
                            Upload Image
                        </Button>
                    </label>
                </CardContent>
                <Button variant="contained" fullWidth component="span" onClick={editAuction} >
                    Update Auction
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
export default EditAuction;