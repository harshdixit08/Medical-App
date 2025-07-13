import React, { useState } from 'react'
import './Login.css'
import assests from '../../assets/assets'
import { SignupUser , LoginUser} from '../../config/firebase'
import { toast } from 'react-toastify'

const Login = () => {

     const [curState,SetcurState]=useState("Sign Up")
     const[username,SetUserName]=useState("");
     const[email,SetEmail]=useState("");
     const[password,SetPassWord]=useState("");

     const onSubmithandler = (event)=>{
        event.preventDefault();
        if (curState==="Sign Up") {
          // console.log(username,email,password)
          SignupUser(username,email,password)
        }else{
          LoginUser(email,password)
        }
        // console.log("initial mount")
     }
 

  return (
    <div className='login'>
      <img src={assests.logo_big} alt="" className='logo'/>


      <form onSubmit={onSubmithandler} className='login-form'>
        <h2>{curState}</h2>
      {curState === "Sign Up"?<input onChange={(e)=>SetUserName(e.target.value)} value={username} type="text" name="" id="" placeholder='Username' className='form-input' required/>:null}
      <input type="email" onChange={(e)=>SetEmail(e.target.value)} value={email} name="" id="" placeholder='Email Address' className='form-input' required/>
      <input type="password" onChange={(e)=>SetPassWord(e.target.value)} value={password} name="" id="" placeholder='Password' className='form-input' checked required/>
      <button type="submit">{curState === "Sign Up"?"Create Account":"Login Now"}</button>
      <div className='login-term'>
        <input type="checkbox" name="" id="" required/>
        <p>Agree to the trems of use & privacy policy</p>
      </div>
      <div className="login-forget">
        {
        curState === "Sign Up"
        ?<p className="login-toggle" onClick={()=>SetcurState('login')}>Already have an account <span>Login Now</span></p>
        :<p className="login-toggle" onClick={()=>SetcurState('Sign Up')}>Create an account <span>click here</span></p>
        }
      </div>
      </form>
    </div>
  )
}

export default Login