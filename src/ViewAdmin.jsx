import React, { useState, useEffect } from 'react';
import './Modal.css';

const ViewAdmin = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    image: null,
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [reloadPage, setReloadPage] = useState(false);

  const [products, setProducts] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setProduct(prevState => ({
        ...prevState,
        [name]: files ? files[0] : value
      }));
    };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', product.name);
    formDataToSend.append('price', product.price);
    formDataToSend.append('category', product.category);
    formDataToSend.append('image', product.image);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/product/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Producto agregado:', data);
        setProduct({
          name: '',
          price: '',
          category: '',
          image: null,
        });
        setModalIsOpen(false);
        fetchProducts();
      } else {
        console.error('Error al agregar el producto');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', product.name);
    formDataToSend.append('price', product.price);
    formDataToSend.append('category', product.category);
    formDataToSend.append('image', product.image);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/product/update/${editingProductId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Producto actualizado:', data);
        setProduct({
          name: '',
          price: '',
          category: '',
          image: null,
        });
        setModalIsOpen(false);
        setIsEditing(false);
        setEditingProductId(null);
        fetchProducts();
        window.location.reload();
       
      } else {
        console.error('Error al actualizar el producto');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setIsEditing(false);
    setEditingProductId(null);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/product/findAll');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Error al obtener los productos');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (reloadPage) {
      setReloadPage(false); // Restablecer reloadPage a false antes de recargar la página
      window.location.reload(); // Recargar la página
    }
  }, [reloadPage]);

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/product/delete/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Producto eliminado');
        fetchProducts();
      } else {
        console.error('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleEditProduct = (product) => {
    setProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      image: null,
    });
    setIsEditing(true);
    setEditingProductId(product.id);
    openModal();
  };

  return (
    <div>
      <h2>Esta es la vista del admin</h2>
      <button onClick={openModal}>Agregar Producto</button>

      {modalIsOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <form onSubmit={isEditing ? handleUpdateProduct : handleAddProduct}>
              <div>
                <label>Nombre del Producto:</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Precio del Producto:</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Categoría del Producto:</label>
                <input
                  type="text"
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Imágenes del Producto:</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  required={!isEditing}
                />
              </div>
              <button type="submit">{isEditing ? 'Actualizar Producto' : 'Agregar Producto'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Tabla para mostrar productos */}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td><img src={product.images} alt={product.name} width="50" /></td>
              <td>
                <button onClick={() => handleEditProduct(product)}>Editar</button>
                <button onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAdmin;

