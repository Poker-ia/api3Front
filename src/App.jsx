import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProductosList from "./components/productos/ProductosList";
import ProductForm from "./components/productos/ProductForm";
import ProveedoresList from "./components/proveedores/ProveedoresList";
import ProveedorForm from "./components/proveedores/ProveedorForm";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-white font-bold text-xl flex items-center">
                  <svg
                    className="w-8 h-8 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Sistema de Gestión
                </Link>
                <div className="flex space-x-1">
                  <Link
                    to="/"
                    className="text-white hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Inicio
                  </Link>
                  <Link
                    to="/productos"
                    className="text-white hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Productos
                  </Link>
                  <Link
                    to="/proveedores"
                    className="text-white hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Proveedores
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/productos" element={<ProductosList />} />
          <Route path="/productos/nuevo" element={<ProductForm />} />
          <Route path="/productos/editar/:id" element={<ProductForm />} />
          <Route path="/proveedores" element={<ProveedoresList />} />
          <Route path="/proveedores/nuevo" element={<ProveedorForm />} />
          <Route path="/proveedores/editar/:id" element={<ProveedorForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
