import React, { } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import InicioContenido from './InicioContenido';
import Login from './Login';
import './App.css';
import RegistroLogin from './RegistroLogin';
import CartItem from './CartItem';
import ProductView from './ProductView';
import Inicio from './Inicio';
import ViewAdmin from './ViewAdmin';
import Pago from './Pago';
import PagoRealizado from './PagoRealizado';



function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path='/cart' element={<CartItem />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="products" element={<InicioContenido />} />
          <Route path="Inicio" element={<Inicio/>} />
          <Route path="/" element={<Inicio/>} />
          <Route path="product/:id"element={<ProductView/>}/>
          

          <Route path="register" element={<RegistroLogin/>} />
          

          <Route path="register" element={<RegistroLogin />} />
          <Route path='/admin' element={<ViewAdmin/>}/>
          <Route path='/pay' element={<Pago/>} />
          <Route path='/pay-successfully' element={<PagoRealizado/>}/>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;