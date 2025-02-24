import pandas as pd
import random

# Definimos una lista de productos farmacéuticos
products = [
    {"name": "Paracetamol 500mg", "ref": "MED-001", "price": 3.5, "cost": 2.0, "weight": 0.05, "desc": "Used to treat pain and fever."},
    {"name": "Ibuprofen 400mg", "ref": "MED-002", "price": 5.0, "cost": 3.2, "weight": 0.06, "desc": "Nonsteroidal anti-inflammatory drug (NSAID)."},
    {"name": "Amoxicillin 500mg", "ref": "MED-003", "price": 10.0, "cost": 6.5, "weight": 0.08, "desc": "Antibiotic used to treat bacterial infections."},
    {"name": "Omeprazole 20mg", "ref": "MED-004", "price": 8.0, "cost": 5.0, "weight": 0.07, "desc": "Proton pump inhibitor for acid reflux."},
    {"name": "Cetirizine 10mg", "ref": "MED-005", "price": 4.5, "cost": 2.8, "weight": 0.04, "desc": "Antihistamine for allergies."},
    {"name": "Metformin 850mg", "ref": "MED-006", "price": 6.0, "cost": 4.0, "weight": 0.09, "desc": "Used to control high blood sugar in type 2 diabetes."},
    {"name": "Atorvastatin 20mg", "ref": "MED-007", "price": 12.0, "cost": 7.5, "weight": 0.06, "desc": "Lowers cholesterol levels."},
    {"name": "Salbutamol Inhaler", "ref": "MED-008", "price": 15.0, "cost": 10.0, "weight": 0.12, "desc": "Relieves bronchospasm in asthma and COPD."},
    {"name": "Aspirin 100mg", "ref": "MED-009", "price": 4.0, "cost": 2.5, "weight": 0.05, "desc": "Used to reduce pain, fever, and inflammation."},
    {"name": "Losartan 50mg", "ref": "MED-010", "price": 9.0, "cost": 6.0, "weight": 0.06, "desc": "Used to treat high blood pressure."}
]

# Generamos un dataframe con la estructura del template de Odoo
data = []
for i, product in enumerate(products, start=1):
    data.append([
        f"product_template_{i}",
        product["name"],
        "Goods",  # Tipo de producto
        product["ref"],
        random.randint(1000000000000, 9999999999999),  # Generación de código de barras aleatorio
        product["price"],
        product["cost"],
        product["weight"],
        product["desc"]
    ])

# Crear DataFrame
columns = ["External ID", "Name", "Product Type", "Internal Reference", "Barcode", "Sales Price", "Cost", "Weight", "Sales Description"]
df = pd.DataFrame(data, columns=columns)

# Guardar en archivo Excel
df.to_excel("pharmaceutical_products.xlsx", index=False)
print("Archivo 'pharmaceutical_products.xlsx' generado con éxito.")
