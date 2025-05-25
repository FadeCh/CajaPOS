import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./PedidosManager.css";

export default function PedidosManager() {
  const [pedidos, setPedidos] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const pedidosPorPagina = 10;

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/api/pedidos`)
      .then((res) => setPedidos(res.data))
      .catch(() => alert("Error al obtener pedidos"));
  }, []);

  const descargarExcel = () => {
    const datos = pedidosFiltrados.map((p) => ({
      Cliente: p.cliente,
      "Hora de Retiro": p.horaRetiro || "No definida",
      Total: p.total,
      "Medio de Pago": p.medioPago,
      Pagado: p.pagado ? "Sí" : "No",
      "Fecha Pedido": new Date(p.fecha).toLocaleString("es-CL"),
    }));

    if (datos.length === 0) {
      alert("No hay pedidos para descargar.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pedidos");
    XLSX.writeFile(wb, "pedidos.xlsx");
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    if (!fechaFiltro) return true;
    const fechaPedido = new Date(p.fecha).toISOString().slice(0, 10);
    return fechaPedido === fechaFiltro;
  });

  // Lógica de paginación
  const indexUltimoPedido = paginaActual * pedidosPorPagina;
  const indexPrimerPedido = indexUltimoPedido - pedidosPorPagina;
  const pedidosPaginados = pedidosFiltrados.slice(indexPrimerPedido, indexUltimoPedido);
  const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina);

  const irPaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const irPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  useEffect(() => {
    setPaginaActual(1); // Cuando cambia el filtro, vuelvo a página 1
  }, [fechaFiltro]);

  const abrirDetalle = (pedido) => {
    setPedidoSeleccionado(pedido);
    setMostrarDetalle(true);
  };

  const cerrarDetalle = () => {
    setPedidoSeleccionado(null);
    setMostrarDetalle(false);
  };

  // Nuevo: calcular total de ventas de los pedidos filtrados
const totalVentas = pedidosFiltrados.reduce((acc, pedido) => acc + pedido.total, 0);


  return (
    <div className="pedidos-container">
      <div className="pedidos-card">
        {/* Total de ventas */}
<div className="total-ventas">
  <h3>Total de Ventas: ${totalVentas.toLocaleString("es-CL")}</h3>
</div>

        <h2 className="pedidos-titulo">Mantenedor de Pedidos</h2>

        <div className="filtro-fecha">
          <label>Filtrar por fecha: </label>
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
          <button onClick={() => setFechaFiltro("")}>Ver Todos</button>
        </div>

        <button className="boton-excel" onClick={descargarExcel}>
          📥 Descargar Excel
        </button>

        <table className="pedidos-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Hora de Retiro</th>
              <th>Total</th>
              <th>Medio de Pago</th>
              <th>Pagado</th>
              <th>Fecha Pedido</th>
            </tr>
          </thead>
          <tbody>
            {pedidosPaginados.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No hay pedidos para esta fecha.
                </td>
              </tr>
            ) : (
              pedidosPaginados.map((p) => (
                <tr key={p.id} onClick={() => abrirDetalle(p)} className="fila-clickable">
                  <td>{p.cliente}</td>
                  <td>{p.horaRetiro || "No definida"}</td>
                  <td>${p.total.toLocaleString("es-CL")}</td>
                  <td>{p.medioPago}</td>
                  <td>{p.pagado ? "Sí" : "No"}</td>
                  <td>{new Date(p.fecha).toLocaleString("es-CL")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPaginas > 1 && (
          <div className="paginacion">
            <button onClick={irPaginaAnterior} disabled={paginaActual === 1}>
              ◀️ Anterior
            </button>
            <span>
              Página {paginaActual} de {totalPaginas}
            </span>
            <button onClick={irPaginaSiguiente} disabled={paginaActual === totalPaginas}>
              Siguiente ▶️
            </button>
          </div>
        )}
      </div>

      {/* Modal Detalle */}
      {mostrarDetalle && pedidoSeleccionado && (
        <div className="modal-detalle">
          <div className="modal-contenido">
            <h3>Detalle del Pedido</h3>
            <p><strong>Cliente:</strong> {pedidoSeleccionado.cliente}</p>
            <p><strong>Total:</strong> ${pedidoSeleccionado.total.toLocaleString("es-CL")}</p>
            <p><strong>Medio de Pago:</strong> {pedidoSeleccionado.medioPago}</p>
            <h4>Productos:</h4>
            <ul>
              {JSON.parse(pedidoSeleccionado.items).map((item, index) => (
                <li key={index}>
                  {item.nombre} × {item.cantidad} = ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                </li>
              ))}
            </ul>
            <button onClick={cerrarDetalle} className="boton-cerrar">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
