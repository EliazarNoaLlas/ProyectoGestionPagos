import { useState } from "react";
import PropTypes from "prop-types";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const ClientForm = ({ onAddClient }) => {
  const [newClient, setNewClient] = useState({
    name: "",
    service: "",
    amount: "",
    dueDate: ""
  });

  const handleSubmit = () => {
    const amountNumber = parseFloat(newClient.amount);

    if (newClient.name && newClient.service && amountNumber > 0 && newClient.dueDate) {
      const clientData = {
        ...newClient,
        amount: amountNumber
      };
      onAddClient(clientData);
      setNewClient({ name: "", service: "", amount: "", dueDate: "" });
    }
    else {
      alert("Todos los campos son obligatorios y el monto debe ser mayor a 0.");
    }
  };

  return (
    <div className="grid gap-4 max-w-xl">
      <Input
        placeholder="Nombre del cliente"
        value={newClient.name}
        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
      />
      <Input
        placeholder="Servicio"
        value={newClient.service}
        onChange={(e) => setNewClient({ ...newClient, service: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Monto"
        value={newClient.amount}
        onChange={(e) => setNewClient({ ...newClient, amount: e.target.value })}
      />
      <Input
        type="date"
        value={newClient.dueDate}
        onChange={(e) => setNewClient({ ...newClient, dueDate: e.target.value })}
      />
      <Button onClick={handleSubmit}>Registrar Cliente</Button>
    </div>
  );
};

// Definición de PropTypes para validar props
ClientForm.propTypes = {
  onAddClient: PropTypes.func.isRequired
};

export default ClientForm;
