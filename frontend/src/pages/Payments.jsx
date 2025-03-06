/*
 * File: PaymentPage.js
 * Author: Desarrollador de Interfaz de Gestión de Pagos
 * Copyright: 2025, Embedding Minds
 * License: MIT
 * Purpose: Interfaz de gestión de pagos con modos de vista de cuadrícula y lista
 * Last Modified: 2025-03-05
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, Plus, Grid, List, FileText, DollarSign, Calendar, CreditCard } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import FilterMenu from "../components/filterMenu.jsx";

// Servicio API para obtener y buscar pagos
const getPayments = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/payments/status/en proceso');
        if (!response.ok) throw new Error('Error al cargar pagos');
        return await response.json();
    } catch (error) {
        console.error("Error fetching payments:", error);
        return [];
    }
};

const searchPayments = async (searchTerm) => {
    try {
        const response = await fetch(`http://localhost:3000/api/payments?search=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('Error al buscar pagos');
        return await response.json();
    } catch (error) {
        console.error("Error searching payments:", error);
        return [];
    }
};

// Componente principal de la interfaz de pagos
const PaymentPage = () => {
    // Estados para gestionar la interfaz
    const [viewMode, setViewMode] = useState('kanban');
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleClick = (paymentId) => {
        navigate(`/payments/${paymentId}`);
    };

    // Efecto para cargar pagos al iniciar la interfaz
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const data = await getPayments();
                if (!Array.isArray(data)) throw new Error("La respuesta no es una lista de pagos");
                setPayments(data);
            } catch (error) {
                console.error("Error al cargar pagos:", error.message);
            }
        };
        fetchPayments();
    }, []);

    // Manejar búsqueda en tiempo real
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchTerm.trim() === "") {
                const data = await getPayments(); // Si el campo está vacío, recarga todos los pagos
                setPayments(data);
            } else {
                const data = await searchPayments(searchTerm);
                setPayments(data);
            }
        };

        const delaySearch = setTimeout(fetchSearchResults, 500); // Retraso de 500ms para evitar consultas innecesarias
        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    // Componente de tarjeta de pago
    const PaymentCard = ({ payment }) => {
        // Función para obtener el color del estado
        const getStatusColor = (status) => {
            switch (status) {
                case 'pagado': return 'bg-green-100 text-green-800';
                case 'borrador': return 'bg-gray-100 text-gray-800';
                case 'en proceso': return 'bg-yellow-100 text-yellow-800';
                default: return 'bg-gray-100 text-gray-800';
            }
        };

        // Función para obtener el ícono del método de pago
        const getPaymentMethodIcon = (method) => {
            switch (method) {
                case 'tarjeta': return <CreditCard className="w-8 h-8 text-blue-500" />;
                case 'efectivo': return <DollarSign className="w-8 h-8 text-green-500" />;
                case 'transferencia': return <FileText className="w-8 h-8 text-purple-500" />;
                case 'cheque': return <FileText className="w-8 h-8 text-orange-500" />;
                default: return <DollarSign className="w-8 h-8 text-gray-500" />;
            }
        };

        return (
            <div
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 mb-4 cursor-pointer"
                onClick={() => handleClick(payment.payment_id)}
            >
                {/* Encabezado de la tarjeta */}
                <div className="flex items-start mb-3">
                    {/* Ícono de pago */}
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        {getPaymentMethodIcon(payment.payment_method)}
                    </div>
                    {/* Información principal del pago */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">Pago #{payment.payment_id}</h3>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                            {payment.status}
                        </div>
                    </div>
                </div>

                {/* Detalles adicionales del pago */}
                <div className="space-y-2 mb-3">
                    {/* Monto */}
                    <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2"/>
                        {new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN'
                        }).format(payment.amount)}
                    </div>

                    {/* Método de pago */}
                    <div className="flex items-center text-sm text-gray-600">
                        <CreditCard className="w-4 h-4 mr-2"/>
                        Método: {payment.payment_method}
                    </div>

                    {/* Fecha de pago */}
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2"/>
                        Fecha: {new Date(payment.payment_date).toLocaleDateString()}
                    </div>

                    {/* Referencia */}
                    <div className="flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2"/>
                        Referencia: {payment.reference_number || "N/A"}
                    </div>
                </div>
            </div>
        );
    };

    // Validación de propiedades para PaymentCard
    PaymentCard.propTypes = {
        payment: PropTypes.shape({
            payment_id: PropTypes.number.isRequired,
            amount: PropTypes.string.isRequired,
            payment_date: PropTypes.string.isRequired,
            payment_method: PropTypes.string.isRequired,
            reference_number: PropTypes.string,
            status: PropTypes.string.isRequired,
            payment_type: PropTypes.string.isRequired,
            client_service_id: PropTypes.number.isRequired,
            notes: PropTypes.string,
            created_at: PropTypes.string.isRequired,
        }).isRequired,
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar/>

            {/* Contenido principal de la interfaz */}
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-semibold text-gray-800">Pagos</h1>
                        <button
                            onClick={() => navigate("/create-payment")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2"/>
                            Nuevo Pago
                        </button>
                    </div>
                </div>

                {/* Search Bar y Filtros */}
                <div className="px-6 py-4">
                    <div className="flex space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                            <input
                                type="text"
                                placeholder="Buscar pagos..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        {/* Menú de filtros */}
                        <FilterMenu/>
                        <div className="flex border border-gray-300 rounded-md overflow-hidden">
                            <button
                                className={`px-3 py-2 flex items-center ${viewMode === 'kanban' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'}`}
                                onClick={() => setViewMode('kanban')}
                            >
                                <Grid className="w-4 h-4"/>
                            </button>
                            <button
                                className={`px-3 py-2 flex items-center ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contenido principal de pagos */}
                <div className="px-6 py-4">
                    {/* Vista de cuadrícula (Kanban) */}
                    {viewMode === 'kanban' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {payments.map(payment => (
                                <PaymentCard key={payment.payment_id} payment={payment}/>
                            ))}
                        </div>
                    )}

                    {/* Vista de lista */}
                    {viewMode === 'list' && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referencia</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Servicio</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {payments.map(payment => (
                                    <tr
                                        key={payment.payment_id}
                                        className="hover:bg-blue-100 cursor-pointer transition duration-200"
                                        onClick={() => handleClick(payment.payment_id)}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-800">{payment.payment_id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Intl.NumberFormat('es-MX', {
                                                style: 'currency',
                                                currency: 'MXN'
                                            }).format(payment.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{payment.payment_method}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(payment.payment_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{payment.reference_number || "N/A"}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                                payment.status === 'pagado' ? 'bg-green-100 text-green-800' :
                                                    payment.status === 'borrador' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{payment.client_service_id}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;