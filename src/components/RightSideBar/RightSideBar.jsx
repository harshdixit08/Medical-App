import React, { useEffect, useState } from "react";
import "./RightSideBar.css";
import assets from "../../assets/assets";
import {  LogoutUser } from "../../config/firebase";
import { appContext } from "../../context/AppContext";
import { useContext } from "react";


const RightSideBar = () =>{

    const {chatUser,messages}=useContext(appContext)

    // let tim=chatUser?.userDatas.lastseen
    // let t = new Date(tim).toLocaleString()

    // console.log(Date.now() - chatUser?.userDatas.lastseen)

    const[msgImages,SetMsgImages]=useState([])

    useEffect(()=>{
        let tempData = []
        messages?.map((msg)=>{
            if(msg.image){

                tempData.push(msg.image)
            }
        })
        // console.log(tempData)
        SetMsgImages(tempData)
    },[messages])

        

    return chatUser?(
        
        <div className="rightside">
            <div className="right-profile">
            <img className="dp" onClick={()=>window.open(chatUser.userDatas.avatar)} src={chatUser.userDatas.avatar?chatUser.userDatas.avatar:assets.avatar_icon} alt="" width={200}/>
            <h3>{chatUser.userDatas.name} {Date.now() - chatUser.userDatas.lastseen <= 70000 ? <img src={assets.green_dot} alt="" className="grn-dot" />:<img src={assets.grey_dot} alt="" className="grn-dot" />}</h3>
            <p className="abt-para">{chatUser.userDatas.bio}</p>            
            </div> 
        <hr width={260}/>
        <div className="right-media">
            <p>Media</p>
            {/* <div> */}
            <div className="right-sub">
            {msgImages?.map((ms,index)=>(

                <img className="imgs" onClick={()=>window.open(ms)} key={index} src={ms} alt="" />
    )      
)}
                </div>
        {/* </div> */}
        </div>
        <button onClick={()=>LogoutUser()} className="logout-btn">LogOut</button>
        </div>
        
    )
    :<div className="rightside">
        <button onClick={()=>LogoutUser()} className="logout-btn">LogOut</button>
    </div>
}
export default RightSideBar;
{/* {msgImages?.map((url,index)=>(<img className="imgs" key={index} src={url} alt="" />))} */}