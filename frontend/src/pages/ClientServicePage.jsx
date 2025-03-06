/*
 * File: ClientServicePage.jsx
 * Author: Desarrollador de Interfaz de Servicios de Cliente
 * Copyright: 2025, Embedding Minds
 * License: MIT
 * Purpose: Interfaz de gestión de servicios de clientes con modos de vista de cuadrícula y lista
 * Last Modified: 2024-03-04
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, Plus, Grid, List, FileText, Users, DollarSign, Calendar } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import FilterMenu from "../components/filterMenu.jsx";

// Servicio API para obtener y buscar servicios de clientes
const getClientServices = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/client/services');
        if (!response.ok) throw new Error('Error al cargar servicios de clientes');
        return await response.json();
    } catch (error) {
        console.error("Error fetching client services:", error);
        return [];
    }
};

const searchClientServices = async (searchTerm) => {
    try {
        const response = await fetch(`http://localhost:3000/api/client/services/search?name=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('Error al buscar servicios de clientes');
        return await response.json();
    } catch (error) {
        console.error("Error searching client services:", error);
        return [];
    }
};

// Componente principal de la interfaz de servicios de clientes
const ClientServiceInterface = () => {
    // Estados para gestionar la interfaz
    const [viewMode, setViewMode] = useState('kanban');
    const [clientServices, setClientServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleClick = (clientServiceId) => {
        navigate(`/client-services/${clientServiceId}`);
    };

    // Efecto para cargar servicios de clientes al iniciar la interfaz
    useEffect(() => {
        const fetchClientServices = async () => {
            try {
                const data = await getClientServices();
                if (!Array.isArray(data)) throw new Error("La respuesta no es una lista de servicios de clientes");
                setClientServices(data);
            } catch (error) {
                console.error("Error al cargar servicios de clientes:", error.message);
            }
        };
        fetchClientServices();
    }, []);

    // Manejar búsqueda en tiempo real
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchTerm.trim() === "") {
                const data = await getClientServices(); // Si el campo está vacío, recarga todos los servicios
                setClientServices(data);
            } else {
                const data = await searchClientServices(searchTerm);
                setClientServices(data);
            }
        };

        const delaySearch = setTimeout(fetchSearchResults, 500); // Retraso de 500ms para evitar consultas innecesarias
        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    // Componente de tarjeta de servicio de cliente
    const ClientServiceCard = ({ clientService }) => {
        // Función para obtener el color del estado
        const getStatusColor = (status) => {
            switch (status) {
                case 'activo': return 'bg-green-100 text-green-800';
                case 'cancelado': return 'bg-red-100 text-red-800';
                case 'pendiente': return 'bg-yellow-100 text-yellow-800';
                default: return 'bg-gray-100 text-gray-800';
            }
        };

        return (
            <div
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 mb-4 cursor-pointer"
                onClick={() => handleClick(clientService.client_service_id)}
            >
                {/* Encabezado de la tarjeta */}
                <div className="flex items-start mb-3">
                    {/* Ícono de servicio */}
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-8 h-8 text-purple-500"/>
                    </div>
                    {/* Información principal del servicio */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">{clientService.service_name}</h3>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(clientService.status)}`}>
                            {clientService.status}
                        </div>
                    </div>
                </div>

                {/* Detalles adicionales del servicio de cliente */}
                <div className="space-y-2 mb-3">
                    {/* Cliente */}
                    <div className="flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2"/>
                        {clientService.client_name}
                    </div>

                    {/* Precio del servicio */}
                    <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2"/>
                        {new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN'
                        }).format(clientService.service_price)}
                    </div>

                    {/* Fecha de vencimiento */}
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2"/>
                        Vence: {new Date(clientService.due_date).toLocaleDateString()}
                    </div>

                    {/* Estado de pago */}
                    <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2"/>
                        Estado de pago: {clientService.payment_status}
                    </div>
                </div>
            </div>
        );
    };

    // Validación de propiedades para ClientServiceCard
    ClientServiceCard.propTypes = {
        clientService: PropTypes.shape({
            client_service_id: PropTypes.number.isRequired,
            service_name: PropTypes.string.isRequired,
            client_name: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            service_price: PropTypes.string.isRequired,
            due_date: PropTypes.string.isRequired,
            payment_status: PropTypes.string.isRequired,
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
                        <h1 className="text-xl font-semibold text-gray-800">Servicios de Clientes</h1>
                        <button
                            onClick={() => navigate("/create-client-service")}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center hover:bg-purple-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2"/>
                            Nuevo
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
                                placeholder="Buscar servicios de clientes..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                        {/* Menú de filtros */}
                        <FilterMenu/>
                        <div className="flex border border-gray-300 rounded-md overflow-hidden">
                            <button
                                className={`px-3 py-2 flex items-center ${viewMode === 'kanban' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700'}`}
                                onClick={() => setViewMode('kanban')}
                            >
                                <Grid className="w-4 h-4"/>
                            </button>
                            <button
                                className={`px-3 py-2 flex items-center ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700'}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contenido principal de servicios de clientes */}
                <div className="px-6 py-4">
                    {/* Vista de cuadrícula (Kanban) */}
                    {viewMode === 'kanban' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {clientServices.map(service => (
                                <ClientServiceCard key={service.client_service_id} clientService={service}/>
                            ))}
                        </div>
                    )}

                    {/* Vista de lista */}
                    {viewMode === 'list' && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado de Pago</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha de Vencimiento</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {clientServices.map(service => (
                                    <tr
                                        key={service.client_service_id}
                                        className="hover:bg-purple-100 cursor-pointer transition duration-200"
                                        onClick={() => handleClick(service.client_service_id)}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-800">{service.service_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{service.client_name}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${service.status === 'activo' ? 'bg-green-100 text-green-800' : service.status === 'cancelado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {service.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Intl.NumberFormat('es-MX', {
                                                style: 'currency',
                                                currency: 'MXN'
                                            }).format(service.service_price)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{service.payment_status}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(service.due_date).toLocaleDateString()}
                                        </td>
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

export default ClientServiceInterface;