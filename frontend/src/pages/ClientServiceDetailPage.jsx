/*
 * File: ClientServiceDetailPage.js
 * Author: Claude AI (basado en trabajo de Eliazar)
 * Copyright: 2025, Embedding Minds
 * License: MIT
 * Purpose: Componente que muestra los detalles de un servicio de cliente, permite editarlo, eliminarlo y realizar pagos.
 * Last Modified: 2025-03-05
 */

import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    User,
    Phone,
    Mail,
    Save,
    X,
    DollarSign,
    FileText,
    Calendar,
    Edit,
    Trash2,
    ArrowLeft,
    CheckCircle,
    CreditCard,
    AlertCircle
} from 'lucide-react';
import axios from 'axios';
import Navbar from "../components/Navbar.jsx";

// Definición de endpoints para API
const API_BASE_URL = 'http://localhost:3000/api';

// Funciones de API para servicios de clientes
const getClientServiceById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/client/services/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching client service:", error);
        throw error;
    }
};

const updateClientService = async (id, data) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/client/services/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating client service:", error);
        throw error;
    }
};

const deleteClientService = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/client/services/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting client service:", error);
        throw error;
    }
};

const createPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/payments`, paymentData);
        return response.data;
    } catch (error) {
        console.error("Error creating payment:", error);
        throw error;
    }
};

const ClientServiceDetailPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    // Estado para los datos del servicio de cliente
    const [clientService, setClientService] = useState({
        client_id: '',
        service_id: '',
        status: 'activo',
        amount_due: 0,
        due_date: '',
        payment_status: 'pendiente',
        client_name: '',
        service_name: '',
        service_price: ''
    });

    // Estado para el formulario de pago
    const [paymentData, setPaymentData] = useState({
        payment_method: 'transferencia',
        reference_number: '',
        notes: '',
        client_service_id: id,
        amount: 0
    });

    // Cargar datos del servicio de cliente
    useEffect(() => {
        const fetchClientServiceData = async () => {
            if (!id) {
                setError("ID del servicio no proporcionado");
                setLoading(false);
                return;
            }

            try {
                const data = await getClientServiceById(id);
                if (!data) {
                    throw new Error("Servicio de cliente no encontrado");
                }

                setClientService({
                    client_id: data.client_id || '',
                    service_id: data.service_id || '',
                    status: data.status || 'activo',
                    amount_due: parseFloat(data.amount_due) || 0,
                    due_date: data.due_date ? data.due_date.split('T')[0] : '',
                    payment_status: data.payment_status || 'pendiente',
                    client_name: data.client_name || '',
                    service_name: data.service_name || '',
                    service_price: parseFloat(data.service_price) || 0
                });

                // Inicializar el monto del pago con el monto pendiente
                setPaymentData(prev => ({
                    ...prev,
                    amount: parseFloat(data.amount_due) || 0
                }));

                setLoading(false);
            } catch (err) {
                console.error("Error al cargar el servicio de cliente:", err);
                setError("No se pudo cargar la información del servicio");
                setLoading(false);
            }
        };

        fetchClientServiceData();
    }, [id]);

    // Manejar cambios en los campos del formulario
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setClientService(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejar cambios en el formulario de pago
    const handlePaymentInputChange = (e) => {
        const {name, value} = e.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) : value
        }));
    };

    // Guardar cambios del servicio de cliente
    const handleSaveChanges = async () => {
        try {
            setLoading(true);

            // Formatear datos para la API
            const serviceData = {
                client_id: clientService.client_id,
                service_id: clientService.service_id,
                status: clientService.status,
                amount_due: parseFloat(clientService.amount_due),
                due_date: clientService.due_date,
                payment_status: clientService.payment_status
            };

            await updateClientService(id, serviceData);
            setIsEditing(false);
            alert("Servicio actualizado exitosamente");

            // Recargar datos
            const updatedData = await getClientServiceById(id);
            setClientService({
                ...updatedData,
                amount_due: parseFloat(updatedData.amount_due) || 0,
                service_price: parseFloat(updatedData.service_price) || 0,
                due_date: updatedData.due_date ? updatedData.due_date.split('T')[0] : ''
            });
        } catch (error) {
            console.error("Error al actualizar servicio:", error.response?.data || error.message);
            alert(`Error al actualizar servicio: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Procesar pago
    const handleProcessPayment = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Validar monto
            const amountToPay = parseFloat(paymentData.amount);
            if (isNaN(amountToPay) || amountToPay <= 0) {
                alert("El monto debe ser un número mayor a cero");
                return;
            }

            if (amountToPay > clientService.amount_due) {
                alert("El monto no puede ser mayor que el saldo pendiente");
                return;
            }

            if (!paymentData.reference_number.trim()) {
                alert("El número de referencia es obligatorio");
                return;
            }

            // Convertir client_service_id a número
            const clientServiceId = Number(paymentData.client_service_id);
            if (isNaN(clientServiceId)) {
                throw new Error("ID de servicio de cliente no es válido");
            }

            // Formatear datos del pago para la API
            const formattedPaymentData = {
                ...paymentData,
                client_service_id: clientServiceId,
                amount: amountToPay
            };

            // Enviar pago a la API
            const response = await createPayment(formattedPaymentData);

            // Verificar respuesta del API
            if (!response || !response.payment) {
                throw new Error("No se recibió una respuesta válida del servidor");
            }

            // Extraer detalles del pago
            const { amount, status } = response.payment;

            // Calcular nuevo saldo pendiente
            const newAmountDue = clientService.amount_due - amount;
            const newPaymentStatus = newAmountDue <= 0 ? "pagado" : "pendiente";
            const newClientServiceStatus = newAmountDue === 0 ? "cancelado" : "activo";

            // Si el estado del pago es "en proceso", reflejarlo en la UI
            const updatedPaymentStatus = status === "en proceso" ? "en proceso" : newPaymentStatus;

            // Actualizar servicio con nuevo monto pendiente, estado de pago y estado general
            await updateClientService(clientServiceId, {
                ...clientService,
                amount_due: newAmountDue,
                payment_status: newPaymentStatus,
                status: newClientServiceStatus
            });

            // Actualizar estado local de la UI
            setClientService(prev => ({
                ...prev,
                amount_due: newAmountDue,
                payment_status: newPaymentStatus,
                status: updatedPaymentStatus
            }));

            // Resetear formulario de pago
            setPaymentData({
                payment_method: "transferencia",
                reference_number: "",
                notes: "",
                client_service_id: clientServiceId,
                amount: 0
            });

            setShowPaymentForm(false);
            alert(`Pago procesado exitosamente. Estado: ${updatedPaymentStatus}, Servicio: ${newClientServiceStatus}`);
        } catch (error) {
            console.error("Error al procesar pago:", error.response?.data || error.message);
            alert(`Error al procesar pago: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar servicio de cliente
    const handleDeleteService = async () => {
        if (!window.confirm("¿Está seguro que desea eliminar este servicio? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            setLoading(true);
            await deleteClientService(id);
            alert("Servicio eliminado exitosamente");
            navigate(`/client/${clientService.client_id}`);
        } catch (error) {
            console.error("Error al eliminar servicio:", error.response?.data || error.message);
            alert(`Error al eliminar servicio: ${error.response?.data?.message || error.message}`);
            setLoading(false);
        }
    };

    // Descartar cambios
    const handleDiscardChanges = () => {
        if (window.confirm("¿Está seguro que desea descartar los cambios?")) {
            setIsEditing(false);

            // Recargar datos del servicio
            getClientServiceById(id).then(data => {
                setClientService({
                    client_id: data.client_id || '',
                    service_id: data.service_id || '',
                    status: data.status || 'activo',
                    amount_due: parseFloat(data.amount_due) || 0,
                    due_date: data.due_date ? data.due_date.split('T')[0] : '',
                    payment_status: data.payment_status || 'pendiente',
                    client_name: data.client_name || '',
                    service_name: data.service_name || '',
                    service_price: parseFloat(data.service_price) || 0
                });
            }).catch(err => {
                console.error("Error al recargar datos:", err);
            });
        }
    };

    // Formatear fecha para mostrar
    const formatDate = (dateString) => {
        if (!dateString) return "No establecida";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    if (loading && !clientService.client_name) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Cargando...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <Navbar/>

            {/* Panel de Control Superior */}
            <div className="bg-white shadow-md p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(`/client-services`)}
                        className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
                    >
                        <ArrowLeft className="mr-2" size={18}/> Servicios Clientes
                    </button>

                    {isEditing ? (
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSaveChanges}
                                className="bg-blue-600 text-white px-3 py-1 rounded flex items-center"
                                disabled={loading}
                            >
                                <Save size={18} className="mr-1"/> Guardar
                            </button>
                            <button
                                onClick={handleDiscardChanges}
                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded flex items-center"
                                disabled={loading}
                            >
                                <X size={18} className="mr-1"/> Descartar
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 text-white px-3 py-1 rounded flex items-center"
                            >
                                <Edit size={18} className="mr-1"/> Editar
                            </button>
                            {clientService.payment_status === 'pendiente' && (
                                <button
                                    onClick={() => setShowPaymentForm(!showPaymentForm)}
                                    className="bg-green-600 text-white px-3 py-1 rounded flex items-center"
                                >
                                    <CreditCard size={18} className="mr-1"/> Registrar Pago
                                </button>
                            )}
                            <button
                                onClick={handleDeleteService}
                                className="bg-red-600 text-white px-3 py-1 rounded flex items-center"
                                disabled={loading}
                            >
                                <Trash2 size={18} className="mr-1"/> Eliminar
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex space-x-4 text-gray-600">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded ${
                        clientService.payment_status === 'pagado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {clientService.payment_status === 'pagado'
                            ? <CheckCircle size={20}/>
                            : <AlertCircle size={20}/>
                        }
                        <span className="font-medium">
                            {clientService.payment_status === 'pagado' ? 'Pagado' : 'Pendiente'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-4xl mx-auto w-full flex-grow p-6">
                {/* Formulario de pago */}
                {showPaymentForm && (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                        <div className="bg-blue-50 border-b p-4">
                            <h2 className="text-xl font-semibold text-blue-700">Registrar Pago</h2>
                        </div>
                        <form onSubmit={handleProcessPayment} className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                                    <select
                                        name="payment_method"
                                        value={paymentData.payment_method}
                                        onChange={handlePaymentInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="transferencia">Transferencia Bancaria</option>
                                        <option value="efectivo">Efectivo</option>
                                        <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                                        <option value="cheque">Cheque</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Monto a Pagar</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={paymentData.amount}
                                        onChange={handlePaymentInputChange}
                                        min="0.01"
                                        max={clientService.amount_due}
                                        step="0.01"
                                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Monto pendiente: ${clientService.amount_due.toFixed(2)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Número de Referencia</label>
                                    <input
                                        type="text"
                                        name="reference_number"
                                        value={paymentData.reference_number}
                                        onChange={handlePaymentInputChange}
                                        placeholder="Ej. TRX-12345"
                                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
                                    <input
                                        type="text"
                                        name="notes"
                                        value={paymentData.notes}
                                        onChange={handlePaymentInputChange}
                                        placeholder="Notas adicionales sobre el pago..."
                                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentForm(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded"
                                    disabled={loading}
                                >
                                    Procesar Pago
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {/* Información básica del servicio */}
                    <div className="bg-white border-b p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-800 mb-2">{clientService.service_name}</h1>
                                <p className="text-gray-600">Cliente: {clientService.client_name}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-semibold">${parseFloat(clientService.service_price).toFixed(2)}</div>
                                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                    clientService.payment_status === 'pagado'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {clientService.payment_status === 'pagado' ? 'Pagado' : 'Pendiente'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detalles del servicio */}
                    <div className="p-6 grid md:grid-cols-2 gap-6">
                        <div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado del Servicio</label>
                                    <select
                                        name="status"
                                        value={clientService.status}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'}`}
                                    >
                                        <option value="activo">Activo</option>
                                        <option value="suspendido">Suspendido</option>
                                        <option value="cancelado">Cancelado</option>
                                        <option value="completado">Completado</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio del Servicio</label>
                                    <div className="flex items-center">
                                        <DollarSign className="mr-2 text-gray-500" size={20}/>
                                        <input
                                            type="text"
                                            value={parseFloat(clientService.service_price).toFixed(2)}
                                            readOnly
                                            className="flex-grow px-3 py-2 border rounded-md bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Monto Pendiente</label>
                                    <div className="flex items-center">
                                        <DollarSign className="mr-2 text-gray-500" size={20}/>
                                        <input
                                            type="number"
                                            name="amount_due"
                                            value={clientService.amount_due}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            min="0"
                                            step="0.01"
                                            className={`flex-grow px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'}`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Vencimiento</label>
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 text-gray-500" size={20}/>
                                        <input
                                            type="date"
                                            name="due_date"
                                            value={clientService.due_date}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            className={`flex-grow px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'}`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Pago</label>
                                    <select
                                        name="payment_status"
                                        value={clientService.payment_status}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'}`}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="parcial">Pago Parcial</option>
                                        <option value="pagado">Pagado</option>
                                        <option value="vencido">Vencido</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="p-6 bg-gray-50 border-t">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Servicio creado el: {formatDate(clientService.created_at)}</p>
                                <p className="text-gray-500">Última actualización: {formatDate(clientService.updated_at)}</p>
                            </div>
                            <div className="md:text-right">
                                <p className="text-gray-500">ID del Servicio: {clientService.client_service_id}</p>
                                <p className="text-gray-500">ID del Cliente: {clientService.client_id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de historial de pagos (se podría implementar en futuras versiones) */}
                <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="bg-white border-b p-4">
                        <h2 className="text-lg font-semibold text-gray-800">Historial de Pagos</h2>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-500">No hay registros de pagos para este servicio.</p>
                        {/* Aquí se podría agregar una tabla con el historial de pagos en futuras versiones */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientServiceDetailPage;