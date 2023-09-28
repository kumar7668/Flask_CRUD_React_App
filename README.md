# Flask_CRUD
Info : 
    Backend (Flask): Implement a Flask application that serves as the backend API.
    Create endpoints for:
    1>Fetching sensor data. 
    2>Adding new sensor data. 
    3>Updating sensor data. 

    Use a relational database (PostgreSQL) to store sensor data.
        Frontend ( React.js): 
        Create a dashboard that displays real-time data from the sensors.



**************************************************************************************************
## PostgreSQL Setup ##


    1. Activate PostgreSQL server:
        $ cd C:\Program Files\PostgreSQL\10\bin
        $ psql -U postgres
        Password for user postgres: 12345

    2. Create 'SensorData' database:
        postgres=#  CREATE DATABASE Sensor_db;
        postgres=#  \l 
        postgres=#  \c SensorData

    3. Create 'Sensor_data' table on 'Sensor_db' database:
        Sensor_db=#  CREATE TABLE Sensor_data(
                    id SERIAL PRIMARY KEY,
                    sensor_name VARCHAR(255),
                    value NUMERIC(15, 15)
                    );
        Sensor_db=#  \d

*****************************************************************************************
## Flask Setup ##

    1. Inside Project dir 
        pip install flask flask_cors Flask-SQLAlchemy psycopg2


    2. run server
    $ python app.py    

    Your application server will run locally at __*http://localhost:5000/*_

***************************************************************************************
## React.js setup :
 1> cd sensor_frontend

    run : nmp Start 

    Your application server will run locally at __*http://localhost:3000/*_




*************************************************************************************
 ## Give a request to the server. You can use __Postman__ app: ##


 Note> I have created UI for Add and update data from React side.
    
    __See the opening screen (*home.html*)__
    GET /


    __Post a data to database:__ 
    POST /data
    body request: {sensor_name:"x", value:"y"}

    __Get all data & specific data by id:__
    GET /data
    GET /data/{:id}

    __Update a data by id__:
    PUT /data/{:id}
    body request: {sensor_name:"x", value:"y"}

************************************************************************************************************


Thank you :)



                 





