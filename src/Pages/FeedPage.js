import "../firebase.js";
import { curcollection, getDocs, auth } from "../firebase.js";
import { useEffect, useState } from "react";
import React from "react";
function FeedPage() {
  const [allMessages, setAllMessages] = useState([]); // Use useState
  useEffect(() => {
    const collectionRef = curcollection;

    // Fetching documents from the collection
    async function fetchData() {
      const querySnapshot = await getDocs(collectionRef);
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        //if (doc.data().user === auth.currentUser.email)
        messagesData.push(doc.data());
        //console.log(doc.id, " => ", doc.data());
      });

      setAllMessages(messagesData);
    }

    fetchData();
  }, []);

  //console.log(allMessages);
  return listOfMessages(allMessages);
}

function listOfMessages(messages) {
  return (
    <>
      <ol className="LOM">
        {messages?.map((m) => (
          <li>
          <p>{m.user}</p>
          <img className="canvasPrint" src={m.canvasData} />
          <div className="message">{m.message}</div>
        </li>
        ))}
      </ol>
    </>
  );
}
export { FeedPage, listOfMessages };
