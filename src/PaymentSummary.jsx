import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentSummary.css';

const PaymentSummary = () => {
    const [paymentResponse, setPaymentResponse] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, totalPrice, client } = location.state || {}; // Obtenemos cart, totalPrice y client

    // Validación de los datos recibidos
    if (!cart || !totalPrice || !client) {
        return <div>Error: No se encontraron los datos del carrito o cliente. Vuelve a intentarlo.</div>;
    }

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token'); // Token de autenticación

            // Asegúrate de que el token se ha cargado correctamente
            console.log('Token cargado:', token);

            // Realiza la solicitud para procesar el pago
            const response = await fetch('http://localhost:8080/api/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `x-token ${token}`,
                },
                body: JSON.stringify({
                    cart, 
                    totalPrice, 
                    client
                }),
            });

            if (!response.ok) {
                throw new Error('Error en el pago');
            }

            // Respuesta del pago
            const data = await response.json();
            console.log('Pago realizado:', data);
            setPaymentResponse(data); // Guardamos la respuesta del pago

            // Redirigir a la página de pago exitoso
            navigate('/pay-successful', { state: { paymentResponse: data } });
        } catch (error) {
            console.error('Error en la solicitud de pago:', error);
            alert('Error al procesar el pago. Intenta de nuevo.');
        }
    };

    return (
        <div className="payment-summary-container">
            <h2>Resumen de la Compra</h2>
            <div className="summary-details">
                <p><strong>Total:</strong> ${totalPrice}</p>
                <p><strong>Cliente:</strong> {client.name}</p>
            </div>

            <button onClick={handlePayment} className="submit-button">Realizar Pago</button>

            {paymentResponse && (
                <div className="payment-response">
                    <h3>Detalles del Pago:</h3>
                    <p><strong>ID de Pago:</strong> {paymentResponse._id}</p>
                    <p><strong>Monto Total:</strong> ${paymentResponse.total}</p>
                    <p><strong>Fecha:</strong> {new Date(paymentResponse.date).toLocaleString()}</p>

                    {/* Mostrar los productos si existen */}
                    {paymentResponse.products && paymentResponse.products.length > 0 ? (
                        <div className="product-details">
                            <h3>Productos Comprados:</h3>
                            <ul>
                                {paymentResponse.products.map((item) => (
                                    <li key={item._id}>
                                        <span>{item.product.name}</span> - Cantidad: {item.quantity} - Precio: ${item.product.price}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No se encontraron productos en esta compra.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentSummary;
