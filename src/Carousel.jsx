import React, { useEffect, useState, useRef } from 'react';
import './Carousel.css';
import { Link } from 'react-router-dom';

const Carousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/product/findAll');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="product-carousel">
      <h2>¡Revisa Nuestros productos!</h2>
      <div className="carousel-buttons">
        <button onClick={scrollLeft}>&lt;</button>
        <button onClick={scrollRight}>&gt;</button>
      </div>
      <ProductCarousel products={products} ref={carouselRef} />
    </div>
  );
};

const ProductCarousel = React.forwardRef(({ products }, ref) => {
  return (
    <div className="carousel-container" ref={ref}>
      {products.map((product) => (
        <Link to={`/product/${product.id}`} key={product.id} className="producto-link">
          <div className="carousel-item">
            <img src={product.images} alt={product.name} className="producto-imagen" />
            <div className="producto-detalle">
              <h3 className="producto-titulo">{product.name}</h3>
              <p>{product.category}</p>
              <p>Precio: ${product.price}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
});

export default Carousel;
