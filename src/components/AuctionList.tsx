import * as React from 'react';
import {
    TextField, FormControl, InputLabel, MenuItem, Select, useTheme, Pagination, Autocomplete,
    CssBaseline, Grid, Box, Typography, Container, ThemeProvider
} from "@mui/material";

import * as auctionApi from '../API/auctionApi'
import AuctionListObject from "./AuctionListObject";
import Auction from "./Auction"
import Navbar from "./Navbar";


const AuctionList = () => {
    const [auctions, setAuctions] = React.useState<Array<Auction>>([])
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [sortByUser, setSortByUser] = React.useState('Reverse chronologically by closing date')
    const [statusUser, setStatusUser] = React.useState('Any')
    const [q, setQ] = React.useState("")
    const [itemCount, setItemCount] = React.useState(0)
    const [current, setCurrent] = React.useState(1)
    const [categoryArray, setCategoryArray] = React.useState<Array<Category>>([]);


    const theme = useTheme();



    React.useEffect(() => {

        getCategory()
    }, [])


    React.useEffect( () => {
        filterOptions()
    }, [q, sortByUser, categoryArray, statusUser])

    const sortBy = [
        'Ascending by alphabetically',
        'Descending by alphabetically',
        'Ascending by current bid',
        'Descending by current bid',
        'Ascending by reserve price',
        'Descending by reserve price',
        'Chronologically by closing date',
        'Reverse chronologically by closing date',
    ];

    const status = [
        'Any',
        'Open',
        'Closed'
    ];


    React.useEffect( () => {
        filterOptionsPagination()
    }, [current])


    const filterOptionsPagination = () => {

        const start = (current -1) * 6

        let baseQuery = '?count=6&startIndex='+start



        const sort = "&sortBy="

        if (sortByUser === "Reverse chronologically by closing date") {
            baseQuery += sort + "CLOSING_SOON"
        } else if (sortByUser === "Ascending by alphabetically") {
            baseQuery += sort + "ALPHABETICAL_ASC"
        } else if (sortByUser === "Descending by alphabetically") {
            baseQuery += sort + "ALPHABETICAL_DESC"
        } else if (sortByUser === "Ascending by current bid") {
            baseQuery += sort + "BIDS_ASC"
        } else if (sortByUser === "Descending by current bid") {
            baseQuery += sort + "BIDS_DESC"
        } else if (sortByUser === "Ascending by reserve price") {
            baseQuery += sort + "RESERVE_ASC"
        } else if (sortByUser === "Descending by reserve price") {
            baseQuery += sort + "RESERVE_DESC"
        } else if (sortByUser === "Chronologically by closing date") {
            baseQuery += sort + "CLOSING_LAST"
        }


        if (q !== ""){
            baseQuery += '&q='+q
        }


        if (categoryArray.length > 0) {
            for (let i = 0; i < categoryArray.length; i++) {
                baseQuery += "&categoryIds="+categoryArray[i].categoryId
            }
        }



        const status = '&status='

        if (statusUser === "Any") {
            baseQuery += status + "ANY"
        } else if (statusUser === "Open") {
            baseQuery += status + "OPEN"
        } else if (statusUser === "Closed") {
            baseQuery += status + "CLOSED"
        }




        auctionApi.filterAuctionSearch(baseQuery).then((response) => {
            setAuctions(response.data.auctions)
            setItemCount(response.data.count)

        })


    }



    const filterOptions = () => {


        let baseQuery = '?count=6&startIndex=0'



        const sort = "&sortBy="

        if (sortByUser === "Reverse chronologically by closing date") {
            baseQuery += sort + "CLOSING_SOON"
        } else if (sortByUser === "Ascending by alphabetically") {
            baseQuery += sort + "ALPHABETICAL_ASC"
        } else if (sortByUser === "Descending by alphabetically") {
            baseQuery += sort + "ALPHABETICAL_DESC"
        } else if (sortByUser === "Ascending by current bid") {
            baseQuery += sort + "BIDS_ASC"
        } else if (sortByUser === "Descending by current bid") {
            baseQuery += sort + "BIDS_DESC"
        } else if (sortByUser === "Ascending by reserve price") {
            baseQuery += sort + "RESERVE_ASC"
        } else if (sortByUser === "Descending by reserve price") {
            baseQuery += sort + "RESERVE_DESC"
        } else if (sortByUser === "Chronologically by closing date") {
            baseQuery += sort + "CLOSING_LAST"
        }


        if (q !== ""){
            baseQuery += '&q='+q
        }


        if (categoryArray.length > 0) {
            for (let i = 0; i < categoryArray.length; i++) {
                baseQuery += "&categoryIds="+categoryArray[i].categoryId
            }
        }


        const status = '&status='

        if (statusUser === "Any") {
            baseQuery += status + "ANY"
        } else if (statusUser === "Open") {
            baseQuery += status + "OPEN"
        } else if (statusUser === "Closed") {
            baseQuery += status + "CLOSED"
        }



        auctionApi.filterAuctionSearch(baseQuery).then((response) => {
            setAuctions(response.data.auctions)
            setItemCount(response.data.count)
        })


    }


    const getCategory = () => {
        auctionApi.getCategory().then((response) => {
            setCategories(response.data)
        })
    }




    return (
        <ThemeProvider theme={theme}>
            <Navbar/>
            <CssBaseline />
            <main>
                <Box
                    sx={{
                        bgcolor: "#B3E8E5",
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="lg">
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                            sx={{backgroundColor:"#B3E8E5"}}
                        >
                            Auctions
                        </Typography>

                        <form id={"Search-form"}>
                            <TextField
                                id="search-bar"
                                className="text"
                                sx={{backgroundColor:"white"}}
                                onChange={(event) => setQ(event.target.value)}
                                label="Search Auctions"
                                variant="outlined"
                                placeholder="Search..."
                                size="medium"
                                fullWidth
                            />
                        </form>
                        <div>
                                <Autocomplete
                                    multiple
                                    id="tags-outlined"
                                    options={categories}
                                    getOptionLabel={(chosen) => chosen.name}
                                    filterSelectedOptions
                                    style = {{backgroundColor: "white"}}
                                    fullWidth
                                    onChange={(event, value) => setCategoryArray(value)}
                                    isOptionEqualToValue={(chosen, value) => chosen.categoryId === value.categoryId}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Filter by Categories"
                                            placeholder="Category"
                                        />
                                    )}
                                />
                            <Box sx={{ minWidth: 120, pt:2, pb:2 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={sortByUser}
                                        label="Sort By"
                                        sx={{backgroundColor:"white"}}
                                    >
                                        {sortBy.map((name, index) => (
                                            <MenuItem key={index} value={name} onClick={() => setSortByUser(name)}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Auction Status</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={statusUser}
                                    label="Auction Status"
                                    sx={{backgroundColor:"white"}}
                                >
                                    {status.map((name, index) => (
                                        <MenuItem key={index} value={name} onClick={() => setStatusUser(name)}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </Container>
                </Box>
                <Container sx={{ py: 2 }} maxWidth="lg">
                    <Grid container spacing={4}>
                        {auctions.map((auction) => (
                            <AuctionListObject key={auction.auctionId} auction={auction} categories={categories} actionable={false}/>
                        ))}
                    </Grid>
                </Container>
            </main>
                <div style={{alignContent:"center", alignItems:"center", margin:10}}>
                <Pagination count={(Math.ceil(itemCount / 6))} page={current} color="primary" onChange={(event:any, value:any) => setCurrent(value)}/>
                </div>
        </ThemeProvider>
    )
}
export default AuctionList;