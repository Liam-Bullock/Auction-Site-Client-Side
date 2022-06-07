type Auction = {
    auctionId: number,
    title: string,
    description: string
    categoryId: number,
    sellerId: number,
    reserve: number,
    endDate: string,
    imageFilename?: string,
    sellerFirstName: string,
    sellerLastName: string,
    highestBid: number,
    numBids: number,
}
type Category = {
    categoryId: number,
    name: string
}

type Bid = {
    bidderId: number,
    amount: number,
    firstName: string
    lastName: string,
    timestamp: string
}

type AuctionPost = {
    title: string,
    categoryId: number,
    sellerId: number,
    reserve: number,
    endDate: string,
    description: string
}