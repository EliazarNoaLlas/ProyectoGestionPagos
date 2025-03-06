/*
 * File: ServiceDetailPage.js
 * Author: Claude
 * Copyright: 2025, Embedding Minds
 * License: MIT
 * Purpose: Componente que muestra los detalles de un servicio, permite editarlos, eliminarlos y gestionar su información.
 * Last Modified: 2025-03-05
 */

import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    Package,
    Save,
    X,
    DollarSign,
    FileText,
    Users,
    Edit,
    Trash2,
    ArrowLeft,
    Tag,
    Clock,
    Calendar
} from 'lucide-react';
import {getServiceById, updateService, deleteService} from "../services/api";
import Navbar from "../components/Navbar.jsx";

const ServiceDetailPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('detalles');

    // Estado para los datos del servicio
    const [service, setService] = useState({
        name: '',
        description: '',
        price: ''
    });

    // Pestañas adicionales
    const tabs = [
        {id: 'detalles', label: 'Detalles del servicio', icon: FileText},
        {id: 'historial', label: 'Historial de uso', icon: Clock},
        {id: 'clientes', label: 'Clientes asociados', icon: Users},
        {id: 'facturacion', label: 'Facturación', icon: DollarSign}
    ];

    // Cargar datos del servicio
    useEffect(() => {
        const fetchServiceData = async () => {
            if (!id) {
                setError("ID del servicio no proporcionado");
                setLoading(false);
                return;
            }

            try {
                const data = await getServiceById(id);
                if (!data) {
                    throw new Error("Servicio no encontrado");
                }

                setService({
                    name: data.name || '',
                    description: data.description || '',
                    price: data.price || ''
                });

                setLoading(false);
            } catch (err) {
                console.error("Error al cargar el servicio:", err);
                setError("No se pudo cargar la información del servicio");
                setLoading(false);
            }
        };

        fetchServiceData();
    }, [id]);

    // Manejar cambios en los campos del formulario
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setService(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Guardar cambios del servicio
    const handleSaveChanges = async () => {
        if (!service.name.trim()) {
            alert("El nombre del servicio es obligatorio");
            return;
        }

        if (isNaN(parseFloat(service.price)) || parseFloat(service.price) < 0) {
            alert("El precio debe ser un número válido y mayor o igual a cero");
            return;
        }

        try {
            setLoading(true);

            const serviceData = {
                name: service.name.trim(),
                description: service.description.trim(),
                price: parseFloat(service.price)
            };

            await updateService(id, serviceData);
            setIsEditing(false);
            alert("Servicio actualizado exitosamente");
        } catch (error) {
            console.error("Error al actualizar servicio:", error.response?.data || error.message);
            alert(`Error al actualizar servicio: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar servicio
    const handleDeleteService = async () => {
        if (!window.confirm("¿Está seguro que desea eliminar este servicio? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            setLoading(true);
            await deleteService(id);
            alert("Servicio eliminado exitosamente");
            navigate("/services");
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
            getServiceById(id).then(data => {
                setService({
                    name: data.name || '',
                    description: data.description || '',
                    price: data.price || ''
                });
            }).catch(err => {
                console.error("Error al recargar datos:", err);
            });
        }
    };

    // Formatear precio para mostrar
    const formatPrice = (price) => {
        return parseFloat(price).toFixed(2);
    };

    if (loading && !service.name) {
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
                        onClick={() => navigate('/services')}
                        className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
                    >
                        <ArrowLeft className="mr-2" size={18}/> Servicios
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
                    <div className="flex items-center space-x-2">
                        <DollarSign size={20}/>
                        <span>Ingresos ${service.price ? formatPrice(service.price) : '0.00'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar size={20}/>
                        <span>Creado: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users size={20}/>
                        <span>Clientes 0</span>
                    </div>
                </div>
            </div>


            {/* Contenido principal */}
            <div className="max-w-4xl mx-auto w-full flex-grow p-6">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {/* Información básica del servicio */}
                    <div className="bg-white border-b p-6 flex items-center space-x-6">
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                            <Package className="w-12 h-12 text-blue-500"/>
                        </div>

                        <div className="flex-grow">
                            <div className="mb-2">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Servicio</span>
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={service.name}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className={`w-full text-2xl font-medium text-gray-700 ${isEditing ? 'border-b-2 border-transparent focus:border-blue-500 outline-none' : 'bg-transparent border-none outline-none'}`}
                                placeholder="Nombre del Servicio"
                            />
                            <div className="flex items-center mt-2">
                                <Tag className="text-gray-400 mr-2" size={16}/>
                                <div className="flex items-center">
                                    <span className="text-gray-500 mr-2">Precio:</span>
                                    <div className="flex items-center">
                                        <DollarSign className="text-gray-400 mr-1" size={16}/>
                                        <input
                                            type="text"
                                            name="price"
                                            value={service.price}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            className={`text-lg font-semibold text-blue-600 ${isEditing ? 'border-b border-gray-300 focus:border-blue-500 outline-none' : 'bg-transparent border-none outline-none'}`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulario con datos del servicio */}
                    <div className="p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del servicio</label>
                            <textarea
                                name="description"
                                value={service.description}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'}`}
                                placeholder="Descripción detallada del servicio..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Pestañas de Información Adicional */}
                <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
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
                                <tab.icon className="mr-2" size={16}/>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Contenido de la pestaña activa */}
                    <div className="p-6 bg-gray-50 rounded">
                        {activeTab === 'detalles' && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Detalles del servicio</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded shadow-sm">
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">ID del Servicio</h4>
                                        <p>{id}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'historial' && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Historial de uso del servicio</h3>
                                <p className="text-gray-500">No hay registros de uso para este servicio.</p>
                            </div>
                        )}

                        {activeTab === 'clientes' && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Clientes que utilizan este servicio</h3>
                                <p className="text-gray-500">No hay clientes asociados a este servicio.</p>
                            </div>
                        )}

                        {activeTab === 'facturacion' && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Historial de facturación</h3>
                                <p className="text-gray-500">No hay datos de facturación disponibles para este servicio.</p>

                                <div className="mt-6">
                                    <h4 className="text-md font-medium mb-3">Resumen financiero</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-white p-4 rounded shadow-sm">
                                            <h5 className="text-sm font-medium text-gray-500 mb-2">Facturado (total)</h5>
                                            <p className="text-xl font-semibold text-blue-600">$0.00</p>
                                        </div>
                                        <div className="bg-white p-4 rounded shadow-sm">
                                            <h5 className="text-sm font-medium text-gray-500 mb-2">Este mes</h5>
                                            <p className="text-xl font-semibold text-blue-600">$0.00</p>
                                        </div>
                                        <div className="bg-white p-4 rounded shadow-sm">
                                            <h5 className="text-sm font-medium text-gray-500 mb-2">Pendiente de cobro</h5>
                                            <p className="text-xl font-semibold text-red-600">$0.00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;