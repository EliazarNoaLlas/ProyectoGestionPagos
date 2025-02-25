import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importación agregada
import { Search, Filter, Plus, Grid, List, Clock, User, DollarSign, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getClients } from '../services/api';
import { useNavigate } from "react-router-dom";

const ClientsInterface = () => {
  const [viewMode, setViewMode] = useState('kanban');
  const [showFilters, setShowFilters] = useState(false);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  // Cargar clientes al iniciar
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        if (!Array.isArray(data)) throw new Error("La respuesta no es una lista de clientes");
        setClients(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error.message);
      }
    };
    fetchClients();
  }, []);

  // Componente de tarjeta de cliente
  const ClientCard = ({ client }) => (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 mb-4">
        <div className="flex items-start mb-3">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <User className="w-8 h-8 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800">{client.name}</h3>
            <div className="text-sm text-gray-600">{client.service}</div>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            Monto: ${client.amount}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Fecha de Vencimiento: {new Date(client.dueDate).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            Estado: {client.status}
          </div>
        </div>

        <div className="flex justify-between pt-3 border-t border-gray-100 text-sm">
          <div className="text-gray-600">Creado: {new Date(client.createdAt).toLocaleDateString()}</div>
          <div className="text-gray-600">Actualizado: {new Date(client.updatedAt).toLocaleDateString()}</div>
        </div>
      </div>
  );

  // PropTypes para ClientCard
  ClientCard.propTypes = {
    client: PropTypes.shape({
      name: PropTypes.string.isRequired,
      service: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      dueDate: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    }).isRequired,
  };

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Clientes</h1>
            <button onClick={() => navigate("/create-client")}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center hover:bg-purple-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo
            </button>
          </div>
        </div>

        {/* Search Bar y Filtros */}
        <div className="px-6 py-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                  type="text"
                  placeholder="Buscar clientes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <button
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md flex items-center hover:bg-gray-50 transition-colors"
                onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                  className={`px-3 py-2 flex items-center ${viewMode === 'kanban' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700'}`}
                  onClick={() => setViewMode('kanban')}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                  className={`px-3 py-2 flex items-center ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700'}`}
                  onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="px-6 py-4">
          {viewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map(client => (
                    <ClientCard key={client._id} client={client} />
                ))}
              </div>
          )}

          {viewMode === 'list' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {clients.map(client => (
                      <tr key={client._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">{client.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{client.service}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">${client.amount}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(client.dueDate).toLocaleDateString()}</td>
                        <td className={`px-6 py-4 text-sm ${client.status === 'Pagado' ? 'text-green-600' : 'text-red-600'}`}>{client.status}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>
      </div>
  );
};

export default ClientsInterface;
