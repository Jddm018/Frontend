import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductView.css';

function ProductView() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error al leer el carrito del almacenamiento local:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem) => {
    const updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex(item => item.id === newItem.id);

    if (existingItemIndex >= 0) {
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart.push({ ...newItem, quantity: 1 });
    }

    setCart(updatedCart);
    console.log(cart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/product/find/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="product-view-container">
      <div className="product-details">
        <img src={product.images} alt={product.title} />
        <div className="details-text">
          <h1>{product.name}</h1>
          <p>{product.category}</p>
          <p>Precio: ${product.price}</p>
          <button onClick={() => addToCart({ ...product, productId: product.id })} className="add-to-cart-button">Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
}

export default ProductView;
