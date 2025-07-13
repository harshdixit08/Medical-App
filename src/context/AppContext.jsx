import { doc, getDoc, onSnapshot, updateDoc,getDocs } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const appContext = createContext()

const AppContextProvider = (props) => {

        const navigate = useNavigate()

    const [userData, SetUserData]=useState(null)
    // console.log("usd",userData)
    const[chatData, SetChatData]=useState(null)
    // console.log("chatData------>",chatData)
    const[messages,SetMessages]=useState(null)
    const[messagesId,SetMessagesId]=useState(null)
    const[chatUser,SetChatUser]=useState(null)
    const[chatVissible,SetChatVissible]=useState(false)
    const[chatvis,SetChatVis]=useState(true)

    // console.log(chatUser?chatUser:null,"chatUser--->")
    
    // console.log("uid---->",Uid)
    // console.log("ApContext page id",Uid) // same Id

        

    const loadUserData = async(Uid)=>{
        try {
            const userRef = doc(db,'users',Uid);
            // console.log("userRef--->",userRef)
            const userSnap = await getDoc(userRef)
            const userDetails = userSnap.data()
            // console.log(userDetails,"=====>>>>>>>>>>")
            SetUserData(userDetails)
            if (userDetails.avatar && userDetails.name) {
                navigate('/chat')
            }else{
                navigate("/profile")
                // console.log(userDetails,'()...>')
            }
            await updateDoc(userRef,{
                lastseen:Date.now()
            })
            setInterval(async()=>{
                if (auth) {
                    await updateDoc(userRef,{
                        lastseen:Date.now()
                    })      
                }
            },60000)
        } catch (error) {
            toast.error(error.message)
            console.error(error,'errr----------->')

        }
    }

    useEffect(()=>{
        if(userData){
            const chatRef = doc(db,"chats",userData.id)
            const unSub = onSnapshot(chatRef, async(res)=>{
            const chatItems = await res.data().chatData
            // console.log("chatItems----->",chatItems)
            const tempData = []
            try {
                for (let items of chatItems) {
                    const userRef =doc(db,"users",items.rId)
                    // console.log("userRef------>",userRef)
                    const userSnap = await getDoc(userRef)
                    const userDatas = userSnap.data()
                    // console.log(userDatas,"---->")
                    tempData.push({...items,userDatas})
                    
                }   
            } catch (error) {
                toast.error("Your Chats Is Not available")
                console.log(error)
            }
            SetChatData(tempData.sort((a,b)=>{b.updatedAt - a.updatedAt}))           
                console.log("tempData----->",tempData)
            })
            return ()=>{
                unSub()
            }
        }
    },[userData])
    
    const value ={
        userData,SetUserData,
        chatData,SetChatData,
        loadUserData,
        messages,SetMessages,
        messagesId,SetMessagesId,
        chatUser,SetChatUser,
        chatVissible,SetChatVissible,
        chatvis,SetChatVis
    }




  return (
   <appContext.Provider value={value}>
    {props.children}
   </appContext.Provider>
  )
}

export default AppContextProvider