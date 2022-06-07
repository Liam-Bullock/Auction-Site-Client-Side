import React from "react";

import {
    Avatar, Card, CardContent, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Grid, Typography,
    Alert, AlertTitle, CardMedia, CardActions, Button
} from '@mui/material'


import * as auctionApi from "../API/auctionApi";
import defaultImage from "../images/default-picture.png";
import {Category} from "@mui/icons-material";
import {useUserStore} from "../store";

interface IUserProps {
    auction: Auction,
    categories: Category[]
    actionable: boolean
}

interface Category {
    categoryId: number,
    name:string
}
const AuctionListObject = (props: IUserProps) => {
    const [auction] = React.useState<Auction>(props.auction)
    const [category] = React.useState<Array<Category>>(props.categories)
    const [categoriesFiltered, setCategoriesFiltered] = React.useState<Category>({categoryId:-1, name:""})
    const [reserveAuc, setReserveAuc] = React.useState("")
    const [highestBidAuc, setHighestBidAuc] = React.useState("")
    const [days, setDays] = React.useState("")
    const localUser = useUserStore (state => state.user)
    const [open, setOpen] = React.useState(false);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [numBids, setNumBids] = React.useState(0)

    const handleClickOpenDelete = () => {
        setOpen(true);
    };

    const handleCloseDelete = () => {
        setOpen(false);
    };


    React.useEffect(() => {
        setCategoriesFiltered(props.categories.filter(category => category.categoryId === auction.categoryId)[0])
        reserveMet()
        highestBid()
        daysTillClose()
        auctionApi.getBids(auction.auctionId).then((response) => {
            setNumBids(response.data.length)
        })

    }, [])


    const reserveMet = () => {
        if (auction.highestBid >= auction.reserve) {
            setReserveAuc("Reserve Met: $")
        } else {
            setReserveAuc("Reserve not Met: $")
        }
    }
    const highestBid = () => {
        if (auction.highestBid) {
            setHighestBidAuc("Highest bid: $")
        } else {
            setHighestBidAuc("No Bids!")
        }
    }


    const daysTillClose = () => {
        let today = new Date()
        const aucEndDate = new Date(auction.endDate.toString())
        const date1 = Date.UTC(aucEndDate.getFullYear(), aucEndDate.getMonth(), aucEndDate.getDate())
        const date2 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
        const calc = 1000 * 60 * 60 * 24
        const daysLeft = Math.floor((date1-date2) / calc)
        if (daysLeft >= 0) {
            setDays(`${daysLeft} days until auction closes`)
        } else {
            setDays(`Auction Closed`)
        }
    }

    const deleteAuction = () => {
        console.log(numBids)
        if (numBids > 0) {
            setErrorFlag(true)
            setErrorMessage("Error: Cannot delete an Auction after a bid has been placed")

        }
        if (!errorFlag){
            auctionApi.deleteAuction(auction.auctionId, localUser.authToken).then((response) => {
                if (response.status === 200) {
                    setErrorFlag(false)
                    setErrorMessage("")
                    window.location.reload()
                }
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
                return
            })

        }
        handleCloseDelete()


    }


    const editAuction = () => {
        if (numBids > 0) {
            setErrorFlag(true)
            setErrorMessage("Error: Cannot Edit an Auction after a bid has been placed!")
        } else {
            window.location.href = `/auctions-edit/${auction.auctionId}`
        }
    }



    return (
        <Grid item key={auction.auctionId} xs={12} sm={8} md={4}>
            <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                <CardContent sx={{backgroundColor:'#2196F3'}} >{categoriesFiltered.name}</CardContent>
                {errorFlag?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    :""}
                <CardMedia
                    component="img"
                    sx={{
                        // 16:9
                        // pt: '56.25%',
                        height:"300px"
                    }}
                    image={`http://localhost:4941/api/v1/auctions/${auction.auctionId}/image`}
                    alt="Auction Image"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <div>
                        <Typography gutterBottom variant="h5" component="h2">
                            {auction.title}
                        </Typography>

                        <Typography>{reserveAuc}{auction.reserve}</Typography>
                        <Typography>{highestBidAuc}{auction.highestBid}</Typography>
                        <Typography>{days}</Typography>
                        <Typography>
                            {auction.sellerFirstName} {auction.sellerLastName}
                        </Typography>
                        <Avatar src={`http://localhost:4941/api/v1/users/${auction.sellerId}/image`}/>
                    </div>
                </CardContent>
                <CardActions>
                    <div style={!props.actionable?{display:''}:{display:'none'}}>
                    <Button size="small" onClick={() => window.location.href = `/auctions/${auction.auctionId}`}>View</Button>
                    </div>
                    <div style={!props.actionable?{display:'none'}:{display:''}}>
                        <Button size="small" onClick={() => window.location.href = `/auctions/${auction.auctionId}`}>View</Button>
                        <Button size="small" onClick={editAuction}>Edit</Button>
                        <Button size="small" onClick={handleClickOpenDelete}>Delete</Button>
                    </div>
                </CardActions>
            </Card>
            <Dialog
                open={open}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this auction?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Cancel</Button>
                    <Button onClick={deleteAuction} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
export default AuctionListObject