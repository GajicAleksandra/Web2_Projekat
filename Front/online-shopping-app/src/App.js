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
import AddProduct from './components/Shop/AddProduct/AddProduct';
import EditProduct from './components/Shop/EditProduct/EditProduct';
import CashRegister from './components/Shop/CashRegister/CashRegister';
import { Users } from './components/User/Users';
import { AdminOrderList, SalesmanOrderList, CustomerOrderList } from './components/Order/OrderList/OrderList';


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
        <Route path="/adminorders" element={<ProtectedRoute Component={AdminOrderList} role="0" />} />
        <Route path="/customerorders/:type" element={<ProtectedRoute Component={CustomerOrderList} role="1" />} />
        <Route path="/salesmanorders/:type" element={<ProtectedRoute Component={CustomerOrderList} role="2" />} />
        <Route path="/pendingrequests" element={<ProtectedRoute Component={VerifySalesmen} role="0" additionalProp="Pending" />} />
        <Route path="/products" element={<ProtectedRoute Component={ProductList} additionalProp="verificationRequired"/>} />
        <Route path="/details" element={<ProtectedRoute Component={ProductDetails} additionalProp="verificationRequired"/>} />
        <Route path="/details/:id" element={<ProtectedRoute Component={ProductDetails} additionalProp="verificationRequired"/>} />
        <Route path="/addproduct" element={<ProtectedRoute Component={AddProduct} role="2" additionalProp="verificationRequired" />} />
        <Route path="/editproduct/:id" element={<ProtectedRoute Component={EditProduct} role="2" additionalProp="verificationRequired" />} />
        <Route path="/checkout" element={<ProtectedRoute Component={CashRegister} role="1" />} />
        <Route path="/customers" element={<ProtectedRoute Component={Users} role="0" additionalProp="customers"/>} />
        <Route path="/salesmen" element={<ProtectedRoute Component={Users} role="0" additionalProp="salesmen"/>} />
      </Routes>
    </Router>
  );
}


export default App;
