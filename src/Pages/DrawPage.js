import { useOnDraw } from "../Hooks";
import {
  firestore,
  curcollection,
  addDoc,
  auth,
  firebase,
  useAuthState,
  serverTimestamp,
} from "../firebase.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";

export function DrawPage() {
  const [user] = useAuthState(auth);
  const { setCanvasRef, clearCanvas, undo, canvasRef } = useOnDraw(onDraw);
  const navigate = useNavigate();
  function onDraw(ctx, point, prevPoint) {
    drawLine(prevPoint, point, ctx, ctx.strokeStyle, 2);
  }

  function drawLine(start, end, ctx, color, width) {
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(start.x, start.y, 1, 0, 360);
    ctx.fill();
  }
  async function saveToFirebase() {
    const canvas = canvasRef.current;
    const canvasDataUrl = canvas.toDataURL();
    //const history = useHistory();
    const messageValue = document.getElementById("message").value;

    const jsonToSave = {
      canvasData: canvasDataUrl,
      message: messageValue,
      user: user.email,
      timestamp: serverTimestamp(),
    };
    try {
      await addDoc(curcollection, jsonToSave);
      //console.log("saved");
      clearCanvas();
      document.getElementById("message").value = "";
    } catch (e) {
      console.log("yeah no", e);
    }
  }

  return (
    <>
      <div className="DrawArea" id="drawArea">
        <canvas
          id="myCanvas"
          className="canvasDraw"
          ref={setCanvasRef}
        ></canvas>
      </div>
      <div className="btns">
      <button className="clearBtn" onClick={clearCanvas}>
        Clear
      </button>
      <button className="clearBtn" onClick={undo}>
        Undo
      </button>
      </div>
      <br />
      <textarea
        className="message"
        type="text"
        name="name"
        rows="5"
        cols="30"
        id="message"
      />
      <button
        className="sendBtn"
        onClick={() => {
          saveToFirebase();
          navigate("/");
        }}
      >
        Send
      </button>
    </>
  );
}
