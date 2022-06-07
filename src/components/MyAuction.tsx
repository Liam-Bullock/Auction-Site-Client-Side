import * as React from 'react';
import {
    CssBaseline, Grid, Stack, Box, Typography, Container
} from "@mui/material";


import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as auctionApi from '../API/auctionApi'

import AuctionListObject from "./AuctionListObject";
import Auction from "./Auction"
import Navbar from "./Navbar";
import {useUserStore} from "../store";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

const MyAuction = () => {
    const [auction, setAuction] = React.useState<Auction>({auctionId: 0, categoryId: 0, description: "", endDate:"", highestBid:0, numBids:0, reserve:0, sellerFirstName:"", sellerLastName:"", title:"", sellerId:0})
    const [auctionSimilar, setAuctionSimilar] = React.useState<Auction[]>([])
    const [auctionSimilarBid, setAuctionSimilarBid] = React.useState<Auction[]>([])
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const localUser = useUserStore (state => state.user)

    const navigate = useNavigate()


    React.useEffect(() => {
        if (localUser === null) {
            navigate('/')
            return
        }

        auctionApi.getAuctions().then((response) => {
            setAuction(response.data)
            auctionApi.getAuctionsUser(localUser.userId).then((response) => {
                setAuctionSimilar(response.data.auctions)
            })
            auctionApi.getAuctionsUserBid(localUser.userId).then((response) => {
                setAuctionSimilarBid(response.data.auctions)

            })


        })
        auctionApi.getCategory().then((response) => {
            setCategories(response.data)
        })

    }, [])

    const theme = createTheme();

    const similarAuction = () => {
        console.log(auctionSimilar)

        if(auctionSimilar.length === 0){
            return (
                <div>
                    <h1 style={{color:"red", marginTop:"40px", marginLeft:"40px"}}>No Auctions Found</h1>
                </div>
            )
        } else {
            return auctionSimilar.map((item: Auction) =>
                <AuctionListObject auction={item} categories={categories} actionable={true}/>)
        }
    }

    //
    // const similarAuction = () => {
    //     return auctionSimilar.map((item: Auction) =>
    //         <AuctionListObject auction={item} categories={categories} actionable={true}/>)
    // }

    const similarAuctionBid = () => {
        if(auctionSimilarBid.length === 0){
            return (
                <div>
                    <h1 style={{color:"red", marginTop:"40px", marginLeft:"40px"}}>No Auctions Found</h1>
                </div>
            )
        } else {
            return auctionSimilarBid.map((item: Auction) =>
                <AuctionListObject auction={item} categories={categories} actionable={false}/>)
        }

    }

    return (
        <ThemeProvider theme={theme}>
            <Navbar/>
            <CssBaseline />
            <main>
                {/* Hero unit */}
                <Box
                    sx={{
                        bgcolor: "#B3E8E5",
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="lg">
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                        </Stack>
                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="md">
                    <Typography variant="h3">My Listings: <Button size="medium" sx={{backgroundColor:"green", color:"white"}} onClick={() => window.location.href = `/auctions-create/`}>Create Auction</Button></Typography>
                    <Grid container spacing={4}>
                        {similarAuction()}
                    </Grid>
                    <Typography variant="h3">Auctions I have bids on:</Typography>
                    <Grid container spacing={4}>
                        {similarAuctionBid()}
                    </Grid>
                </Container>
            </main>
        </ThemeProvider>
    )
}
export default MyAuction;