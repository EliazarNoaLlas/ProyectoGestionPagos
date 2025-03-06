import React, { useState } from 'react';
import {
    Home,
    Bell,
    User,
    Settings,
    LogOut,
    ChevronDown,
    ArrowRightLeft,
    Menu
} from 'lucide-react';

const Navbar = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentCompany, setCurrentCompany] = useState('Main Company');
    const [activeMenuItem, setActiveMenuItem] = useState('Tablero');

    const companies = ['Main Company', 'Subsidiary A', 'Subsidiary B'];

    const menuItems = [
        { title: 'Clientes', path: '/clients' },
        { title: 'Contabilidad', path: '/client-services' },
        { title: 'Pagos', path: '/payments' },
        { title: 'Productos', path: '/products' },
        { title: 'Servicios', path: '/services' },
        { title: 'Reportes', path: '/reports' },
        { title: 'Configuración', path: '/settings' },
        { title: 'Ayuda', path: '/help' }
    ];

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 py-2 px-4 flex items-center justify-between">
            {/* Left Section: Home and Breadcrumbs */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => window.location.href = '/'}
                    aria-label="Go to Home"
                    title="Inicio"
                    className="p-2 hover:bg-purple-50 rounded-full transition-colors cursor-pointer"
                >
                    <Home className="text-purple-600 w-6 h-6" />
                </button>

                <nav aria-label="Breadcrumb" className="text-sm text-gray-500 space-x-2 hidden md:block">
                    <span className="font-semibold text-purple-700">Inicio</span>
                </nav>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                    <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <span className="text-gray-700 font-semibold">TABLERO</span>
            </div>

            {/* Center Section: Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
                {menuItems.map((item) => (
                    <button
                        key={item.title}
                        onClick={() => {
                            setActiveMenuItem(item.title);
                            window.location.href = item.path;
                        }}
                        className={`
                            text-sm font-medium transition-colors 
                            ${activeMenuItem === item.title
                            ? 'text-purple-600 border-b-2 border-purple-600'
                            : 'text-gray-600 hover:text-purple-700'}
                        `}
                    >
                        {item.title}
                    </button>
                ))}
            </div>

            {/* Right Section: System Tray */}
            <div className="hidden md:flex items-center space-x-4">
                {/* Company Switcher */}
                <div className="relative">
                    <button
                        className="flex items-center text-sm text-gray-700 hover:bg-gray-100 px-3 py-1 rounded-md transition-colors"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        {currentCompany}
                        <ChevronDown className="w-4 h-4 ml-2" />
                    </button>
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-20">
                            {companies.map((company) => (
                                <div
                                    key={company}
                                    onClick={() => {
                                        setCurrentCompany(company);
                                        setIsUserMenuOpen(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {company}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        aria-label="Notifications"
                        className="p-2 hover:bg-blue-50 rounded-full relative"
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    >
                        <Bell className="text-blue-600 w-5 h-5" />
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                            3
                        </span>
                    </button>
                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg z-20 p-4">
                            <p className="text-sm font-semibold mb-2">Notifications</p>
                            <div className="text-gray-500 text-xs">No new notifications</div>
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div className="relative">
                    <button
                        className="flex items-center hover:bg-gray-100 rounded-full p-1"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                        <User className="w-6 h-6 text-purple-700" />
                        <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-20">
                            <div className="px-4 py-2 border-b text-sm">
                                <p className="font-semibold">John Doe</p>
                                <p className="text-gray-500">john.doe@company.com</p>
                            </div>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                                <Settings className="w-4 h-4 mr-2" /> Settings
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600">
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-14 right-4 bg-white border rounded-md shadow-lg w-60 z-50 p-4 flex flex-col space-y-2 md:hidden">
                    {menuItems.map((item) => (
                        <button
                            key={item.title}
                            onClick={() => {
                                setActiveMenuItem(item.title);
                                setIsMobileMenuOpen(false);
                                window.location.href = item.path;
                            }}
                            className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-left"
                        >
                            {item.title}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
