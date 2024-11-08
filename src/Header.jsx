import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Logo_Rivera from "./img/Logo-removebg-preview.png";

const Header = () => {
  const[user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate(); // Inicializa useNavigate
 // const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  const isLoggedIn = () => {

   const token = localStorage.getItem('token');
  
  // console.log(token)
   return token !== null;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/api/user/byuser', { // Cambia la URL por la ruta correcta de tu API
            headers: {
              'x-token':  token,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
            console.log(data.role);
            if (data.role === "ADMIN_ROLE") {
                setIsAdmin(true);
            }
           // setIsAdmin(data.role.some(role => role === 'ADMIN_ROLE')); 
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  //useEffect(() => {
   // const checkUserRole = () => {
   //   const token = localStorage.getItem('token');
    //   if (token) {
      //    try {
            //setIsLoggedIn(true);
      //      setIsAdmin(true);
          //  if (userRole === 'ADMIN_ROLE') {
            //  setIsAdmin(true);
            // }
       //   } catch (error) {
         //   console.error('Error al decodificar el token:', error);
          //  }
        //}
    //};

   // checkUserRole();
 // }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    navigate('/');
    setIsAdmin(false);

    
  };

  return (
    <header className="header">
      <img src={Logo_Rivera} alt="Logo Rivera" className="Logo_Rivera" />
      <nav className="nav">
        <ul className="nav-list">
          <li><Link to="/Inicio" className="nav-link">Inicio</Link></li>
          <li><Link to="/products" className="nav-link">Productos</Link></li>
          {console.log("login",isLoggedIn())}
          {console.log("admin",isAdmin)}
          {console.log("user",user)}
          {!isLoggedIn() && ( 
            <>
              <li><Link to="/login" className="nav-link">Iniciar sesión</Link></li>
              <li><Link to="/register" className="nav-link">Registrarse</Link></li>
            </>
          )}
          {isAdmin && (
            <li><Link to="/admin" className="nav-link">Panel Administrador</Link></li>
          )}
          <li><Link to="/cart" className="nav-link"><img src="carritocompras.png" alt="" height="30" /></Link></li>
          {isLoggedIn() && (
            <button 
              className="nav-link logout-button" 
              onClick={logout}
            >
              Cerrar sesión
            </button>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
