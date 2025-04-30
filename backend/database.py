import pyodbc

# Cambia los valores según tu servidor
conn_str = (
    "Driver={SQL Server};"
    "Server=BS-EXMX\EXMXBS;"
    "Database=SRO_Modelos;"
    "Trusted_Connection=yes;"
)

def get_periodos():
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    cursor.execute("SELECT Periodo FROM [SRO_Modelos].[dbo].[CAtalogo_Config]")
    periodos = [row[0] for row in cursor.fetchall()]
    conn.close()
    return periodos

def get_mdo_for_periodo(periodo):
    conn = pyodbc.connect(conn_str.replace("SRO_Modelos", "EXE_Catalogo_Parrilla"))
    cursor = conn.cursor()
    table_name = f"[dbo].[Mercado_Precios_{periodo}]"
    query = f"SELECT Mdo FROM {table_name}"
    cursor.execute(query)
    datos = [row[0] for row in cursor.fetchall()]
    conn.close()
    return datos


def datos_otros(per):
    with pyodbc.connect(conn_str) as conn:
        cursor = conn.cursor()
        query = "SELECT * FROM [SRO_Modelos].[dbo].[CAtalogo_Config] WHERE Periodo = ?"
        cursor.execute(query, (per,))
        columns = [column[0] for column in cursor.description]
        datos2 = [dict(zip(columns, row)) for row in cursor.fetchall()]
    return datos2


def guardar_config(data):  # RECIBE un diccionario de datos
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()

    # Borrar todos los registros antes de insertar
    cursor.execute("DELETE FROM [SRO_Modelos].[dbo].[Consulta_configuracion]")

    # Insertar el nuevo registro
    query = """
    INSERT INTO [SRO_Modelos].[dbo].[Consulta_configuracion] 
    (Periodo_A, Fichero_Medico_Mod_A, ParrilaA, PeriodoB, Fichero_Medico_Mod_B, Parrila_B) 
    VALUES (?, ?, ?, ?, ?, ?)
    """
    valores = (
        data["periodoA"],
        data["ficheroA"],
        data["parrillaA"],
        data["periodoB"],
        data["ficheroB"],
        data["parrillaB"]
    )

    cursor.execute(query, valores)
    conn.commit()
    conn.close()

    return {"mensaje": "Datos limpiados y guardados exitosamente"}