import React from 'react';
import { useLocation } from 'react-router-dom';
import './PagoRealizado.css';

const PagoRealizado = () => {
    const location = useLocation();
    const { paymentResponse } = location.state || {}; // Obtener paymentResponse desde location.state

    // Verificar qué está recibiendo el componente
    console.log('Datos recibidos en PagoRealizado:', location.state); // Agrega este log para ver los datos
    
    // Verificar si paymentResponse está presente
    if (!paymentResponse) {
        return <p>No se encontraron datos de pago.</p>;
    }

    return (
        <div className="payment-success-container">
            <div className="payment-received-card">
                <h2 className="payment-success-title">Pago Realizado Exitosamente</h2>
                <p className="payment-success-message"><strong>ID de Pedido:</strong> {paymentResponse._id}</p>
                <p className="payment-success-message"><strong>Total:</strong> ${paymentResponse.total}</p>
                <p className="payment-success-message"><strong>Fecha:</strong> {new Date(paymentResponse.date).toLocaleString()}</p>

                <div className="client-details">
                    <h3 className="section-header">Información del Cliente:</h3>
                    <p><strong>Nombre:</strong> {paymentResponse.client.name}</p>
                    <p><strong>Documento de Identidad:</strong> {paymentResponse.client.dni}</p>
                    <p><strong>Teléfono:</strong> {paymentResponse.client.phone}</p>
                </div>

                <div className="payment-details">
                    <h3 className="section-header">Detalles de Pago:</h3>
                    <p><strong>Número de Pago:</strong> {paymentResponse.pay.numberpay}</p>
                    <p><strong>Monto Pagado:</strong> ${paymentResponse.pay.amountpay}</p>
                    <p><strong>Fecha de Pago:</strong> {new Date(paymentResponse.pay.date).toLocaleString()}</p>
                </div>

                <h3 className="section-header">Productos Comprados:</h3>
                <ul className="product-details-list">
                    {paymentResponse.products.map((item) => (
                        <li className="product-details-item" key={item._id}>
                            <span className="product-details-name">{item.product.name}</span> - 
                            Cantidad: <span className="product-details-quantity">{item.quantity}</span> - 
                            Precio: <span className="product-details-price">${item.product.price}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PagoRealizado;
