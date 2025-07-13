// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { toast } from "react-toastify";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { getFirestore, setDoc, doc } from "firebase/firestore"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4QfNxetf2U8snc_7OUuSR4IsU90xEE4U",
  authDomain: "medical-data-pager.firebaseapp.com",
  projectId: "medical-data-pager",
  storageBucket: "medical-data-pager.firebasestorage.app",
  messagingSenderId: "517451230239",
  appId: "1:517451230239:web:875b2c84d791f66bf9392a",
  measurementId: "G-L8NB2RHXVP",
  databaseURL: "https://medical-data-pager-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


const SignupUser = async (username, email, password) => {
  // console.log(username,email,password,"=====>>>>")
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    // console.log('wh is res',res)
    const user = res.user;
    console.log("wh is user", user)
    const userid = user.uid
    await setDoc(doc(db, "users", userid), {
      id: userid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey , I am using there chat app",
      lastseen: Date.now()
    })
    await setDoc(doc(db, "chats", userid), {
      chatData: []
    })
    toast.success("Account Created Successfully")
  } catch (error) {
    // console.error(error,"hello")
    toast.error(error.code.split('/')[1].split('-').join(" "))
  }


}
const LoginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
    toast.success("Login Successfully")
  } catch (error) {
    // console.error(error)
    toast.error(error.code.split("/")[1].split("-").join(" "))

  }
}

const LogoutUser = async () => {
  try {
    // console.log("log outing")
    await signOut(auth)
    toast.success("LogOut Successfully")

  } catch (error) {
    console.error(error)
    toast.error(error.code.split("/")[1].split("-").join(" "))
  }
}
export { SignupUser, LoginUser, LogoutUser, auth, db }
