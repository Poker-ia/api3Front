import { useEffect, useState } from "react";
import { getProductos } from "../services/productos";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProductos();
        const data = response.data?.data || response.data || [];
        setProductos(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-md mx-auto mt-8">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-light text-gray-900 mb-1">
            Panel de Control
          </h1>
          <p className="text-gray-500 text-sm">Gestiona tus productos y proveedores</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            to="/productos/nuevo"
            className="border border-gray-300 hover:border-gray-400 bg-white rounded-lg p-6 transition-all hover:shadow-sm group"
          >
            <div className="flex items-center">
              <div className="bg-gray-100 group-hover:bg-gray-200 rounded-full p-3 mr-4 transition-colors">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-normal text-gray-900">Agregar Producto</h3>
                <p className="text-gray-500 text-sm">Nuevo producto</p>
              </div>
            </div>
          </Link>

          <Link
            to="/proveedores"
            className="border border-gray-300 hover:border-gray-400 bg-white rounded-lg p-6 transition-all hover:shadow-sm group"
          >
            <div className="flex items-center">
              <div className="bg-gray-100 group-hover:bg-gray-200 rounded-full p-3 mr-4 transition-colors">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-normal text-gray-900">Proveedores</h3>
                <p className="text-gray-500 text-sm">Gestionar proveedores</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-light text-gray-900">Productos</h2>
            <Link
              to="/productos"
              className="text-gray-600 hover:text-gray-900 font-normal text-sm"
            >
              Ver todos →
            </Link>
          </div>

          {productos.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-lg font-normal text-gray-700 mb-2">
                No hay productos
              </h3>
              <p className="text-gray-500 mb-4 text-sm">
                Comienza agregando tu primer producto
              </p>
              <Link
                to="/productos/nuevo"
                className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-normal py-2 px-5 rounded text-sm"
              >
                Agregar Producto
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {productos.slice(0, 8).map((producto) => (
                <div
                  key={producto.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                >
                  <div className="relative h-40 bg-gray-100">
                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-normal text-gray-900 mb-2 truncate">
                      {producto.nombre}
                    </h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-normal text-gray-900">
                        S/{producto.precio}
                      </span>
                      <span
                        className={`text-xs font-normal px-2 py-1 rounded ${
                          producto.stock > 10
                            ? "bg-gray-100 text-gray-700"
                            : producto.stock > 0
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        Stock: {producto.stock}
                      </span>
                    </div>
                    <Link
                      to={`/productos/editar/${producto.id}`}
                      className="block w-full text-center border border-gray-300 hover:border-gray-400 text-gray-700 font-normal py-2 rounded text-sm transition-colors"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;