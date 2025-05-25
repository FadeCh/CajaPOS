import React, { useState, useEffect } from "react";
import axios from "axios";
import './ProductManager.css';

export default function ProductManager() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    categoria: "",
  });
  const [editandoId, setEditandoId] = useState(null);
  const [editadoProducto, setEditadoProducto] = useState({
    nombre: "",
    precio: "",
    categoria: "",
  });

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/api/productos`);

      setProductos(res.data);
    } catch (err) {
      console.error("Error al obtener productos", err);
    }
  };

  const agregarProducto = async () => {
    try {
      await axios.post("http://localhost:3001/api/productos", nuevoProducto);
      obtenerProductos();
      setNuevoProducto({ nombre: "", precio: "", categoria: "" });
    } catch (err) {
      console.error("Error al agregar producto", err);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/productos/${id}`);
      obtenerProductos();
    } catch (err) {
      console.error("Error al eliminar producto", err);
    }
  };

  const guardarEdicion = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/productos/${id}`, editadoProducto);
      obtenerProductos();
      setEditandoId(null);
    } catch (err) {
      console.error("Error al editar producto", err);
    }
  };

  return (
    <div className="contenedor-productos">
      <h2>Mantenedor de Productos</h2>

      <div className="formulario">
        <input
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
          }
        />
        <input
          placeholder="Precio"
          type="number"
          value={nuevoProducto.precio}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, precio: e.target.value })
          }
        />
        <input
          placeholder="Categoría"
          value={nuevoProducto.categoria}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })
          }
        />
        <button onClick={agregarProducto}>Agregar</button>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              {editandoId === prod.id ? (
                <>
                  <td>
                    <input
                      value={editadoProducto.nombre}
                      onChange={(e) =>
                        setEditadoProducto({ ...editadoProducto, nombre: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editadoProducto.precio}
                      onChange={(e) =>
                        setEditadoProducto({ ...editadoProducto, precio: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editadoProducto.categoria}
                      onChange={(e) =>
                        setEditadoProducto({ ...editadoProducto, categoria: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => guardarEdicion(prod.id)}>Guardar</button>
                    <button onClick={() => setEditandoId(null)}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{prod.nombre}</td>
                  <td>${prod.precio}</td>
                  <td>{prod.categoria}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditandoId(prod.id);
                        setEditadoProducto({
                          nombre: prod.nombre,
                          precio: prod.precio,
                          categoria: prod.categoria,
                        });
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => eliminarProducto(prod.id)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
