import React from "react";
import Register from "./components/registration/Register";
import Login from "./components/registration/Login";
import {Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import FavoriteList from "./components/favoriteList/FavoriteList";
import {AuthProvider} from "./components/context/AuthProvider";
import OrdersList from "./components/OrdersList/OrdersList";
import TempOrder from "./components/OrdersList/tempOrder/TempOrder";
import ClosedOrders from "./components/OrdersList/closedOrders/ClosedOrders";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App(){
    return(
        <>
            <AuthProvider>
                <Navbar />
                <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<Register />} />
            <Route path="/favoriteList" element={<FavoriteList />} />
            <Route path="/OrdersList" element={<OrdersList />} />
            <Route path="/tempOrder" element={<TempOrder />} />
            <Route path="/closedOrders" element={<ClosedOrders />} />
          </Routes>
          <ToastContainer />
        </div>

                
            </AuthProvider>
        </>
    )
}

export default App;