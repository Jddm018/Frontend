import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './PagoRealizado.css'; // Importa el archivo CSS

const PagoRealizado = () => {
    const location = useLocation();
    const paymentResponse = location.state?.paymentResponse;

    return (
        <div className="payment-success-container">
            <h2 className="payment-success-title">Pago realizado correctamente</h2>
            <p className="payment-success-message">Encargo realizado exitosamente</p>
            {paymentResponse && paymentResponse.map((item, index) => (
                <div key={index} className="product-details-item">
                    <h3 className="product-details-title">Detalle del producto {index + 1}</h3>
                    <p className="product-details">
                        <span className="product-details-name">Nombre:</span> {item.product.name}
                    </p>
                    <p className="product-details">
                        <span className="product-details-name">Categoría:</span> {item.product.category}
                    </p>
                    <p className="product-details">
                        <span className="product-details-name">Precio:</span> {item.product.price}
                    </p>
                    <p className="product-details">
                        <span className="product-details-name">Cantidad:</span> {item.quantity}
                    </p>
                </div>
            ))}
            <div className="center">
                <Link to="/" className="back-to-home-button">Regresar al inicio</Link>
            </div>
        </div>
    );
};

export default PagoRealizado;
