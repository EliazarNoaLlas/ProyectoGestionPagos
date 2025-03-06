/*
 * File: CreateService.jsx
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 * Purpose: Interfaz para la creacion de un nuevo servicio
 * Last Modified: 2024-03-04
 */

import { useState, useRef } from 'react';
import {
    Box,
    Upload,
    DollarSign,
} from 'lucide-react';
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { addService } from "../services/api";

const ServiceCreationForm = ({ onAddService }) => {
    const [serviceName, setServiceName] = useState('Nuevo Servicio');
    const [formData, setFormData] = useState({
        description: '',
        price: '',
        category: 'Consultoría',
    });
    const [serviceImage, setServiceImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleServiceImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setServiceImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddService({
            name: serviceName,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-white border-b p-6 flex items-center space-x-6">
                    <div
                        className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-opacity-70"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleServiceImageUpload}
                        />
                        {serviceImage ? (
                            <img
                                src={serviceImage}
                                alt="Service"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <Box className="w-12 h-12 text-gray-500" />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="flex-grow">
                        <input
                            type="text"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            className="w-full text-2xl font-bold text-gray-800 border-b-2 border-transparent focus:border-purple-500 outline-none"
                            placeholder="Nombre del Servicio"
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 grid md:grid-cols-2 gap-6">
                    <div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Servicio</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe el servicio detalladamente"
                                    rows="4"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Información de Precio</label>
                                <div className="flex items-center mb-2">
                                    <DollarSign className="mr-2 text-gray-500" size={20} />
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="Precio del Servicio"
                                        step="0.01"
                                        min="0"
                                        className="flex-grow px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría del Servicio</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="Consultoría">Consultoría</option>
                                    <option value="Desarrollo">Desarrollo</option>
                                    <option value="Diseño">Diseño</option>
                                    <option value="Soporte">Soporte</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center mt-6">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            Crear Servicio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Definición de PropTypes para validar props
ServiceCreationForm.propTypes = {
    onAddService: PropTypes.func.isRequired
};

const CreateService = () => {
    const navigate = useNavigate();

    const handleAddService = async (newService) => {
        try {
            const serviceData = {
                name: newService.name.trim(),
                description: newService.description.trim(),
                price: newService.price,
            };

            await addService(serviceData);
            alert("Servicio agregado exitosamente.");
            navigate("/services");
        } catch (error) {
            console.error("Error al agregar servicio:", error.response?.data || error.message);
        }
    };

    return (
        <>
            <ServiceCreationForm onAddService={handleAddService}/>
        </>
    );
};

export default CreateService;