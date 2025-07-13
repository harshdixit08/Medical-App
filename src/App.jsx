import React, { useContext, useEffect, useState } from "react";
import { Route, Router, Routes, useLocation, useNavigate } from "react-router-dom";
import Chat from "./pages/Chat/Chat";
import Login from "./pages/Login/Login";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
import { ToastContainer, toast } from 'react-toastify';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import NotFound from "./notFound";
import { appContext } from "./context/AppContext";
function App() {

    const navigate = useNavigate()

    const {loadUserData} = useContext(appContext)

    useEffect(()=>{
        onAuthStateChanged(auth, async(user)=>{
            // console.log(auth,"====+> this is Auth")
            // console.log("app page id",user.uid) // same Id
            if(user){
                navigate('/chat')
                loadUserData(user.uid)
                // console.log(usr,"---+>This is user")
            }else{
                navigate('/')
            }
        })
    },[])
    

    return(
        <>
        <ToastContainer/>
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/chat" element={<Chat/>}/>
            <Route path="/profile" element={<ProfileUpdate/>}/>
           <Route path="/*" element={<NotFound/>}/>
        </Routes>
        </>
    )
}
export default App;