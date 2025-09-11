import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase_config';
import { SunMoon, CircleFadingPlus, MessageSquare, UserRound, Loader2Icon, SearchIcon } from 'lucide-react';
import Profile from './Profile';
import { useAuth } from './AuthContext';
import UserCard from './UserCard';

function ChatPanel() {
  
    const [users,setUsers] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [showProfile, setShowProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const {userData} = useAuth();

    const onBack = () => {setShowProfile(false )}


    useEffect( () => {
        const getUsers = async () => {
            const snapShot = await getDocs(collection(db, 'users'));
            const arrayOfUsers = snapShot.docs.map((docs) => {return {userData: docs.data(), id: docs.id}});
            setUsers(arrayOfUsers);
            setLoading(false);
        };
        getUsers();
    },[]);


    if(showProfile){
      return <Profile onBack={onBack} />
    }
 


    let filteredUsers = users;

    if(searchQuery) {
      filteredUsers = users.filter((user) => 
        user.userData.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())       // can use startsWith func  user.userData.name?startsWwithtoLowerCase()?.includes(searchQuery?.toLowerCase()) 
      );
    }





    return (
      <div className='bg-white w-[30vw] min-w-[350px]'>
        {/* top bar */}
      <div className='bg-background py-2 px-4 border-r flex justify-between items-center gap-2'>
        <button
          onClick={ () =>{setShowProfile(true)}}
        >
          <img src={userData.profile_pic}
           alt="profile_pic"
           className='w-10 h-10 rounded-full object-cover' />
        </button>
        <div className='flex items-end justify-center gap-6 mx-4'> 
          <SunMoon className='w-6 h-6'/>
          <CircleFadingPlus className='w-6 h-6'/>
          <MessageSquare className='w-6 h-6'/>
          <UserRound className='w-6 h-6'/>
        </div>
      </div>

      {/* chat list */}
      {
        isLoading ? <div className='h-full w-full flex justify-center items-center'><Loader2Icon className='w-10 h-10 animate-spin'/></div> :
        <div className='bg-white py-2 px-3'>

            <div className='bg-background flex items-center gap-4 px-3 py-2 rounded-lg'>
              <SearchIcon className='w-4 h-4'/>
              <input 
                className='bg-background focus-within:outline-none'
                placeholder='Search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className='divide-y py-4 h-full max-h-[calc(100vh-152px)] overflow-y-scroll [&::-webkit-scrollbar]:hidden'>
              {filteredUsers.map(userObject => <UserCard userObject={userObject} key={userObject.id}/>
              )}
            </div>
        </div>
         
      }
      
      </div>
   );
}

export default ChatPanel
