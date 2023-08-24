import { getElementError } from "@testing-library/react";
import * as React from "react";
import { useRef, useEffect } from "react";

export function useOnDraw(onDraw) {
  const canvasRef = React.useRef(null); //current canvas
  const isDrawingRef = React.useRef(false); //Currently pressing down mouse button
  const history = React.useRef([]);

  const historyStartIndex = React.useRef(0);
  const historyEndIndex = React.useRef(0);

  const prevPointRef = useRef(null);

  function setCanvasRef(ref) {
    if (!ref) return null;
    canvasRef.current = ref;
    resizeCanvas();
    initMouseMoveListener();
    initMouseDownListener();
    initMouseUpListener();
  }

  function initMouseMoveListener() {
    console.log(isDrawingRef.current);
    const mouseMoveListener = (e) => {
      if (isDrawingRef.current) {
        const curX = e.touches ? e.touches[0].clientX : e.clientX;
        const curY = e.touches ? e.touches[0].clientY : e.clientY;
        const point = subPointInCanvas(curX, curY);
        const ctx = canvasRef.current.getContext("2d");
        if (onDraw) onDraw(ctx, point, prevPointRef.current)
        if(prevPointRef.current != null){
        history.current.push({
          type: "point",
          data: {
            start: { x: prevPointRef.current.x, y: prevPointRef.current.y },
            end: { x: point.x, y: point.y },
          },
        });
      }
        prevPointRef.current = point;
        
      

        historyStartIndex.current = historyEndIndex.current;
      }
    };
    window.addEventListener("mousemove", mouseMoveListener);
    window.addEventListener("touchmove", mouseMoveListener);
  }

  function initMouseUpListener() {
    const listener = (e) => {
      isDrawingRef.current = false;
      historyEndIndex.current = history.current.length - 1;
      prevPointRef.current = null;
    };
    window.addEventListener("mouseup", listener);
    window.addEventListener("touchend", listener);
  }



  function initMouseDownListener() {
    if (!canvasRef) {
      return null;
    }
    const listener = (e) => {
      isDrawingRef.current = true;
    };
    canvasRef.current.addEventListener("mousedown", listener);
    canvasRef.current.addEventListener("touchstart", listener);
    canvasRef.current.addEventListener("contextmenu", (e) =>
      e.preventDefault()
    );
    canvasRef.current.addEventListener("selectstart", (e) =>
      e.preventDefault()
    );
    canvasRef.current.addEventListener("touchmove", (e) => e.preventDefault());
  }

  function subPointInCanvas(clientX, clientY) {
    if (!canvasRef) return null;
    return {
      x: clientX - canvasRef.current.offsetLeft,
      y: clientY - canvasRef.current.offsetTop,
    };
  }

  function resizeCanvas() {
    const curCanvas = document.getElementById("myCanvas");
    curCanvas.width = window.innerWidth / 1.35;
    curCanvas.height = window.innerHeight / 1.50;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    for(let i = 0; i < history.current.length; i++){
      if(history.current[i].type == "point"){
        const start = history.current[i].data.start;
        const end = history.current[i].data.end;
        onDraw(ctx, end, start);
      }
    }
  }

  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
      // You can also perform other actions here when the window is resized
    };
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    //clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history.current = [];
    historyStartIndex.current = 0;
    historyEndIndex.current = 0;
    prevPointRef.current = null;
  }

  function undo() {
    const ctx = canvasRef.current.getContext("2d");
    let popCount = 0;
    //Going though the history array and popping from the latest start index to the the end
    //console.log(historyStartIndex.current);
    //console.log(historyEndIndex.current);
    for (let i = historyStartIndex.current;i < historyEndIndex.current;i++) {
      history.current.pop();
      popCount+= 1;
    }

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    for (let i = 0; i < history.current.length - 1; i++) {
      const startPoint = history.current[i].data.start;
      const endPoint = history.current[i].data.end;
      //console.log("Start: " + startPoint.x + " " + startPoint.y);
      //console.log("End:" + endPoint.x + " " + endPoint.y);
      drawLine(startPoint, endPoint, ctx);
    }

    historyStartIndex.current -= popCount;
    historyEndIndex.current -= popCount;
    
  }

  function drawLine(start, end, ctx) {
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(start.x, start.y, 1, 0, 360);
    ctx.fill();
  }

  return { setCanvasRef, clearCanvas, undo, canvasRef };
}
