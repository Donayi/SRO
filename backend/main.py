from fastapi import FastAPI, Depends, Query, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from .database import get_periodos, get_mdo_for_periodo, guardar_config, datos_otros
import pyodbc
import pandas as pd 
import numpy as np
from typing import List

# Configuración de la base de datos
DATABASE_URL = "mssql+pyodbc://BS-EXMX/SRO_Modelos?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo de la base de datos
class Selection(Base):
    __tablename__ = "selections"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(255), index=True)
    cycle = Column(Integer)
    business_unit = Column(String)
# Modelo de la base de datos selection_2
class Selection2(Base):
    __tablename__ = "selections2"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(255), index=True)
    cycle = Column(Integer)
    business_unit = Column(String)

class RepresentanteDB(Base):
    __tablename__ = "Representantes"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    BU = Column(String(100))
    Tipo = Column(String(100))
    Reps = Column(Integer)

Base.metadata.create_all(bind=engine)



# FastAPI app
app = FastAPI()

# CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Modelo Pydantic para la API
class SelectionCreate(BaseModel):
    description: str
    cycle: int
    business_unit: str

# Modelo de datos esperado desde el frontend
class Representante(BaseModel):
    BU: str
    Tipo: str
    Reps: int

@app.get("/periodos")
async def periodos():
    return get_periodos()

@app.get("/mdo/{periodo}")
async def mdo(periodo: str):
    return get_mdo_for_periodo(periodo)

