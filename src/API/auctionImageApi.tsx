import axios from "axios";

const getAuctionImage = async (auction_id: number): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.get(URL+'auctions/'+auction_id+'/image', {responseType: 'blob'})
}

const putAuctionImage = async (auction_id: number, image:any, token:string): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.put(URL+'auctions/'+auction_id+'/image', image, {headers: {'X-Authorization': token, 'Content-Type':image.type}})
}

export {getAuctionImage, putAuctionImage}