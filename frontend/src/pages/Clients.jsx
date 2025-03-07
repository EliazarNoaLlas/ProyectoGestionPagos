/*
 * File: ClientsInterface.jsx
 * Author: Desarrollador de Interfaz de Clientes
 * Copyright: 2025, Embedding Minds
 * License: MIT
 * Purpose: Interfaz de gestión de clientes con modos de vista de cuadrícula y lista
 * Last Modified: 2024-03-04
 */

import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Search, Plus, Grid, List, Building, Mail, MapPin, User} from 'lucide-react';
import {getClients, searchClients} from '../services/api';
import {useNavigate} from "react-router-dom";
import FilterMenu from "../components/filterMenu.jsx";
import Navbar from "../components/Navbar.jsx";

// Componente principal de la interfaz de clientes
const ClientsInterface = () => {
    // Estados para gestionar la interfaz
    const [viewMode, setViewMode] = useState('kanban');
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleClick = (clientId) => {
        navigate(`/clients/${clientId}`);
    };

    // Efecto para cargar clientes al iniciar la interfaz
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getClients();
                if (!Array.isArray(data)) throw new Error("La respuesta no es una lista de clientes");
                setClients(data);
            } catch (error) {
                console.error("Error al cargar clientes:", error.message);
            }
        };
        fetchClients();
    }, []);

    // Manejar búsqueda en tiempo real
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchTerm.trim() === "") {
                const data = await getClients(); // Si el campo está vacío, recarga todos los clientes
                setClients(data);
            } else {
                const data = await searchClients(searchTerm);
                setClients(data);
            }
        };

        const delaySearch = setTimeout(fetchSearchResults, 500); // Retraso de 500ms para evitar consultas innecesarias
        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    // Componente de tarjeta de cliente
    const ClientCard = ({client}) => (
        <div
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 mb-4 cursor-pointer"
            onClick={() => handleClick(client.client_id)}
        >
            {/* Encabezado de la tarjeta */}
            <div className="flex items-start mb-3">
                {/* Ícono de empresa o usuario */}
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    {client.type === 'empresa' ? (
                        <Building className="w-8 h-8 text-blue-500"/>
                    ) : (
                        <User className="w-8 h-8 text-blue-500"/>
                    )}
                </div>
                {/* Información principal del cliente */}
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{client.name}</h3>
                    <div className="text-sm text-gray-600">
                        {client.type === 'empresa' ? 'Empresa' : 'Cliente Individual'}
                    </div>
                </div>
            </div>

            {/* Detalles adicionales del cliente */}
            <div className="space-y-2 mb-3">
                {/* Ubicación */}
                <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2"/>
                    {client.city}, {client.country}
                </div>

                {/* Correo electrónico */}
                <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2"/>
                    {client.email}
                </div>
            </div>

            {/* Información de creación y actualización */}
            <div className="flex justify-between pt-3 border-t border-gray-100 text-sm">
                <div className="text-gray-600">Creado: {new Date(client.created_at).toLocaleDateString()}</div>
                <div className="text-gray-600">Actualizado: {new Date(client.updated_at).toLocaleDateString()}</div>
            </div>
        </div>
    );

    // Validación de propiedades para ClientCard
    ClientCard.propTypes = {
        client: PropTypes.shape({
            client_id: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            city: PropTypes.string.isRequired,
            country: PropTypes.string.isRequired,
            phone: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            is_active: PropTypes.bool.isRequired,
            created_at: PropTypes.string.isRequired,
            updated_at: PropTypes.string.isRequired,
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
                        <h1 className="text-xl font-semibold text-gray-800">Clientes</h1>
                        <button onClick={() => navigate("/create-client")}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center hover:bg-purple-700 transition-colors">
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
                                placeholder="Buscar clientes..."
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

                {/* Contenido principal de clientes */}
                <div className="px-6 py-4">
                    {/* Vista de cuadrícula (Kanban) */}
                    {viewMode === 'kanban' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {clients.map(client => (
                                <ClientCard key={client.client_id} client={client}/>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ciudad</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {clients.map(client => (
                                    <tr
                                        key={client.client_id}
                                        className="hover:bg-purple-100 cursor-pointer transition duration-200"
                                        onClick={() => handleClick(client.client_id)}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-800">{client.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{client.type === 'empresa' ? 'Empresa' : 'Individual'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{client.city}, {client.country}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{client.phone}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                                        <td className={`px-6 py-4 text-sm font-medium ${client.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                            {client.is_active ? 'Activo' : 'Inactivo'}
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

export default ClientsInterface;
