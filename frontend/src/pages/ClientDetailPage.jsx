/*
 * File: ClientDetailPage.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 * Purpose: Componente que muestra los detalles de un cliente, permite editarlos, eliminarlos y gestionar su información.
 * Last Modified: 2025-03-05
 */

import {useState, useEffect, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    User,
    Upload,
    Phone,
    Mail,
    Save,
    X,
    DollarSign,
    FileText,
    Users,
    Edit,
    Trash2,
    ArrowLeft,
    Archive
} from 'lucide-react';
import {getClientById, updateClient, deleteClient} from "../services/api";
import Navbar from "../components/Navbar.jsx";

const ClientDetailPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('contactos');
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    // Estado para los datos del cliente
    const [client, setClient] = useState({
        type: 'empresa',
        name: '',
        phone: '',
        email: '',
        identification_number: '',
        identification_type: 'RUC',
        address: '',
        city: '',
        country: '',
        postal_code: '',
        is_active: true
    });

    // Pestañas adicionales (igual que en CreateClient.jsx)
    const tabs = [
        {id: 'contactos', label: 'Contactos y direcciones', icon: Users},
        {id: 'ventas', label: 'Ventas y compra', icon: DollarSign},
        {id: 'contabilidad', label: 'Contabilidad', icon: FileText},
        {id: 'notas', label: 'Notas internas', icon: Mail}
    ];

    // Cargar datos del cliente
    useEffect(() => {
        const fetchClientData = async () => {
            if (!id) {
                setError("ID del cliente no proporcionado");
                setLoading(false);
                return;
            }

            try {
                const data = await getClientById(id);
                if (!data) {
                    throw new Error("Cliente no encontrado");
                }

                setClient({
                    type: data.type || 'empresa',
                    name: data.name || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    identification_number: data.identification_number || '',
                    identification_type: data.identification_type || 'RUC',
                    address: data.address || '',
                    city: data.city || '',
                    country: data.country || '',
                    postal_code: data.postal_code || '',
                    is_active: data.is_active !== undefined ? data.is_active : true
                });

                setLoading(false);
            } catch (err) {
                console.error("Error al cargar el cliente:", err);
                setError("No se pudo cargar la información del cliente");
                setLoading(false);
            }
        };

        fetchClientData();
    }, [id]);

    // Manejar cambios en los campos del formulario
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setClient(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejar cambio de tipo de cliente
    const handleTypeChange = (type) => {
        setClient(prev => ({
            ...prev,
            type
        }));
    };

    // Manejar subida de imagen de perfil
    const handleProfileImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Guardar cambios del cliente
    const handleSaveChanges = async () => {
        if (!client.name.trim()) {
            alert("El nombre del cliente es obligatorio");
            return;
        }

        try {
            setLoading(true);

            const clientData = {
                type: client.type,
                name: client.name.trim(),
                phone: client.phone.trim(),
                email: client.email.trim(),
                identification_number: client.identification_number,
                identification_type: client.identification_type,
                address: client.address,
                city: client.city.trim(),
                country: client.country.trim(),
                postal_code: client.postal_code.trim(),
                is_active: client.is_active
            };

            await updateClient(id, clientData);
            setIsEditing(false);
            alert("Cliente actualizado exitosamente");
        } catch (error) {
            console.error("Error al actualizar cliente:", error.response?.data || error.message);
            alert(`Error al actualizar cliente: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar cliente
    const handleDeleteClient = async () => {
        if (!window.confirm("¿Está seguro que desea eliminar este cliente? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            setLoading(true);
            await deleteClient(id);
            alert("Cliente eliminado exitosamente");
            navigate("/clients");
        } catch (error) {
            console.error("Error al eliminar cliente:", error.response?.data || error.message);
            alert(`Error al eliminar cliente: ${error.response?.data?.message || error.message}`);
            setLoading(false);
        }
    };

    // Archivar cliente (cambiar is_active a false)
    const handleArchiveClient = async () => {
        if (!window.confirm("¿Está seguro que desea archivar este cliente?")) {
            return;
        }

        try {
            setLoading(true);
            const clientData = {
                ...client,
                is_active: false
            };

            await updateClient(id, clientData);
            setClient(clientData);
            alert("Cliente archivado exitosamente");
            setLoading(false);
        } catch (error) {
            console.error("Error al archivar cliente:", error.response?.data || error.message);
            alert(`Error al archivar cliente: ${error.response?.data?.message || error.message}`);
            setLoading(false);
        }
    };

    // Restaurar cliente (cambiar is_active a true)
    const handleRestoreClient = async () => {
        try {
            setLoading(true);
            const clientData = {
                ...client,
                is_active: true
            };

            await updateClient(id, clientData);
            setClient(clientData);
            alert("Cliente restaurado exitosamente");
            setLoading(false);
        } catch (error) {
            console.error("Error al restaurar cliente:", error.response?.data || error.message);
            alert(`Error al restaurar cliente: ${error.response?.data?.message || error.message}`);
            setLoading(false);
        }
    };

    // Descartar cambios
    const handleDiscardChanges = () => {
        if (window.confirm("¿Está seguro que desea descartar los cambios?")) {
            setIsEditing(false);
            // Recargar datos del cliente
            getClientById(id).then(data => {
                setClient({
                    type: data.type || 'empresa',
                    name: data.name || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    identification_number: data.identification_number || '',
                    identification_type: data.identification_type || 'RUC',
                    address: data.address || '',
                    city: data.city || '',
                    country: data.country || '',
                    postal_code: data.postal_code || '',
                    is_active: data.is_active !== undefined ? data.is_active : true
                });
            }).catch(err => {
                console.error("Error al recargar datos:", err);
            });
        }
    };

    if (loading && !client.name) {
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
                        onClick={() => navigate('/clients')}
                        className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
                    >
                        <ArrowLeft className="mr-2" size={18}/> Clientes
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
                            {client.is_active ? (
                                <button
                                    onClick={handleArchiveClient}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center"
                                    disabled={loading}
                                >
                                    <Archive size={18} className="mr-1"/> Archivar
                                </button>
                            ) : (
                                <button
                                    onClick={handleRestoreClient}
                                    className="bg-green-500 text-white px-3 py-1 rounded flex items-center"
                                    disabled={loading}
                                >
                                    <Archive size={18} className="mr-1"/> Restaurar
                                </button>
                            )}
                            <button
                                onClick={handleDeleteClient}
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
                        <span>Ventas $0</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FileText size={20}/>
                        <span>Facturado $0,00</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users size={20}/>
                        <span>Estado del cliente 0,00</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FileText size={20}/>
                        <span>Documentos 0</span>
                    </div>
                </div>
            </div>

            {/* Cliente inactivo banner */}
            {!client.is_active && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 text-yellow-700">
                    <div className="flex items-center">
                        <p>Este cliente está archivado. Las operaciones con este cliente están restringidas.</p>
                    </div>
                </div>
            )}

            {/* Contenido principal */}
            <div className="max-w-4xl mx-auto w-full flex-grow p-6">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {/* Información básica del cliente */}
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
                                onChange={handleProfileImageUpload}
                                disabled={!isEditing}
                            />
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <User className="w-12 h-12 text-gray-500"/>
                            )}
                            {isEditing && (
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Upload className="w-8 h-8 text-white"/>
                                </div>
                            )}
                        </div>

                        <div className="flex-grow">
                            <div className="flex space-x-4 mb-4">
                                {['persona', 'empresa'].map(type => (
                                    <label
                                        key={type}
                                        className={`flex items-center space-x-2 ${!isEditing && "pointer-events-none"} ${
                                            client.type === type
                                                ? 'text-purple-600 font-semibold'
                                                : 'text-gray-600'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            value={type}
                                            checked={client.type === type}
                                            onChange={() => handleTypeChange(type)}
                                            disabled={!isEditing}
                                            className="text-purple-600 focus:ring-purple-500"
                                        />
                                        <span>{type === 'persona' ? 'Persona' : 'Empresa'}</span>
                                    </label>
                                ))}
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={client.name}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className={`w-full text-2xl font-medium text-gray-700 ${isEditing ? 'border-b-2 border-transparent focus:border-purple-500 outline-none' : 'bg-transparent border-none outline-none'}`}
                                placeholder="Nombre del Cliente"
                            />
                        </div>
                    </div>

                    {/* Formulario con datos del cliente */}
                    <div className="p-6 grid md:grid-cols-2 gap-6">
                        <div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={client.address}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        placeholder="Dirección"
                                        className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        type="text"
                                        name="city"
                                        value={client.city}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        placeholder="Ciudad"
                                        className={`px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                    />
                                    <input
                                        type="text"
                                        name="country"
                                        value={client.country}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        placeholder="País"
                                        className={`px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                    />
                                    <input
                                        type="text"
                                        name="postal_code"
                                        value={client.postal_code}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        placeholder="Código Postal"
                                        className={`px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Información de
                                        Contacto</label>
                                    <div className="flex items-center mb-2">
                                        <Phone className="mr-2 text-gray-500" size={20}/>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={client.phone}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            placeholder="Teléfono"
                                            className={`flex-grow px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                        />
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <Mail className="mr-2 text-gray-500" size={20}/>
                                        <input
                                            type="email"
                                            name="email"
                                            value={client.email}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            placeholder="Correo electrónico"
                                            className={`flex-grow px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ID Fiscal</label>
                                    <input
                                        type="text"
                                        name="identification_number"
                                        value={client.identification_number}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        placeholder="Número de identificación"
                                        className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de
                                        Identificación</label>
                                    <select
                                        name="identification_type"
                                        value={client.identification_type}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'focus:ring-purple-500 focus:border-purple-500' : 'bg-gray-50'}`}
                                    >
                                        <option value="RUC">RUC</option>
                                        <option value="DNI">DNI</option>
                                        <option value="CIF">CIF</option>
                                        <option value="NIF">NIF</option>
                                    </select>
                                </div>
                            </div>
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
                        {activeTab === 'contactos' && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Contactos y direcciones</h3>
                                <p className="text-gray-500">No hay contactos adicionales registrados para este
                                    cliente.</p>
                            </div>
                        )}

                        {activeTab === 'ventas' && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Historial de ventas y compras</h3>
                                <p className="text-gray-500">No hay transacciones registradas para este cliente.</p>
                            </div>
                        )}

                        {activeTab === 'contabilidad' && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Información contable</h3>
                                <p className="text-gray-500">No hay datos contables disponibles para este cliente.</p>
                            </div>
                        )}

                        {activeTab === 'notas' && (
                            <div>
                                <h3 className="text-lg font-medium mb-4">Notas internas</h3>
                                <textarea
                                    className="w-full p-3 border rounded-md"
                                    placeholder="Añadir notas internas sobre este cliente..."
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

export default ClientDetailPage;