import React, { useState, useEffect } from 'react';
import axios from 'axios';
import openSocket from 'socket.io-client';
import Navbar from './Navbar';


const api = axios.create({
    baseURL: 'http://127.0.0.1:5000',
});

const socket = openSocket('http://127.0.0.1:5000');
function SensorDashboard() {
    const [sensorData, setSensorData] = useState([]);

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

        <div >
        <Navbar title="Dashboard" about="Data Maping"/>
        <div className='container'>

            <h1 className='text-center'>Sensor Dashboard</h1>
            {/* Display sensor data */}
            <div>
                <h2 style={{background: 'azure', color: 'blue'}}>Sensor Data</h2>
                <ul className='text-bg-info'>
                    {sensorData.map((data) => (
                        <li key={data.id} style={{listStyleType :'none'}}>
                           <strong style={{padding:"0 10px 0 10px"}}>Sensor Name-</strong> {data.sensor_name} <strong style={{padding:"0 10px 0 10px"}}>Sensor Data- </strong>{data.value}
                        </li>
                    ))}
                </ul>
            </div>
            </div>
        </div>
        </>
    );
}

export default SensorDashboard;
