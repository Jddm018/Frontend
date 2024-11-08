import React, { useState, useEffect } from 'react';
import './Modal.css';

const ViewAdmin = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    image: null,
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', product.name);
    formDataToSend.append('price', product.price);
    formDataToSend.append('category', product.category);
    formDataToSend.append('stock', product.stock);
    formDataToSend.append('description', product.description);
    formDataToSend.append('image', product.image);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/product/', {
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
          stock: '',
          description: '',
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
    formDataToSend.append('stock', product.stock);
    formDataToSend.append('description', product.description);
    formDataToSend.append('image', product.image);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/product/${editingProductId}`, {
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
          stock: '',
          description: '',
          image: null,
        });
        setModalIsOpen(false);
        setIsEditing(false);
        setEditingProductId(null);
        fetchProducts();
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
      const response = await fetch('http://localhost:8080/api/product/');
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

  const verifyAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'ADMIN_ROLE') {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    verifyAdmin();
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/product/${productId}`, {
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
      stock: product.stock,
      description: product.description,
      image: null,
    });
    setIsEditing(true);
    setEditingProductId(product._id);
    openModal();
  };

  if (!isAdmin) {
    return <div>No tienes permisos para acceder a esta sección.</div>;
  }

  return (
    <div>
      <h2>Esta es la vista del admin</h2>
      <button onClick={openModal}>Agregar Producto</button>

      {modalIsOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <form onSubmit={isEditing ? handleUpdateProduct : handleAddProduct}>
              <div>
                <label>Nombre del Producto:</label>
                <input type="text" name="name" value={product.name} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Precio del Producto:</label>
                <input type="number" name="price" value={product.price} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Categoría del Producto:</label>
                <input type="text" name="category" value={product.category} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Stock del Producto:</label>
                <input type="number" name="stock" value={product.stock} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Descripción del Producto:</label>
                <textarea name="description" value={product.description} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Imágenes del Producto:</label>
                <input type="file" name="image" onChange={handleInputChange} required={!isEditing} />
              </div>
              <button type="submit">{isEditing ? 'Actualizar Producto' : 'Agregar Producto'}</button>
            </form>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Descripción</th>
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
              <td>{product.stock}</td>
              <td>{product.description}</td>
              <td><img src={product.images} alt={product.name} width="50" /></td>
              <td>
                <button onClick={() => handleEditProduct(product)}>Editar</button>
                <button onClick={() => handleDeleteProduct(product._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAdmin;
