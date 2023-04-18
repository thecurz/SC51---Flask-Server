from flask import request, Flask, jsonify
from flask_mysqldb import MySQL
import mysql.connector
import yaml


db_data = yaml.load(open('db.yaml'), Loader=yaml.SafeLoader)

app = Flask(__name__)

db = mysql.connector.connect(
    host=db_data['mysql_host'],
    user=db_data['mysql_user'],
    passwd=db_data['mysql_password'],
    database=db_data['mysql_db'])

cur = db.cursor()

@app.route('/')
def index(debug=True):
    return 'index'


@app.route('api/GET')
def query():
    cur.execute("SELECT * FROM platillo")
    rows = cur.fetchall()
    column_names = [desc[0] for desc in cur.description]
    result = [dict(zip(column_names, row)) for row in rows]
    return jsonify(result)



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
    app.run()
