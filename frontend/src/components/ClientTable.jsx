import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/Button";

const ClientTable = ({ clients, onRegisterPayment }) => {
    const [clientData, setClientData] = useState([]);

    // Actualizar el estado local cuando `clients` cambie (importante para recibir datos dinámicos)
    useEffect(() => {
        setClientData(clients);
    }, [clients]);

    const handleRegisterPayment = (clientId) => {
        setClientData((prevClients) =>
            prevClients.map((client) =>
                client._id === clientId ? { ...client, status: "Pagado" } : client
            )
        );

        // Llamar a la función proporcionada por el prop para actualizar el backend
        onRegisterPayment(clientId);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha de Pago</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {clientData.length > 0 ? (
                    clientData.map((client) => (
                        <TableRow key={client._id}>
                            <TableCell>{client.name}</TableCell>
                            <TableCell>{client.service}</TableCell>
                            <TableCell>${client.amount}</TableCell>
                            <TableCell>{client.dueDate}</TableCell>
                            <TableCell>
                <span
                    className={`px-2 py-1 rounded-full text-sm ${
                        client.status === "Pagado"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {client.status}
                </span>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRegisterPayment(client._id)}
                                    disabled={client.status === "Pagado"}
                                >
                                    Registrar Pago
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center">
                            No hay clientes disponibles
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

// Definición de PropTypes para validación
ClientTable.propTypes = {
    clients: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            service: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            dueDate: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        })
    ).isRequired,
    onRegisterPayment: PropTypes.func.isRequired,
};

export default ClientTable;
