/*
 * File: ServicesPage.jsx
 * Author: Desarrollador de Interfaz de Servicios
 * Copyright: 2025, Embedding Minds
 * License: MIT
 * Purpose: Interfaz de gestión de servicios con modos de vista de cuadrícula y lista
 * Last Modified: 2024-03-04
 */

import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Search, Plus, Grid, List, Box, DollarSign, FileText} from 'lucide-react';
import {getServices, searchServices} from '../services/api';
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import FilterMenu from "../components/filterMenu.jsx";

// Componente principal de la interfaz de servicios
const ServicesInterface = () => {
    // Estados para gestionar la interfaz
    const [viewMode, setViewMode] = useState('kanban');
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleClick = (serviceId) => {
        navigate(`/services/${serviceId}`);
    };

    // Efecto para cargar servicios al iniciar la interfaz
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getServices();
                if (!Array.isArray(data)) throw new Error("La respuesta no es una lista de servicios");
                setServices(data);
            } catch (error) {
                console.error("Error al cargar servicios:", error.message);
            }
        };
        fetchServices();
    }, []);

    // Manejar búsqueda en tiempo real
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchTerm.trim() === "") {
                const data = await getServices(); // Si el campo está vacío, recarga todos los servicios
                setServices(data);
            } else {
                const data = await searchServices(searchTerm);
                setServices(data);
            }
        };

        const delaySearch = setTimeout(fetchSearchResults, 500); // Retraso de 500ms para evitar consultas innecesarias
        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    // Componente de tarjeta de servicio
    const ServiceCard = ({service}) => (
        <div
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 mb-4 cursor-pointer"
            onClick={() => handleClick(service.service_id)}
        >
            {/* Encabezado de la tarjeta */}
            <div className="flex items-start mb-3">
                {/* Ícono de servicio */}
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Box className="w-8 h-8 text-blue-500"/>
                </div>
                {/* Información principal del servicio */}
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{service.name}</h3>
                    <div className="text-sm text-gray-600">Servicio</div>
                </div>
            </div>

            {/* Detalles adicionales del servicio */}
            <div className="space-y-2 mb-3">
                {/* Descripción */}
                <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2"/>
                    {service.description}
                </div>

                {/* Precio */}
                <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2"/>
                    {new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN'
                    }).format(service.price)}
                </div>
            </div>
        </div>
    );

    // Validación de propiedades para ServiceCard
    ServiceCard.propTypes = {
        service: PropTypes.shape({
            service_id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
            price: PropTypes.string.isRequired,
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
                        <h1 className="text-xl font-semibold text-gray-800">Servicios</h1>
                        <button
                            onClick={() => navigate("/create-service")}
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
                                placeholder="Buscar servicios..."
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

                {/* Contenido principal de servicios */}
                <div className="px-6 py-4">
                    {/* Vista de cuadrícula (Kanban) */}
                    {viewMode === 'kanban' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map(service => (
                                <ServiceCard key={service.service_id} service={service}/>
                            ))}
                        </div>
                    )}

                    {/* Vista de lista */}
                    {viewMode === 'list' && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {services.map(service => (
                                    <tr
                                        key={service.service_id}
                                        className="hover:bg-purple-100 cursor-pointer transition duration-200"
                                        onClick={() => handleClick(service.service_id)}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-800">{service.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{service.description}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Intl.NumberFormat('es-MX', {
                                                style: 'currency',
                                                currency: 'MXN'
                                            }).format(service.price)}
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

export default ServicesInterface;
