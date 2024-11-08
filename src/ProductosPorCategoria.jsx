import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ListaProductos.css';  

const ProductosPorCategoria = () => {
    const { categoryId } = useParams(); // Obtiene el ID de la categoría de la URL
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProductosPorCategoria = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/category/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Error al cargar los productos');
                }
                const data = await response.json();
                setProductos(data.products); // Ajusta según la estructura de tu respuesta
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductosPorCategoria();
    }, [categoryId]);

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="productos-categoria">
            <h1>Productos en esta categoría</h1>
            <div className="productos">
                {productos.map((producto) => (
                    <Link key={producto._id} to={`/product/${producto._id}`} className="producto-link">
                        <div className="producto">
                            <img
                                src={`http://localhost:8080/uploads/products/${producto.images}`}
                                alt={producto.title}
                                className="producto-imagen"
                            />
                            <div className="producto-detalle">
                                <h2 className="producto-titulo">{producto.name}</h2>
                                <p className="producto-precio">${producto.price}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductosPorCategoria;
