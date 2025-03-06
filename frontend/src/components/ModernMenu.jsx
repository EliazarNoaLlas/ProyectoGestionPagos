/*
 * File: ModernMenu.jsx
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 * Purpose: Menu de Inicio Mejorado
 * Last Modified: 2024-03-04
 */

import {useState} from 'react';
import {NavLink} from "react-router-dom";
import {
    Users,
    Calculator,
    CreditCard,
    ShoppingBag,
    Layers,
    BarChart2,
    Settings,
    HelpCircle,
    LogOut
} from "lucide-react";

const MenuItem = ({icon: Icon, title, path, color}) => (
    <NavLink
        to={path}
        className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-gray-100 transition-all group"
    >
        <div
            className={`
                w-16 h-16 rounded-2xl mb-2 flex items-center justify-center 
                bg-gradient-to-br ${color} 
                group-hover:scale-105 transition-transform
            `}
        >
            <Icon className="w-8 h-8 text-white"/>
        </div>
        <span className="text-sm text-gray-700 font-medium text-center">
            {title}
        </span>
    </NavLink>
);

const ModernAppDashboard = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div
            className={`min-h-screen p-6 relative ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} transition-colors duration-300`}>
            <div className="container mx-auto text-center">
                {/* Header */}
                <div className="mb-8">
                    <h2 className={`text-4xl font-extrabold tracking-wide uppercase ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Gestiona tus Pagos
                    </h2>
                    <p className={`text-md mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Administra tus pagos de manera automática
                    </p>
                </div>
                <button
                    onClick={toggleDarkMode}
                    className={`
                            p-2 rounded-full 
                            ${isDarkMode
                        ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                        `}
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </div>

            {/* Cuadrícula de Aplicaciones */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-8">
                <MenuItem icon={Users} title="Clientes" path="/clients" color="from-blue-400 to-blue-500"/>
                <MenuItem icon={Calculator} title="Contabilidad" path="/client-services"
                          color="from-indigo-400 to-indigo-500"/>
                <MenuItem icon={CreditCard} title="Pagos" path="/payments" color="from-green-400 to-green-500"/>
                <MenuItem icon={ShoppingBag} title="Productos" path="/products" color="from-orange-400 to-orange-500"/>
                <MenuItem icon={Layers} title="Servicios" path="/services" color="from-purple-400 to-purple-500"/>
                <MenuItem icon={BarChart2} title="Reportes" path="/reports" color="from-amber-400 to-amber-500"/>
                <MenuItem icon={Settings} title="Configuración" path="/settings"
                          color="from-gray-400 to-gray-500"/>
                <MenuItem icon={HelpCircle} title="Ayuda" path="/settings" color="from-red-400 to-red-500"/>
            </div>

            {/* Cerrar Sesión */}
            <div className="mt-10 flex justify-center">
                <NavLink to="/logout" className="flex items-center p-4 rounded-xl hover:bg-red-50 cursor-pointer group">
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-red-100 to-red-50 group-hover:from-red-200 group-hover:to-red-100">
                        <LogOut className="w-6 h-6 text-red-600"/>
                    </div>
                    <span className="ml-4 text-red-600 font-medium hidden md:inline">Cerrar Sesión</span>
                </NavLink>
            </div>

        </div>
    );
};

export default ModernAppDashboard;
