import "./App.css";
import * as React from "react";
import { useOnDraw } from "./Hooks";
import {
  firestore,
  curcollection,
  userCollection,
  addDoc,
  getDocs,
  auth,
  firebase,
  useAuthState,
  serverTimestamp,
} from "./firebase.js";
import { signInWithPopup } from "firebase/auth";
import { FeedPage, listOfMessages } from "./Pages/FeedPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { DrawPage } from "./Pages/DrawPage";
import { UserPage } from "./Pages/UserPage";
import { UsernamePage } from "./Pages/UsernamePage";
import { CurrentMessagePage } from "./Pages/CurrentMessagePage";

function App() {
  const [user] = useAuthState(auth);
  const [userName, setUserName] = React.useState(false);

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      signInWithPopup(auth, provider);
      console.log("Succsessfully Signed In");
    } catch (e) {
      console.log("Sign In Failed", e);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(userCollection);
      if (user) {
        const curUser = {
          email: auth.currentUser.email,
          timestamp: serverTimestamp(),
          username: "",
        };

        //If user is in the database already and if they DO have a username
        //or if their username spot in databse is NOT blank then userExists is ture
        //else add the user into the database
        let userExists = false;
        try {
          for (const doc of querySnapshot.docs) {
            if (doc.data().email === auth.currentUser.email) {
              userExists = true;
              break;
            }
          }

          if (userExists === false) await addDoc(userCollection, curUser);
        } catch (e) {
          console.log(e);
        }
        ifUserName(); // Call the ifUserName function when the user state changes
      }
    };
    fetchData();
  }, [user]);

  //If username is blank it needs to set user else its false
  async function ifUserName() {
    const querySnapshot = await getDocs(userCollection);
    querySnapshot.forEach((doc) => {
      if (doc.data().email === auth.currentUser.email) {
        if (doc.data().username === "")
        { 
          setUserName(true);
          //console.log("Its true");
        }
        else setUserName(false);
      }
    });

    console.log(userName);
  }

  return (
    <Router>
      <div className="App">
        <header className="AppHeader"></header>
      </div>
      <Routes>
        <Route path="/message/:messageId" element={<CurrentMessagePage/>} />
        <Route path="/username" element={<UsernamePage />} />
        <Route path="/draw" element={<DrawPage />} />
        <Route
          path="/"
          element={
            user ? (
              userName ? (
                <>
                  <UsernamePage />
                </>
              ) : (
                <>
                  <div className="mainContent">
                    <div className="topOfPage">
                      <Link to="/draw">
                        <img className="drawIcon" src={require("./images/draw4.png")}></img>
                      </Link>
                      <Link to="/userpage">
                        <img src={user.photoURL} />
                      </Link>
                    </div>
                    <div className="scrollableContainer">
                      <FeedPage/>
                    </div>
                    <button
                      className="signoutBtn"
                      onClick={() => {
                        auth.signOut();
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )
            ) : (
              <>
                <button onClick={signInWithGoogle}>Sign In With Google</button>
              </>
            )
          }
        />
        <Route
          path="/userpage"
          element={<UserPage/>}
        />
      </Routes>
    </Router>
  );
}

export default App;
