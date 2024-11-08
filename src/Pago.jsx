import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Pago.css';

const Pago = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const location = useLocation();
    const { totalPrice } = location.state || { totalPrice: 0 };
    const taxRate = 0.19;
    const taxAmount = totalPrice * taxRate;
    const totalWithTax = totalPrice + taxAmount;
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState({ dni: '', name: '', email: '', phone: '', address: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const handleCreateClient = async () => {
        try {
            console.log('Registrando cliente:', client); // Agregado para ver los datos del cliente

            const response = await fetch('http://localhost:8080/api/client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(client),
            });

            if (!response.ok) {
                throw new Error('Error al crear el cliente');
            }

            const newClient = await response.json();
            return newClient;
        } catch (error) {
            console.error('Error al crear cliente:', error);
            alert('Error al crear cliente. Intenta de nuevo.');
            return null;
        }
    };

    const handlePago = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        console.log(storedCart);
        const paymentData = {
            client,
            products: storedCart.map(item => ({
                product: item._id, 
                quantity: item.quantity,
            })),
        };

        console.log('Datos del pago:', paymentData); // Agregado para ver la información antes de enviar el pago

        try {
            const createdClient = await handleCreateClient();
            if (!createdClient) {
                setLoading(false);
                return;
            }

            paymentData.client = createdClient;

            const response = await fetch('http://localhost:8080/api/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(paymentData),
            });

            if (!response.ok) {
                throw new Error('Error en el pago');
            }

            const result = await response.json();
            localStorage.removeItem('cart');

            setLoading(false);
            navigate('/pay-successfully', { state: { paymentResponse: result } });
        } catch (error) {
            console.error('Error en la solicitud de pago:', error);
            setLoading(false);
            alert('El pago falló. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="payment-container">
            <div className="card">
                <form className="payment-form" onSubmit={handlePago}>
                    <div className="header-container">
                        <div className="form-title">
                            <h2>Información del Cliente</h2>
                        </div>
                        <div className="payment-logo-container">
                            <img src="/visa-mastercard.png" alt="Visa Mastercard" className="payment-logo" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="dni">Documento de Identidad:</label>
                            <input type="text" id="dni" name="dni" value={client.dni} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Nombre Completo:</label>
                            <input type="text" id="name" name="name" value={client.name} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico:</label>
                            <input type="email" id="email" name="email" value={client.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Teléfono:</label>
                            <input type="tel" id="phone" name="phone" value={client.phone} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="address">Dirección:</label>
                            <input type="text" id="address" name="address" value={client.address} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cardNumber">Número de Tarjeta:</label>
                            <input type="text" id="cardNumber" name="cardNumber" maxLength="19" required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="expiryDate">Fecha de Expiración:</label>
                            <input type="text" id="expiryDate" name="expiryDate" value={new Date(Date.now() + 12 * 60 * 60 * 1000).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cvv">CVV:</label>
                            <input type="text" id="cvv" name="cvv" maxLength="3" required />
                        </div>
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Procesando...' : 'Pagar'}
                    </button>
                </form>
            </div>

            <div className="card">
                <div className="summary-container">
                    <div className="summary-header">
                        <h2>Resumen del Pedido</h2>
                    </div>
                    <div className="summary-details">
                        <p className="bold">Precio Total: ${totalPrice.toFixed(2)}</p>
                        <p className="bold">IVA (19%): ${taxAmount.toFixed(2)}</p>
                        <p className="bold">Total con IVA: ${totalWithTax.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pago;
