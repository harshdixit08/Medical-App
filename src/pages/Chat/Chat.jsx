import React, { useContext, useEffect, useState } from 'react'
import './Chat.css'
import LeftSideBar from '../../components/LeftSideBar/LeftSideBar'
import ChatBox from '../../components/Chatbox/ChatBox'
import RightSideBar from '../../components/RightSideBar/RightSideBar'
import { appContext } from '../../context/AppContext'
import { toast } from 'react-toastify'




const Chat = () =>{
      
      const {userData,chatData}=useContext(appContext)
      const [Loading,SetLoading]=useState(true)
      useEffect(()=>{
            if (userData && chatData) {
                SetLoading(false)  
            }
      
      },[userData,chatData])
  return(
        <div className="chat">
            {
             Loading ?<h2 className='h-two'> chats loading</h2>
               : <div className='main-container'>
                  {/* {toast.success('success')} */}
                  <LeftSideBar/>
                  <ChatBox/>
                  <RightSideBar/>
            </div>
             }  
        </div>
  )
}

export default Chat; 