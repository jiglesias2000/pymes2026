import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Menu } from "./components/Menu";
import { Footer } from "./components/Footer";
import { Inicio } from "./components/Inicio";
import { Categorias } from "./components/Categorias";
import { Articulos } from "./components/articulos/Articulos";
import { ModalDialog } from "./components/ModalDialog";
import { Usuarios } from "./components/Usuarios";
import { RequireAuth } from "./components/RequiereAuth";
import { Login } from "./components/login/Login";
import { Ventas } from "./components/ventas/Ventas";
import { VentasConsultas } from "./components/ventas/VentasConsultas";
import { Clientes } from "./components/clientes/Clientes";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ModalDialog />
        <div className="app-layout">
          <Menu />
          <div className="app-main">
            <div className="divBody">
              <Routes>
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/articulos" element={<Articulos />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/ventas" element={<Ventas />} />
                <Route path="/ventasconsultas" element={<VentasConsultas />} />
                <Route
                  path="/usuarios"
                  element={
                    <RequireAuth rol="jefe">
                      <Usuarios />
                    </RequireAuth>
                  }
                />
                <Route path="/login/:componentFrom" element={<Login />} />
                <Route path="*" element={<Navigate to="/inicio" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
