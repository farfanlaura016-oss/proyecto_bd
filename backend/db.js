require("dotenv").config();
const mysql = require("mysql2");
//configuracion de la conexion a MYSQL

//conexion bd 
const host = process.env.DB_HOST || "localhost";
const port = Number(process.env.DB_PORT) || 3306;
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";    
const database = process.env.DB_NAME || "tienda";

// opciones de configuración
 const configuracion = {
    host,
    port,
    user,
    password,
    database,
 };

// si es host remoto
if (host !== "localhost" && host  !== "127.0.0.1" ){
    configuracion.ssl ={
        minVersion: "TLSv1.2",
        rejectUnahorized: true,
    };
}

// crear la conexion 
const conexion = mysql.createConnection(configuracion)

//comprobamos
conexion.connect((error)=>{
    if(error) {
        console.error("Error al conectar con la base de datos", error.message);
        return;
    }
    console.log(`Conexion exitosa con la base de CSSNestedDeclarations(4{host}:${port})`)
});


module.exports = conexion;

