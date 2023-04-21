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


# API ROUTES
# TODO: set cors so only local connections can access


@app.route('/api/GET')
def query():
    cur.execute("SELECT * FROM platillo")
    rows = cur.fetchall()
    column_names = [desc[0] for desc in cur.description]
    result = [dict(zip(column_names, row)) for row in rows]
    return jsonify(result)


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
# UI Routes


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if request.path.startswith('/api/'):
        return 'URL not found', 404
    else:
        return send_from_directory(app.static_folder, 'index.html')


'''
@app.route('/api/post/', methods=['GET', 'POST'])
def post():
    body = request.form
    nombre = body['nombre']
    descripcion = body['descripcion']
    precio = body['precio']
    categoria = body['categoria']

    cur.execute(
        "INSERT INTO platillo(nombre, descripcion, precio, categoria) VALUES(%s, %s, %s, %s)", ('test', 'blah blah', 13, 'uno'))
    mysql.connection.commit()
    cur.close()
    return 'success'
'''

if __name__ == '__main__':
    app.run(debug=True)
