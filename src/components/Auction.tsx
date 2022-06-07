import * as React from 'react';
import Navbar from "./Navbar";
import * as auctionApi from "../API/auctionApi";

import {
    Avatar, Card, CardContent, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Grid, TextField, Typography,
    Divider, Alert, AlertTitle, CardMedia, CardActions
} from '@mui/material';
import defaultImage from "../images/default-picture.png";
import Button from "@mui/material/Button";
import AuctionListObject from "./AuctionListObject";
import {useUserStore} from "../store";
import Stack from "@mui/material/Stack";
import {useNavigate} from "react-router-dom";





const Auction = () => {
    const [auction, setAuction] = React.useState<Auction>({auctionId: 0, categoryId: 0, description: "", endDate:"", highestBid:0, numBids:0, reserve:0, sellerFirstName:"", sellerLastName:"", title:"", sellerId:0})
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [bids, setBids] = React.useState<Array<Bid>>([])
    const [numBids, setNumBids] = React.useState(0)
    const [open, setOpen] = React.useState(false);
    const [bidAmount, setBidAmount] = React.useState("");
    const localUser = useUserStore (state => state.user)
    let loggedUser = JSON.parse(localStorage.getItem("user") as string)
    const [aucId, setAucId] = React.useState(0)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [dayNum, setDayNum] = React.useState("")
    const [auctionSimilar, setAuctionSimilar] = React.useState<Auction[]>([])


    const navigate = useNavigate()

    const handleClickOpenBid = () => {
        setOpen(true);
    };

    const handleCloseBid = () => {
        setOpen(false);
    };

    React.useEffect(() => {

        const pathname = window.location.pathname
        const pathArray = pathname.split("/")
        const id = parseInt(pathArray[2])
        setAucId(id)

        auctionApi.getAuction(id).then((response) => {
            setAuction(response.data)
        }, (error) => {
            navigate('/')
        })
        auctionApi.getCategory().then((response) => {
            setCategories(response.data)
        })

        auctionApi.getBids(id).then((response) => {
            setBids(response.data)
            setNumBids(response.data.length)
        })
    }, []);



    const daysTillClose = (aucDate: string) => {
        let today = new Date()
        const aucEndDate = new Date(aucDate.toString())
        const date1 = Date.UTC(aucEndDate.getFullYear(), aucEndDate.getMonth(), aucEndDate.getDate())
        const date2 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
        const calc = 1000 * 60 * 60 * 24
        const daysLeft = Math.floor((date1 - date2) / calc)

        if (daysLeft >= 0) {
            return false
        } else {
            return true
        }
    }



    const placeAucbid = () => {


        if (parseInt(dayNum, 10) <= 0) {
            setErrorFlag(true)
            setErrorMessage("Error: Auction has already closed")
            handleCloseBid()
            return
        }
        else if (auction.sellerId === localUser.userId) {
            setErrorFlag(true)
            setErrorMessage("Error: You cannot place a bid on your own auction")
            handleCloseBid()
            return
        } else if (auction.highestBid >= parseInt(bidAmount, 10)) {
            setErrorFlag(true)
            setErrorMessage("Error: Bid must be higher than the current highest")
            handleCloseBid()
            return
        } else if ((Number(bidAmount) % 1) !== 0) {
            setErrorFlag(true)
            setErrorMessage("Error: Bid must not be fractional")
            handleCloseBid()
            return
        }

        auctionApi.placeBid(aucId, localUser.authToken, parseInt(bidAmount, 10)).then((response) => {
            if (response.status === 201) {
                handleCloseBid()
                window.location.reload()
            }
        }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.response.statusText)

        })

        handleCloseBid()
    }



    const similarAuction = () => {

        auctionApi.getAuctions().then((response) => {
            setAuctionSimilar(response.data.auctions.filter((auctiontemp1: Auction) => auctiontemp1.auctionId !== auction.auctionId
                && (auctiontemp1.sellerId === auction.sellerId || auctiontemp1.categoryId === auction.categoryId)))
        })
        if(auctionSimilar.length === 0){
            return (
                <div>
                    <h1 style={{color:"red", marginTop:"40px", marginLeft:"40px"}}>No Similar Auctions Found</h1>
                </div>
            )
        } else {
            return auctionSimilar.map((item: Auction) =>
                <AuctionListObject auction={item} categories={categories} actionable={false}/>)
        }

    }



    //     return (
    //         auctionSimilar.map((item: Auction) =>
    //             <AuctionListObject auction={item} categories={categories} actionable={false}/>))
    // }



    const categoryName = () => {
        for(let i=0; i < categories.length; i++) {
            if(categories[i].categoryId === auction.categoryId){
                return categories[i].name
            }
        }
    }


    const dateLeft = (aucDate: string) => {
        const today = new Date();
        const endDate = new Date(Date.parse(aucDate));

        if (today > endDate) {
            return <strong>Auction Closed</strong>
        } else {
            return 'Auction closes on ' + endDate.getDate() + '/' + endDate.getMonth() + '/' + endDate.getFullYear() + " at "
                + endDate.getHours() + ':' + endDate.getMinutes();
        }
    }





    return (
        <div>
            <Navbar/>
            <h1>{auction.title}</h1>
            <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12} md={8} lg={9}>
                    <Card
                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <CardMedia
                            component="img"
                            sx={{
                                // 16:9
                                // pt: '56.25%',
                                width:"40%"
                            }}
                            image={`http://localhost:4941/api/v1/auctions/${auction.auctionId}/image`}
                            alt="Auction Image"
                        />
                        <CardContent><strong>Description:</strong> {auction.description}</CardContent>
                        <CardContent><strong>Category:</strong> {categoryName()}</CardContent>
                        <CardContent><strong>Reserve:</strong> ${auction.reserve}</CardContent>
                        <div><CardContent><strong>Seller:</strong> {auction.sellerFirstName} {auction.sellerLastName}
                            <Avatar src={`http://localhost:4941/api/v1/users/${auction.sellerId}/image`} onError={defaultImage}/></CardContent> </div>
                    </Card>
                </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <Card
                            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <CardContent>{numBids} Bids</CardContent>
                {bids.map((bid) => (
                    <div>
                    <CardContent>
                        <Divider/>
                        <div id = "bidContent"><Avatar src={`http://localhost:4941/api/v1/users/${bid.bidderId}/image`}/>{bid.firstName} {bid.lastName} <strong>${bid.amount}</strong> {bid.timestamp} </div>
                    </CardContent>
                    </div>
                ))}
                            <div style={(!daysTillClose(auction.endDate))?{display:''}:{display:'none'}}>
                            <div style={loggedUser===null || (loggedUser.token===""&& loggedUser.userId===-1)?{display:'none'}:{display:''}}>
                    <TextField id="outlined-basic"
                               label="Amount"
                               variant="outlined"
                               type={"number"}
                               required
                               onChange={(event) => setBidAmount(event.target.value)} />
                    <CardActions>
                    <Button variant="contained" fullWidth onClick={handleClickOpenBid}>Bid</Button>
                    </CardActions>
                            </div>
                            </div>
                            <div style={(!daysTillClose(auction.endDate))?{display:''}:{display:'none'}}>
                            <div style={loggedUser===null || (loggedUser.token===""&& loggedUser.userId===-1)?{display:''}:{display:'none'}}>
                                <Typography>You must be logged in to place a bid!</Typography>
                                <CardActions>
                                    <Button variant="contained" fullWidth onClick={() => window.location.href = 'http://localhost:8000/login'}>Login</Button>
                                    <Button variant="contained" fullWidth onClick={() => window.location.href = 'http://localhost:8000/register'}>Register</Button>
                                </CardActions>
                            </div>
                            </div>
                            <CardContent>{dateLeft(auction.endDate)}</CardContent>

                        </Card>
                    </Grid>

                {/*</Grid>*/}
                {/* Recent Orders */}
                {errorFlag?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    :""}
                <Grid item xs={12}>
                    <Card
                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <CardContent><h3>Similar Auctions</h3></CardContent>
                        <Stack direction={"row"} spacing={5}> {similarAuction()}</Stack>
                    </Card>
                </Grid>
            </Grid>
            <Dialog
                open={open}
                onClose={handleCloseBid}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Please Confirm your bid
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You are about to place a bid of <strong>${bidAmount}</strong>
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBid}>Cancel</Button>
                    <Button onClick={placeAucbid} autoFocus>
                        Place Bid
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}
export default Auction;