# Ruta para guardar los datos en la tabla Representantes
@app.post("/guardar_representantes/")
async def guardar_representantes(
    representantes: List[Representante], db: Session = Depends(get_db)
):
    try:
        # Borrar todos los registros de la tabla
        db.query(RepresentanteDB).delete()
        db.commit()

        #Insertar los nuevos registros
        nuevos_representantes = [
            RepresentanteDB(BU=rep.BU, Tipo=rep.Tipo, Reps=rep.Reps)
            for rep in representantes
        ]
        db.add_all(nuevos_representantes)
        db.commit()

        return {"message": "Datos guardados correctamente"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
# Ruta para obtener los datos guardados en la tabla Representantes
@app.get("/obtener_representantes/", response_model=List[Representante])
async def obtener_representantes(db: Session = Depends(get_db)):
    try:
        return db.query(RepresentanteDB).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Ruta para guardar selección
@app.post("/save/")
def save_selection(selections: List[SelectionCreate], db: Session = Depends(get_db)):
    if not selections:
        return {"message": "No se recibieron selecciones"}

    # Eliminar todas las selecciones previas de la business_unit
    business_unit = selections[0].business_unit
    db.query(Selection).filter(Selection.business_unit == business_unit).delete()
    db.commit()

    # Guardar todas las nuevas selecciones
    db.add_all([Selection(**selection.dict()) for selection in selections])
    db.commit()

    return {"message": "Selección guardada correctamente"}


# Ruta para obtener selecciones por unidad de negocio
@app.get("/selections/{business_unit}")
def get_selections(business_unit: str, db: Session = Depends(get_db)):
    selections = db.query(Selection).filter(Selection.business_unit == business_unit).all()
    return selections


# Ruta para limpiar selecciones de una unidad de negocio
@app.delete("/clear/{business_unit}")
def clear_selections(business_unit: str, db: Session = Depends(get_db)):
    db.query(Selection).filter(Selection.business_unit == business_unit).delete()
    db.commit()
    return {"message": "Selecciones eliminadas para la unidad de negocio"}


# Ruta para limpiar selecciones de una unidad de negocio
@app.delete("/cleartot/{business_unit}")
def clear_selectionstot(business_unit: str, db: Session = Depends(get_db)):
    db.query(Selection).delete()
    db.commit()
    return {"message": "Selecciones eliminadas para la unidad de negocio"}


#Modelos segunda parrilla 

# Ruta para guardar selección
@app.post("/save2/")
def save_selection(selections: List[SelectionCreate], db: Session = Depends(get_db)):
    if not selections:
        return {"message": "No se recibieron selecciones"}

    # Eliminar todas las selecciones previas de la business_unit
    business_unit = selections[0].business_unit
    db.query(Selection2).filter(Selection2.business_unit == business_unit).delete()
    db.commit()

    # Guardar todas las nuevas selecciones
    db.add_all([Selection2(**selection.dict()) for selection in selections])
    db.commit()

    return {"message": "Selección guardada correctamente"}

# Ruta para obtener selecciones por unidad de negocio
@app.get("/selections2/{business_unit}")
def get_selections(business_unit: str, db: Session = Depends(get_db)):
    selections = db.query(Selection2).filter(Selection2.business_unit == business_unit).all()
    return selections


# Ruta para limpiar selecciones de una unidad de negocio
@app.delete("/clear2/{business_unit}")
def clear_selections(business_unit: str, db: Session = Depends(get_db)):
    db.query(Selection2).filter(Selection2.business_unit == business_unit).delete()
    db.commit()
    return {"message": "Selecciones eliminadas para la unidad de negocio"}

# Ruta para limpiar selecciones de una unidad de negocio
@app.delete("/cleartot2/{business_unit}")
def clear_selectionstot(business_unit: str, db: Session = Depends(get_db)):
    db.query(Selection2).delete()
    db.commit()
    return {"message": "Selecciones eliminadas para la unidad de negocio"}

DB_CONFIG = {
    "server": "BS-EXMX\EXMXBS",
    "database": "SRO_Modelos",
}


def funcionComparativa(df_base,rep):
    # Filtrar por cada parrilla
    df_p1 = df_base[df_base["Parrilla"] == "Parrilla_1"]
    df_p2 = df_base[df_base["Parrilla"] == "Parrilla_2"]

    # Agrupar por producto y sumar los valores
    agg_p1 = df_p1.groupby("Producto")[["Valor_Ponderado", "Valor_PPI","Valor_Mdo","Valor_CUP"]].sum().rename(
        columns={
            "Valor_Ponderado": "Contactos_Ponderados_P1",
            "Valor_PPI": "Contactos_PPI_P1",
            "Valor_Mdo": "Valor_Mdo_P1",
            "Valor_CUP": "Valor_CUP_P1"
        }
    )

    agg_p2 = df_p2.groupby("Producto")[["Valor_Ponderado", "Valor_PPI","Valor_Mdo","Valor_CUP"]].sum().rename(
        columns={
            "Valor_Ponderado": "Contactos_Ponderados_P2",
            "Valor_PPI": "Contactos_PPI_P2",
            "Valor_Mdo": "Valor_Mdo_P2",
            "Valor_CUP": "Valor_CUP_P2"
        }
    )

    # Unir los resultados de ambas parrillas
    df_comparativo = pd.merge(agg_p1, agg_p2, on="Producto", how="outer").fillna(0)

    # Calcular totales de PPI
    total_ppi_p1 = df_comparativo["Contactos_PPI_P1"].sum()
    total_ppi_p2 = df_comparativo["Contactos_PPI_P2"].sum()

    # Calcular porcentaje de participación
    df_comparativo["%_Participacion_PPI_P1"] = df_comparativo["Contactos_PPI_P1"] / total_ppi_p1 * 100
    df_comparativo["%_Participacion_PPI_P2"] = df_comparativo["Contactos_PPI_P2"] / total_ppi_p2 * 100

        #calcular representantes
    df_comparativo["Representantes_P1"]= (df_comparativo["%_Participacion_PPI_P1"]/100) * rep
    df_comparativo["Representantes_P2"]= (df_comparativo["%_Participacion_PPI_P2"]/100) * rep

    # Calcular variaciones
    df_comparativo["Variacion_Ponderado"] = np.where(
        df_comparativo["Contactos_Ponderados_P1"] != 0,
        df_comparativo["Contactos_Ponderados_P2"] / df_comparativo["Contactos_Ponderados_P1"] - 1,
        0
    )

    df_comparativo["Variacion_PPI"] = np.where(
        df_comparativo["Contactos_PPI_P1"] != 0,
        df_comparativo["Contactos_PPI_P2"] / df_comparativo["Contactos_PPI_P1"] - 1,
        0
    )

    #Calcular Reach
    df_comparativo["Reach_P1"] = np.where(df_comparativo["Valor_Mdo_P1"] !=0, df_comparativo["Valor_CUP_P1"]/df_comparativo["Valor_Mdo_P1"] *100,0)
    df_comparativo["Reach_P2"] = np.where(df_comparativo["Valor_Mdo_P2"] !=0, df_comparativo["Valor_CUP_P2"]/df_comparativo["Valor_Mdo_P2"] *100,0)


    # Resetear índice para que "Producto" sea columna
    df_comparativo = df_comparativo.reset_index().sort_values(by="Producto")
    return df_comparativo


def totales_var(df):
    resultado = {
        "Total_PPI_P1": df["Contactos_PPI_P1"].astype(float).sum().round(2),
        "Total_PPI_P2": df["Contactos_PPI_P2"].astype(float).sum().round(2),
        "Total_Pond_P1": df["Contactos_Ponderados_P1"].astype(float).sum().round(2),
        "Total_Pond_P2": df["Contactos_Ponderados_P2"].astype(float).sum().round(2),
        "Total_Reps_p1": df["Representantes_P1"].astype(float).sum().round(2),
        "Total_Reps_p2": df["Representantes_P2"].astype(float).sum().round(2),
        "Total_Mdo_P1":df["Valor_Mdo_P1"].astype(float).sum().round(2),
        "Total_Mdo_P2":df["Valor_Mdo_P2"].astype(float).sum().round(2),
        "Total_CUP_P1":df["Valor_CUP_P1"].astype(float).sum().round(2),
        "Total_CUP_P2":df["Valor_CUP_P2"].astype(float).sum().round(2)

    }
    
    # Calcular variaciones y agregarlas al mismo diccionario
    resultado["Variacion_PPI"] = (
        (resultado["Total_PPI_P2"] / resultado["Total_PPI_P1"] - 1) * 100
        if resultado["Total_PPI_P1"] != 0 else 0
    )
    
    resultado["Variacion_Pond"] = (
        (resultado["Total_Pond_P2"] / resultado["Total_Pond_P1"] - 1) * 100
        if resultado["Total_Pond_P1"] != 0 else 0
    )

    resultado["Reach_P1"]=(
        (resultado["Total_CUP_P1"] / resultado["Total_Mdo_P1"]) * 100
        if resultado["Total_Mdo_P1"] != 0 else 0
    )

    resultado["Reach_P2"]=(
        (resultado["Total_CUP_P2"] / resultado["Total_Mdo_P2"]) * 100
        if resultado["Total_Mdo_P2"] != 0 else 0
    )
    
    # Redondear todos los valores
    resultado = {k: round(float(v), 2) for k, v in resultado.items()}
    
    return resultado



# Calculos

@app.get("/calcular")
def ejecutar(
    climaterio_rep: int = Query(0, alias="climaterio"),
    ginecologia_rep: int = Query(0, alias="ginecologia"),
    obstetricia_rep: int = Query(0, alias="obstetricia")
     
):
    tot_rep = climaterio_rep + obstetricia_rep + ginecologia_rep
    try:  
        conn_str = (
            f"DRIVER={{SQL Server}};SERVER={DB_CONFIG['server']};"
            f"DATABASE={DB_CONFIG['database']};Trusted_Connection=yes;"
        )
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cursor.execute("EXEC SP_Parte_One '202501_SRO' , 'Fichero_Medico_MOD_202501_SRO'")
        conn.commit()
        cursor.execute("EXEC SP_Parte_Twuo '202501_SRO' , 'Fichero_Med_Despivote_202501_SRO_Unicos'")
        conn.commit()

        df = pd.read_sql("SELECT * FROM [SRO_Modelos].[dbo].[BASE_SRO_202501_SRO]",conn)
        df_clim =  df.query("BU == 'climaterio'")
        df_gine =  df.query("BU == 'ginecologia'")
        df_obste =  df.query("BU == 'obstetricia'")

        tabla_total = funcionComparativa(df,tot_rep).round(2)
        tabla_clim =funcionComparativa(df_clim,climaterio_rep).round(2)
        tabla_gine = funcionComparativa(df_gine,ginecologia_rep).round(2)
        tabla_obste= funcionComparativa(df_obste,obstetricia_rep).round(2)

        totales_tot = totales_var(tabla_total)
        totales_clim = totales_var(tabla_clim)
        totales_gine = totales_var(tabla_gine)
        totales_obste= totales_var(tabla_obste)

        data = {
            "tabla_tot": tabla_total.to_dict(orient="records"),
            "tabla_clim": tabla_clim.to_dict(orient="records"),
            "tabla_gine": tabla_gine.to_dict(orient="records"),
            "tabla_obste": tabla_obste.to_dict(orient="records"),
            "totales_tot": totales_tot,
            "totales_clim": totales_clim,
            "totales_gine": totales_gine,
            "totales_obste": totales_obste
        }
        return data
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()


@app.get("/datos/{per}")
async def per(per: str):
    return datos_otros(per)

@app.post("/guardar-config")
async def guardar(request: Request):
    data = await request.json()  #aquí hacemos el await del request
    return guardar_config(data)  #mandamos los datos al database.py