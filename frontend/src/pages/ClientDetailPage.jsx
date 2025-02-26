import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getClientById, updateClient, deleteClient, registerPayment } from "../services/api.js";

const ClientDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", service: "", amount: "", status: "", due_date: "" });

    useEffect(() => {
        if (!id) {
            setError("ID del cliente no válido.");
            setLoading(false);
            return;
        }

        const fetchClient = async () => {
            try {
                const data = await getClientById(id);
                if (!data) throw new Error("Cliente no encontrado.");
                setClient(data);
                setFormData({
                    name: data.name,
                    service: data.service,
                    amount: data.amount,
                    status: data.status,
                    due_date: data.due_date ? new Date(data.due_date).toISOString().split("T")[0] : ""
                });
            } catch (err) {
                setError("No se pudo cargar la información del cliente.");
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [id]);

    const handleEdit = async () => {
        if (!formData.name || !formData.service || !formData.amount || !formData.due_date) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        try {
            // Convertir la fecha a formato "YYYY-MM-DD" y cambiar due_date a dueDate (camelCase)
            const formattedData = {
                name: formData.name.trim(),
                service: formData.service.trim(),
                amount: parseFloat(formData.amount),
                dueDate: new Date(formData.due_date).toISOString(), // Cambiado de due_date a dueDate
                status: formData.status?.trim() || "Pendiente",
            };

            const updatedClient = await updateClient(id, formattedData);
            setClient(updatedClient);
            setIsEditing(false);
            alert("Cliente actualizado con éxito.");
        } catch (error) {
            alert("Error al actualizar el cliente: " + (error.response?.data?.message || error.message));
        }
    };


    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) return;

        try {
            await deleteClient(id);
            alert("Cliente eliminado con éxito.");
            navigate("/clients");
        } catch (error) {
            alert("Error al eliminar el cliente.");
        }
    };

    const handlePayment = async () => {
        try {
            const updatedClient = await registerPayment(id);
            setClient(updatedClient);
            alert("Pago realizado con éxito.");
        } catch (error) {
            alert("Error al realizar el pago.");
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Cargando...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Detalles del Cliente</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-600">Nombre:</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border p-2 rounded"
                        readOnly={!isEditing}
                    />
                </div>
                <div>
                    <label className="block text-gray-600">Servicio:</label>
                    <input
                        type="text"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full border p-2 rounded"
                        readOnly={!isEditing}
                    />
                </div>
                <div>
                    <label className="block text-gray-600">Monto:</label>
                    <input
                        type="text"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full border p-2 rounded"
                        readOnly={!isEditing}
                    />
                </div>
                <div>
                    <label className="block text-gray-600">Estado:</label>
                    <input
                        type="text"
                        value={formData.status}
                        className="w-full border p-2 rounded bg-gray-100"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-gray-600">Fecha de Vencimiento:</label>
                    <input
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        className="w-full border p-2 rounded"
                        readOnly={!isEditing}
                    />
                </div>
                <div className="flex justify-between mt-6">
                    {isEditing ? (
                        <button
                            onClick={handleEdit}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
                            Guardar Cambios
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
                            Editar
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500">
                        Eliminar
                    </button>
                    <button
                        onClick={handlePayment}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">
                        Realizar Pago
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientDetailPage;
