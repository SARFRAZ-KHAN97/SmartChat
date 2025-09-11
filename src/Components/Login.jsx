import React from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth ,db} from '../../firebase_config'
import { GoogleAuthProvider } from 'firebase/auth'
import { Fingerprint } from 'lucide-react'
import { ArrowRightToLine } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { doc,setDoc } from 'firebase/firestore'
import { useAuth } from './AuthContext'



async function createUser(authData) {
  const userObject = authData.user;
  //const uid = userObject.id;
  //const photoURL = userObject.photoURL;
  //const name = userObjec t.displayName;
  //const email = userObject.email;
  //console.log(uid, "  ",photoURL,"  ",name, email)
  const { uid, photoURL, displayName, email} = userObject;
  
  const date = new Date();
  const timeStamp = date.toLocaleString("en-US",{
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });

  await setDoc(doc(db,"users",uid),{
    email,
    profile_pic: photoURL,
    name: displayName,
    lastSeen: timeStamp
  }
)
}



function Login() {

  const navigate = useNavigate();
  const handleLogin = async () => {
    const userData = await signInWithPopup(auth, new GoogleAuthProvider);
    await createUser(userData);
    navigate("/");
  }


  return (
    <>
      <div className='h-[220px] bg-primary '>
        <div className='flex ml-[200px] pt-[40px] items-center gap-[16px]'>
          <img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" alt="" 
          className='h-[40px] w-10'/>
          <div className='text-white uppercase font-medium'>
            SmartChat
          </div>
        </div>
      </div> 
      <div className='bg-background h-[calc(100vh-220px)] flex justify-center items-center relative'>
        <div className='h-[100%] w-[50%] bg-white shadow-2xl flex flex-col gap-4 justify-center items-center absolute top-[-93px]'>
          <Fingerprint className='h-[90px] w-[90px] ' strokeWidth={1.2} color='green'/>
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fingerprint w-24 h-24 text-primary mb-8"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"></path><path d="M14 13.12c0 2.38 0 6.38-1 8.88"></path><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"></path><path d="M2 12a10 10 0 0 1 18-6"></path><path d="M2 16h.01"></path><path d="M21.8 16c.2-2 .131-5.354 0-6"></path><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"></path><path d="M8.65 22c.21-.66.45-1.32.57-2"></path><path d="M9 6.8a6 6 0 0 1 9 5.2v2"></path></svg> */}
          <div>Sign In</div>
          <div>
            <div>Sign in with your google account</div>
            <div className='text-center'>to get started.</div>
            </div>
          <button className='flex gap-2 item-center bg-primary p-3 text-white rounded-md hover:bg-primary-dense' onClick={handleLogin}>
            <div>
              Sign In with Google
            </div>
            <ArrowRightToLine />
          </button>
        </div>
      </div>
    </>
  )
}

export default Login