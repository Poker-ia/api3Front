import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProducto,
  crearProducto,
  editarProducto,
} from "../../services/productos";
import { listarProveedores } from "../../services/proveedores";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nombre: "",
    modelo: "",
    precio: "",
    stock: "",
    proveedor: "",
    imagen: null,
  });
  const [proveedores, setProveedores] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar proveedores
        const proveedoresData = await listarProveedores();
        console.log("Proveedores cargados:", proveedoresData);
        setProveedores(proveedoresData);

        // Si estamos editando, cargar datos del producto
        if (isEditing && id) {
          try {
            const response = await getProducto(id);
            const producto = response.data;
            console.log("Producto cargado:", producto);

            setFormData({
              nombre: producto.nombre || "",
              modelo: producto.modelo || "",
              precio: producto.precio || "",
              stock: producto.stock || "",
              proveedor: producto.proveedor || "",
              imagen: null,
            });

            // Asegurarse de que la URL de la imagen sea absoluta
            if (producto.imagen) {
              // Si la URL es relativa, conviértela en absoluta
              const imagenUrl = producto.imagen.startsWith("http")
                ? producto.imagen
                : `https://api3-1-0spe.onrender.com${producto.imagen}`;
              console.log("URL de la imagen:", imagenUrl);
              setPreviewImage(imagenUrl);
            }
          } catch (error) {
            console.error("Error al cargar el producto:", error);
            setError("Error al cargar el producto");
          }
        }
      } catch (error) {
        console.error("Error al cargar los proveedores:", error);
        setError(
          "Error al cargar los proveedores. Verifica que la API esté funcionando correctamente."
        );
      }
    };

    loadData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen" && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validaciones
      if (!formData.nombre || !formData.modelo) {
        setError("El nombre y modelo son campos obligatorios");
        setLoading(false);
        return;
      }

      const precio = parseFloat(formData.precio);
      if (isNaN(precio) || precio <= 0) {
        setError("El precio debe ser un número válido mayor que 0");
        setLoading(false);
        return;
      }

      const stock = parseInt(formData.stock, 10);
      if (isNaN(stock) || stock < 0) {
        setError("El stock debe ser un número válido mayor o igual a 0");
        setLoading(false);
        return;
      }

      if (!formData.proveedor) {
        setError("Debe seleccionar un proveedor");
        setLoading(false);
        return;
      }

      // Preparar FormData
      const formDataToSend = new FormData();

      // Agregar campos obligatorios
      formDataToSend.append("nombre", formData.nombre.trim());
      formDataToSend.append("modelo", formData.modelo.trim());
      formDataToSend.append("precio", precio.toFixed(2));
      formDataToSend.append("stock", stock);
      formDataToSend.append("proveedor", parseInt(formData.proveedor, 10));

      // Agregar imagen si existe
      if (formData.imagen instanceof File) {
        formDataToSend.append("imagen", formData.imagen);
      }

      console.log("Datos a enviar:", {
        nombre: formDataToSend.get("nombre"),
        modelo: formDataToSend.get("modelo"),
        precio: formDataToSend.get("precio"),
        stock: formDataToSend.get("stock"),
        proveedor: formDataToSend.get("proveedor"),
        imagen:
          formData.imagen instanceof File
            ? "Archivo presente"
            : "No hay archivo",
      });

      let response;
      if (isEditing) {
        response = await editarProducto(id, formDataToSend);
        console.log("Producto editado:", response.data);
      } else {
        response = await crearProducto(formDataToSend);
        console.log("Producto creado:", response.data);
      }

      alert(
        isEditing
          ? "Producto actualizado exitosamente"
          : "Producto creado exitosamente"
      );
      navigate("/productos");
    } catch (error) {
      console.error("Error detallado:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMessage = "Error al guardar el producto: ";

      if (error.response?.data) {
        if (typeof error.response.data === "object") {
          errorMessage += Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(". ");
        } else {
          errorMessage += error.response.data;
        }
      } else {
        errorMessage += error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con diseño minimalista y profesional */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/productos")}
              className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Volver a Productos</span>
            </button>

            <div className="hidden sm:block text-right text-sm text-gray-500">
              {isEditing ? "Modo edición" : "Nuevo registro"}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extralight text-gray-900 tracking-tight">
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isEditing
              ? "Actualiza la información del producto existente"
              : "Ingresa los detalles para crear un nuevo producto"}
          </p>
        </div>

        {error && (
          <div className="mb-6 animate-fadeIn">
            <div className="bg-white border-l-4 border-red-500 rounded-lg shadow-sm p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error al procesar la solicitud
                  </h3>
                  <div className="mt-1 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all hover:shadow-xl"
        >
          <div className="p-6 sm:p-8 space-y-8">
            {/* Grid responsivo de 2 columnas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Ej: Smartphone Galaxy S21"
                  required
                />
              </div>

              {/* Modelo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Modelo
                </label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  className="w-full px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Ej: SM-G991B"
                  required
                />
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Precio
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500">S/</span>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full pl-8 pr-4 h-11 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Stock disponible
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Cantidad en inventario"
                  required
                />
              </div>
            </div>

            {/* Proveedor - ancho completo */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Proveedor
              </label>
              <select
                name="proveedor"
                value={formData.proveedor}
                onChange={handleChange}
                className="w-full px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 appearance-none cursor-pointer"
                required
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Imagen con vista previa mejorada */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Imagen del producto
              </label>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <label className="flex-1 cursor-pointer group">
                  <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-6 text-center transition-all group-hover:border-blue-400 group-hover:bg-blue-50">
                    <svg
                      className="w-10 h-10 mx-auto text-gray-400 mb-3 group-hover:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600 group-hover:text-gray-900">
                      {previewImage ? "Cambiar imagen" : "Subir imagen"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG hasta 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    name="imagen"
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                {previewImage && (
                  <div className="relative">
                    <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={previewImage}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(
                            "Error al cargar la imagen:",
                            previewImage
                          );
                          e.target.src =
                            "https://via.placeholder.com/150?text=No+disponible";
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData((prev) => ({ ...prev, imagen: null }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      ×
                    </button>
                    <div className="mt-2 text-xs text-center text-gray-500">
                      {isEditing ? "Imagen actual" : "Vista previa"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones con diseño mejorado */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium h-11 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Guardando...
                  </span>
                ) : isEditing ? (
                  "Actualizar Producto"
                ) : (
                  "Crear Producto"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/productos")}
                className="px-6 h-11 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
