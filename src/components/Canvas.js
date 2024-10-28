import React, {useState, useEffect, useRef} from 'react'

export function Canvas(){
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState();
  const [prediction, setPrediction] = useState("None");
  const [isFetching, setisFetching] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      setCtx(canvas.getContext('2d'));
      canvasRef.current.width = 560;  // Set canvas resolution
      canvasRef.current.height = 560; 
    }
  }, [canvasRef]);

  const stopDrawing = (e) => {setIsDrawing(false)}

  const draw = e =>{
    if(isDrawing){
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "white";  
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.stroke();
      setPosition({x, y})
    }
  }

  const clearDrawing = e =>{
    ctx.fillStyle = "black";
    ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  //when user clicks "Predict"
  const handleEnter = e =>{
    if (isFetching) {return;}

    setisFetching(true)
    const pngDataUrl = canvasRef.current.toDataURL('image/png');
    setPrediction('Predicting...')
    fetch("http://localhost:5000/data", {     //POST request to server.py
      method: "POST",
      headers: {'Content-Type': 'image/png'}, 
      body: JSON.stringify({ image: pngDataUrl })
    }).then((res) => res.json())
    .then((res) => setPrediction(res['value']))
    .finally(() => setisFetching(false))
  }

  return(
    <div style = {{display: 'grid', cols:'1', rows:'2'}}>
      <canvas ref = {canvasRef} 
      onMouseDown={()=>{setIsDrawing(true)}} 
      onMouseLeave={stopDrawing}
      onMouseUp={stopDrawing}
      onMouseMove={draw}
      style = {{border: "1px solid", width:'560px', height:'560px', backgroundColor: 'black'}}> </canvas>

      <div style = {{display: 'flex'}}>
        <button style = {{fontSize: '20px'}} onClick={clearDrawing}>
          Clear Drawing Board
        </button>
        <button style = {{fontSize: '20px'}} onClick = {handleEnter}>
          Predict Number
        </button>
        <p style = {{marginLeft:'10px', fontSize:'15px', textSizeAdjust:'auto'}}>Your number is: {prediction}</p>
      </div>
    </div>
  )
}