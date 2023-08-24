import { collection } from "firebase/firestore";
import {
    firestore,
    curcollection,
    userCollection,
    addDoc,
    updateDoc,
    auth,
    firebase,
    useAuthState,
    serverTimestamp,
    getDocs,
  } from "../firebase.js";
  import React, { useState, useEffect } from "react";
  import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
    useNavigate,
    useParams,
  } from "react-router-dom";



    export function CurrentMessagePage() {
      const {messageId} = useParams();
      const messagesRef = curcollection;
      const [message, setMessage] = useState([]);

      useEffect(() => {
      async function fetchData() {
        const querySnapshot = await getDocs(messagesRef);
        try{
          const messagefound = querySnapshot.docs.find((doc) => doc.id === messageId);
          setMessage(messagefound.data());
        }catch(e){
          console.log(e);
        }

      }


      fetchData();
    }, []);


      return(<>
        <p>{message.user}</p>
        <p>yer</p>
      </>)
    }