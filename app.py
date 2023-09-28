
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import yaml

app = Flask(__name__)
db_config = yaml.safe_load(open('database.yaml'))
app.config['SQLALCHEMY_DATABASE_URI'] = db_config['uri'] 
db = SQLAlchemy(app)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)
class SensorData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sensor_name = db.Column(db.String(50), nullable=False)
    value = db.Column(db.Float, nullable=False)

@app.route('/api/sensor-data', methods=['GET'])
def get_sensor_data():
    data = SensorData.query.all()
    sensor_data = [{'id': item.id, 'sensor_name': item.sensor_name, 'value': item.value} for item in data]
    return jsonify(sensor_data)

@app.route('/api/sensor-data', methods=['POST'])
def add_sensor_data():
    data = request.json
    new_sensor_data = SensorData(sensor_name=data['sensor_name'], value=data['value'])
    db.session.add(new_sensor_data)
    db.session.commit()
    socketio.emit('new_sensor_data', {'id': new_sensor_data.id, 'sensor_name': new_sensor_data.sensor_name, 'value': new_sensor_data.value})
    return jsonify({'message': 'Sensor data added successfully'})

@app.route('/api/sensor-data/<int:id>', methods=['PUT'])
def update_sensor_data(id):
    data = request.json
    sensor_data = SensorData.query.get(id)
    if not sensor_data:
        return jsonify({'error': 'Sensor data not found'}), 404
    sensor_data.sensor_name = data['sensor_name']
    sensor_data.value = data['value']
    db.session.commit()
    socketio.emit('updated_sensor_data', {'id': sensor_data.id, 'sensor_name': sensor_data.sensor_name, 'value': sensor_data.value})
    return jsonify({'message': 'Sensor data updated successfully'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        socketio.run(app, debug=True)
