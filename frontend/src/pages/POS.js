import { useState, useEffect } from "react";
import axios from "axios";
import menu from "../menu.json";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function POS({ usuario }) {
  const [horaRetiro, setHoraRetiro] = useState("");
  const [medioPago, setMedioPago] = useState("Efectivo");
  const [observacion, setObservacion] = useState("");
  const [pagado, setPagado] = useState(false);
  const [pedido, setPedido] = useState([]);
  const [cliente, setCliente] = useState("");
  const [filtro, setFiltro] = useState("");
  const [numeroComanda, setNumeroComanda] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [comandasExcel, setComandasExcel] = useState(() => {
    const stored = localStorage.getItem("comandasExcel");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const storedNumero = localStorage.getItem("numeroComanda");
    setNumeroComanda(storedNumero ? parseInt(storedNumero) : 1);
  }, []);

  useEffect(() => {
    localStorage.setItem("comandasExcel", JSON.stringify(comandasExcel));
  }, [comandasExcel]);

  const incrementarComanda = () => {
    const next = numeroComanda + 1;
    setNumeroComanda(next);
    localStorage.setItem("numeroComanda", next);
  };

  const agregarItem = (item) => {
    const existe = pedido.find((i) => i.nombre === item.nombre);
    if (existe) {
      setPedido(
        pedido.map((i) =>
          i.nombre === item.nombre ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      );
    } else {
      setPedido([...pedido, { ...item, cantidad: 1 }]);
    }
  };

  const eliminarItem = (nombre) => {
    const actualizado = pedido
      .map((i) =>
        i.nombre === nombre ? { ...i, cantidad: i.cantidad - 1 } : i
      )
      .filter((i) => i.cantidad > 0);

    setPedido(actualizado);
  };

  const total = pedido.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const guardarComandaExcel = () => {
    const productos = pedido
      .map((item) => `${item.nombre} x${item.cantidad} ($${item.precio})`)
      .join(", ");

    const nueva = {
      Numero: numeroComanda,
      Cliente: cliente,
      Fecha: new Date().toLocaleString("es-CL"),
      Total: total,
      MedioPago: medioPago,
      Pagado: pagado ? "Sí" : "No",
      Observacion: observacion,
      Productos: productos,
    };
    setComandasExcel((prev) => [...prev, nueva]);
  };

  const imprimirComanda = () => {
    const doc = new jsPDF({ unit: "mm", format: [75, 297] });
    const pageWidth = 75;
    let y = 10;

    doc.setFontSize(14);
    doc.text("La Sushitería", pageWidth / 2, y, { align: "center" });
    y += 8;

    doc.setFontSize(10);
    const fechaHora = new Date();
    const fechaFormateada = fechaHora.toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    });

    doc.text(`N° Comanda: ${numeroComanda}`, 5, y);
    y += 5;
    doc.text(`${fechaFormateada}`, 5, y);
    y += 5;
    doc.text(`Cliente: ${cliente || "Sin nombre"}`, 5, y);
    y += 5;
    doc.text(`Retiro: ${horaRetiro || "No definida"}`, 5, y);
    y += 5;
    doc.text(`Pago: ${medioPago}`, 5, y);
    y += 5;
    doc.text(`Pagado: ${pagado ? "Sí" : "No"}`, 5, y);
    y += 6;

    if (observacion) {
      const lines = doc.splitTextToSize(`Obs: ${observacion}`, 65);
      doc.setDrawColor(150);
      doc.rect(5, y, 65, lines.length * 5 + 4);
      doc.text(lines, 7, y + 6);
      y += lines.length * 5 + 8;
    }

    const tabla = pedido.map((item) => [
      item.nombre,
      item.cantidad,
      `$${item.precio.toLocaleString("es-CL")}`,
    ]);

    autoTable(doc, {
      head: [["Producto", "Cant", "Precio"]],
      body: tabla,
      startY: y,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontSize: 9,
      },
      margin: { left: 2, right: 2 },
    });

    const afterTable = doc.lastAutoTable.finalY + 5;
    doc.setFontSize(12);
    doc.text(`Total: $${total.toLocaleString("es-CL")}`, 5, afterTable);

    const clienteNombre = cliente.trim().replace(/\s+/g, "_") || "sin_nombre";
    const fechaArchivo = new Date()
      .toISOString()
      .slice(0, 16)
      .replace("T", "_")
      .replace(":", "-");

    const nombreArchivo = `Comanda_${numeroComanda}_${clienteNombre}_${fechaArchivo}.pdf`;
    doc.save(nombreArchivo);
  };

  const confirmarEnvio = async () => {
    try {
      await axios.post("${process.env.REACT_APP_API}/api/pedidos", {
        cliente,
        horaRetiro,
        items: pedido,
        total,
        medioPago,
        observacion,
        pagado,
        numeroComanda,
      });

      imprimirComanda();
      guardarComandaExcel();
      setPedido([]);
      setCliente("");
      setHoraRetiro("");
      setMedioPago("Efectivo");
      setObservacion("");
      setPagado(false);
      incrementarComanda();
      setMostrarModal(false);
    } catch (error) {
      alert("Error al enviar pedido ❌");
    }
  };

  const enviarPedido = () => {
    if (!cliente) return alert("Debes ingresar el nombre del cliente.");
    if (pedido.length === 0) return alert("El pedido está vacío.");
    setMostrarModal(true);
  };

  const categorias = ["Todo", ...new Set(menu.map((item) => item.categoria))];
  const menuFiltrado = !filtro
    ? []
    : filtro === "Todo"
    ? menu
    : menu.filter((item) => item.categoria === filtro);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        <img src="/logolasushiteria.png" alt="Logo La Sushitería" style={{ height: "70px" }} />
        <h1 style={{ margin: 0 }}>La Sushitería</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", margin: "20px 0" }}>
        <div>
          <label>Nombre Cliente: </label>
          <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Ej: Juan Pérez" />
        </div>
        <div>
          <label>Hora de Retiro: </label>
          <input type="time" value={horaRetiro} onChange={(e) => setHoraRetiro(e.target.value)} />
        </div>
        <div>
          <label>Medio de Pago: </label>
          <select value={medioPago} onChange={(e) => setMedioPago(e.target.value)}>
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Tarjeta">Tarjeta</option>
          </select>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={pagado} onChange={(e) => setPagado(e.target.checked)} /> Pagado
          </label>
        </div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Observación:</label>
        <textarea
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          placeholder="Ej: sin palta / entregar en portón"
          rows="3"
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Filtrar por categoría:</strong>{" "}
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">-- Selecciona categoría --</option>
          {categorias.map((c, i) => (
            <option key={i}>{c}</option>
          ))}
        </select>
      </div>

      {/* Zona de productos + resumen */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginTop: "20px" }}>
        <div style={{ flex: 3 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "10px",
            }}
          >
            {menuFiltrado.map((item, i) => (
              <div
                key={i}
                style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px" }}
              >
                <strong>{item.nombre}</strong>
                <p style={{ margin: "5px 0" }}>${item.precio.toLocaleString("es-CL")}</p>
                <button onClick={() => agregarItem(item)}>Agregar</button>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            position: "sticky",
            top: "20px",
            height: "fit-content",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <h2>Resumen del Pedido</h2>
          {pedido.length === 0 ? (
            <p>No hay productos aún</p>
          ) : (
            <>
              <ul>
                {pedido.map((item, i) => (
                  <li key={i}>
                    {item.nombre} × {item.cantidad} = $
                    {(item.precio * item.cantidad).toLocaleString("es-CL")} {" "}
                    <button onClick={() => eliminarItem(item.nombre)}>❌</button>
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> ${total.toLocaleString("es-CL")}</p>
              <p><strong>Hora de Retiro:</strong> {horaRetiro || "No definida"}</p>
              <p><strong>Medio de Pago:</strong> {medioPago}</p>
              <p><strong>Pagado:</strong> {pagado ? "Sí" : "No"}</p>
              {observacion && (
                <p><strong>Observación:</strong> {observacion}</p>
              )}
              <button onClick={enviarPedido}>🧾 Enviar Pedido</button>
            </>
          )}
        </div>
      </div>

      {mostrarModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", width: "90%", maxWidth: "500px" }}>
            <h2>¿Confirmar Pedido?</h2>
            <p><strong>Cliente:</strong> {cliente}</p>
            <p><strong>Total:</strong> ${total.toLocaleString("es-CL")}</p>
            <p><strong>Hora de Retiro:</strong> {horaRetiro}</p>
            <p><strong>Medio de Pago:</strong> {medioPago}</p>
            <p><strong>Pagado:</strong> {pagado ? "Sí" : "No"}</p>
            {observacion && <p><strong>Observación:</strong> {observacion}</p>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
              <button onClick={() => setMostrarModal(false)}>Cancelar</button>
              <button onClick={confirmarEnvio}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
