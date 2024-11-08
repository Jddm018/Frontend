import React, { useEffect, useState } from 'react';
import './Carousel.css';
import { Link } from 'react-router-dom';

const Carousel = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const carouselRef = React.useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/product'); // URL del endpoint del backend
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data.products); // Actualiza productos en el estado
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }, 3000); // Cambiar de producto cada 3 segundos

        return () => clearInterval(interval); // Limpia el intervalo al desmontar
    }, [carouselRef]);

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
            <h2 className="carousel-title">Productos Que Quizas Te Interesen</h2>
            <div className="carousel-inner">
                <div className="carousel-buttons">
                    <button className="carousel-button left" onClick={scrollLeft}>&lt;</button>
                    <button className="carousel-button right" onClick={scrollRight}>&gt;</button>
                </div>
                <div className="carousel-container" ref={carouselRef}>
                    {products.map((product) => (
                        <Link to={`/product/${product._id}`} key={product._id} className="producto-link">
                            <div className="carousel-item">
                                <img src={`http://localhost:8080/uploads/products/${product.images}`} alt={product.name} className="producto-imagen" />
                                <div className="producto-detalle">
                                    <h3 className="producto-titulo">{product.name}</h3>
                                    <p className="categoria">{product.category.name}</p>
                                    <p className="precio">Precio: ${product.price}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Carousel;
