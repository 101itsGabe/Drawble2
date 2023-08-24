import { doc } from "firebase/firestore";
import "../firebase.js";
import { curcollection, getDocs, auth } from "../firebase.js";
import { useEffect, useState } from "react";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";

function FeedPage() {
  const [allMessages, setAllMessages] = useState([]); // Use useState
  const navigate = useNavigate();
  useEffect(() => {
    const collectionRef = curcollection;

    // Fetching documents from the collection
    async function fetchData() {
      const querySnapshot = await getDocs(collectionRef);
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        const customMessage ={
          id: doc.id,
          data: doc.data(),
        }
        messagesData.push(customMessage);
      });

      messagesData.sort((a, b) => b.data.timestamp - a.data.timestamp);

      setAllMessages(messagesData);
    }

    fetchData();
  }, []);


  //console.log(allMessages);
  return listOfMessages (allMessages,navigate);
}

function GoToPage(docId,navigate){
  //const navigate = useNavigate();
  //console.log(docId);
  navigate("/message/" + docId);
}

function listOfMessages(messages, navigate) {
  return (
    <>
      <ol className="LOM">
        {messages?.map((m) => (
            <li>
          <button onClick={() => GoToPage(m.id,navigate)}>
              <p className="userName">{m.data.user}</p>
              <p className="timeStamp">{formatTimeStamp(m.data.timestamp)}</p>
              <img className="canvasPrint" src={m.data.canvasData} />
              <div className="messageFeed">{m.data.message}</div>
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
  console.log(date);
  return date;
}
export { FeedPage, listOfMessages };
