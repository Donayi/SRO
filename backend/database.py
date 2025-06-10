import pyodbc

# Datos de conexión
server = "BS-EXMX\\EXMXBS"
username = "User_Principal"
password = "Exeltis_2025*"
database = "SRO_Modelos"
driver = "ODBC Driver 17 for SQL Server"

# Función para obtener una conexión
def get_connection():
    connection_string = (
        f"DRIVER={{{driver}}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        f"UID={username};"
        f"PWD={password};"
    )
    return pyodbc.connect(connection_string)

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

def get_periodos2():
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    cursor.execute("SELECT [Periodo_A], [PeriodoB] FROM [dbo].[Consulta_configuracion]")
    row = cursor.fetchone()
    conn.close()
    return {"Par_1": row.Periodo_A, "Par_2": row.PeriodoB}

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
    (Periodo_A, Fichero_Medico_Mod_A, Fichero_Desp_A, ParrilaA, PeriodoB, Fichero_Medico_Mod_B, Fichero_Desp_B, Parrila_B, Nom__SRO,Conge_A,Conge_B) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    valores = (
        data["periodoA"],
        data["ficheroA"],
        data["ficheroDespA"],
        data["parrillaA"],
        data["periodoB"],
        data["ficheroB"],
        data["ficheroDespB"],
        data["parrillaB"],
        'SRO_Muestra',
        data["congeA"],
        data["congeB"]
    )

    cursor.execute(query, valores)
    conn.commit()
    conn.close()

    return {"mensaje": "Datos limpiados y guardados exitosamente"}


 