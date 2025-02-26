import React, { useState } from 'react';

const PaymentManagement = () => {
    const [paymentState, setPaymentState] = useState('draft'); // draft, process, paid
    const [formData, setFormData] = useState({
        paymentId: 'PAY00003',
        paymentType: 'send',
        client: '',
        amount: '0.00',
        date: '2025-02-25',
        memo: '',
        journal: 'bank',
        paymentMethod: 'manual',
        bankAccount: 'main'
    });

    // Función para cambiar el estado del pago
    const handleStateChange = (state) => {
        setPaymentState(state);
    };

    // Función para manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-medium text-purple-700">Gestión de Pagos</h1>
                </header>

                {/* Barra de control */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center">
                    <button className="bg-purple-700 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-purple-800 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span>Nuevo</span>
                    </button>

                    <div className="relative ml-3">
                        <button className="border border-gray-200 bg-white text-purple-700 px-4 py-2 rounded flex items-center space-x-2 hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                            <span>Acciones</span>
                        </button>
                        {/* Dropdown contenido (omitido por simplicidad) */}
                    </div>

                    <div className="flex-1"></div>

                    {/* Barra de proceso con flechas */}
                    <div className="flex items-center">
                        <div
                            onClick={() => handleStateChange('draft')}
                            className={`flex items-center px-4 py-2 ${paymentState === 'draft' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} cursor-pointer`}
                        >
                            <span>Borrador</span>
                        </div>
                        <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-gray-200"></div>

                        <div
                            onClick={() => paymentState === 'draft' ? handleStateChange('process') : null}
                            className={`flex items-center px-4 py-2 ${paymentState === 'process' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'} ${paymentState === 'draft' ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                        >
                            <span>En proceso</span>
                        </div>
                        <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-gray-200"></div>

                        <div
                            onClick={() => paymentState === 'process' ? handleStateChange('paid') : null}
                            className={`flex items-center px-4 py-2 ${paymentState === 'paid' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'} ${paymentState === 'process' ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                        >
                            <span>Pagado</span>
                        </div>
                    </div>
                </div>

                {/* Contenido principal basado en el estado */}
                {paymentState === 'draft' && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                        <div className="bg-purple-600 text-white p-4">
                            <h2 className="text-lg font-medium">Información de Pago</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de pago</label>
                                        <select
                                            name="paymentType"
                                            value={formData.paymentType}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="send">Enviar</option>
                                            <option value="receive">Recibir</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                                        <input
                                            type="text"
                                            name="client"
                                            value={formData.client}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Seleccione un cliente..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Importe</label>
                                        <input
                                            type="text"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Memo</label>
                                        <textarea
                                            name="memo"
                                            value={formData.memo}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            rows="3"
                                            placeholder="Agregar una descripción..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Diario</label>
                                        <select
                                            name="journal"
                                            value={formData.journal}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="bank">Diario de banco</option>
                                            <option value="cash">Diario de efectivo</option>
                                            <option value="sales">Diario de ventas</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago</label>
                                        <select
                                            name="paymentMethod"
                                            value={formData.paymentMethod}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="manual">Manual Payment</option>
                                            <option value="transfer">Transferencia bancaria</option>
                                            <option value="credit">Tarjeta de crédito</option>
                                            <option value="cash">Efectivo</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta bancaria de la empresa</label>
                                        <select
                                            name="bankAccount"
                                            value={formData.bankAccount}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="main">Cuenta principal</option>
                                            <option value="secondary">Cuenta secundaria</option>
                                        </select>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            onClick={() => handleStateChange('process')}
                                            className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition-colors"
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {paymentState === 'process' && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                        <div className="bg-purple-600 text-white p-4">
                            <h2 className="text-lg font-medium">Información de Pago</h2>
                        </div>
                        <div className="p-6">
                            <div className="border border-gray-200 rounded-lg p-6 mb-4">
                                <h3 className="text-xl font-medium text-purple-700 mb-4">{formData.paymentId}</h3>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Tipo de pago</p>
                                        <p className="font-medium">{formData.paymentType === 'send' ? 'Enviar' : 'Recibir'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Cliente</p>
                                        <p className="font-medium">{formData.client || 'Sin especificar'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Importe</p>
                                        <p className="font-medium">S/ {formData.amount}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Fecha</p>
                                        <p className="font-medium">
                                            {new Date(formData.date).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Memo</p>
                                        <p className="font-medium">{formData.memo || 'Sin descripción'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Diario</p>
                                        <p className="font-medium">
                                            {formData.journal === 'bank' ? 'Banco' :
                                                formData.journal === 'cash' ? 'Efectivo' : 'Ventas'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Método de pago</p>
                                        <p className="font-medium">
                                            {formData.paymentMethod === 'manual' ? 'Manual Payment' :
                                                formData.paymentMethod === 'transfer' ? 'Transferencia bancaria' :
                                                    formData.paymentMethod === 'credit' ? 'Tarjeta de crédito' : 'Efectivo'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Cuenta bancaria de la empresa</p>
                                        <p className="font-medium">
                                            {formData.bankAccount === 'main' ? 'Cuenta principal' : 'Cuenta secundaria'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => handleStateChange('draft')}
                                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-50 transition-colors"
                                >
                                    Regresar
                                </button>
                                <button
                                    onClick={() => handleStateChange('paid')}
                                    className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition-colors"
                                >
                                    Validar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {paymentState === 'paid' && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                        <div className="bg-purple-600 text-white p-4">
                            <h2 className="text-lg font-medium">Información de Pago</h2>
                        </div>
                        <div className="p-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
                                <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-medium text-green-800 mb-2">¡Pago completado con éxito!</h3>
                                <p className="text-green-600">El pago ha sido procesado y registrado correctamente.</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-6 mb-6">
                                <h3 className="text-xl font-medium text-purple-700 mb-4">{formData.paymentId}</h3>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Tipo de pago</p>
                                        <p className="font-medium">{formData.paymentType === 'send' ? 'Enviar' : 'Recibir'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Cliente</p>
                                        <p className="font-medium">{formData.client || 'Sin especificar'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Importe</p>
                                        <p className="font-medium">S/ {formData.amount}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Fecha</p>
                                        <p className="font-medium">
                                            {new Date(formData.date).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => handleStateChange('process')}
                                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                                >
                                    Regresar
                                </button>
                                <button className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition-colors">
                                    Generar recibo
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chatter */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-purple-600 text-white p-4">
                        <h2 className="text-lg font-medium">Comunicaciones</h2>
                    </div>

                    <div className="flex border-b border-gray-200 p-3">
                        <button className="px-3 py-2 text-gray-600 flex items-center space-x-1 hover:bg-gray-100 rounded transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                            </svg>
                            <span>Enviar mensaje</span>
                        </button>

                        <button className="px-3 py-2 text-gray-600 flex items-center space-x-1 hover:bg-gray-100 rounded transition-colors ml-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            <span>Registrar una nota</span>
                        </button>

                        <button className="px-3 py-2 text-gray-600 flex items-center space-x-1 hover:bg-gray-100 rounded transition-colors ml-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span>Actividades</span>
                        </button>

                        <button className="px-3 py-2 text-gray-600 flex items-center space-x-1 hover:bg-gray-100 rounded transition-colors ml-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a3 3 0 00-3-3 3 3 0 00-3 3v4a5 5 0 0010 0V7a3 3 0 00-3-3h-4z" clipRule="evenodd" />
                            </svg>
                            <span>Adjuntar archivos</span>
                        </button>

                        <div className="flex-1"></div>

                        <button className="px-3 py-2 text-gray-600 flex items-center space-x-1 hover:bg-gray-100 rounded transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            <span>Seguidores (0)</span>
                        </button>
                    </div>

                    <div className="p-6 text-center text-gray-500 italic">
                        No hay mensajes ni actividades registradas.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentManagement;