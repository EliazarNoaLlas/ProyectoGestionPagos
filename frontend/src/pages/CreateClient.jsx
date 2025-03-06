/*
 * File: CreateClient.jsx
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 * Purpose: Interfaz para la creacion de un nuevo cliente
 * Last Modified: 2024-03-04
 */

import {useNavigate} from "react-router-dom";
import ClientCreationForm from "../components/ClientForm";
import {
    PlusCircle,
    Save,
    X,
    Mail,
    DollarSign,
    FileText,
    Users
} from 'lucide-react';
import {addClient} from "../services/api";
import {useState} from "react";
import Navbar from "../components/Navbar.jsx";

const CreateClient = () => {
    const navigate = useNavigate();
    // Estados para el formulario
    const [activeTab, setActiveTab] = useState('contactos');


    // Pestañas adicionales
    const tabs = [
        { id: 'contactos', label: 'Contactos y direcciones', icon: Users },
        { id: 'ventas', label: 'Ventas y compra', icon: DollarSign },
        { id: 'contabilidad', label: 'Contabilidad', icon: FileText },
        { id: 'notas', label: 'Notas internas', icon: Mail }
    ];

    const handleAddClient = async (newClient) => {
        try {
            const clientData = {
                type: newClient.clientType,  // Ahora se debe enviar 'type'
                name: newClient.clientName.trim(),
                phone: newClient.phone.trim(),
                email: newClient.email.trim(),
                identification_number: newClient.identification_number,
                identification_type: newClient.identification_type,
                address: newClient.address,
                city: newClient.city.trim(),
                country: newClient.country.trim(),
                postal_code: newClient.postal_code.trim(),
            };

            await addClient(clientData);
            alert("Cliente agregado exitosamente.");
            navigate("/clients");
        } catch (error) {
            console.error("Error al agregar cliente:", error.response?.data || error.message);
        }
    };

    return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Navbar */}
                <Navbar/>

                {/* Panel de Control Superior */}
                <div className="bg-white shadow-md p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/clients')}
                            className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
                        >
                            Clientes
                        </button>
                        <button className="btn-nuevo flex items-center">
                            <PlusCircle className="mr-2" /> Nuevo
                        </button>
                        <div className="flex space-x-2">
                            <button className="btn-icon" title="Guardar">
                                <Save />
                            </button>
                            <button className="btn-icon" title="Descartar">
                                <X />
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-4 text-gray-600">
                        <div className="stat-item">
                            <DollarSign size={20} />
                            <span>Ventas $0</span>
                        </div>
                        <div className="stat-item">
                            <FileText size={20} />
                            <span>Facturado $0,00</span>
                        </div>
                        <div className="stat-item">
                            <Users size={20} />
                            <span>Estado del cliente 0,00</span>
                        </div>
                        <div className="stat-item">
                            <FileText size={20} />
                            <span>Documentos 0</span>
                        </div>
                    </div>
                </div>
                <ClientCreationForm onAddClient={handleAddClient}/>
                {/* Pestañas de Información Adicional */}
                <div className="border-t">
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
                        <p className="text-gray-500">Contenido de la pestaña {activeTab}</p>
                    </div>
                </div>
            </div>


    );
};

export default CreateClient;
