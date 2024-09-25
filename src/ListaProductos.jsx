import React, { } from 'react';
import './ListaProductos.css';
import { Link } from 'react-router-dom';

const ListaProductos = ({ productos }) => {
  console.log(productos);

  return (
    <div className="lista-productos">
      <h2>Nuestros Productos</h2>
      <div className="productos">
        {productos
          .filter(producto => producto !== null)
          .map((producto, index) => (
            <Link to={`/product/${producto.id}`}><div key={index} className="producto">
            <img src={producto.images} alt={producto.title} className="producto-imagen" />
            <div className="producto-detalle">
              <h3 className="producto-titulo">{producto.name}</h3>
              
            </div>
            
          </div>
          </Link>
          ))}
      </div>
    </div>
  );
};

export default ListaProductos;
