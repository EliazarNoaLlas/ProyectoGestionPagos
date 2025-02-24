import {NavLink} from "react-router-dom";
import {
    Users,
    Calculator,
    CreditCard,
    ShoppingBag,
    BarChart2,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react";

const MenuItem = ({icon: Icon, title, path, notifications = 0}) => (
    <NavLink
        to={path}
        className={({isActive}) =>
            `flex items-center p-4 rounded-xl transition-all cursor-pointer group ${
                isActive ? "bg-blue-100 text-blue-600" : "hover:bg-blue-50"
            }`
        }
    >
        <div
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 group-hover:from-blue-200 group-hover:to-blue-100">
            <Icon className="w-6 h-6 text-blue-600"/>
        </div>
        <span className="ml-4 font-medium">{title}</span>
        {notifications > 0 && (
            <div
                className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
            </div>
        )}
    </NavLink>
);

const ModernMenu = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6 flex">
            {/* Menú Lateral */}
            <div className="w-72 bg-white rounded-2xl shadow-lg p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">SGPS</h1>
                    <p className="text-sm text-gray-500">Gestión de Pagos</p>
                </div>

                {/* Menú Items */}
                <div className="space-y-2">
                    <MenuItem icon={Users} title="Clientes" path="/clients"/>
                    <MenuItem icon={Calculator} title="Contabilidad" path="/contabilidad"/>
                    <MenuItem icon={CreditCard} title="Pagos" path="/pagos"/>
                    <MenuItem icon={ShoppingBag} title="Productos" path="/products"/>
                    <MenuItem icon={BarChart2} title="Reportes" path="/reports"/>
                    <MenuItem icon={Settings} title="Configuración" path="/configurations"/>
                    <MenuItem icon={HelpCircle} title="Ayuda" path="/ayuda"/>
                </div>

                {/* Cerrar Sesión */}
                <div className="mt-8">
                    <NavLink to="/logout"
                             className="flex items-center p-4 rounded-xl hover:bg-red-50 cursor-pointer group">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-red-100 to-red-50 group-hover:from-red-200 group-hover:to-red-100">
                            <LogOut className="w-6 h-6 text-red-600"/>
                        </div>
                        <span className="ml-4 text-red-600 font-medium">Cerrar Sesión</span>
                    </NavLink>
                </div>
            </div>

            {/* Área Decorativa */}
            {/* Área Decorativa */}
            <div className="flex-1 ml-6 bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32"/>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-50 rounded-full -ml-24 -mb-24"/>

                {/* Contenido Principal */}
                <div className="relative z-10">
                    <div className="max-w-md">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            ¡Bienvenido al Sistema de Gestión!
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Gestiona tus pagos y servicios de manera eficiente y segura.
                        </p>
                        <div
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center cursor-pointer hover:bg-blue-700 transition-colors">
                            <CreditCard className="w-5 h-5 mr-2"/>
                            Iniciar Nueva Transacción
                        </div>
                    </div>

                    {/* Ilustración de Caja Registradora */}
                    <div
                        className="absolute top-100 right-8 w-64 h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center">
                        <div className="transform -rotate-12">
                            <div className="w-48 h-32 bg-gray-800 rounded-lg shadow-xl relative">
                                <div className="absolute top-2 left-4 right-4 h-8 bg-gray-600 rounded"/>
                                <div
                                    className="absolute bottom-4 left-4 right-4 h-12 bg-gray-700 rounded flex items-center justify-center">
                                    <div className="text-green-400 text-xl font-mono">$0.00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModernMenu;
