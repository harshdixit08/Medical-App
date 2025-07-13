import {useContext,React, useState, useEffect} from 'react';
import "./ChatBox.css"
import assets from '../../assets/assets'
import { appContext } from '../../context/AppContext'
import { arrayUnion, getDoc, updateDoc,doc, onSnapshot} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../config/firebase';
import uploadimg from '../../library/uploadimg';



const ChatBox = () => {

    const {chatUser,messagesId,userData,messages,SetMessages,chatVissible,SetChatVissible,SetChatVis,chatvis} = useContext(appContext)
    console.log(chatvis)
    // console.log(chatUser?.rId,userData.id,"UserIds---->")
    const[input,SetInput]=useState("")
    
    const Sendmessage = async ()=>{
    
      try {
        if (input && messagesId) {
          await updateDoc(doc(db,"messages",messagesId),{
            messages:arrayUnion({
              sId:userData.id,
              text:input,
              createdAt:new Date()
            })
          })
          const UserIds = [chatUser.rId , userData.id]
          // console.log(UserIds)

          UserIds.forEach(async(id)=>{
            // console.log(id),"id----->"
            const userChatRef = doc(db,"chats",id)
            const userChatsSnapShot = await getDoc(userChatRef)
            
            if(userChatsSnapShot.exists()){
              const userChatData = userChatsSnapShot.data()
              // console.log(userChatData,"userChatData----->")
             console.log(userChatData.chatData)
              const chatIndex = userChatData.chatData.findIndex((c)=>c.messageId === messagesId)
              console.log(userChatData.chatData[chatIndex],"ChatIndex----->")
              userChatData.chatData[chatIndex].lastMessage = input.slice(0,30)
              userChatData.chatData[chatIndex].updatedAt = Date.now()

              if(userChatData.chatData[chatIndex].rId === userData.id){
                // console.log(userChatData.chatData[chatIndex].rId)
                
                  userChatData.chatData[chatIndex].messageSeen = false;
              }

              await updateDoc(userChatRef,{
                chatData:userChatData.chatData
              })
            }
              
              
          })
        
          }
        } catch (error) {
          toast.error(error.message)
        }
        SetInput("")
    }

    const sendImage = async(e)=>{
      try {
        const fileUrl =await uploadimg(e.target.files[0])
        // console.log(fileUrl,"fileurl image")
        if(fileUrl && messagesId){
          await updateDoc(doc(db,"messages",messagesId),{
            messages:arrayUnion({
              sId:userData.id,
              image:fileUrl,
              createdAt:new Date()
            })
          })

          const UserIds = [chatUser.rId , userData.id]
          // console.log(UserIds)

          UserIds.forEach(async(id)=>{
            // console.log(id),"id----->"
            const userChatRef = doc(db,"chats",id)
            const userChatsSnapShot = await getDoc(userChatRef)
            
            if(userChatsSnapShot.exists()){
              const userChatData = userChatsSnapShot.data()
              // console.log(userChatData,"userChatData----->")
              const chatIndex = userChatData.chatData.findIndex((c)=>c.messageId === messagesId)
              // console.log(chatIndex,"ChatIndex----->")
              userChatData.chatData[chatIndex].lastMessage = "image"
              userChatData.chatData[chatIndex].updatedAt = Date.now()

              if(userChatData.chatData[chatIndex].rId === userData.id){
                // console.log(userChatData.chatData[chatIndex])
                  userChatData.chatData[chatIndex].messageSeen = false;
              }

              await updateDoc(userChatRef,{
                chatData:userChatData.chatData
              })
            }
              
              
          })
        }



      } catch (error) {
        toast.error(error.message)
        console.log(error)
      }
    }



    const convertTimeStamp = (timestamp)=>{
      // console.log(timestamp,"time Stapm")
      let date = timestamp.toDate()
      let hour = date.getHours()
      let minitues = date.getMinutes()
      let mini = minitues<10 ? "0"+minitues : minitues
      if(hour>12){
       return hour - 12 + ":" + mini + "Pm"
      }else{
       return hour + ":" + mini + "Am"
      }
    }



    useEffect(()=>{
      if(messagesId){
        const unSub = onSnapshot(doc(db,"messages",messagesId),async(res)=>{
          await SetMessages(res.data().messages)
          // console.log(res.data().messages,"reverse----->")
          // console.log(messagesId,'messageId')
        })
        return ()=>{ 
          unSub()
        }

      }
    },[messagesId])


  return chatUser ? (
// chat-header
    <div className={`chat-box ${chatVissible? "":"hidden"}`}>
      <div className="chat-user">
        <div className='chat-two'>
        <img className='profilecat-img' src={chatUser.userDatas.avatar?chatUser.userDatas.avatar:assets.avatar_icon} alt=""  />
        <p className='name-green'>{chatUser.userDatas.name} {Date.now() - chatUser.userDatas.lastseen <= 70000 ?<img className='green-dt' src={assets.green_dot} alt="" />:<img className='green-dt' src={assets.grey_dot} alt="" />}</p>
        </div>
        <img onClick={()=>SetChatVissible(false)} className='arrowicon-img' src={assets.arrow_icon} alt="" />
      </div>
{/* chat-msg-box */}
    <div className="chats-msg">
      {messages?.map((msg,indx)=>{    //using map function
      // console.log(msg,"msg----->")
      return(
      <div key={indx} className={msg.sId === userData.id ? "send-msg" : "receive-msg"}>
      {msg["image"] ? <img className='msg-img' onClick={()=>window.open(msg.image)} src={msg.image} alt=""  />
      :<p className="text-msg">{msg.text}</p>
      }
        <div className='pro-file-div'>
          <img src={msg.sId === userData.id ? userData.avatar : chatUser.userDatas.avatar} alt="" />
          <p>{convertTimeStamp(msg.createdAt)}</p>
        </div>
      </div>)
      })}

    </div>

{/* chat-input-box */}
      <div className="chat-input">
        <input onChange={(e)=>SetInput(e.target.value)} value={input} type="text" placeholder='Send a message' />
        <input onChange={sendImage} type="file" id='image' accept='image/png , image/jpeg , image/jpg' hidden/>
        <label htmlFor="image">
          <img className='send-button1' src={assets.gallery_icon} alt="" />
        </label> 
          <img className='send-button2' onClick={Sendmessage} src={assets.send_button} alt="" />  
      </div>
    
    </div> //this is end div
  ) 
  :<div className={`welcome-chat ${chatVissible? "" : "hide" }`}>
    <img src={assets.logo_icon} alt="" />
    <p className="welcome-para">chat anyone , chat anywhere</p>
  </div>
}

export default ChatBox 