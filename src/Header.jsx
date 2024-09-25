import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 
import Logo_Rivera from "./img/Logo-removebg-preview.png";

const Header = () => {
  const[user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token !== null;
  };

  
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/api/usuario/findByEmail', { // Cambia la URL por la ruta correcta de tu API
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
            console.log(data);
            setIsAdmin(data.roles.some(role => role.name === 'ADMIN')); 
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

  const logout = () => {
    localStorage.removeItem('token');

  };

  return (
    <header className="header">
      <img src={Logo_Rivera} alt="Logo Rivera" className="Logo_Rivera" />
      <nav className="nav">
        <ul className="nav-list">
          <li><Link to="/Inicio" className="nav-link">Inicio</Link></li>
          <li><Link to="/products" className="nav-link">Productos</Link></li>
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
            <>
              <a href='' className="nav-link" onClick={logout}>Cerrar sesión</a>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;

