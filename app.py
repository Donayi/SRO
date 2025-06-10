from flask import Flask, render_template, request, jsonify , send_from_directory
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mssql+pyodbc://User_Principal:Exeltis_2025*@BS-EXMX\\EXMXBS/SRO_Modelos?driver=ODBC+Driver+17+for+SQL+Server"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Porcentaje(db.Model):
    __tablename__ = 'Producto_Indice'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    producto = db.Column(db.Integer, nullable=False)
    indice = db.Column(db.Integer, nullable=False)
    valor = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'producto': self.producto,
            'indice': self.indice,
            'valor': self.valor
        }

def init_db():
    with app.app_context():
        db.create_all()
        if not Porcentaje.query.first():
            valores_default = [
                (1, 1, 100), (2, 1, 60), (3, 1, 50), (4, 1, 40), (5, 1, 30), (6, 1, 30),
                (2, 2, 40), (3, 2, 30), (4, 2, 30), (5, 2, 25), (6, 2, 25),
                (3, 3, 20), (4, 3, 20), (5, 3, 20), (6, 3, 20),
                (4, 4, 10), (5, 4, 15), (6, 4, 15),
                (5, 5, 10), (6, 5, 5),
                (6, 6, 5)
            ]
            for prod, ind, val in valores_default:
                db.session.add(Porcentaje(producto=prod, indice=ind, valor=val))
            db.session.commit()

@app.route('/')
def index():
    return render_template('tabla_menu.html')
@app.route('/inicio')
def ini():
    return render_template('inicio.html')

@app.route('/porc')
def porc():
    return render_template('index.html')

@app.route('/parr2')
def parr():
    return render_template('parrilla_2.html')

@app.route('/calc')
def calc():
    return render_template('calculo.html')
@app.route('/conf')
def conf():
    return render_template('config.html')
@app.route('/reps')
def reps():
    return render_template('Representantes.html')

@app.route('/images/<path:filename>')
def custom_static(filename):
    return send_from_directory('images',filename)

@app.route('/api/porcentajes', methods=['GET'])
def get_porcentajes():
    porcentajes = Porcentaje.query.all()
    return jsonify([p.to_dict() for p in porcentajes])

@app.route('/api/guardar', methods=['POST'])
def guardar_porcentajes():
    datos = request.json
    try:
        db.session.query(Porcentaje).delete()
        for item in datos:
            porcentaje = Porcentaje(
                producto=item['producto'],
                indice=item['indice'],
                valor=item['valor']
            )
            db.session.add(porcentaje)
        db.session.commit()
        return jsonify({'status': 'success'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/reiniciar', methods=['POST'])
def reiniciar():
    try:
        db.session.query(Porcentaje).delete()
        db.session.commit()
        init_db()
        return jsonify({'status': 'success'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/max_ppi', methods=['GET'])
def max_ppi():
    max_producto = db.session.query(db.func.max(Porcentaje.producto)).scalar() or 1
    max_indice = db.session.query(db.func.max(Porcentaje.indice)).scalar() or 1
    return jsonify({'max_ppi': max(max_producto, max_indice)})

init_db()
app.run(host='0.0.0.0', port=8000, debug=True)
