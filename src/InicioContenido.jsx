import React, { useState, useEffect } from 'react';
import './InicioContenido.css'; // Importa el archivo de estilos CSS para el contenido inicial
import ListaProductos from './ListaProductos'; // Importa el componente ListaProductos

const InicioContenido = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/product/');
        const data = await response.json();
        
        // Log para verificar los datos recibidos desde la API
        console.log('Datos de productos recibidos:', data);

        // Accede al array de productos dentro de la propiedad 'products'
        if (Array.isArray(data.products)) {
          setProductos(data.products);
        } else {
          console.error('La API no devolvió un array:', data);
        }
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    obtenerProductos();
  }, []);

  return (
    <div className="inicio-contenido">
      <ListaProductos productos={productos} />
    </div>
  );
}

export default InicioContenido;
