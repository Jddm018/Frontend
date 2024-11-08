import React, { useEffect, useState } from 'react';
import './ProductCards.css';
import { Link } from 'react-router-dom';

// Importa las imágenes directamente
import barbacoaImage from '../src/img/Barbacoa 1 puesto.png'; 
import estufaImage from '../src/img/estufa.png'; 
import freidoraImage from '../src/img/Freidora 3.jpeg'; 
import campanaImage from '../src/img/campana.png'; 
import otroImage from '../src/img/otro.png'; 

const ProductCards = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Proporciona tus imágenes aquí
    const productImages = [
        estufaImage,
        freidoraImage,
        barbacoaImage,
        campanaImage,
        otroImage,
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/categories'); // Cambia la URL según tu API
                if (!response.ok) {
                    throw new Error('Error al cargar las categorías');
                }
                const data = await response.json();
                console.log(data); // Verifica lo que estás recibiendo

                // Extrae el array de categorías de la respuesta
                setCategories(data.categories);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <p>Cargando categorías...</p>;
    if (error) return <p>{error}</p>;

    // Verifica si categories es un array antes de usar slice
    const displayCategories = Array.isArray(categories) ? categories.slice(0, 6) : [];

    return (
        <div className="product-cards">
            <h2>Nuestros Productos</h2>
            <div className="cards-container"> {/* Agregamos el contenedor aquí */}
                {displayCategories.map((category, index) => (
                    <Link to={`/category/${category._id}`} key={category._id} className="product-card">
                        <img
                            src={productImages[index] ? productImages[index] : '../src/img/default-image.png'}
                            alt={category.name}
                        />
                        <h3>{category.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductCards;
