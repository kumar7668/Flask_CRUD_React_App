import './App.css';
import SensorDashboard from './Components/SensorDashboard';
import SocketSensorDashboard from './Components/dashesnce';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>

    
    <BrowserRouter>
      <Routes>

      
      <Route path="/" element={<SocketSensorDashboard />} />
      <Route path="/data-maping"  element={<SensorDashboard />} />
    
  
    </Routes>
    </BrowserRouter>
    </>
    
  );
}

export default App;
