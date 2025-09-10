import React, { useEffect } from 'react';
import {useContext, useState} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth ,db} from '../../firebase_config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase_config';


const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}


function AuthWrapper({children}) {

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect( ()=>{
    const unsubscribe = onAuthStateChanged(auth,async(currentUser)=>{
      setLoading(true);
      if(currentUser) {
        const docRef = doc(db, "users", currentUser?.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
          const { profile_pic, name, email, lastSeen, status} = docSnap.data();
          await setLastSeen(currentUser);
          setUserData({
            id: currentUser.uid,
            profile_pic,  
            email,
            name,
            lastSeen,
            status: status ? status: ""
          });
        }
      }
      setLoading(false);
    })
    return ()=> {
      unsubscribe();
    }
  },[])

  const setLastSeen = async (user) => {
    const date = new Date();
    const timeStamp = date.toLocaleString("en-US",{
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "2-digit",
      month:"short"
    });
    await updateDoc(doc(db, "users", user.uid), {
      lastSeen: timeStamp,
    });
  }


  const updateName = async (newName) => {
    await updateDoc(doc(db, "users", userData.id), {
      name: newName
    });
  }

  const updateStatus = async (newStatus) => {
    await updateDoc(doc(db, "users", userData.id), {
      status: newStatus
    });
  }
  


  const updatePhoto = async (img) => {
    const storageRef = ref(storage, `profile/${userData.id}`);
    const uploadTask = uploadBytesResumable(storageRef, img);

    uploadTask.on(
      "state_changed",
      () => {
        setIsUpLoading(true);
        setError(null);
      },
      () => {
        setError("Unable to Upload");
        setIsUpLoading(false);
        alert("Unable to Upload");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateDoc(doc(db, "users", userData.id), {
            profile_pic: downloadURL, 
          });
          setUserData({
            ...userData,
            profile_pic: downloadURL,
          });
          setIsUpLoading(false);
          setError(null);
        })
      }
    )
  }



  return  <AuthContext.Provider value={{setUserData, userData, loading, updateName, updateStatus, updatePhoto, isUpLoading, error}}>
        {children}
  </AuthContext.Provider>
  
}

export default AuthWrapper
 