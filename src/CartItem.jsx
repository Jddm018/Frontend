import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


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
    const styles = {
        container: { textAlign: 'center', marginTop: '20px' },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: { backgroundColor: '#f2f2f2', padding: '10px', border: '1px solid #ddd' },
        td: { padding: '10px', border: '1px solid #ddd', textAlign: 'center' },
        img: { width: '70px' },
        quantityButton: {
            padding: '5px 10px',
            margin: '0 5px',
            cursor: 'pointer',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '4px',
        },
        quantity: { margin: '0 10px' },
        actionButton: {
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        cardTotal: { marginTop: '20px', fontSize: '1.2em', fontWeight: 'bold' },
        divButton: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' },
        checkoutButton: {
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        checkoutButtonHover: { backgroundColor: '#218838' },
        clearCartButton: {
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        clearCartButtonHover: { backgroundColor: '#c82333' },
    };

    return (
        <div style={styles.container}>
            <h2>Carrito de Compras</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Imagen</th>
                        <th style={styles.th}>Producto</th>
                        <th style={styles.th}>Precio</th>
                        <th style={styles.th}>Cantidad</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, index) => (
                        <tr key={index}>
                            <td style={styles.td}><img src={`http://localhost:8080/uploads/products/${item.images}`} alt={item.name} style={styles.img}/></td>
                            <td style={styles.td}>{item.name}</td>
                            <td style={styles.td}>${item.price}</td>
                            <td>
                                <button onClick={() => decreaseQuantity(index)} style={styles.quantityButton}>-</button>
                                <span style={styles.quantity}>{item.quantity}</span>
                                <button onClick={() => increaseQuantity(index)} style={styles.quantityButton}>+</button>
                            </td>
                            <td style={styles.td}>
                                <button onClick={() => removeFromCart(index)} style={styles.actionButton}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={styles.cardTotal}>
                <h4>Resumen de compra</h4>
                <p>Total: ${totalPrice}</p>
            </div>
            <div style={styles.divButton}>
                <button onClick={handleCheckout} style={styles.checkoutButton} disabled={loading}>
                    {loading ? 'Procediendo al pago...' : 'Continuar Compra'}
                </button>
                <button onClick={clearCart} style={styles.clearCartButton}>Vaciar Carrito</button>
            </div>
        </div>
    );
}

export default CartItem;