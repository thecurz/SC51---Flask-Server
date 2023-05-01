from flask import request, Flask, jsonify, render_template, send_from_directory
from flask_mysqldb import MySQL
from flask_cors import CORS
import os
import mysql.connector
import yaml


db_data = yaml.load(open('db.yaml'), Loader=yaml.SafeLoader)
static_dir = os.path.abspath('client/dist')
app = Flask(__name__, static_folder=static_dir, static_url_path='/')
# TODO: Change cors permissions before deploying
CORS(app)
db = mysql.connector.connect(
    host=db_data['mysql_host'],
    user=db_data['mysql_user'],
    passwd=db_data['mysql_password'],
    database=db_data['mysql_db'])

cur = db.cursor()


def validateNonVoidInput(input):
    if (input != "" and input != " "):
        return True
    return False

# API ROUTES
# TODO: set cors so only local connections can access


@app.route('/', defaults={'path': ''})
@app.route('/<string:path>')
def catch_all(path):
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/GET/platillo', methods=['GET'])
def get_platillos():
    cur.execute("SELECT * FROM platillo")
    rows = cur.fetchall()
    column_names = [desc[0] for desc in cur.description]
    result = [dict(zip(column_names, row)) for row in rows]
    return jsonify(result)

@app.route('/api/GET/cliente', methods=['GET'])
def get_clientes():
    cur.execute("SELECT * FROM cliente")
    rows = cur.fetchall()
    column_names = [desc[0] for desc in cur.description]
    result = [dict(zip(column_names, row)) for row in rows]
    return jsonify(result)


@app.route('/api/GET/pedido', methods=['GET'])
def get_pedidos():
    cur.execute("SELECT * FROM pedidos")
    rows = cur.fetchall()
    column_names = [desc[0] for desc in cur.description]
    result = [dict(zip(column_names, row)) for row in rows]
    return jsonify(result)

@app.route('/api/POST/platillo', methods=['POST'])
def post_platillos():
    data = request.get_json()
    categoria = data.get('categoria')
    descripcion = data.get('descripcion')
    nombre = data.get('nombre')
    precio = data.get('precio')
    print(categoria, descripcion, nombre, precio)
    if (validateNonVoidInput(categoria) and validateNonVoidInput(descripcion) and validateNonVoidInput(nombre) and validateNonVoidInput(precio)):
        cur.execute("INSERT INTO platillo(categoria, descripcion, nombre, precio) VALUE(%s,%s,%s,%s)", (categoria, descripcion, nombre, precio))
        db.commit()
        return jsonify({'status': 'success'}), 200
    return jsonify({'status': 'Incorrect input'}), 401

@app.route('/api/POST/cliente', methods=['POST'])
def post_cliente():
    data = request.get_json()
    correo = data.get('correo')
    clave = data.get('clave')
    direccion = data.get('direccion')
    nombre = data.get('nombre')
    celular = data.get('celular')
    if (validateNonVoidInput(correo) and validateNonVoidInput(clave) and validateNonVoidInput(direccion) and validateNonVoidInput(nombre) and validateNonVoidInput(celular)):
        cur.execute("INSERT INTO cliente (correo, clave, direccion, nombre, celular)VALUES (%s,%s,%s,%s,%s)",
                    (correo, clave, direccion, nombre, celular))
        db.commit()
        return jsonify({'status': 'success'}), 200
    return jsonify({'status': 'Incorrect input'}), 401


def post_pedido():
    data = request.get_json()
    fecha = data.get('fecha')
    id_platillo = data.get('id_platillo')
    id_cliente = data.get('id_cliente')
    if (validateNonVoidInput(fecha) and validateNonVoidInput(id_platillo) and validateNonVoidInput(id_cliente)):
        cur.execute("INSERT INTO pedidos (fecha, id_platillo, id_cliente)VALUES (%s,%s,%s)",
                    (fecha, id_platillo, id_cliente))
        db.commit()
        return jsonify({'status': 'success'}), 200
    return jsonify({'status': 'Incorrect input'}), 401

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # TODO: add user auth
    if username == 'admin' and password == 'password':
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'status': 'failure'}), 401

@app.route('/api/REM/platillo', methods=['DELETE'])
def remove_platillo():
    data = request.get_json()
    nombre=data.get('nombre')
    cur.execute("DELETE FROM platillo WHERE nombre=%s",(nombre,))
    db.commit()
    return jsonify({'status':'success'}), 200

if __name__ == '__main__':
    app.run(debug=True)
