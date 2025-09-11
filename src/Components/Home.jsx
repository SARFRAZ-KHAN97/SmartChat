import React from 'react'
import { storage } from '../../firebase_config'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import ChatPanel from './ChatPanel';
import Chat from './Chat';

function Home() {

  // const handleChange = (e) => {
  //   const img = e.target.files[0];
  //   //address
  //   const storageRef = ref(storage,"/profile"+Math.random());
  //   //storage task
  //   const uploadTask = uploadBytesResumable(storageRef, img);
  //   //developer
  //   uploadTask.on("state_changed",progressCB, errorCB, finishedCB);
  //   //upload
  //   function progressCB(data) {
  //     console.log("data",data);
  //   }
  //   //if error
  //   function errorCB(err) {
  //     console.log("err",err);
  //   }
  //   //on success
  //   function finishedCB() {
  //     console.log("success completed");  
  //     getDownloadURL(uploadTask.snapshot.ref).then(function(url){
  //       console.log("url :",url);
  //     })
  //   }

  // }


  return (
    <main className='relative w-full h-screen bg-[#E3E1DB]'>
      <div className='absolute top-0 h-[130px] bg-primary w-full' />
    {/* <div> */}
      {/* <h1>Home</h1> */}
      {/* <<input type='file'
        accept='image/*'
        onChange={handleChange}
      ></input>> */}
    {/* </div> */}
    {/* <div>Chat panel</div>
    <div>Profile</div>

    <div>Empty chat</div>
    <div>Individual Chat</div> */}
      <div className='h-screen absolute w-full p-5'>
        <div className='bg-background w-full h-full shadow-md flex'>
        <ChatPanel />
        <Chat></Chat>
        </div>
      </div>
    </main>
  )
}

export default Home
