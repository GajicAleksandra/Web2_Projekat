import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/UI/Nav';
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Home from './components/Home/Home'
import Profile from './components/User/Profile';

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
          </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}


export default App;
