import "../firebase.js";
import { curcollection, getDocs, auth, userCollection } from "../firebase.js";
import { useEffect, useState } from "react";
import React from "react";
import "../App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { setUserId } from "firebase/analytics";
import { FeedPage, listOfMessages } from "./FeedPage";
function UserPage() {
  const [allMessages, setAllMessages] = useState([]); // Use useState
  const navigate = useNavigate();
  const [curName, setName] = useState("");
  useEffect(() => {
    const collectionRef = curcollection;

    // Fetching documents from the collection
    async function fetchData() {
      const querySnapshot = await getDocs(collectionRef);
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().user === auth.currentUser.email){
          const customMessage ={
            id: doc.id,
            data: doc.data(),
          }
          messagesData.push(customMessage);
        }
      });

      const querySnapshot2 = await getDocs(userCollection);
      querySnapshot2.forEach((doc) => {
        if (doc.data().email === auth.currentUser.email){
          setName(doc.data().username);
        }
      });
    
      setAllMessages(messagesData);
    }

    fetchData();
  }, []);

  //console.log(allMessages);
  //return listOfUserMessages(allMessages,navigate, curName);
  return (
    <>
    <button onClick={() => {
          navigate("/username");
        }}>Change UserName</button>
        <p>{curName}</p>
        <button onClick={() => {navigate("/")}}>Home</button>
        <div className="scrollableContainer">
          <ListOfUserMessages messages={allMessages} navigate={navigate} /> 
        </div> 
    </>
  )
}



function GoToPage(docId,navigate){
  //const navigate = useNavigate();
  //console.log(docId);
  navigate("/message/" + docId);
}


function ListOfUserMessages({messages, navigate}) {
  //const navigate = useNavigate();
  return (
    <>
      <ol className="LOM">
        {messages?.map((m) => (
            <li>
          <button onClick={() => GoToPage(m.id,navigate)}>
              <p className="userName">{m.data.user}</p>
              <img className="canvasPrint" src={m.data.canvasData} />
              <div className="message">{m.data.message}</div>
             </button>
             </li>
        ))}
      </ol>
    </>
  );
}

export { UserPage};
