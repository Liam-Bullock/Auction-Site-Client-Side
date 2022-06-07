import axios from "axios";


const getAuctions = async (): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.get(URL+ 'auctions')
}

const getCategory = async (): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.get(URL+ 'auctions/'+ 'categories')
}

const getAuction = async (auction_id: number): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.get(URL+ 'auctions/'+auction_id)
}

const getBids = async (auction_id: number): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.get(URL+ 'auctions/'+auction_id+'/bids')
}

const placeBid = async (auction_id: number, token:string, amount:number): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.post(URL+ 'auctions/'+auction_id+'/bids', {amount}, {headers: {'X-Authorization': token}})
}


const getAuctionsUser = async (sellId:number): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.get(URL+ 'auctions?&sellerId='+sellId)
}

const getAuctionsUserBid = async (bidderId:number): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.get(URL+ 'auctions?bidderId='+bidderId)
}



const deleteAuction = async (auction_id:number, token:string): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.delete(URL+ 'auctions/'+auction_id, {headers:{'X-Authorization': token}})
}

const createAuction = async (auction: AuctionPost, token:string): Promise<any> => {
    if (auction.reserve === 0){
        auction.reserve = 1
    }
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.post(URL+ 'auctions', {"title":auction.title, "categoryId":auction.categoryId, "sellerId":auction.sellerId, "reserve":auction.reserve, "endDate":auction.endDate, "description":auction.description}, {headers:{'X-Authorization': token}})
}

const editAuction = async (auction_id: number, token:any, auction:AuctionPost): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.patch(URL+'auctions/'+auction_id, auction, {headers: {'X-Authorization': token}})

}


const filterAuctionSearch = async (params:string): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.get(URL+ 'auctions' + params)
}



export {getAuctions, getCategory, getAuction, getBids, placeBid,
        getAuctionsUser, deleteAuction, getAuctionsUserBid, createAuction, editAuction, filterAuctionSearch}