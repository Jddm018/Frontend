import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ProductCards from './ProductCards';
import ProductosPorCategoria from './ProductosPorCategoria';
import Login from './Login';
import './App.css';
import RegistroLogin from './RegistroLogin';
import CartItem from './CartItem';
import ProductView from './ProductView';
import Inicio from './Inicio';
import ViewAdmin from './ViewAdmin';
import ClientForm from './ClientForm';
import PagoRealizado from './PagoRealizado';
import PaymentSummary from './PaymentSummary';
import Compras from './Compras';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        {/* Envuelve el contenido principal en main-content */}
        <div className="main-content">
          <Routes>
            <Route path='/cart' element={<CartItem />}></Route>
            <Route path="/login" element={<Login />} />
            <Route path='/purchase_history' element={<Compras />}></Route>
            <Route path="products" element={<ProductCards />} />
            <Route path="Inicio" element={<Inicio />} />
            <Route path="/" element={<Inicio />} />
            <Route path="/category/:categoryId" element={<ProductosPorCategoria />} />
            <Route path="product/:id" element={<ProductView />} />
            <Route path="register" element={<RegistroLogin />} />
            <Route path='/admin' element={<ViewAdmin />} />
            <Route path='/pay' element={<ClientForm />} />
            <Route path='/payment-summary' element={<PaymentSummary />} />
            <Route path='/pay-successfully' element={<PagoRealizado />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
