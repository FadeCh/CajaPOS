// src/components/ConfirmModal.js
export default function ConfirmModal({ mensaje, onConfirmar, onCancelar }) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "400px"
        }}>
          <h3>{mensaje}</h3>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
            <button onClick={onCancelar}>Cancelar</button>
            <button onClick={onConfirmar}>Cerrar Sesión</button>
          </div>
        </div>
      </div>
    );
  }
  