/*
 * File: PaymentDetailPage.js
 * Author: Claude
 * Copyright: 2025, Embedding Minds
 * License: MIT
 * Purpose: Componente que muestra los detalles de un pago, permite editarlos, confirmarlos y generar facturas.
 * Last Modified: 2025-03-05
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    User,
    Phone,
    Mail,
    Save,
    X,
    DollarSign,
    FileText,
    Edit,
    Trash2,
    ArrowLeft,
    Check,
    Printer,
    CreditCard,
    Calendar,
    Hash,
    FileCheck
} from 'lucide-react';
import Navbar from "../components/Navbar.jsx";
import { getPaymentById, updatePayment, deletePayment, updatePaymentStatus } from "../services/api";

const PaymentDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('detalles');

    // Estado para los datos del pago
    const [payment, setPayment] = useState({
        payment_id: '',
        amount: '',
        payment_date: '',
        payment_method: '',
        reference_number: '',
        notes: '',
        status: '',
        payment_type: '',
        client_service_id: ''
    });

    // Estado para mostrar la factura
    const [showInvoice, setShowInvoice] = useState(false);

    // Información del cliente (simulada, en una implementación real se obtendría de la API)
    const [clientInfo] = useState({
        name: 'Cliente de Ejemplo',
        identification_number: 'RUC-1234567890',
        address: 'Av. Principal 123',
        email: 'cliente@ejemplo.com',
        phone: '+593 98 765 4321'
    });

    // Pestañas adicionales
    const tabs = [
        { id: 'detalles', label: 'Detalles del pago', icon: DollarSign },
        { id: 'cliente', label: 'Información del cliente', icon: User },
        { id: 'factura', label: 'Factura', icon: FileText },
        { id: 'notas', label: 'Notas internas', icon: Mail }
    ];

    // Cargar datos del pago
    useEffect(() => {
        const fetchPaymentData = async () => {
            if (!id) {
                setError("ID del pago no proporcionado");
                setLoading(false);
                return;
            }

            try {
                const data = await getPaymentById(id);
                if (!data) {
                    throw new Error("Pago no encontrado");
                }

                setPayment({
                    payment_id: data.payment_id || '',
                    amount: data.amount || '',
                    payment_date: data.payment_date ? new Date(data.payment_date).toISOString().split('T')[0] : '',
                    payment_method: data.payment_method || '',
                    reference_number: data.reference_number || '',
                    notes: data.notes || '',
                    status: data.status || 'en proceso',
                    payment_type: data.payment_type || '',
                    client_service_id: data.client_service_id || ''
                });

                // En una implementación real, aquí también se cargaría la información del cliente
                // basada en el client_service_id

                setLoading(false);
            } catch (err) {
                console.error("Error al cargar el pago:", err);
                setError("No se pudo cargar la información del pago");
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, [id]);

    // Manejar cambios en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPayment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Guardar cambios del pago
    const handleSaveChanges = async () => {
        if (!payment.amount.trim()) {
            alert("El monto del pago es obligatorio");
            return;
        }

        try {
            setLoading(true);

            const paymentData = {
                amount: payment.amount.trim(),
                payment_date: payment.payment_date,
                payment_method: payment.payment_method.trim(),
                reference_number: payment.reference_number.trim(),
                notes: payment.notes.trim(),
                payment_type: payment.payment_type.trim(),
                status: payment.status
            };

            await updatePayment(id, paymentData);
            setIsEditing(false);
            alert("Pago actualizado exitosamente");
        } catch (error) {
            console.error("Error al actualizar pago:", error.response?.data || error.message);
            alert(`Error al actualizar pago: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Confirmar el pago (cambiar status a "pagado")
    const handleConfirmPayment = async () => {
        if (!window.confirm("¿Está seguro que desea confirmar este pago? Esta acción cambiará el estado a 'pagado'.")) {
            return;
        }

        try {
            setLoading(true);
            await updatePaymentStatus(id, { status: "pagado" });

            setPayment(prev => ({
                ...prev,
                status: "pagado"
            }));

            alert("Pago confirmado exitosamente");
            setLoading(false);
        } catch (error) {
            console.error("Error al confirmar pago:", error.response?.data || error.message);
            alert(`Error al confirmar pago: ${error.response?.data?.message || error.message}`);
            setLoading(false);
        }
    };

    // Eliminar pago
    const handleDeletePayment = async () => {
        if (!window.confirm("¿Está seguro que desea eliminar este pago? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            setLoading(true);
            await deletePayment(id);
            alert("Pago eliminado exitosamente");
            navigate("/payments");
        } catch (error) {
            console.error("Error al eliminar pago:", error.response?.data || error.message);
            alert(`Error al eliminar pago: ${error.response?.data?.message || error.message}`);
            setLoading(false);
        }
    };

    // Generar factura
    const handleGenerateInvoice = () => {
        setShowInvoice(true);
        setActiveTab('factura');
    };

    // Imprimir factura
    const handlePrintInvoice = () => {
        window.print();
    };

    // Descartar cambios
    const handleDiscardChanges = () => {
        if (window.confirm("¿Está seguro que desea descartar los cambios?")) {
            setIsEditing(false);
            // Recargar datos del pago
            getPaymentById(id).then(data => {
                setPayment({
                    payment_id: data.payment_id || '',
                    amount: data.amount || '',
                    payment_date: data.payment_date ? new Date(data.payment_date).toISOString().split('T')[0] : '',
                    payment_method: data.payment_method || '',
                    reference_number: data.reference_number || '',
                    notes: data.notes || '',
                    status: data.status || 'en proceso',
                    payment_type: data.payment_type || '',
                    client_service_id: data.client_service_id || ''
                });
            }).catch(err => {
                console.error("Error al recargar datos:", err);
            });
        }
    };

    // Formatear fecha para mostrar
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Formatear monto como moneda
    const formatCurrency = (amount) => {
        if (!amount) return '$0.00';
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    if (loading && !payment.payment_id) {
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
            <Navbar />

            {/* Panel de Control Superior */}
            <div className="bg-white shadow-md p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/payments')}
                        className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
                    >
                        <ArrowLeft className="mr-2" size={18} /> Pagos
                    </button>

                    {isEditing ? (
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSaveChanges}
                                className="bg-blue-600 text-white px-3 py-1 rounded flex items-center"
                                disabled={loading}
                            >
                                <Save size={18} className="mr-1" /> Guardar
                            </button>
                            <button
                                onClick={handleDiscardChanges}
                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded flex items-center"
                                disabled={loading}
                            >
                                <X size={18} className="mr-1" /> Descartar
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 text-white px-3 py-1 rounded flex items-center"
                                disabled={payment.status === 'pagado'}
                            >
                                <Edit size={18} className="mr-1" /> Editar
                            </button>
                            {payment.status !== 'pagado' && (
                                <button
                                    onClick={handleConfirmPayment}
                                    className="bg-green-500 text-white px-3 py-1 rounded flex items-center"
                                    disabled={loading}
                                >
                                    <Check size={18} className="mr-1" /> Confirmar Pago
                                </button>
                            )}
                            <button
                                onClick={handleGenerateInvoice}
                                className="bg-purple-500 text-white px-3 py-1 rounded flex items-center"
                                disabled={loading}
                            >
                                <FileCheck size={18} className="mr-1" /> Generar Factura
                            </button>
                            <button
                                onClick={handleDeletePayment}
                                className="bg-red-600 text-white px-3 py-1 rounded flex items-center"
                                disabled={loading || payment.status === 'pagado'}
                            >
                                <Trash2 size={18} className="mr-1" /> Eliminar
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex space-x-4 text-gray-600">
                    <div className="flex items-center space-x-2">
                        <DollarSign size={20} />
                        <span>Monto: {formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar size={20} />
                        <span>Fecha: {formatDate(payment.payment_date)}</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                        payment.status === 'pagado'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                    }`}>
                        <FileText size={20} />
                        <span>Estado: {payment.status === 'pagado' ? 'Pagado' : 'En proceso'}</span>
                    </div>
                </div>
            </div>

            {/* Estado del pago */}
            {payment.status === 'pagado' && (
                <div className="bg-green-100 border-l-4 border-green-500 p-3 text-green-700">
                    <div className="flex items-center">
                        <p>Este pago ha sido confirmado y completado. No se pueden realizar modificaciones.</p>
                    </div>
                </div>
            )}

            {/* Contenido principal */}
            <div className="max-w-4xl mx-auto w-full flex-grow p-6">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {/* Información básica del pago */}
                    <div className="bg-white border-b p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-medium text-gray-700">
                                Pago #{payment.payment_id}
                            </h2>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                payment.status === 'pagado'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {payment.status === 'pagado' ? 'Pagado' : 'En proceso'}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-600 flex items-center mb-2">
                                    <DollarSign className="mr-2" size={18} />
                                    <span className="font-semibold">Monto:</span> {formatCurrency(payment.amount)}
                                </p>
                                <p className="text-gray-600 flex items-center mb-2">
                                    <Calendar className="mr-2" size={18} />
                                    <span className="font-semibold">Fecha:</span> {formatDate(payment.payment_date)}
                                </p>
                                <p className="text-gray-600 flex items-center mb-2">
                                    <CreditCard className="mr-2" size={18} />
                                    <span className="font-semibold">Método:</span> {payment.payment_method}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 flex items-center mb-2">
                                    <Hash className="mr-2" size={18} />
                                    <span className="font-semibold">Referencia:</span> {payment.reference_number}
                                </p>
                                <p className="text-gray-600 flex items-center mb-2">
                                    <FileText className="mr-2" size={18} />
                                    <span className="font-semibold">Tipo:</span> {payment.payment_type}
                                </p>
                                <p className="text-gray-600 flex items-center mb-2">
                                    <User className="mr-2" size={18} />
                                    <span className="font-semibold">ID Servicio:</span> {payment.client_service_id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pestañas de Información Adicional */}
                    <div className="flex border-b mb-4 px-6 pt-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center px-4 py-2 mr-2 
                                    ${activeTab === tab.id
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'}
                                `}
                            >
                                <tab.icon className="mr-2" size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Contenido de la pestaña activa */}
                    <div className="p-6 bg-gray-50 rounded">
                        {activeTab === 'detalles' && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Detalles del pago</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Monto</label>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    value={payment.amount}
                                                    onChange={handleInputChange}
                                                    readOnly={!isEditing}
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                    className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de pago</label>
                                                <input
                                                    type="date"
                                                    name="payment_date"
                                                    value={payment.payment_date}
                                                    onChange={handleInputChange}
                                                    readOnly={!isEditing}
                                                    className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Método de pago</label>
                                                <select
                                                    name="payment_method"
                                                    value={payment.payment_method}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                                >
                                                    <option value="">Seleccionar método</option>
                                                    <option value="transferencia">Transferencia</option>
                                                    <option value="tarjeta">Tarjeta de crédito</option>
                                                    <option value="efectivo">Efectivo</option>
                                                    <option value="cheque">Cheque</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Número de referencia</label>
                                                <input
                                                    type="text"
                                                    name="reference_number"
                                                    value={payment.reference_number}
                                                    onChange={handleInputChange}
                                                    readOnly={!isEditing}
                                                    placeholder="Número de referencia"
                                                    className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de pago</label>
                                                <select
                                                    name="payment_type"
                                                    value={payment.payment_type}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                                >
                                                    <option value="">Seleccionar tipo</option>
                                                    <option value="efectivo">Efectivo</option>
                                                    <option value="anticipo">Anticipo</option>
                                                    <option value="abono">Abono</option>
                                                    <option value="liquidacion">Liquidación</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Estado del pago</label>
                                                <select
                                                    name="status"
                                                    value={payment.status}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing || payment.status === 'pagado'}
                                                    className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                                >
                                                    <option value="en proceso">En proceso</option>
                                                    <option value="pagado">Pagado</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'cliente' && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Información del cliente</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <User className="mr-2 text-gray-500" size={20} />
                                        <span className="font-medium">Cliente:</span>
                                        <span className="ml-2">{clientInfo.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FileText className="mr-2 text-gray-500" size={20} />
                                        <span className="font-medium">Identificación:</span>
                                        <span className="ml-2">{clientInfo.identification_number}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="mr-2 text-gray-500" size={20} />
                                        <span className="font-medium">Email:</span>
                                        <span className="ml-2">{clientInfo.email}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="mr-2 text-gray-500" size={20} />
                                        <span className="font-medium">Teléfono:</span>
                                        <span className="ml-2">{clientInfo.phone}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FileText className="mr-2 text-gray-500" size={20} />
                                        <span className="font-medium">Dirección:</span>
                                        <span className="ml-2">{clientInfo.address}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'factura' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium">Factura</h3>
                                    <button
                                        onClick={handlePrintInvoice}
                                        className="bg-blue-600 text-white px-3 py-1 rounded flex items-center"
                                    >
                                        <Printer size={18} className="mr-1" /> Imprimir Factura
                                    </button>
                                </div>

                                {showInvoice ? (
                                    <div className="bg-white border p-6 rounded-lg">
                                        <div className="text-center mb-6">
                                            <h2 className="text-2xl font-bold">FACTURA</h2>
                                            <p className="text-gray-500">#{payment.payment_id}</p>
                                        </div>

                                        <div className="flex justify-between mb-6">
                                            <div>
                                                <h3 className="font-medium mb-2">Datos de la empresa:</h3>
                                                <p>Embedding Minds</p>
                                                <p>RUC: 1234567890001</p>
                                                <p>Dirección: Av. Principal 123</p>
                                                <p>Tel: +593 98 123 4567</p>
                                                <p>Email: info@embeddingminds.com</p>
                                            </div>
                                            <div>
                                                <h3 className="font-medium mb-2">Cliente:</h3>
                                                <p>{clientInfo.name}</p>
                                                <p>{clientInfo.identification_number}</p>
                                                <p>{clientInfo.address}</p>
                                                <p>{clientInfo.phone}</p>
                                                <p>{clientInfo.email}</p>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="font-medium mb-2">Detalles de la factura:</h3>
                                            <table className="w-full border-collapse">
                                                <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border p-2 text-left">Fecha</th>
                                                    <th className="border p-2 text-left">Descripción</th>
                                                    <th className="border p-2 text-left">Método</th>
                                                    <th className="border p-2 text-left">Referencia</th>
                                                    <th className="border p-2 text-right">Monto</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td className="border p-2">{formatDate(payment.payment_date)}</td>
                                                    <td className="border p-2">Pago por servicio #{payment.client_service_id}</td>
                                                    <td className="border p-2">{payment.payment_method}</td>
                                                    <td className="border p-2">{payment.reference_number}</td>
                                                    <td className="border p-2 text-right">{formatCurrency(payment.amount)}</td>
                                                </tr>
                                                </tbody>
                                                <tfoot>
                                                <tr className="bg-gray-100">
                                                    <td colSpan="4" className="border p-2 text-right font-medium">Total:</td>
                                                    <td className="border p-2 text-right font-bold">{formatCurrency(payment.amount)}</td>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </div>

                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-medium mb-2">Notas:</h3>
                                                <p>{payment.notes || "Sin notas adicionales."}</p>
                                            </div>
                                            <div className="text-right">
                                                <h3 className="font-medium mb-2">Estado:</h3>
                                                <p className={`font-bold ${payment.status === 'pagado' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {payment.status === 'pagado' ? 'PAGADO' : 'PENDIENTE DE PAGO'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-8 bg-gray-100 rounded">
                                        <p className="text-gray-500 mb-4">Aún no se ha generado una factura para este pago.</p>
                                        <button
                                            onClick={handleGenerateInvoice}
                                            className="bg-blue-600 text-white px-4 py-2 rounded"
                                        >
                                            Generar Factura
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'notas' && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Notas internas</h3>
                                <textarea
                                    name="notes"
                                    value={payment.notes}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                    placeholder="Añadir notas internas sobre este pago..."
                                    rows={5}
                                    readOnly={!isEditing}
                                ></textarea>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailPage;