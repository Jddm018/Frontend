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
    <div className="contenedor-de-compras">
      <h1 className="title">Historial de Compras</h1>
      <p className="compras-info"><strong>Número de compras realizadas:</strong> {numeroDeCompras}</p>
      {compras.length > 0 ? (
        compras.map((compra) => (
          <div className="card" key={compra._id}>
            <div className="card-header">
              <p><strong className="info-item">ID de la compra:</strong> {compra._id}</p>
              <p><strong className="info-item">Fecha:</strong> {new Date(compra.date).toLocaleDateString()}</p>
              <p><strong className="info-item">Pedido:</strong> #{compra.pay.numberpay}</p>
              <p><strong className="info-item">Pagado:</strong> ${compra.pay.amountpay.toLocaleString()}</p>
              <button className="btn-ver-detalles" onClick={() => toggleDetails(compra._id)}>
                {expandedCompra === compra._id ? 'Ver menos detalles' : 'Ver más detalles'}
              </button>
            </div>

            {/* Detalles expandibles */}
            {expandedCompra === compra._id && (
              <div className="card-details">
                <h2>Detalles de la Compra</h2>
                <p><strong className="info-item">Cliente:</strong> {compra.client.name} (DNI: {compra.client.dni})</p>
                <p><strong className="info-item">Teléfono:</strong> {compra.client.phone}</p>
                <p><strong className="info-item">Dirección:</strong> {compra.client.address}</p>
                <p><strong className="info-item">Pago realizado el día:</strong> {new Date(compra.pay.date).toLocaleDateString()}</p>
                <p><strong className="info-item">Total:</strong> ${compra.pay.amountpay.toLocaleString()}</p>
                

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

      {/* Estilos CSS dentro del componente JSX */}
      <style jsx>{`
        /* Reset de márgenes y paddings */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', sans-serif;
          background-color: #f4f7fb;
          color: #333;
          line-height: 1.6;
        }

        h1, h2 {
          font-weight: 600;
          color: #2c3e50;
        }

        h1 {
          font-size: 2.6rem;
          margin-bottom: 30px;
        }

        h2 {
          font-size: 1.8rem;
          margin-bottom: 15px;
        }

        .contenedor-de-compras {
          max-width: 100%;
          margin: 30px auto;
          padding: 40px;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .compras-info {
          font-size: 1.2rem;
          color: #7f8c8d;
          margin-bottom: 20px;
          text-align: center;
        }

        /* Estilo para cada card */
        .card {
          width: 90%;
          max-width: 1200px;  /* Limita el ancho máximo */
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 25px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-left: auto;
          margin-right: auto;
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          background-color: #ecf0f1;
          padding: 20px;
          border-bottom: 2px solid #ddd;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-header-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          flex-wrap: wrap;
        }

        .card-header-info p {
          margin: 5px 15px;
          color: #2c3e50;
        }

        .info-item {
          font-weight: 600;
        }

        .btn-ver-detalles {
          background-color: #3498db;
          color: #fff;
          padding: 12px 18px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
          margin-top: 15px;
        }

        .btn-ver-detalles:hover {
          background-color: #2980b9;
        }

        /* Detalles de la compra (expandibles) */
        .card-details {
          padding: 20px;
          background-color: #f9f9f9;
        }

        .payment-info p {
          margin-bottom: 10px;
          font-size: 1rem;
          color: #7f8c8d;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 25px;
        }

        table th, table td {
          padding: 14px 18px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        table th {
          background-color: #ecf0f1;
          color: #2c3e50;
          font-weight: 600;
        }

        table td {
          color: #7f8c8d;
        }

        table tr:hover {
          background-color: #f1f1f1;
        }

        /* Estilo cuando no hay compras */
        .no-compras {
          text-align: center;
          color: #34495e; /* Gris oscuro */
          font-size: 1.2rem;
        }

        /* Responsividad */
        @media (max-width: 768px) {
          .contenedor-de-compras {
            padding: 20px;
            margin: 10px;
          }

          .card-header-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .card-header-info p {
            margin: 5px 0;
          }

          .btn-ver-detalles {
            width: 100%;
          }

          .card {
            width: 100%;
            margin-left: 0;
            margin-right: 0;
          }
        }
      `}</style>
    </div>
    
  );
  
      


};

export default Compras;
