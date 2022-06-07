import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ProfileShow from "./components/ProfileShow";
import Profile from "./components/Profile";
import AuctionList from "./components/AuctionList";
import Auction from "./components/Auction"
import MyAuction from "./components/MyAuction"
import EditAuction from "./components/EditAuction"
import CreateAuction from "./components/CreateAuction";





function App() {

    return (

        <Router>
            <div id={"HomePage"}>
                <Routes>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/" element={<AuctionList/>}/>
                    <Route path="/profile" element={<ProfileShow/>}/>
                    <Route path="/profile-edit" element={<Profile/>}/>
                    <Route path="/auctions/:id" element={<Auction/>}/>
                    <Route path="/my-auctions" element={<MyAuction/>}/>
                    <Route path="/auctions-edit/:id" element={<EditAuction/>}/>
                    <Route path="/auctions-create/" element={<CreateAuction/>}/>
                </Routes>
            </div>
        </Router>
    );
}
export default App;
