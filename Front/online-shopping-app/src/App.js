import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Home from './components/Home/Home'
import Profile from './components/User/Profile';
import VerifySalesmen from './components/User/VerifySalesmen';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/verifysalesmen" element={<VerifySalesmen />} />
          </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}


export default App;
