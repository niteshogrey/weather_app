import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/register' element={<Signup/>} />
          <Route path='/Login' element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
