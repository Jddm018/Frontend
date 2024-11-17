import React from 'react';
import './ListaProductos.css';
import { Link } from 'react-router-dom';

const ListaProductos = ({ productos }) => {
  if (!Array.isArray(productos) || productos.length === 0) {
    return <p>No hay productos disponibles.</p>;
  }

  return (
    <div className="lista-productos">
      <h1>Todo lo que buscas, en un solo lugar</h1>
      <div className="productos">
        {console.log(productos)}
        {productos.map((producto) => (
          <Link to={`/product/${producto._id}`} key={producto._id} className="producto-link">
            <div className="producto">
              <div className="producto-imagen-container">
                <img 
                  src={`http://localhost:8080/uploads/products/${producto.images}`} 
                  alt={producto.title} 
                  className="producto-imagen" 
                />
              </div>
              <div className="producto-detalle">
                <h2 className="producto-titulo">{producto.name}</h2>
                <p className="producto-precio">${producto.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ListaProductos;
