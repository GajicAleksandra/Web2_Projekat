import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home/Home';
import Profile from './components/User/Profile';
import VerifySalesmen from './components/User/VerifySalesmen';
import ProtectedRoute from './components/UI/ProtectedRoute';
import AccessDenied from './components/Auth/AccessDenied';
import ProductList from './components/Shop/ProductList/ProductList';
import ProductDetails from './components/Shop/ProductDetails/ProductDetails';
import ChangePassword from './components/User/ChangePassword'

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/accessdenied' element={<AccessDenied />} />
        <Route path="/profile" element={<ProtectedRoute Component={Profile} />} />
        <Route path="/changepassword" element={<ProtectedRoute Component={ChangePassword}/>} />
        <Route path="/pendingrequests" element={<ProtectedRoute Component={VerifySalesmen} role="0" additionalProp="Pending" />} />
        <Route path="/acceptedrequests" element={<ProtectedRoute Component={VerifySalesmen} role="0" additionalProp="Accepted" />} />
        <Route path="/rejectedrequests" element={<ProtectedRoute Component={VerifySalesmen} role="0" additionalProp="Rejected" />} />
        <Route path="/products" element={<ProtectedRoute Component={ProductList}/>} />
        <Route path="/details" element={<ProtectedRoute Component={ProductDetails}/>} />
        <Route path="/details/:id" element={<ProtectedRoute Component={ProductDetails}/>} />
      </Routes>
    </Router>
  );
}


export default App;
