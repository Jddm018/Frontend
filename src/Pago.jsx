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
    const navigate = useNavigate();
    
    console.log(storedCart.map(item => (item.product)));
    const handlePago = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        const paymentData = storedCart.map(item => ({
            user: {
                id: 1
            },
            product: {
                id: item.id,
                name: item.name,
                price: item.price,
                category: item.category,
                images: item.images
            },
            quantity: item.quantity
        }));
            console.log(paymentData);
        // Verificar si paymentData está vacío o nulo antes de enviarlo al backend
        if (paymentData && paymentData.length > 0) {
            try {
                const response = await fetch('http://localhost:8080/api/buy/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(paymentData)
                });

                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue satisfactoria');
                }

                const result = await response.json();
                console.log('Pago exitoso:', result);
                localStorage.removeItem('cart');

                setLoading(false);
                navigate('/pay-successfully', { state: { paymentResponse: result } });
            } catch (error) {
                console.error('Hubo un problema con la solicitud de pago:', error);
                setLoading(false);
                alert('El pago falló. Por favor, inténtalo de nuevo.');
            }
        } else {
            console.error('El carrito está vacío o los datos del producto son incorrectos.');
            setLoading(false);
            alert('El carrito está vacío o los datos del producto son incorrectos. Por favor, verifica tu carrito y vuelve a intentarlo.');
        }
    };


    const formatCardNumber = (e) => {
        const input = e.target;
        let value = input.value.replace(/\D/g, ''); // Elimina todos los caracteres que no son dígitos
        value = value.slice(0, 16); // Limita a 16 dígitos

        // Añade espacio después de cada 4 dígitos
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');

        input.value = formattedValue;
    };

    const formatExpiryDate = (e) => {
        const input = e.target;
        let value = input.value.replace(/\D/g, ''); // Elimina todos los caracteres que no son dígitos
        if (value.length > 4) value = value.slice(0, 4); // Limita a 4 dígitos
        if (value.length > 2) {
            value = `${value.slice(0, 2)}/${value.slice(2)}`; // Añade el '/'
        }
        input.value = value;
    };

    const formatCVV = (e) => {
        const input = e.target;
        let value = input.value.replace(/\D/g, ''); // Elimina todos los caracteres que no son dígitos
        value = value.slice(0, 3); // Limita a 3 dígitos
        input.value = value;
    };

    return (
        <div className="payment-container">
            <div className="card payment-card">
                <h2>Detalles del Pago</h2>
                <img src="visa-mastercard.png" alt="Visa y Mastercard" className='visa-mastercard' />
                <form onSubmit={handlePago}>
                    <div className="form-group">
                        <label htmlFor="cardNumber">Número de Tarjeta:</label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            maxLength="19"
                            pattern="\d{4}\s\d{4}\s\d{4}\s\d{4}"
                            placeholder="XXXX XXXX XXXX XXXX"
                            required
                            onInput={formatCardNumber}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cardName">Nombre en la Tarjeta:</label>
                        <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            maxLength="50"
                            pattern="[A-Za-z\s]+"
                            placeholder="Ingresa el nombre como aparece en la tarjeta"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="expiryDate">Fecha de Expiración:</label>
                        <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/AA"
                            maxLength="5"
                            pattern="\d{2}/\d{2}"
                            required
                            onInput={formatExpiryDate}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cvv">CVV:</label>
                        <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            maxLength="3"
                            pattern="\d{3}"
                            placeholder="XXX"
                            required
                            onInput={formatCVV}
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Procesando...' : 'Pagar'}
                    </button>
                </form>
            </div>
            <div className="card summary-card">
                <h2>Resumen del Pedido</h2>
                <p>Precio Total: ${totalPrice.toFixed(2)}</p>
                <p>IVA (19%): ${taxAmount.toFixed(2)}</p>
                <p>Total con IVA: ${totalWithTax.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default Pago;
