import React, { useState, useEffect } from 'react';

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [expandedCompra, setExpandedCompra] = useState(null); 
  
  

  useEffect(() => {
    const fetchCompras = async () => {
      const user = JSON.parse(localStorage.getItem('user'));      
      const token = localStorage.getItem('token');
      console.log("es usuario:", user)
      console.log(`Buscando compras para el usuario con ID: ${user.uid}`); 
      try {
        const response = await fetch(`http://localhost:8080/api/buy/byuser/${user.uid}`, { 
          headers: {
            'x-token':  token,
            'Accept': 'application/json',
            'Content-Type':'multipart/form-data',
          },
        });
               
        console.log('Respuesta de la API:', response); // Muestra la respuesta de la API

        if (response.ok) {
          const data = await response.json();
          console.log('Datos de compras recibidos:', data.buys); // Verifica los datos de la respuesta
          setCompras(data.buys); 
        } else {
          console.error('Error al obtener el historial de compras');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    }; fetchCompras();    
  }, []);
  const toggleDetails = (compraId) => {
    setExpandedCompra(expandedCompra === compraId ? null : compraId);
  };

   // Obtener el número total de compras
   const numeroDeCompras = compras.length;

  console.log('Compras del usuario:', compras); // Verifica el estado de las compras

  return (
    <div className="contenedor de compras">
      <h2>Historial de Compras</h2>
      <p><strong>Número de compras realizadas:</strong> {numeroDeCompras}</p>

      {compras.length > 0 ? (
        compras.map((compra) => (
          <div className="card" key={compra._id}>
            {/* Resumen de la compra */}
            <div className="card-header">
              <p><strong>ID De La Compra:</strong> {compra._id}</p>
              <p><strong>Fecha:</strong> {new Date(compra.date).toLocaleDateString()}</p>
              <p><strong>Numero de Pago:</strong> {compra.pay.numberpay}</p>
              <p><strong>pagado:</strong> ${compra.pay.amountpay.toLocaleString()}</p>
              <button className="btn-ver-detalles" onClick={() => toggleDetails(compra._id)}>
                {expandedCompra === compra._id ? 'Ver menos detalles' : 'Ver más detalles'}
              </button>
            </div>

            {/* Detalles expandibles */}
            {expandedCompra === compra._id && (
              <div className="card-details">
                <h4>Detalles de la Compra</h4>
                <p><strong>Cliente:</strong> {compra.client.name} (DNI: {compra.client.dni})</p>
                <p><strong>Teléfono:</strong> {compra.client.phone}</p>
                <p><strong>Dirección:</strong> {compra.client.address}</p>

                <div className="payment-info">
                  <p><strong>Pago realizado el dia:</strong> {new Date(compra.pay.date).toLocaleDateString()}</p>
                  <p><strong>Total:</strong> ${compra.pay.amountpay.toLocaleString()}</p>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Precio Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compra.products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.product.name}</td>
                        <td>{product.quantity}</td>
                        <td>${product.product.price.toLocaleString()}</td>
                        <td>${(product.product.price * product.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No tienes compras registradas.</p>
      )}
    </div>
  );
};

export default Compras;
