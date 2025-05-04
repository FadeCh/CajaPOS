import POS from "./pages/POS";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import UserManager from "./pages/UserManager";
import ConfirmModal from "./components/ConfirmModal";
import Sidebar from "./components/Sidebar"; // 👈 Importamos el Sidebar
import "./components/Sidebar.css"; // ✅ Estilos del sidebar
import ProductManager from "./pages/ProductManager"; // 👈 Importamos
import PedidosManager from "./pages/PedidosManager";


function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarModalCerrarSesion, setMostrarModalCerrarSesion] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) setUsuario(JSON.parse(stored));
  }, []);

  const cerrarSesion = () => setMostrarModalCerrarSesion(true);

  const confirmarCerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    setMostrarModalCerrarSesion(false);
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {usuario && <Sidebar usuario={usuario} cerrarSesion={cerrarSesion} />}
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route
              path="/"
              element={!usuario ? <Login setUsuario={setUsuario} /> : <Navigate to="/pos" />}
            />
              <Route
                path="/pedidos"
                element={usuario ? <PedidosManager /> : <Navigate to="/" />}
              />

            <Route
              path="/pos"
              element={usuario ? <POS usuario={usuario} cerrarSesion={cerrarSesion} /> : <Navigate to="/" />}
            />
            <Route
              path="/usuarios"
              element={
                usuario && usuario.rol === "superadmin" ? (
                  <UserManager />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            
            <Route
              path="/productos"
              element={
                usuario && usuario.rol === "superadmin" ? (
                  <ProductManager />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </div>

      {mostrarModalCerrarSesion && (
        <ConfirmModal
          mensaje="¿Estás segura de que quieres cerrar sesión?"
          onConfirmar={confirmarCerrarSesion}
          onCancelar={() => setMostrarModalCerrarSesion(false)}
        />
      )}
    </Router>
  );
}

export default App;
