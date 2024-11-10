import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartItem.css';

function CartItem() {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                setCart(parsedCart);
                calculateTotalPrice(parsedCart);
            } catch (error) {
                console.error('Error parsing cart data:', error);
            }
        }
    }, []);

    const calculateTotalPrice = (cart) => {
        const totalPrice = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
        setTotalPrice(totalPrice);
    };

    const handleCheckout = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate('/pay', {
                state: {
                    totalPrice,
                    cart
                }
            });
        }, 1000);
    };

    const decreaseQuantity = (index) => {
        const updatedCart = [...cart];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity--;
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            calculateTotalPrice(updatedCart);
        }
    };

    const increaseQuantity = (index) => {
        const updatedCart = [...cart];
        updatedCart[index].quantity++;
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart);
    };

    const removeFromCart = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart);
    };

    const clearCart = () => {
        setCart([]);
        setTotalPrice(0); // Reinicia el total a 0
        localStorage.removeItem('cart');
    };

    return (
        <div>
            <h2>Carrito de Compras</h2>
            <table>
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, index) => (
                        <tr key={index}>
                            <td><img src={`http://localhost:8080/uploads/products/${item.images}`} alt={item.name} style={{ width: '70px' }} /></td>
                            <td>{item.name}</td>
                            <td>${item.price}</td>
                            <td>
                                <button onClick={() => decreaseQuantity(index)} className="quantity-button">-</button>
                                <span className="quantity">{item.quantity}</span>
                                <button onClick={() => increaseQuantity(index)} className="quantity-button">+</button>
                            </td>
                            <td>
                                <button onClick={() => removeFromCart(index)} className="action-button">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='card-total'>
                <h4>Resumen de compra</h4>
                <p>Total: ${totalPrice}</p>
            </div>
            <div className='div-button'>
                <button onClick={handleCheckout} className="checkout-button" disabled={loading}>
                    {loading ? 'Procediendo al pago...' : 'Continuar Compra'}
                </button>
                <button onClick={clearCart} className="clear-cart-button">Vaciar Carrito</button>
            </div>
        </div>
    );
}

export default CartItem;
