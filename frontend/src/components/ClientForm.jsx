import { useState, useRef } from 'react';
import {
    User,
    Upload,
    Phone,
    Mail,
} from 'lucide-react';
import PropTypes from "prop-types";

const ClientCreationForm = ({ onAddClient }) => {
    const [clientType, setClientType] = useState('empresa');
    const [clientName, setClientName] = useState('Nuevo Cliente');
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        taxId: '',
        identificationType: 'RUC',  // Puede ser un valor predeterminado, dependiendo del contexto
        address: '',
        city: '',
        country: '',
        postalCode: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddClient({
            clientType,
            clientName,
            phone: formData.phone,
            email: formData.email,
            identification_number: formData.taxId,
            identification_type: formData.identificationType,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postal_code: formData.postalCode,
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
                            onChange={handleProfileImageUpload}
                        />
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <User className="w-12 h-12 text-gray-500" />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="flex-grow">
                        <div className="flex space-x-4 mb-4">
                            {['persona', 'empresa'].map(type => (
                                <label
                                    key={type}
                                    className={`flex items-center space-x-2 cursor-pointer ${
                                        clientType === type
                                            ? 'text-purple-600 font-semibold'
                                            : 'text-gray-600'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        value={type}
                                        checked={clientType === type}
                                        onChange={() => setClientType(type)}
                                        className="text-purple-600 focus:ring-purple-500"
                                    />
                                    <span>{type === 'persona' ? 'Persona' : 'Empresa'}</span>
                                </label>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full text-2xl font-medium text-gray-700 border-b-2 border-transparent focus:border-purple-500 outline-none"
                            placeholder="Ingrese el Nombre del Cliente"
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 grid md:grid-cols-2 gap-6">
                    <div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Dirección"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Ciudad"
                                    className="px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                                />
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="País"
                                    className="px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                                />
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="Código Postal"
                                    className="px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Información de Contacto</label>
                                <div className="flex items-center mb-2">
                                    <Phone className="mr-2 text-gray-500" size={20} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Teléfono"
                                        className="flex-grow px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div className="flex items-center mb-2">
                                    <Mail className="mr-2 text-gray-500" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Correo electrónico"
                                        className="flex-grow px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">ID Fiscal</label>
                                <input
                                    type="text"
                                    name="taxId"
                                    value={formData.taxId}
                                    onChange={handleInputChange}
                                    placeholder="Número de identificación"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Identificación</label>
                                <select
                                    name="identificationType"
                                    value={formData.identificationType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="RUC">RUC</option>
                                    <option value="DNI">DNI</option>
                                    {/* Agregar más tipos de identificación si es necesario */}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center mt-6">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            Crear Cliente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Definición de PropTypes para validar props
ClientCreationForm.propTypes = {
    onAddClient: PropTypes.func.isRequired
};

export default ClientCreationForm;


