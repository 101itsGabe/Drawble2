import {
  firestore,
  userCollection,
  addDoc,
  updateDoc,
  auth,
  firebase,
  useAuthState,
  serverTimestamp,
  getDocs,
} from "../firebase.js";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";

export function UsernamePage() {
  const [user] = useAuthState(auth);
  const [usernameValue, setUsernameValue] = React.useState("");
  const navigate = useNavigate();
  async function saveToFirebase() {
    const jsonToSave = {
      username: usernameValue,
    };
    try {
      const querySnapshot = await getDocs(userCollection);
      const docs = querySnapshot.docs;
      //console.log(docs);
      for (const doc of docs) {
        const docData = doc.data();
        if(usernameValue === docData.username)
        {
          if(docData.email === user.email)
          {
            setUsernameValue("");
            console.log("User name is already taken");
            return false;
          }
        }
        if (docData.email === user.email) {
          const docRef = doc.ref;
          await updateDoc(docRef, jsonToSave);
          setUsernameValue("");
      }
      }

      return true;
    } catch (e) {
      console.log("yeah no", e);
    }
  }
  return (
    <>
      <p>Enter a username!</p>
      <input
        id="username"
        value={usernameValue}
        onChange={(e) => setUsernameValue(e.target.value)}
      ></input>
      <button
        onClick={async () => {
          let didSave = await saveToFirebase();
          if (didSave)
          { 
            
            navigate("/");
            window.location.reload();
          }
        }}
      >
        Change Username!
      </button>
    </>
  );
}
