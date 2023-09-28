import React, { useState, useEffect } from 'react';
import axios from 'axios';
import openSocket from 'socket.io-client';
import Navbar from './Navbar';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5000', 
});

const socket = openSocket('http://127.0.0.1:5000'); 

function SocketSensorDashboard() {
    const [sensorData, setSensorData] = useState([]);
    const [newSensorData, setNewSensorData] = useState({ sensor_name: '', value: '' });
    const [sensorToUpdateId, setSensorToUpdateId] = useState(null); 


    // Fetch sensor data on component load
    useEffect(() => {
        async function fetchSensorData() {
            try {
                const response = await api.get('/api/sensor-data');
                setSensorData(response.data);
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        }
        fetchSensorData();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSensorData({ ...newSensorData, [name]: value });
    };

    // Add new sensor data
    const addSensorData = async () => {
        try {
            await api.post('/api/sensor-data', newSensorData);
            // Clear the form
            setNewSensorData({ sensor_name: '', value: '' });
        } catch (error) {
            console.error('Error adding sensor data:', error);
        }
    };

    const updateSensorData = async (id) => {
        try {
            const updatedData = {
                sensor_name: newSensorData.sensor_name,
                value: newSensorData.value,
            };

            await api.put(`/api/sensor-data/${id}`, updatedData);
            // Refresh sensor data after updating
            const response = await api.get('/api/sensor-data');
            setSensorData(response.data);
            // Clear the form and reset the sensor to update
            setNewSensorData({ sensor_name: '', value: '' });
            setSensorToUpdateId(null);
        } catch (error) {
            console.error('Error updating sensor data:', error);
        }
    };



    // Update sensor data in real-time when a WebSocket event is received
    useEffect(() => {
        socket.on('new_sensor_data', (data) => {
            setSensorData((prevData) => [...prevData, data]);
        });

        socket.on('updated_sensor_data', (data) => {
            setSensorData((prevData) =>
                prevData.map((item) => (item.id === data.id ? { ...item, ...data } : item))
            );
        });

        return () => {
            // Clean up socket connection when the component unmounts
            socket.off('new_sensor_data');
            socket.off('updated_sensor_data');
        };
    }, []);

    return (
        <>
        <Navbar title="Dashboard" about="Data Maping"/>
         <div className='container'>
            <h1 className='text-center py-5'>Add & Update Data</h1>
            {/* Form to add and update sensor data */}
            <div>
                <h3>Add New Sensor Data-</h3>
                <input
                    type="text"
                    name="sensor_name"
                    value={newSensorData.sensor_name}
                    onChange={handleInputChange}
                    placeholder="Sensor Name"
                />
                <input
                    type="number"
                    name="value"
                    value={newSensorData.value}
                    onChange={handleInputChange}
                    placeholder="Sensor Value"
                />
                <button onClick={addSensorData}>Add Data</button>
                {/* Update data button */}
                {sensorToUpdateId !== null && (
                    <button onClick={() => updateSensorData(sensorToUpdateId)}>Update Data</button>
                )}
            </div>

            {/* Display sensor data */}
            <div className='py-3'>
                <h2>Sensor Data!  </h2>
                <ul>
                    {sensorData.map((data) => (
                        <li key={data.id}>
                            {data.sensor_name}: {data.value}
                            {/* Edit button */}
                            <button onClick={() => setSensorToUpdateId(data.id)}>Edit</button>
                        </li>
                    ))}
                </ul>
            </div>
     </div>
     </>
    );
}

export default SocketSensorDashboard;
