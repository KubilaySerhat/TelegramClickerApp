import { useState } from 'react'
import './App.css'

function App() {
  const [points, setPoints] = useState(3000000);
  const [energy, setEnergy] = useState(2500);

  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">

      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>

      <div className="absolute inset-0 flex items-center justify-center z-0">
      <div className="radial-gradient-overlay"></div>
      
      </div>

    </div>
  )
}

export default App
