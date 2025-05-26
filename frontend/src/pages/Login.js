import { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function Login({ setUsuario }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/api/usuarios/login`, {
        username,
        password,
      });

      localStorage.setItem("usuario", JSON.stringify(res.data));
      setUsuario(res.data);
    } catch (err) {
      alert("Credenciales inválidas o usuario desactivado");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/logolasushiteria.png" alt="Logo" className="logo" />
        <h2>Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Entrar</button>
      </div>
    </div>
  );
}
