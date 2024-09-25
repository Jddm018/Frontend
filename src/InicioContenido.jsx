import React, { useState, useEffect } from 'react';
import './InicioContenido.css'; // Importa el archivo de estilos CSS para el contenido inicial
import ListaProductos from './ListaProductos'; // Importa el componente ListaProductos

const InicioContenido = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    const obtenerProductosDestacados = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/product/findAll');
        const data = await response.json();
        setProductosDestacados(data);
      } catch (error) {
        console.error('Error al obtener productos destacados:', error);
      }
    };

    obtenerProductosDestacados();
  }, []);

  return (
    <div className="inicio-contenido">
      
      <ListaProductos productos={productosDestacados} />
    </div>
  );
}

export default InicioContenido;
