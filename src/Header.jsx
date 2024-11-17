import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Logo_Rivera from "./img/Logo-removebg-preview.png";
import InformeIcon from './img/informe.png';  // Asegúrate de importar la imagen
import CerrarSesionIcon from './img/cerrar-sesion.png'
import IniciarSesionIcon from './img/iniciar-sesion.png';
import CarritoIcon from './img/supermercado.png'; 
import AdminPanelIcon from './img/equipo-de-usuario.png';
import CompraIcon from './img/reloj.png';

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
              'Accept': 'application/json',
              'Content-Type':'multipart/form-data',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
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
        <li>
            <Link to="/purchase_history" className="nav-link">
              <img src={CompraIcon} alt="compras" height="30" />
            </Link>
        </li>
          {console.log("login",isLoggedIn())}
          {console.log("admin",isAdmin)}
          {console.log("user",user)}
          <li>
            <img 
              src={InformeIcon} 
              alt="Power BI" 
              className="powerbi-icon"
              onClick={() => window.open('https://app.powerbi.com/view?r=eyJrIjoiNDgyN2M2ODctZDk0OC00YWEzLTk4NDMtM2QwNTlkMDExY2UxIiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9', '_blank')} 
            />
          </li>
          {!isLoggedIn() && ( 
            <>
               <li>
                <Link to="/login" className="nav-link">
                  <img src={IniciarSesionIcon} alt="Iniciar sesión" height="30" />
                </Link>
              </li>
            </>
          )}
          {console.log(isAdmin)}
          {isAdmin && (
            
            <li>
            <Link to="/admin" className="nav-link">
              <img src={AdminPanelIcon} alt="Panel de Administrador" height="30" />
            </Link>
          </li>
          )}
          <li>
            <Link to="/cart" className="nav-link">
              <img src={CarritoIcon} alt="Carrito de compras" height="30" />
            </Link>
          </li>
          {isLoggedIn() && (
            <div
            className="nav-link logout-button"
            onClick={logout}
          >
            <img src={CerrarSesionIcon} alt="Cerrar sesión" />
          </div>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
