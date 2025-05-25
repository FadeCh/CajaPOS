import { useEffect, useState } from "react";
import axios from "axios";
import "./UserManager.css"; // Asegúrate de crear este archivo o mover estilos a App.css

export default function UserManager() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: "",
    password: "",
    rol: "usuario",
  });

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get("${process.env.REACT_APP_API}/api/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      alert("Error al obtener usuarios");
    }
  };

  const agregarUsuario = async () => {
    if (!nuevoUsuario.username || !nuevoUsuario.password)
      return alert("Completa todos los campos");

    try {
      await axios.post("${process.env.REACT_APP_API}/api/usuarios/crear", nuevoUsuario);
      obtenerUsuarios();
      setNuevoUsuario({ username: "", password: "", rol: "usuario" });
    } catch (err) {
      alert("Error al agregar usuario");
    }
  };

  const desactivarUsuario = async (username) => {
    try {
      await axios.put(`${process.env.REACT_APP_API}/api/usuarios/desactivar/${username}`);
      obtenerUsuarios();
    } catch (err) {
      alert("Error al desactivar usuario");
    }
  };

  const eliminarUsuario = async (username) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API}/api/usuarios/eliminar/${username}`);
      obtenerUsuarios();
    } catch (err) {
      alert("Error al eliminar usuario");
    }
  };

  return (
    <div className="user-manager-wrapper">
      <div className="user-manager-container">
        <h2>Mantenedor de Usuarios</h2>

        <div className="form-group">
          <input
            placeholder="Usuario"
            value={nuevoUsuario.username}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })
            }
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={nuevoUsuario.password}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
            }
          />
          <select
            value={nuevoUsuario.rol}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
            }
          >
            <option value="usuario">Usuario</option>
            <option value="superadmin">Superadmin</option>
          </select>
          <button onClick={agregarUsuario}>Agregar</button>
        </div>

        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.username}>
                <td>{u.username}</td>
                <td>{u.rol}</td>
                <td>{u.activo ? "Sí" : "No"}</td>
                <td>
                  <button onClick={() => desactivarUsuario(u.username)}>Desactivar</button>
                  <button onClick={() => eliminarUsuario(u.username)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
