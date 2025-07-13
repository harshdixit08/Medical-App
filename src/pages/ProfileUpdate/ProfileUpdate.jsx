import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../../config/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import uploadimg from '../../library/uploadimg'
import { appContext } from '../../context/AppContext'


const ProfileUpdate = () => {

  const [profileImage,setProfileImage]=useState(null)
  //  console.log("pro img----->",profileImage) 
    var [name,SetName]=useState("")
    var [bio,SetBio]=useState("")
    var [userId,SetUserId]=useState("")
    var [previewimg,SetPreviewImg]=useState("")
    // console.log('preimg----------->',previewimg)
    // console.log(name)
    // console.log(bio)
    // console.log(previewimg)

        const navigate = useNavigate()

        const {SetUserData} = useContext(appContext)

          const profileDetails = async (event)=>{
            event.preventDefault();
            try {
              if(!previewimg && !profileImage){
                toast.error('upload the picture')
              } else{
                toast.success('Profile Updated successful')
              }
              const docRefs = doc(db,"users",userId)
              // console.log(docRefs.data(),"------this is docrefss")
              if(profileImage){
                // const im = profileImage
                const imge = await uploadimg(profileImage)
                SetPreviewImg(imge)
                // console.log(imge)
                // console.log("imgeUrl--->",imge.then((e)=>console.log(e,'====<>')))
                await updateDoc(docRefs,{
                  avatar:imge,
                  bio:bio,
                  name:name
                })
              } else{
                await updateDoc(docRefs,{
                  bio:bio,
                  name:name
                })
              }
              
              const snap = await getDoc(docRefs)
              SetUserData(snap.data())
              navigate("/chat")

            } catch (error) {
              console.log(error)
              toast.error(error.message)
            }
         }

      useEffect(()=>{
        onAuthStateChanged(auth, async(user)=>{
          // console.log("profile update page id",user.uid) // same Id
          if(user){
            SetUserId(user.uid)
            const docRef = doc(db,"users",user.uid)
            const docSnap = await getDoc(docRef)
            // console.log(docSnap)
            // if(docSnap.data().name){
            //   console.log("onstch-----> profile upd page")
            //     SetName(docSnap.data().name)
            // }
            // if (docSnap.data().bio) {
            //   console.log("onstch-----> profile upd page")
            //   SetBio(docSnap.data().bio)
            // }
            // if (docSnap.data().avatar) {
            //   console.log("onstch-----> profile upd page")
            //   SetPreviewImg(docSnap.data().avatar)
            // }
            SetName(docSnap.data().name)
            SetBio(docSnap.data().bio)
            SetPreviewImg(docSnap.data().avatar)

          }else{
              navigate('/')
          }
        })
        // console.log('-------->','useEffect')
      },[])



  return (
    <div className='profile'> 
      <div className="profile-container">
        <form onSubmit={profileDetails}>
          <div className='head-arrow'>
          <h3>Profile Details</h3>
    <img onClick={()=>navigate('/chat')} className='arrow' src={assets.arrow_icon} alt="" />
          </div>
          <label htmlFor="avatar">
            <input onChange={(e)=>setProfileImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
          <img src={profileImage?URL.createObjectURL(profileImage):previewimg ? previewimg :assets.avatar_icon} alt="" /> <h4 className='h4'>Upload Profile Picture</h4>
          </label>
          <input onChange={((e)=>SetName(e.target.value))} value={name}  type="text"  placeholder='your Name' required/>
          <textarea onChange={((e)=>SetBio(e.target.value))} value={bio} placeholder='write profile bio' name="" id=""></textarea>
          <button type='submit'>Save</button>
        </form>
        <img className='profile-pic' src={profileImage?URL.createObjectURL(profileImage):previewimg ? previewimg : assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate 