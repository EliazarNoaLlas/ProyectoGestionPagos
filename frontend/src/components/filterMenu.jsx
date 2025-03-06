import { useState } from "react";
import { Filter, Users, Star, Group } from "lucide-react"; // Iconos

const FilterMenu = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [groupBy, setGroupBy] = useState("");
    const [favorites, setFavorites] = useState([]);

    const toggleFilter = (filter) => {
        setSelectedFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    const handleSaveFavorite = () => {
        if (selectedFilters.length || groupBy) {
            const newFavorite = { filters: selectedFilters, group: groupBy };
            setFavorites([...favorites, newFavorite]);
        }
    };

    return (
        <div className="relative">
            {/* Botón Filtros */}
            <button
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md flex items-center hover:bg-gray-50 transition-colors"
                onClick={() => setShowFilters(!showFilters)}
            >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
            </button>

            {/* Menú Desplegable */}
            {showFilters && (
                <div className="absolute mt-2 w-64 bg-white border border-gray-300 shadow-lg rounded-md z-50 animate-fadeIn">
                    {/* Sección Filtros */}
                    <div className="border-b px-4 py-3">
                        <div className="flex items-center text-purple-700 font-semibold">
                            <Filter className="w-4 h-4 mr-2" />
                            Filtros
                        </div>
                        <div className="mt-2 space-y-2">
                            {["Personas", "Empresas", "País"].map((filter) => (
                                <label key={filter} className="flex items-center space-x-2 text-gray-700">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox text-purple-500"
                                        checked={selectedFilters.includes(filter)}
                                        onChange={() => toggleFilter(filter)}
                                    />
                                    <span>{filter}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sección Agrupar por */}
                    <div className="border-b px-4 py-3">
                        <div className="flex items-center text-purple-700 font-semibold">
                            <Group className="w-4 h-4 mr-2" />
                            Agrupar por
                        </div>
                        <div className="mt-2 space-y-2">
                            {["Vendedor", "Empresa", "País"].map((group) => (
                                <label key={group} className="flex items-center space-x-2 text-gray-700">
                                    <input
                                        type="radio"
                                        name="groupBy"
                                        className="form-radio text-purple-500"
                                        checked={groupBy === group}
                                        onChange={() => setGroupBy(group)}
                                    />
                                    <span>{group}</span>
                                </label>
                            ))}
                        </div>
                        {/* Agregar Grupo Personalizado */}
                        <select
                            className="w-full mt-2 p-1 border rounded text-gray-700"
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value)}
                        >
                            <option value="">Agregar grupo personalizado</option>
                            <option value="Fecha">Fecha</option>
                            <option value="Categoría">Categoría</option>
                        </select>
                    </div>

                    {/* Sección Favoritos */}
                    <div className="px-4 py-3">
                        <div className="flex items-center text-purple-700 font-semibold">
                            <Star className="w-4 h-4 mr-2" />
                            Favoritos
                        </div>
                        <button
                            className="mt-2 px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                            onClick={handleSaveFavorite}
                        >
                            Guardar búsqueda actual
                        </button>
                        {favorites.length > 0 && (
                            <ul className="mt-2 text-gray-700">
                                {favorites.map((fav, index) => (
                                    <li key={index} className="text-sm">
                                        {fav.filters.join(", ") || "Sin filtros"} - {fav.group || "Sin agrupación"}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterMenu;
