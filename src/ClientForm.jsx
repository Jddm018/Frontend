import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(client),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error al crear cliente (detalles):', errorData);
                throw new Error('Error al crear el cliente');
            }

            const newClient = await response.json();

            // Usar el campo `uid` en lugar de `_id` para navegar
            if (!newClient.uid) {
                console.error('La respuesta del backend no contiene un UID válido:', newClient);
                throw new Error("El cliente creado no contiene un UID válido");
            }

            // Navegar a la siguiente página con los datos del cliente, carrito y precio total
            navigate('/payment-summary', { state: { client: newClient.uid, cart, totalPrice } });
        } catch (error) {
            console.error('Error al crear cliente:', error);
            alert('Error al crear cliente. Intenta de nuevo.');
        }
    };

    return (
        <div className="payment-container">
            <div className="card">
                <form className="payment-form">
                    <h2>Información del Cliente</h2>
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
                    </div>
                    <button type="button" onClick={handleNextStep} className="submit-button">Paso 2</button>
                </form>
            </div>
        </div>
    );
};

export default ClientForm;
