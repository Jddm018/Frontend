import React, { useState, useEffect } from 'react';

const ViewAdmin = () => {
  const [product, setProduct] = useState({
    name: '',
    title: '',
    description: '',
    price: '',
    images: null,
    category: '',  // Ahora usaremos el ID de la categoría
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);  // Esto se usará para las actualizaciones
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Para almacenar las categorías obtenidas del backend
  const [isAdmin, setIsAdmin] = useState(false);
  const [notification, setNotification] = useState(''); // Estado para manejar notificaciones

  // Cargar las categorías del backend
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories');  // Ajusta la URL si es necesario
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories); 
      } else {
        console.error('Error al obtener las categorías');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no disponible');
      return null;
    }
    return token;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    // Asegurarse de que se envíen todos los datos necesarios, incluido el stock como 0
    const productToSend = {
      ...product,
      stock: 0,  // Establecemos el stock a 0
    };

    if (!product.name || !product.price || !product.category || !product.description || (product.images === null && !isEditing)) {
      console.error('Por favor complete todos los campos');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', productToSend.name);
    formDataToSend.append('price', productToSend.price);
    formDataToSend.append('category', productToSend.category);  // Enviamos el ID de la categoría
    formDataToSend.append('description', productToSend.description);
    if (productToSend.images) formDataToSend.append('uploadFile', productToSend.images);

    try {
      const response = await fetch('http://localhost:8080/api/product/', {
        method: 'POST',
        headers: {
          'x-token': token,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Producto agregado:', data);

        // Mostrar mensaje de éxito
        setNotification('Producto agregado correctamente. Te notificaremos cuando haya productos disponibles en el stock.');

        // Limpiar el formulario después de agregar el producto
        setProduct({
          name: '',
          title: '',
          description: '',
          price: '',
          images: null,
          category: '',  // Limpiar el campo de categoría
        });
        setModalIsOpen(false);
        fetchProducts();
      } else {
        const errorData = await response.json();
        console.error('Error al agregar el producto:', errorData);
        setNotification('Hubo un error al agregar el producto.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setNotification('Hubo un error en la solicitud.');
    }
  };

  // Definir la función handleUpdateProduct
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    const productToSend = {
      ...product,
      stock: 0,  // Aseguramos que el stock sea 0, aunque no se esté mostrando en el formulario
    };

    if (!product.name || !product.price || !product.category || !product.description || (product.images === null && !isEditing)) {
      console.error('Por favor complete todos los campos');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', productToSend.name);
    formDataToSend.append('price', productToSend.price);
    formDataToSend.append('category', productToSend.category);  // Enviamos el ID de la categoría
    formDataToSend.append('description', productToSend.description);
    if (productToSend.images) formDataToSend.append('uploadFile', productToSend.images);

    try {
      const response = await fetch(`http://localhost:8080/api/product/${editingProductId}`, {
        method: 'PUT',
        headers: {
          'x-token': token,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Producto actualizado:', data);

        // Mostrar mensaje de éxito
        setNotification('Producto actualizado correctamente.');

        // Limpiar el formulario después de actualizar el producto
        setProduct({
          name: '',
          title: '',
          description: '',
          price: '',
          images: null,
          category: '',  // Limpiar el campo de categoría
        });
        setModalIsOpen(false);
        setIsEditing(false);
        setEditingProductId(null);  // Limpiar la ID de producto en edición
        fetchProducts();
      } else {
        const errorData = await response.json();
        console.error('Error al actualizar el producto:', errorData);
        setNotification('Hubo un error al actualizar el producto.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setNotification('Hubo un error en la solicitud.');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/product');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
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
    fetchCategories(); // Cargar categorías al iniciar el componente
    fetchProducts();
  }, []);

  const handleEditProduct = (product) => {
    setProduct({
      name: product.name,
      title: product.title,
      description: product.description,
      price: product.price,
      images: null,
      category: product.category._id,  // Asumimos que la categoría tiene un campo `_id`
    });
    setIsEditing(true);
    setEditingProductId(product._id);  // Guardar el ID del producto que estamos editando
    openModal();
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setIsEditing(false);
    setEditingProductId(null);
  };

  if (!isAdmin) {
    return <div>No tienes permisos para acceder a esta sección.</div>;
  }

  return (
    <div className="admin-container">
      <h2>Panel De Admnistrador</h2>
      <button onClick={openModal} className="add-product-btn">Agregar Producto</button>

      {modalIsOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <form onSubmit={isEditing ? handleUpdateProduct : handleAddProduct}>
              <div className="form-group">
                <label>Nombre del Producto:</label>
                <input type="text" name="name" value={product.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Título del Producto:</label>
                <input type="text" name="title" value={product.title} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Precio del Producto:</label>
                <input type="number" name="price" value={product.price} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Categoría del Producto:</label>
                <select name="category" value={product.category} onChange={handleInputChange} required>
                  <option value="">Selecciona una categoría</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Descripción del Producto:</label>
                <textarea name="description" value={product.description} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Imagen del Producto:</label>
                <input type="file" name="images" onChange={handleInputChange} required={!isEditing} />
              </div>
              <button type="submit" className="submit-btn">{isEditing ? 'Actualizar Producto' : 'Agregar Producto'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Notificación */}
      {notification && <div className="notification">{notification}</div>}

      <table className="product-table">
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
              <td>{product.category.name}</td>
              <td>{product.stock}</td>
              <td>{product.description}</td>
              <td><img src={`http://localhost:8080/uploads/products/${product.images}`} alt={product.name} width="50" /></td>
              <td>
                <button onClick={() => handleEditProduct(product)} className="edit-btn">Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .admin-container {
          font-family: 'Roboto', sans-serif;
          margin: 20px;
          padding: 20px;
          background-color: #f9fafb;
          border-radius: 8px;
        }
        h2 {
          color: #333;
          text-align: center;
          font-size: 28px;
          margin-bottom: 20px;
        }
        .add-product-btn {
          background-color: #4CAF50;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
          margin-bottom: 30px;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        .add-product-btn:hover {
          background-color: #45a049;
        }
        .modal {
          display: block;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.5);
          padding-top: 60px;
        }
        .modal-content {
          background-color: #fff;
          margin: 5% auto;
          padding: 20px;
          border-radius: 8px;
          width: 70%;
          max-width: 600px;
          box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
        }
        .close-button {
          color: #aaa;
          font-size: 28px;
          font-weight: bold;
          position: absolute;
          top: 15px;
          right: 25px;
          cursor: pointer;
        }
        .close-button:hover,
        .close-button:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          font-weight: bold;
          margin-bottom: 8px;
          display: block;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          box-sizing: border-box;
        }
        .form-group textarea {
          resize: vertical;
        }
        .submit-btn {
          background-color: #4CAF50;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
          width: 100%;
        }
        .submit-btn:hover {
          background-color: #45a049;
        }
        .notification {
          background-color: #f8d7da;
          color: #721c24;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 16px;
        }
        .product-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
          box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
        }
        .product-table th,
        .product-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .product-table th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .edit-btn {
          background-color: #2196F3;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .edit-btn:hover {
          background-color: #1976D2;
        }
      `}</style>
    </div>
  );
};

export default ViewAdmin;
