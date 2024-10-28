import React from 'react'
import {Canvas} from './components/Canvas'

function App(){
  return (
    <div style = {{display: 'grid',
      border: "1px solid",
      justifyContent:'center',
      cols: '1',       
      rows: '1',}}>

      <h1 style = {{fontSize:"30px", marginBottom:"0px", display: 'flex'}}> Canvas Classifier </h1>
      <p style = {{fontSize:'15px'}}>Draw a digit 1-9</p>
      <Canvas style = {{display:'flex'}}/>
    </div>
  ) 
}
export default App