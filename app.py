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
CORS(app, resources={r'/api/*': {'origins': r'http://127.0.0.1:5173/*'}})
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


@app.route('/api/POST/platillo', methods=['POST'])
def post_platillos():
    data = request.get_json()
    categoria = data.get('categoria')
    descripcion = data.get('descripcion')
    nombre = data.get('nombre')
    precio = data.get('precio')
    print(categoria, descripcion, nombre, precio)
    if (validateNonVoidInput(categoria) and validateNonVoidInput(descripcion) and validateNonVoidInput(nombre) and validateNonVoidInput(precio)):
        cur.execute("INSERT INTO platillo (categoria, descripcion, nombre, precio)VALUES ({c}, {d}, {n}, {p})".format(
            c=categoria, d=descripcion, n=nombre, p=precio))
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


if __name__ == '__main__':
    app.run(debug=True)
