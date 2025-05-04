import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { FaClipboardList } from "react-icons/fa";


function Sidebar({ usuario, cerrarSesion }) {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const sidebarRef = useRef(null);

  const toggleMenu = () => setVisible(!visible);

  // 🔻 Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (visible && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible]);
  
  return (
    <>
      <div className="menu-toggle" onClick={toggleMenu}>
        ☰
      </div>

      <div
        ref={sidebarRef}
        className={`sidebar ${visible ? "visible" : "hidden"}`}
      >
        <div className="logo-container">
          <img src="/logolasushiteria.png" alt="Logo" className="logo" />
          <h2>La Sushitería</h2>
        </div>

        <nav>
          <ul>
            <li className={location.pathname === "/pos" ? "activo" : ""}>
              <Link to="/pos">🍣 Panel Principal</Link>
            </li>
            <li className={location.pathname === "/usuarios" ? "activo" : ""}>
              <Link to="/usuarios">👥 Usuarios</Link>
            </li>
            {usuario?.rol === "superadmin" && (
              <li className={location.pathname === "/productos" ? "activo" : ""}>
                <Link to="/productos">📦 Productos</Link>
              </li>
            )}
          </ul>
        </nav>

              <li>
        <Link to="/pedidos">
          <FaClipboardList /> Pedidos
        </Link>
      </li>


        <div className="cerrar-sesion-container">
          <button className="cerrar-sesion" onClick={cerrarSesion}>
            🔒 Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
