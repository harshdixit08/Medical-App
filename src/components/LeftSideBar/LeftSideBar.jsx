import React, { useContext, useEffect, useState } from "react";
import "./LeftSideBar.css";
import assests from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { collection, getDoc, getDocs, query, where, doc, setDoc, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";
import {  auth, db, LogoutUser } from "../../config/firebase";
import { appContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { use } from "react";

const LeftSideBar = () => {


  const navigate = useNavigate()
  const {userData,chatData,chatUser,SetChatUser,messagesId,SetMessagesId,chatVissible,SetChatVissible,SetChatVis} = useContext(appContext)
  // console.log("chatData",chatData)
  
  const [user,SetUser]=useState(null)
  // console.log('user--->',user)
  const [showSearch,SetShowSearch]=useState(false)

  const[input,SetInput]=useState("")

  // console.log(input)
  
 
  
  
  const inputHandler = async(e)=>{
    try {
      let input = e.target.value
      // console.log(input,"t")
      if (input) {
        console.log(true,"----->SetShowtrue")
        SetShowSearch(true)
        const userRef = collection(db,"users")
        const q = query(userRef,where("username","==",input.toLowerCase()))
        const querySnap = await getDocs(q)
        // console.log("querySnap----->", querySnap.docs[0].data())
        if(!querySnap.empty && querySnap.docs[0].data().id !==userData.id){
          
          let userExist = false
          chatData?.map((chatDataUsers) => {
            // console.log("chk map----->",chatDataUsers)
            if (chatDataUsers.rId == querySnap.docs[0].data().id){
              userExist = true
            }
          }) 
          console.log(userExist)
          if (!userExist) {
            SetUser(querySnap.docs[0].data())
            // console.log("work")
          }
          
          // console.log("userExits---->",userExist)
          // console.log(querySnap.docs[0].data())
        }else{
          SetUser(null)
          // console.log("winner down")
        }
      }else{
        SetShowSearch(false)
      }
    } catch (error) {
        // console.log(error)
        
        // toast.error(error.message)
      }
    }

    const addChat = async()=>{
      const messageRef = collection(db,"messages")
      const chatRef = collection(db,"chats")
      try {
        const newMessageRef = doc(messageRef)
        // console.log("newMessage------>",newMessageRef.id)
        
        await setDoc((newMessageRef),{
          createdAt:serverTimestamp(),
          messages:[]
        })
        
        await updateDoc(doc(chatRef,user.id),{
          chatData:arrayUnion({
            messageId:newMessageRef.id,
            lastMessage:"",
            messageSeen:true,
            rId:userData.id,
            updatedAt:Date.now()
          })
        })
        await updateDoc(doc(chatRef,userData.id),{
          chatData:arrayUnion({
            messageId:newMessageRef.id,
            lastMessage:"",
            messageSeen:true,
            rId:user.id,
            updatedAt:Date.now()
          })
        })

        // const uSnap = await getDoc(doc(db,"users",user.id));
        // const uData = uSnap.data()
        // console.log(uData),"Udata----->"
        // setChat({
        //   messagesId:newMessageRef.id,
        //   lastMessage:"",
        //   rId:user.id,
        //   updatedAt:Date.now(),
        //   messageSeen:true,
        //   userData:uData
        // })
        // SetShowSearch(false)

        SetInput("")
        SetShowSearch(false)
      } catch (error) {
        toast.error(error.message)
        console.log(error)
      }

      // window.location.reload()
      // navigate('/profile')
      
    }
    
    
    const setChat = async (item)=>{
      // console.log(item.rId,"onclikitms")
      SetMessagesId(item.messageId)
      SetChatUser(item)
      // console.log(item,"item")
      try {
        const userChatRef = doc(db,"chats",userData.id)
        const userChatsSnapShot = await getDoc(userChatRef)
        const userChatData = userChatsSnapShot.data()
        // console.log(userChatData)
        const chatIndex = userChatData.chatData.findIndex((c)=>c.messageId === item.messageId)
        userChatData.chatData[chatIndex].messageSeen = true
  
        await updateDoc(userChatRef,{
          chatData:userChatData.chatData
        })

        SetChatVissible(true)
      } catch (error) {
        toast.error(error.message)
        console.log(error)
      }  
    }
    

    // useEffect(()=>{
    //   const upadateChatUserData = async()=>{
    //       if(chatUser){
    //         const useRef = doc(db,"user",chatUser.userDatas.id)
    //         const userSnap = await getDoc(useRef)
    //         const userData =userSnap.data()
    //         SetChatUser(prev({...prev,userDatas:userData}))
    //       }

    //   }
    //   upadateChatUserData()
    // },[chatData])
    
    return (
      <div className={`ls ${chatVissible?"hidden":"ls"}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assests.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assests.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={()=>navigate('/profile')}>Edit Profile</p>
              <hr />
              <p onClick={()=>LogoutUser()}>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assests.search_icon} alt="" />
          <input type="text" onChange={(e)=>{inputHandler(e); SetInput(e.target.value);}} value={input}  placeholder="Search Here . . ." />
        </div>
      </div>
      <div className="ls-list">
      {showSearch && user ? <div  className="friends add-user">
        <img src={user.avatar?user.avatar:assests.avatar_icon} className="profile-img" alt="" />
        <div onClick={()=>addChat()} className="name-lastmsg">
                  <p>{user.name}</p>
                  <span>{user.bio}</span>
                </div>
      </div> :
       chatData?.map((item,index)=>{
         // for(let i=0; i<user.length; i++){
          //   console.log(user[i],'jk')
          // console.log(item.messageSeen,'u')
          return(
            <div onClick={()=>setChat(item)} key={index} className={`friends ${item.messageSeen || item.messageId === messagesId ? "" : "border"}`}>
                        <img src={item.userDatas.avatar?item.userDatas.avatar:assests.avatar_icon} className="profile-img" alt="" />
                        <div className="name-lastmsg">
                          <p>{item.userDatas.name}</p>
                          <span>{item.lastMessage}</span>
                        </div>
                      </div>
        )
        // }
      })
      
      
      
    }
      </div>
    </div>
  );
};
export default LeftSideBar