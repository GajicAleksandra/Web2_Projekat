import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Home from './components/Home/Home'
import Profile from './components/User/Profile';
import VerifySalesmen from './components/User/VerifySalesmen';
import ProtectedRoute from './components/UI/ProtectedRoute';
import AccessDenied from './components/Auth/AccessDenied'

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/accessdenied' element={<AccessDenied />} />
        <Route path="/profile" element={<ProtectedRoute Component={Profile} />} />
        <Route path="/verifysalesmen" element={<ProtectedRoute Component={VerifySalesmen} role="0" />} />
      </Routes>
    </Router>
  );
}


export default App;
