import { FieldValue, doc, query, updateDoc } from "firebase/firestore";
import "../firebase.js";
import { curcollection, getDocs, auth, userCollection, where, collection } from "../firebase.js";
import { useEffect, useState } from "react";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { RecaptchaVerifier } from "firebase/auth";

function FeedPage() {
  const [allMessages, setAllMessages] = useState([]); // Use useState
  const navigate = useNavigate();
  useEffect(() => {
    const collectionRef = curcollection;

    // Fetching documents from the collection
    async function fetchData() {
      const querySnapshot = await getDocs(collectionRef);
      const messagesData = [];
      for (const doc of querySnapshot.docs) {
        const customMessage ={
          id: doc.id,
          data: doc.data(),
          docRef: doc.ref,
          likeCount: doc.data().likeCounter,
          userName: await getUserName(doc.data().user),
        }
        messagesData.push(customMessage);
      }

      messagesData.sort((a, b) => b.data.timestamp - a.data.timestamp);
      setAllMessages(messagesData);
    }
    fetchData();
    //update();
  }, []);



  async function getUserName(email){
    const userRef = query(userCollection, where("email", "==", email));
    const querySnapshot = await getDocs(userRef);
    let userName = "";
    try{
    querySnapshot.forEach((doc) => {
      if(doc.data().email == email){
        userName = doc.data().username;
      }
    });
    return userName;
  }
  catch(e){console.log(e);}
  }


  async function handleClick(event, doc,docRef){
    event.stopPropagation();
    await AddLike(doc,docRef);
  }
  async function AddLike(doc,docRef){
      const curCounter = doc.data.likeCounter + 1;
      doc.likeCount=curCounter;
      try{
      await updateDoc(docRef,{
         likeCounter: curCounter, 
      });

      const updatedMessages = allMessages.map((m) =>
      m.id === doc.id ? { ...m, likeCount: curCounter } : m
    );

    setAllMessages(updatedMessages);
      }catch(e){console.log(e);}
      
  }
  function GoToPage(docId,navigate){
    navigate("/message/" + docId);
  }
  
  function listOfMessages(messages, navigate,) {
    if(!messages){
      return <div>Loading</div>;
    }

    return (
      <>
        <ol className="LOM">
          {messages?.map((m) => (
              <li key={m.id}>
            <button className="fullMessage" onClick={() => GoToPage(m.id,navigate)}>
               <div className="chatHeader"> 
                  <p className="userName">{m.userName}</p>
                  <p className="timeStamp">{formatTimeStamp(m.data.timestamp)}</p>
                </div>
                <img className="canvasPrint" src={m.data.canvasData} />
                <div className="messageFeed">{m.data.message}</div>
                <br/>
               <p className="likeCount">{m.likeCount}</p>
                <br/>
                <img
                className="likebtn"
                src={require("../images/likebtn.png")}
                onClick={(event) => handleClick(event, m, m.docRef)}
              />
            </button>
               </li>
          ))}
        </ol>
      </>
    );
  }
  
  function formatTimeStamp(timestamp)
  {
    const date = new Date(timestamp.seconds * 1000).toLocaleDateString("en-US");
    return date;
  }


  return listOfMessages (allMessages,navigate, setAllMessages);

}
//End of FeedPage

/*
async function update(){
  try{
  const querySnapshot = await getDocs(curcollection);
  querySnapshot.forEach(async(doc) => {
    const docRef = doc.ref;
    const likeCollection = collection(docRef, "likes");
    const please = doc.collection("likes");
    await updateDoc(docRef,likeCollection);
  });
}catch(e){console.log(e);}
}
*/

export { FeedPage };


