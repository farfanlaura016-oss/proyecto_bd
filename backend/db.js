const mysql = require("mysql2");
//configuracion de la conexion a MYSQL

const conexion = mysql.createConnection({
    host: "localhost", // servidor local
    user: "root",      // usuario MYSQL
    database: "tienda" // Nombre de BD
});

//Comprobación
conexion.connect((error)=>{
    if (error) {
        console.error("Error al conectar con MySQL:", error);
        return;
    }
    console.log("Conexion exitosa con MySQL");
});

module.exports = conexion;

