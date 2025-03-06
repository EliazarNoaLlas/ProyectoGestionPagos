import pandas as pd

def generate_odoo_clients(filename="odoo_clients.xlsx"):
    data = [
        ["Inversiones Andinas", 1, "", "PE", "15", "15001", "Lima", "Av. Javier Prado 1234", "", "+51123456789", "", "contacto@andinas.com", "20552103816", "BCPLPEPL", "1023456789"],
        ["Soluciones Digitales", 1, "", "PE", "04", "04001", "Arequipa", "Calle Mercaderes 456", "", "+5154256789", "", "info@soluciones.pe", "20538856674", "BIFSPEPL", "2034567891"],
        ["Juan Pérez", 0, "Soluciones Digitales", "PE", "04", "04001", "Arequipa", "Calle Mercaderes 456", "", "", "987654321", "juan.perez@soluciones.pe", "", "BIFSPEPL", "2034567892"],
        ["Comercial Andina", 1, "", "PE", "08", "08001", "Cusco", "Av. Sol 789", "", "+5184267890", "", "ventas@andina.com", "20553856451", "BSUDPEPL", "3045678912"],
        ["María López", 0, "Comercial Andina", "PE", "08", "08001", "Cusco", "Av. Sol 789", "", "", "987123456", "maria.lopez@andina.com", "", "BSUDPEPL", "3045678913"],
        ["Innovatech Perú", 1, "", "PE", "13", "13001", "La Libertad", "Av. España 321", "", "+5144267890", "", "contacto@innovatech.pe", "20480316259", "BINPPEPL", "4056789123"],
        ["Carlos Ramírez", 0, "Innovatech Perú", "PE", "13", "13001", "La Libertad", "Av. España 321", "", "", "987112233", "carlos.ramirez@innovatech.pe", "", "BINPPEPL", "4056789124"],
        ["Servicios Globales", 1, "", "PE", "14", "14001", "Lambayeque", "Calle San José 654", "", "+5134267890", "", "servicios@globales.pe", "20538995364", "BDCMPEPL", "5067891234"],
        ["Ana Torres", 0, "Servicios Globales", "PE", "14", "14001", "Lambayeque", "Calle San José 654", "", "", "987223344", "ana.torres@globales.pe", "", "BDCMPEPL", "5067891235"],
        ["Consultores Estratégicos", 1, "", "PE", "20", "20001", "Piura", "Av. Grau 852", "", "+5194267890", "", "info@consultores.pe", "20480674414", "COFDPEPL", "6078912345"],
    ]
    
    while len(data) < 20:
        data.append([f"Empresa {len(data)}", 1, "", "PE", "15", "15001", "Lima", f"Av. Principal {len(data)}", "", f"+511{len(data)}234567", "", f"empresa{len(data)}@ejemplo.pe", "", "BCPLPEPL", f"123456789{len(data)}"])
    
    columns = [
        "name", "is_company", "company_name", "country_id", "state_id", "zip", "city", "street", "street2", "phone", "mobile", "email", "vat", "bank_ids/bank", "bank_ids/acc_number"
    ]
    
    df = pd.DataFrame(data, columns=columns)
    df.to_excel(filename, index=False)
    print(f"Archivo {filename} generado con éxito.")

if __name__ == "__main__":
    generate_odoo_clients()