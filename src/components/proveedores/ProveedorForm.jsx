import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  obtenerProveedor,
  crearProveedor,
  actualizarProveedor,
} from "../../services/proveedores";

const ProveedorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
  });

  useEffect(() => {
    if (id) {
      fetchProveedor();
    }
  }, [id]);

  const fetchProveedor = async () => {
    try {
      setLoading(true);
      const data = await obtenerProveedor(id);
      setFormData({
        nombre: data.nombre || "",
        contacto: data.contacto || "",
      });
      setLoading(false);
    } catch (err) {
      setError("Error al cargar el proveedor");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await actualizarProveedor(id, formData);
      } else {
        await crearProveedor(formData);
      }
      navigate("/proveedores");
    } catch (err) {
      setError("Error al guardar el proveedor");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header minimalista */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/proveedores")}
            className="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center text-sm transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <h1 className="text-3xl font-light text-gray-900">
            {id ? "Editar Proveedor" : "Nuevo Proveedor"}
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del Proveedor
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900"
              placeholder="Ingrese el nombre del proveedor"
            />
          </div>

          {/* Contacto */}
          <div>
            <label
              htmlFor="contacto"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contacto (Teléfono)
            </label>
            <div className="relative">
              <svg
                className="absolute left-4 top-3 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <input
                type="text"
                id="contacto"
                name="contacto"
                value={formData.contacto}
                onChange={handleChange}
                required
                maxLength="15"
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900"
                placeholder="+51 999 999 999"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : id ? "Actualizar" : "Crear Proveedor"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/proveedores")}
              className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProveedorForm;
