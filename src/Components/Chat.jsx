import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { MessageSquareText, PlusIcon, SendIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../firebase_config';
import { useAuth } from './AuthContext';
import { arrayUnion } from 'firebase/firestore/lite';

function Chat() {

  const params =  useParams();
  const [msg, setMsg] = useState("");
  const [secondUser, setSecondUser] = useState("");
  const {userData} = useAuth();
  const [msgList,setMsgList] = useState([]);
  const receiverId = params?.chatid;


  const chatId =
    userData?.id > receiverId
      ?`${userData.id}-${receiverId}`
      :`${receiverId}-${userData.id}`;


  const handleSendMsg = async () => {
    if(msg) {
      const date = new Date();
      const timeStamp = date.toLocaleString("en-US",{
        hour: "numeric",
        minute: "numeric",
        hour12: true
      });


      if(msgList?.length === 0) {
        await setDoc(doc(db,"user-chats",chatId),{
          chatId: chatId,
          messages: [
            {
              text: msg,
              time: timeStamp,
              sender: userData.id,
              receiver: receiverId,
            },
          ],
        });
      } 
      else {
        const newMessage = {
          text: msg,
          time: timeStamp,
          sender: userData.id,
          receiver: receiverId,
        };
        const chatDocRef = doc(db, "user-chats", chatId);
        const chatDoc = await getDoc(chatDocRef);
        const messages = chatDoc.data().messages;
        messages.push(newMessage); // Add new message
        await updateDoc(chatDocRef, { messages: messages });
        // await updateDoc(doc(db,"user-chats",chatId),{
        //   chatId: chatId,
        //   messages: arrayUnion({
        //     text: msg,
        //     time: timeStamp,
        //     sender: userData.id,
        //     receiver: receiverId,
        //   }),
        // });
      }


      setMsg("");
    
  }
}


  useEffect(() => {
    const getUser = async() => {
      const docRef = doc(db,"users", receiverId);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) {
        setSecondUser(docSnap.data());
      }
    };
    getUser();

    const msgUnsubscribe = onSnapshot(doc(db,"user-chats",chatId), (doc) => {
      setMsgList(doc.data()?.messages || []);
    });
    return () => {
      msgUnsubscribe();
    }

  }, [receiverId]);
  


  if(!receiverId)
    return (
      <section className='w-[70%] h-full flex flex-col gap-4 items-center justify-center'>
        <MessageSquareText
          className='w-28 h-28 text-gray-400'
          strokeWidth={1.2}
        />
        <p className='test-sm text-center text-gray-400'>
          Select any contact to
          <br />
          start a chat with
        </p>
      </section>
    );

    

    

    return <>
      <section className='w-[70%] h-full flex flex-col gap-4 items-center justify-center'>
        <div className='h-full w-full bg-chat-bg flex flex-col'>


          <div className='bg-background py-2 px-4 flex items-center gap-2 shadow-sm'>
            <img 
              src={secondUser?.profile_pic||"/defaultUser.png"}
              alt="profile_pic"
              className='w-9 h-9 rounded-full object-cover' 
            />
            <div>
            <h3>{secondUser.name}</h3>
            {secondUser?.lastSeen && (
                <p className="text-xs text-neutral-400">
                last seen at {secondUser?.lastSeen}
                </p>
              )}
            </div>          
          </div>



          <div className='flex-grow flex flex-col gap-12 p-6 overflow-y-scroll '>
            {msgList?.map((m, index) => (
              <div
                key={index}
                data-sender = {m.sender === userData.id}
                className='bg-white w-fit rounded-md p-2 shadow-sm max-w-[400px] break-words data-[sender=true]:ml-auto data-[sender=true]:bg-primary-light'
              >
                <p>{m?.text}</p>
                <p className='text-xs text-neutral-500 text-end'>
                  {m?.time}
                </p>
              </div>
            ))}
          </div>




          <div className='bg-background py-3 px-6 shadow flex items-center gap-6'>
            <PlusIcon />
            <input type="text" className='w-full py-2 px-4 rounded focus:outline-none' placeholder='Type a message...'
              value={msg} 
              onChange={(e) => {
                setMsg(e.target.value)
              }}
              onKeyDown={(e) => {
                if(e.key == "Enter") {
                  handleSendMsg();
                }
              }}
            />
            <button onClick={handleSendMsg}> 
              <SendIcon />
            </button>
          </div>
        </div>
      </section>
    </>
  

  
}


export default Chat 