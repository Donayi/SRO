## 📌 Características
- **Frontend:** HTML, CSS, y JavaScript.
- **Backend:** FastAPI con SQLite.
- **Persistencia de Datos:** Uso de SQLite para almacenar selecciones.
- **API REST:** Endpoints para guardar, recuperar y eliminar selecciones.

## 🚀 Instalación y Uso
### 1️⃣ Clonar el Repositorio
```bash
 git clone https://github.com/tuusuario/proyecto-seleccion.git
 cd proyecto-seleccion
```

### 2️⃣ Crear un Entorno Virtual (Opcional pero Recomendado)
```bash
python -m venv env
source env/bin/activate  # En macOS/Linux
env\Scripts\activate    # En Windows
```

### 3️⃣ Instalar Dependencias
```bash
pip install -r requirements.txt
```

### 4️⃣ Ejecutar el Backend
```bash
uvicorn backend.main:app --reload
```
El backend estará disponible en `http://127.0.0.1:8000`

### 5️⃣ Abrir el Frontend
Solo abre `templates/tabla_menu.html` en un navegador web.

## 📡 API Endpoints
| Método  | Ruta                     | Descripción                              |
|---------|--------------------------|------------------------------------------|
| POST    | `/save/`                  | Guarda una selección en la base de datos |
| GET     | `/selections/{unidad}`     | Recupera selecciones por unidad de negocio |
| DELETE  | `/clear/{unidad}`          | Borra todas las selecciones de una unidad |


para correr uvicorn 

uvicorn backend.main:app --port 8001 --reload

Pära correr la otra interface py app.py


