const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // 👈 primero
app.use(express.json());

const pedidosRoutes = require("./routes/pedidos");
const usuariosRoutes = require("./routes/usuarios");
const productosRoute = require("./routes/productos");

app.use("/api/pedidos", pedidosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/productos", productosRoute); // ✅ ahora sí funcionará

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
