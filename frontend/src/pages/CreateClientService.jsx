/*
 * File: CreateClientService.jsx
 * Author: Desarrollador de Servicios de Cliente
 * Copyright: 2025, Embedding Minds
 * License: MIT
 * Purpose: Interfaz para la creación de un nuevo servicio de cliente
 * Last Modified: 2025-03-05
 */

import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Users,
    Box,
    Calendar,
    DollarSign
} from 'lucide-react';

const CreateClientService = () => {
    const navigate = useNavigate();

    // Estados para gestionar los datos del formulario
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        client_id: '',
        service_id: '',
        amount_due: '',
        due_date: '',
    });
    const [loading, setLoading] = useState(false);

    // Cargar clientes y servicios al iniciar el componente
    useEffect(() => {
        const fetchClientsAndServices = async () => {
            setLoading(true);
            try {
                // Fetch clients
                const clientsResponse = await fetch('http://localhost:3000/api/clients');
                if (!clientsResponse.ok) {
                    throw new Error('Error al cargar los clientes');
                }
                const clientsData = await clientsResponse.json();
                setClients(clientsData);

                // Fetch services
                const servicesResponse = await fetch('http://localhost:3000/api/services');
                if (!servicesResponse.ok) {
                    throw new Error('Error al cargar los servicios');
                }
                const servicesData = await servicesResponse.json();
                setServices(servicesData);
            } catch (error) {
                console.error("Error fetching clients or services:", error);
                alert(`Error: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchClientsAndServices();
    }, []);

    // Manejar cambios en los inputs
    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Si se selecciona un servicio, obtener su precio
        if (name === 'service_id' && value) {
            setLoading(true);
            try {
                const serviceResponse = await fetch(`http://localhost:3000/api/services/${value}`);
                if (!serviceResponse.ok) {
                    throw new Error('Error al obtener detalles del servicio');
                }
                const serviceData = await serviceResponse.json();

                // Actualizar el monto adeudado con el precio del servicio
                setFormData(prev => ({
                    ...prev,
                    amount_due: serviceData.price
                }));
            } catch (error) {
                console.error("Error al obtener detalles del servicio:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validar datos del formulario
            if (!formData.client_id || !formData.service_id || !formData.amount_due || !formData.due_date) {
                throw new Error('Todos los campos son obligatorios');
            }

            const clientServiceData = {
                client_id: parseInt(formData.client_id),
                service_id: parseInt(formData.service_id),
                amount_due: parseFloat(formData.amount_due),
                due_date: formData.due_date,
            };

            // Enviar datos al backend
            const response = await fetch('http://localhost:3000/api/client/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clientServiceData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el servicio de cliente');
            }

            alert("Servicio de cliente agregado exitosamente.");
            navigate("/client-services");
        } catch (error) {
            console.error("Error al agregar servicio de cliente:", error.message);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-white border-b p-6 flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
                        <Box className="w-12 h-12 text-purple-500" />
                    </div>
                    <div className="flex-grow">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Crear Nuevo Servicio de Cliente
                        </h1>
                        <p className="text-gray-600">
                            Complete los detalles del servicio para el cliente
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Selección de Cliente */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="inline-block mr-2 text-gray-500" size={20} />
                                Cliente
                            </label>
                            <select
                                name="client_id"
                                value={formData.client_id}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Seleccionar Cliente</option>
                                {clients.map(client => (
                                    <option
                                        key={client.client_id}
                                        value={client.client_id}
                                    >
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selección de Servicio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Box className="inline-block mr-2 text-gray-500" size={20} />
                                Servicio
                            </label>
                            <select
                                name="service_id"
                                value={formData.service_id}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Seleccionar Servicio</option>
                                {services.map(service => (
                                    <option
                                        key={service.service_id}
                                        value={service.service_id}
                                    >
                                        {service.name} - ${service.price}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Monto Adeudado */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="inline-block mr-2 text-gray-500" size={20} />
                                Monto Adeudado
                            </label>
                            <input
                                type="number"
                                name="amount_due"
                                value={formData.amount_due}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                required
                                disabled={loading}
                                placeholder="Monto adeudado"
                                className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Se completa automáticamente al seleccionar un servicio
                            </p>
                        </div>

                        {/* Fecha de Vencimiento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="inline-block mr-2 text-gray-500" size={20} />
                                Fecha de Vencimiento
                            </label>
                            <input
                                type="date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="w-full flex justify-center mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:bg-purple-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Procesando...' : 'Crear Servicio de Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateClientService;