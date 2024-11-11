import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ClientForm.css';

const ClientForm = () => {
    const [client, setClient] = useState({ dni: '', name: '', email: '', phone: '', address: '' });
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, totalPrice } = location.state || {};

    if (!cart || !totalPrice) {
        return <div>Error: No se encontraron los datos del carrito. Vuelve a intentarlo.</div>;
    }

    const handleChange = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const handleNextStep = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("No se ha encontrado el token de autenticación. Por favor, inicia sesión de nuevo.");
                return;
            }

            const response = await fetch('http://localhost:8080/api/client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token,
                },
                body: JSON.stringify(client),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error al crear cliente (detalles):', errorData);
                throw new Error('Error al crear el cliente');
            }

            const  data = await response.json();
           
            const newClient  = data.client;
            if (!newClient.uid) {

                console.error('La respuesta del backend no contiene un UID válido:', newClient);
                throw new Error("El cliente creado no contiene un UID válido");
            }

            navigate('/payment-summary', { state: { client: newClient.uid, cart, totalPrice } });
        } catch (error) {
            console.error('Error al crear cliente:', error);
            alert('Error al crear cliente. Intenta de nuevo.');
        }
    };

    return (
        <div className="payment-container">
            <div className="card">
                {/* Imagen del logo en la esquina superior derecha */}
                <img src="/visa-mastercard.png" alt="Visa y Mastercard" className="logo" />
                <h2>Información del Cliente</h2>
                <form className="payment-form">
                    
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
                    <button type="button" onClick={handleNextStep} className="submit-button">Continuar</button>
                </form>
            </div>
        </div>
    );
};

export default ClientForm;
